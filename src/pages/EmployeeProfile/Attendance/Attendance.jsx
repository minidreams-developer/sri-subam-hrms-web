import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../../theme/theme";
import TopIcon from "../../../assets/images/employee/calendar.svg";
import EditIcon from "../../../assets/images/employee/editIcon.svg";
import CardDetails from "../../../components/CardDetails";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import TabSwitcher from "../../../components/TabSwitcher";
import ListView from "../../../components/ListView";
import CalendarView from "../../../components/CalendarView";
import { getEmployeeAttendance, getEmployeeAttendanceCalendar, getEmployeeAttendanceSummary, getHolidays, getShifts, updateUser } from "../../../services/apiServices";
import { toast } from "react-toastify";

export const Attendance = ({ employee, onEmployeeUpdated }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("List View");
  const [summary, setSummary] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [shiftsLoading, setShiftsLoading] = useState(false);
  const [savingShift, setSavingShift] = useState(false);
  const monthRange = useMemo(() => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return {
      fromDate: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`,
      toDate: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate())}`,
    };
  }, []);

  useEffect(() => {
    const employeeId = employee?._id || employee?.id || employee?.userId;
    if (!employeeId) return;
    let cancelled = false;
    setAttendanceLoading(true);
    Promise.all([
      getEmployeeAttendanceSummary(employeeId, monthRange),
      getEmployeeAttendance(employeeId, { fromDate: `${new Date().getFullYear()}-01-01`, toDate: `${new Date().getFullYear()}-12-31`, sortBy: "date:desc" }),
      getEmployeeAttendanceCalendar(employeeId, monthRange),
      getHolidays({ page: 1, limit: 100 }),
    ])
      .then(([summaryResponse, recordsResponse, calendarResponse, holidaysResponse]) => {
        if (cancelled) return;
        setSummary(summaryResponse?.data || summaryResponse?.summary || summaryResponse);
        setAttendanceRecords(recordsResponse?.data || recordsResponse?.records || recordsResponse || []);
        setCalendar(calendarResponse?.data || calendarResponse?.calendar || calendarResponse || []);
        const holidayRecords = holidaysResponse?.results
          || holidaysResponse?.data?.results
          || holidaysResponse?.data
          || (Array.isArray(holidaysResponse) ? holidaysResponse : []);
        setHolidays(holidayRecords);
      })
      .catch((error) => {
        if (!cancelled) toast.error(error.response?.data?.message || "Failed to load attendance");
      })
      .finally(() => !cancelled && setAttendanceLoading(false));
    return () => { cancelled = true; };
  }, [employee, monthRange]);
  const leaveDates = employee?.leaveDates || employee?.leaves?.map((leave) => leave.date || leave.leaveDate).filter(Boolean) || [];
  const leaveDateText = Array.isArray(leaveDates)
    ? leaveDates.join(", ") || "N/A"
    : leaveDates || "N/A";
  const shift = employee?.workInformation?.shiftId || employee?.workInformation?.shift || employee?.shift;
  const formatTime = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };
  const firstTiming = shift?.timings?.find((timing) => !timing.off) || shift?.timings?.[0];
  const weekOff = Array.isArray(shift?.weekOff) ? shift.weekOff.join(", ") : "N/A";

  const handleTabChange = (val) => {
    setActiveTab(val);
  };

  const handleEditDetails = async () => {
    const currentShiftId = shift?._id || shift?.id;
    const currentOption = currentShiftId ? {
      value: currentShiftId,
      label: shift?.shiftName || shift?.name || "Current shift",
      shift,
    } : null;
    setSelectedShift(currentOption);
    setShiftModalOpen(true);
    setShiftsLoading(true);
    try {
      const response = await getShifts({ page: 1, limit: 100 });
      const records = Array.isArray(response)
        ? response
        : response?.results || response?.data?.results || response?.data || [];
      const options = records.map((item) => ({
        value: item._id || item.id,
        label: item.shiftName || item.name || "Unknown shift",
        shift: item,
      }));
      setShiftOptions(options);
      setSelectedShift(options.find((option) => String(option.value) === String(currentShiftId)) || currentOption);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load shifts");
    } finally {
      setShiftsLoading(false);
    }
  };

  const saveShift = async (event) => {
    event.preventDefault();
    const employeeId = employee?._id || employee?.id || employee?.userId;
    if (!employeeId) return toast.error("Employee ID is missing");
    if (!selectedShift?.value) return toast.error("Please select a shift");

    const workInformation = {
      ...(employee?.workInformation || {}),
      shiftId: selectedShift.value,
    };
    setSavingShift(true);
    try {
      const response = await updateUser(employeeId, { workInformation });
      const responseEmployee = response?.data?.user || response?.data || response?.user || response;
      const updatedEmployee = {
        ...employee,
        ...(responseEmployee && typeof responseEmployee === "object" ? responseEmployee : {}),
        workInformation: {
          ...workInformation,
          ...(responseEmployee?.workInformation || {}),
          shiftId: responseEmployee?.workInformation?.shiftId || selectedShift.shift,
        },
      };
      onEmployeeUpdated?.(updatedEmployee);
      setShiftModalOpen(false);
      toast.success("Shift updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to update shift");
    } finally {
      setSavingShift(false);
    }
  };

  const openLeaveForm = (mode) => {
    const path = mode === "edit"
      ? "/admin/time-hub/leaveAttendance/edit-Leave"
      : "/admin/time-hub/leaveAttendance/add-LeaveOrPermissions";

    navigate(path, {
      state: {
        employee,
        returnTo: "/admin/peopleHub/employees/employeeProfile",
        returnTab: "Attendance",
      },
    });
  };

  return (
    <Wrapper>
      <HeaderRow>
        <LeftHead>
          <IconWrap>
            <Icon src={TopIcon} alt="user" />
          </IconWrap>
          <Title>Attendance</Title>
        </LeftHead>
        <EditBtn type="button" onClick={handleEditDetails}>
          <img src={EditIcon} alt="edit" width="16" height="16" />
          Edit details
        </EditBtn>
      </HeaderRow>
      {shiftModalOpen && (
        <ModalBackdrop onMouseDown={() => !savingShift && setShiftModalOpen(false)}>
          <Modal role="dialog" aria-modal="true" aria-labelledby="edit-shift-title" onMouseDown={(event) => event.stopPropagation()}>
            <ModalHeader>
              <ModalTitle id="edit-shift-title">Edit Shift</ModalTitle>
              <CloseButton type="button" onClick={() => setShiftModalOpen(false)} disabled={savingShift} aria-label="Close">×</CloseButton>
            </ModalHeader>
            <ShiftForm onSubmit={saveShift}>
              <FieldLabel htmlFor="employee-shift">Shift</FieldLabel>
              <Select
                inputId="employee-shift"
                options={shiftOptions}
                value={selectedShift}
                onChange={setSelectedShift}
                isLoading={shiftsLoading}
                isDisabled={shiftsLoading || savingShift}
                placeholder="Select shift"
              />
              <ModalActions>
                <CancelButton type="button" onClick={() => setShiftModalOpen(false)} disabled={savingShift}>Cancel</CancelButton>
                <SaveButton type="submit" disabled={savingShift || shiftsLoading || !selectedShift}>{savingShift ? "Saving..." : "Set Shift"}</SaveButton>
              </ModalActions>
            </ShiftForm>
          </Modal>
        </ModalBackdrop>
      )}
      <CardDetails
        title="Shift Details"
        columns={3}
        items={[
          {
            label: "Shift",
            value: shift?.shiftName || shift?.name || "N/A",
          },
          { label: "Shift Code", value: shift?.shiftCode || "N/A" },
          { label: "Start Time", value: formatTime(firstTiming?.startTime) },
          { label: "End Time", value: formatTime(firstTiming?.endTime) },
          { label: "Total Shift Duration", value: shift?.totalShiftDuration || "N/A" },
          { label: "Minimum Working Hours", value: shift?.minWorkingHours || "N/A" },
          { label: "Week Off", value: weekOff },
          {
            label: "Fixed days",
            value: shift?.sameTimingForAllDays ? "All working days" : "Different timing per day",
          },
          {
            label: "Working on holiday",
            value: shift?.isShiftActive ? "Yes" : "No",
          },
          {
            label: "Comp-off",
            value: shift?.compOff?.join(", ") || "N/A",
          },
          { label: "Early Check-in Grace", value: shift?.gracePeriod?.earlyCheckIn != null ? `${shift.gracePeriod.earlyCheckIn} min` : "N/A" },
          { label: "Late Check-in Grace", value: shift?.gracePeriod?.lateCheckIn != null ? `${shift.gracePeriod.lateCheckIn} min` : "N/A" },
          { label: "Early Check-out Grace", value: shift?.gracePeriod?.earlyCheckOut != null ? `${shift.gracePeriod.earlyCheckOut} min` : "N/A" },
          { label: "Late Check-out Grace", value: shift?.gracePeriod?.lateCheckOut != null ? `${shift.gracePeriod.lateCheckOut} min` : "N/A" },
          { label: "Late Mark After", value: shift?.attendanceRules?.lateMarkAfter != null ? `${shift.attendanceRules.lateMarkAfter} min` : "N/A" },
          { label: "Auto Half-day After Late", value: shift?.attendanceRules?.autoHalfDayAfterLate != null ? `${shift.attendanceRules.autoHalfDayAfterLate} min` : "N/A" },
        ]}
      />
      <CardDetails
        title="Current Month"
        columns={3}
        showEdit={true}
        editIcon={EditIcon}
        editText="Edit Leave"
        onEdit={() => openLeaveForm("edit")}
        showAdd={true}
        uploadIcon={PlusIcon}
        addText="Add Leaves"
        onAdd={() => openLeaveForm("add")}
        items={[
          {
            label: "Total Working Day",
            value: attendanceLoading ? "..." : summary?.totalWorkingDays ?? "N/A",
          },
          {
            label: "Full Days",
            value: attendanceLoading ? "..." : summary?.fullDays ?? "N/A",
          },
          {
            label: "Half Days",
            value: attendanceLoading ? "..." : summary?.halfDays ?? "N/A",
          },
          {
            label: "Absent",
            value: attendanceLoading ? "..." : summary?.absent ?? "N/A",
          },
          {
            label: "Over Time",
            value: attendanceLoading ? "..." : summary?.overtimeHours ?? summary?.overtime ?? "N/A",
          },
          {
            label: "Day Off",
            value: attendanceLoading ? "..." : summary?.dayOff ?? "N/A",
          },
          {
            label: "Holidays",
            value: attendanceLoading ? "..." : summary?.holidays ?? "N/A",
          },
          {
            label: "Leave Dates",
            value: summary?.leaves ?? leaveDateText,
          },
        ]}
      />
      <TabSwitcher
        tabs={[
          { label: "List View", value: "List View" },
          { label: "Calendar View", value: "Calendar View" },
        ]}
        active={activeTab}
        onChange={handleTabChange}
      />
      {activeTab === "List View" ? (
        <ListView attendanceRecords={attendanceRecords} />
      ) : (
        <CalendarView calendarData={calendar} holidays={holidays} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border-radius: 12px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  padding: 1rem;
`;

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftHead = styled.div`
  display: flex;
  align-items: center;
  gap: 1.125rem;
`;

const IconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem;
  border-radius: 6px;
  background: ${theme.colors.secondaryPrimary};
`;

const Icon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  line-height: 160%;
  margin: 0;
`;

const EditBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  height: 40px;
  padding: 0 0.875rem;
  background: ${theme.colors.secondaryPrimary};
  border: none;
  border-radius: 0.5rem;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(12, 36, 39, 0.45);
`;

const Modal = styled.div`
  width: min(460px, 100%);
  border-radius: 12px;
  background: ${theme.colors.white};
  box-shadow: 0 24px 60px rgba(12, 36, 39, 0.2);
  padding: 1.25rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textColor};
  font: 600 1.125rem/1.6 "Inter-SemiBold", sans-serif;
`;

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: #667085;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
`;

const ShiftForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const FieldLabel = styled.label`
  color: ${theme.colors.textColor};
  font: 500 0.875rem/1.5 "Inter-Medium", sans-serif;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  height: 40px;
  padding: 0 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  background: ${theme.colors.white};
  color: ${theme.colors.textColor};
  cursor: pointer;
`;

const SaveButton = styled.button`
  height: 40px;
  padding: 0 1rem;
  border: 0;
  border-radius: 8px;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
