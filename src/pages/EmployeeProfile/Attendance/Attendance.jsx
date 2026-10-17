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
import { createLeaveBalance, getEmployeeAttendanceCalendar, getEmployeeAttendanceSummary, getEmployeeLeaveBalances, getHolidays, getShifts, getUser, updateUser } from "../../../services/apiServices";
import { toast } from "react-toastify";

const leaveTypes = ["Casual Leave", "Sick Leave", "Earned Leave", "Privilege Leave", "Unpaid Leave", "Maternity Leave", "Paternity Leave", "Comp-Off", "Permission"];
const normalizeLeaveType = (value) => String(value || "").trim().toLowerCase();

export const Attendance = ({ employee, onEmployeeUpdated }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("List View");
  const [summary, setSummary] = useState(null);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loadedAttendanceMonths, setLoadedAttendanceMonths] = useState([]);
  const [monthlyAttendanceSummaries, setMonthlyAttendanceSummaries] = useState({});
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [shiftsLoading, setShiftsLoading] = useState(false);
  const [savingShift, setSavingShift] = useState(false);
  const [leaveConfigOpen, setLeaveConfigOpen] = useState(false);
  const [savingLeaveConfig, setSavingLeaveConfig] = useState(false);
  const [loadingLeaveConfig, setLoadingLeaveConfig] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [leaveConfig, setLeaveConfig] = useState({
    year: new Date().getFullYear(),
    allocations: Object.fromEntries(leaveTypes.map((type) => [type, ""])),
  });
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
    const currentMonthKey = monthRange.fromDate.slice(0, 7);
    let cancelled = false;
    setSummary(null);
    setMonthlyAttendanceSummaries({});
    setLoadedAttendanceMonths([]);
    setAttendanceLoading(true);
    getEmployeeAttendanceSummary(employeeId, monthRange)
      .then((summaryResponse) => {
        if (cancelled) return;
        const summaryData = summaryResponse?.summary || summaryResponse?.data?.summary || summaryResponse?.data || summaryResponse;
        setSummary(summaryData);
        setMonthlyAttendanceSummaries((current) => ({ ...current, [currentMonthKey]: summaryData }));
        setLoadedAttendanceMonths([currentMonthKey]);
      })
      .catch((error) => {
        if (!cancelled) toast.error(error.response?.data?.message || "Failed to load attendance");
      })
      .finally(() => !cancelled && setAttendanceLoading(false));
    return () => { cancelled = true; };
  }, [employee, monthRange, onEmployeeUpdated]);

  useEffect(() => {
    const employeeId = employee?._id || employee?.id || employee?.userId;
    if (!employeeId) return;
    let cancelled = false;
    Promise.all([
      getEmployeeAttendanceCalendar(employeeId),
      getHolidays({ page: 1, limit: 100 }),
      getUser(employeeId),
    ])
      .then(([calendarResponse, holidaysResponse, profileResponse]) => {
        if (cancelled) return;
        const calendarRecords = calendarResponse?.days || calendarResponse?.calendar || calendarResponse?.records || calendarResponse?.data?.days || calendarResponse?.data?.calendar || calendarResponse?.data || (Array.isArray(calendarResponse) ? calendarResponse : []);
        setCalendar(Array.isArray(calendarRecords) ? calendarRecords : []);
        const profile = profileResponse?.user || profileResponse?.data?.user || profileResponse?.data || profileResponse;
        if (profile && typeof profile === "object") setEmployeeProfile(profile);
        const holidayRecords = holidaysResponse?.results
          || holidaysResponse?.data?.results
          || holidaysResponse?.data
          || (Array.isArray(holidaysResponse) ? holidaysResponse : []);
        setHolidays(holidayRecords);
      })
      .catch((error) => {
        if (!cancelled) toast.error(error.response?.data?.message || "Failed to load attendance");
      });
    return () => { cancelled = true; };
  }, [employee]);

  const loadAttendanceMonthSummary = async (monthKey) => {
    const employeeId = employee?._id || employee?.id || employee?.userId;
    if (!employeeId || loadedAttendanceMonths.includes(monthKey)) return;
    const [year, month] = monthKey.split("-").map(Number);
    const pad = (value) => String(value).padStart(2, "0");
    const range = {
      fromDate: `${year}-${pad(month)}-01`,
      toDate: `${year}-${pad(month)}-${pad(new Date(year, month, 0).getDate())}`,
    };
    try {
      const response = await getEmployeeAttendanceSummary(employeeId, range);
      const summaryData = response?.summary || response?.data?.summary || response?.data || response;
      setMonthlyAttendanceSummaries((current) => ({ ...current, [monthKey]: summaryData }));
      setLoadedAttendanceMonths((current) => [...current, monthKey]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load monthly summary");
    }
  };

  useEffect(() => {
    const employeeId = employee?._id || employee?.id || employee?.userId;
    if (!employeeId) return;
    getEmployeeLeaveBalances(employeeId, { year: new Date().getFullYear() })
      .then((response) => {
        const records = Array.isArray(response) ? response : response?.results || response?.data || [];
        setLeaveBalances(Object.fromEntries(records.map((record) => [normalizeLeaveType(record.leaveType), record])));
      })
      .catch((error) => toast.error(error.response?.data?.message || "Failed to load leave balances"));
  }, [employee]);
  const displayedEmployee = employeeProfile || employee;
  const leaveDates = displayedEmployee?.leaveDates || displayedEmployee?.leaves?.map((leave) => leave.date || leave.leaveDate).filter(Boolean) || [];
  const leaveDateText = Array.isArray(leaveDates)
    ? leaveDates.join(", ") || "N/A"
    : leaveDates || "N/A";
  const shift = displayedEmployee?.workInformation?.shiftId || displayedEmployee?.workInformation?.shift || displayedEmployee?.shift;
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

  const saveLeaveConfig = async (event) => {
    event.preventDefault();
    const employeeId = employee?._id || employee?.id || employee?.userId;
    if (!employeeId) return toast.error("Employee ID is missing");
    setSavingLeaveConfig(true);
    try {
      const payloads = leaveTypes
        .filter((leaveType) => leaveConfig.allocations[leaveType] !== "")
        .map((leaveType) => ({
          employeeId,
          leaveType,
          year: Number(leaveConfig.year),
          allocated: Number(leaveConfig.allocations[leaveType]),
          isPaid: leaveType !== "Unpaid Leave",
          requiresBalance: !["Unpaid Leave", "Permission"].includes(leaveType),
        }));
      if (!payloads.length) return toast.error("Enter allocation for at least one leave type");
      await Promise.all(payloads.map((payload) => createLeaveBalance(payload)));
      const refreshed = await getEmployeeLeaveBalances(employeeId, { year: leaveConfig.year });
      const refreshedRecords = Array.isArray(refreshed) ? refreshed : refreshed?.results || refreshed?.data || [];
      setLeaveBalances(Object.fromEntries(refreshedRecords.map((record) => [normalizeLeaveType(record.leaveType), record])));
      toast.success("Leave balance configured successfully");
      setLeaveConfigOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to configure leave balance");
    } finally {
      setSavingLeaveConfig(false);
    }
  };

  const openLeaveConfig = async () => {
    setLeaveConfigOpen(true);
    const employeeId = employee?._id || employee?.id || employee?.userId;
    if (!employeeId) return;
    setLoadingLeaveConfig(true);
    try {
      const response = await getEmployeeLeaveBalances(employeeId, { year: leaveConfig.year });
      const records = Array.isArray(response) ? response : response?.results || response?.data || [];
      const balanceMap = Object.fromEntries(records.map((record) => [normalizeLeaveType(record.leaveType), record]));
      setLeaveBalances(balanceMap);
      setLeaveConfig((current) => ({
        ...current,
        allocations: Object.fromEntries(leaveTypes.map((type) => [type, balanceMap[normalizeLeaveType(type)]?.allocated ?? ""])),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load leave balances");
    } finally {
      setLoadingLeaveConfig(false);
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
      {leaveConfigOpen && (
        <ModalBackdrop onMouseDown={() => !savingLeaveConfig && setLeaveConfigOpen(false)}>
          <Modal role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <ModalHeader><ModalTitle>Configure Leave Balance</ModalTitle><CloseButton type="button" onClick={() => setLeaveConfigOpen(false)}>×</CloseButton></ModalHeader>
            <ShiftForm onSubmit={saveLeaveConfig}>
              <FieldLabel>Year</FieldLabel>
              <FormInput type="number" value={leaveConfig.year} onChange={(event) => setLeaveConfig({ ...leaveConfig, year: event.target.value })} required />
              {loadingLeaveConfig && <FieldLabel>Loading existing leave balances...</FieldLabel>}
              {leaveTypes.map((leaveType) => (
                <LeaveAllocationRow key={leaveType}>
                  <FieldLabel>{leaveType}</FieldLabel>
                  <LeaveInputGroup>
                    <FormInput type="number" min="0" placeholder="Allocated days" value={leaveConfig.allocations[leaveType]} onChange={(event) => setLeaveConfig({ ...leaveConfig, allocations: { ...leaveConfig.allocations, [leaveType]: event.target.value } })} />
                    {leaveBalances[leaveType] && <BalanceHint>Used {leaveBalances[leaveType].used ?? 0} · Remaining {leaveBalances[leaveType].remaining ?? 0}</BalanceHint>}
                  </LeaveInputGroup>
                </LeaveAllocationRow>
              ))}
              <ModalActions><CancelButton type="button" onClick={() => setLeaveConfigOpen(false)}>Cancel</CancelButton><SaveButton type="submit" disabled={savingLeaveConfig}>{savingLeaveConfig ? "Saving..." : "Save Configuration"}</SaveButton></ModalActions>
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
        extraActionText="Leave Config"
        onExtraAction={openLeaveConfig}
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
            value: attendanceLoading ? "..." : summary?.absentDays ?? summary?.absent ?? "N/A",
          },
          {
            label: "Over Time",
            value: attendanceLoading ? "..." : summary?.overtimeHours ?? summary?.overtime ?? "N/A",
          },
          {
            label: "Day Off",
            value: attendanceLoading ? "..." : summary?.dayOffs ?? summary?.dayOff ?? "N/A",
          },
          {
            label: "Holidays",
            value: attendanceLoading ? "..." : summary?.holidays ?? "N/A",
          },
          {
            label: "Leave Dates",
            value: summary?.leaveDays ?? summary?.leaves ?? leaveDateText,
          },
        ]}
      />
      <CardDetails
        title="Leave Details"
        columns={3}
        items={leaveTypes.map((leaveType) => {
          const balance = leaveBalances[normalizeLeaveType(leaveType)];
          return {
            label: leaveType,
            value: balance
              ? `Allocated: ${balance.allocated ?? 0} | Used: ${balance.used ?? 0} | Remaining: ${balance.remaining ?? 0}`
              : "N/A",
          };
        })}
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
        <ListView monthlySummaries={monthlyAttendanceSummaries} onMonthToggle={loadAttendanceMonthSummary} loadedMonths={loadedAttendanceMonths} />
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

const FormInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  color: ${theme.colors.textColor};
  font: 400 0.875rem/1.5 "Inter-Regular", sans-serif;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.colors.textColor};
  font: 400 0.875rem/1.5 "Inter-Regular", sans-serif;
`;

const LeaveAllocationRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 150px;
  align-items: center;
  gap: 0.75rem;
`;

const LeaveInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const BalanceHint = styled.span`
  color: ${theme.colors.secondaryTextColor};
  font-size: 0.7rem;
`;
