import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { FiCheck, FiChevronLeft, FiChevronRight, FiClock, FiFilter, FiPlus, FiSearch, FiX } from "react-icons/fi";
import theme from "../../theme/theme";
import sampleProfile from "../../assets/images/employee/sampleProfile.jpg";
import { getDepartments, getEmployeeTimesheetDate, getShifts, getTimesheetStats, getWeeklyTimesheet } from "../../services/apiServices";

const weeks = [
  {
    label: "Week 2", range: "18 Jul - 24 Jul", dates: [18, 19, 20, 21, 22, 23, 24],
    entries: [
      ["8.10 Hrs", "8.35 Hrs", "Leave", "8.15 Hrs", "Active", "weekend", "weekend"],
      ["8.20 Hrs", "Absent", "8.05 Hrs", "4.10 Hrs", "Active", "weekend", "weekend"],
      ["8.30 Hrs", "8.12 Hrs", "8.25 Hrs", "8.05 Hrs", "Active", "weekend", "weekend"],
      ["Leave", "8.18 Hrs", "8.33 Hrs", "8.16 Hrs", "Active", "weekend", "weekend"],
      ["8.14 Hrs", "8.09 Hrs", "Absent", "8.21 Hrs", "Active", "weekend", "weekend"],
    ], overtime: { row: 2, day: 2, value: "OT - 01:40 Hr" },
  },
  {
    label: "Week 3", range: "25 Jul - 31 Jul", dates: [25, 26, 27, 28, 29, 30, 31],
    entries: [
      ["8.25 Hrs", "8.16 Hrs", "4.45 Hrs", "8.30 Hrs", "Active", "weekend", "weekend"],
      ["8.02 Hrs", "Leave", "8.11 Hrs", "8.42 Hrs", "Active", "weekend", "weekend"],
      ["Absent", "8.20 Hrs", "8.18 Hrs", "8.27 Hrs", "Active", "weekend", "weekend"],
      ["8.30 Hrs", "8.36 Hrs", "8.08 Hrs", "Leave", "Active", "weekend", "weekend"],
      ["8.05 Hrs", "4.30 Hrs", "8.19 Hrs", "8.25 Hrs", "Active", "weekend", "weekend"],
    ], overtime: { row: 0, day: 3, value: "OT - 02:10 Hr" },
  },
  {
    label: "Week 4", range: "01 Aug - 07 Aug", dates: [1, 2, 3, 4, 5, 6, 7],
    entries: [
      ["8.23 Hrs", "8.23 Hrs", "8.23 Hrs", "4.26 Hrs", "Active", "weekend", "weekend"],
      ["Absent", "Leave", "8.23 Hrs", "8.23 Hrs", "Active", "weekend", "weekend"],
      ["8.23 Hrs", "8.23 Hrs", "4.26 Hrs", "8.23 Hrs", "Leave", "weekend", "weekend"],
      ["8.23 Hrs", "8.23 Hrs", "8.23 Hrs", "8.23 Hrs", "Active", "weekend", "weekend"],
      ["8.23 Hrs", "8.23 Hrs", "8.23 Hrs", "8.23 Hrs", "Active", "weekend", "weekend"],
    ], overtime: { row: 0, day: 0, value: "OT - 02:56 Hr" },
  },
  {
    label: "Week 5", range: "08 Aug - 14 Aug", dates: [8, 9, 10, 11, 12, 13, 14],
    entries: [
      ["8.40 Hrs", "8.22 Hrs", "8.10 Hrs", "8.31 Hrs", "Active", "weekend", "weekend"],
      ["8.18 Hrs", "8.28 Hrs", "Absent", "8.09 Hrs", "Active", "weekend", "weekend"],
      ["Leave", "8.16 Hrs", "8.34 Hrs", "4.20 Hrs", "Active", "weekend", "weekend"],
      ["8.11 Hrs", "8.25 Hrs", "8.19 Hrs", "8.38 Hrs", "Active", "weekend", "weekend"],
      ["8.26 Hrs", "Leave", "8.12 Hrs", "8.29 Hrs", "Active", "weekend", "weekend"],
    ], overtime: { row: 3, day: 3, value: "OT - 03:05 Hr" },
  },
];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const today = new Date();
const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const currentWeekStart = (() => { const date = new Date(today); date.setDate(date.getDate() - date.getDay()); return localDate(date); })();
const unwrap = (response, keys = []) => {
  for (const key of keys) if (Array.isArray(response?.[key])) return response[key];
  return Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : Array.isArray(response?.results) ? response.results : [];
};
const displayName = (user) => user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Unknown employee";
const categoryLabel = (category) => ({ noAttendance: "Absent", dayOff: "Day Off", weekOff: "Week Off", holiday: "Holiday", leave: "Leave" }[category] || category);
const overtimeLabel = (hours) => { const totalMinutes = Math.round(Number(hours || 0) * 60); return `OT - ${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")} Hr`; };
const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  const selected = options.find((option) => option.value === value);
  return <CustomSelectWrap ref={ref}><CustomSelectButton type="button" $open={open} onClick={() => setOpen((current) => !current)}>{selected?.label || placeholder}<span>⌄</span></CustomSelectButton>{open && <CustomOptions>{options.map((option) => <CustomOption key={option.value} type="button" $selected={option.value === value} onClick={() => { onChange(option.value); setOpen(false); }}>{option.label}</CustomOption>)}</CustomOptions>}</CustomSelectWrap>;
};

const Timesheet = () => {
  const [activeTab, setActiveTab] = useState("Employees");
  const [search, setSearch] = useState("");
  const [weekStart, setWeekStart] = useState(() => { const date = new Date(today); date.setDate(date.getDate() - date.getDay()); return localDate(date); });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualEntries, setManualEntries] = useState({});
  const [manualForm, setManualForm] = useState({ employee: "0", day: "0", login: "09:00", logout: "17:30", breakHours: "0.30", shift: "Morning", status: "Present" });
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [timesheetStats, setTimesheetStats] = useState({});
  const [weekData, setWeekData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [viewMode, setViewMode] = useState("Week View");
  const [dateRange, setDateRange] = useState("Today");
  const [detail, setDetail] = useState(null);
  const role = activeTab === "Employees" ? "employee" : "staff";

  useEffect(() => {
    let mounted = true;

    const fetchEmployees = async () => {
      try {
        setIsLoadingEmployees(true);
        const request = (startDate) => getWeeklyTimesheet({ startDate, role, search, departmentId: selectedDepartment, shiftId: selectedShift, page: 1, limit: 100 });
        const starts = viewMode === "Month View" ? Array.from({ length: 5 }, (_, index) => { const date = new Date(`${weekStart}T00:00:00`); date.setDate(date.getDate() + index * 7); return localDate(date); }) : [weekStart];
        const responses = await Promise.all(starts.map(request));
        const grouped = new Map();
        responses.flatMap((response) => unwrap(response, ["results", "rows", "items", "users", "employees"])).forEach((row) => {
          const existing = grouped.get(row.employeeId) || { ...row, days: [] };
          existing.days.push(...(row.days || []));
          grouped.set(row.employeeId, existing);
        });
        const users = [...grouped.values()];
        setWeekData(users);

        const normalizedUsers = users.map((user, index) => ({
          id: user.employeeId || user.id || user._id || user.userId || index + 1,
          name: displayName(user),
          role: user.designation || user.role || user.position || "Employee",
          employeeId: user.employeeCode || user.employeeId || user.staffId || user.agentId || "N/A",
          profilePic: user.profilePic || user.avatar || sampleProfile,
        }));

        if (mounted) {
          setEmployees(normalizedUsers);
          setManualForm((current) => ({ ...current, employee: "0" }));
        }
      } catch (error) {
        console.error("Failed to load employees for timesheet:", error);
        if (mounted) setEmployees([]);
      } finally {
        if (mounted) setIsLoadingEmployees(false);
      }
    };

    fetchEmployees();
    return () => { mounted = false; };
  }, [weekStart, role, search, selectedDepartment, selectedShift, viewMode]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getTimesheetStats({ date: localDate(today), role }),
      getDepartments({ page: 1, limit: 100 }),
      getShifts({ page: 1, limit: 100 }),
    ]).then(([statsResponse, departmentsResponse, shiftsResponse]) => {
      if (!mounted) return;
      setTimesheetStats(statsResponse?.data || statsResponse || {});
      setDepartments(unwrap(departmentsResponse, ["departments"]));
      setShifts(unwrap(shiftsResponse, ["shifts"]));
    }).catch((error) => console.error("Failed to load timesheet filters/stats:", error));
    return () => { mounted = false; };
  }, [role]);

  const stats = [["Present This Week", timesheetStats.present ?? timesheetStats.presentCount ?? 0], ["Absent", timesheetStats.absent ?? timesheetStats.absentCount ?? 0], ["On Time", timesheetStats.onTime ?? 0], ["Late entry", timesheetStats.late ?? timesheetStats.lateCount ?? 0], ["On Leave", timesheetStats.leave ?? timesheetStats.leaveCount ?? 0]];
  const visibleEmployees = useMemo(
    () => employees.filter((employee) => employee.name.toLowerCase().includes(search.toLowerCase())),
    [employees, search],
  );
  const openDateDetail = async (employee, date) => {
    setSelectedEmployee({ ...employee, selectedDate: date, detailLoading: true });
    try {
      const response = await getEmployeeTimesheetDate(employee.id, date);
      setSelectedEmployee({ ...employee, selectedDate: date, detail: response?.data || response });
    } catch (error) {
      console.error("Failed to load employee timesheet detail:", error);
      setSelectedEmployee({ ...employee, selectedDate: date, detailError: true });
    }
  };

  return (
    <Page>
      <SectionHead>
        <Title>Quick Stats</Title>
        <Actions>
          <CustomSelect value={dateRange} onChange={setDateRange} placeholder="Today" options={[{ value: "Today", label: "Today" }, { value: "Last 7 days", label: "Last 7 days" }, { value: "Last 30 days", label: "Last 30 days" }]} />
          <OutlineButton>Export Data</OutlineButton>
        </Actions>
      </SectionHead>

      <Stats>
        {stats.map(([label, value]) => (
          <StatCard key={label}><StatLabel>{label}</StatLabel><StatRow><StatValue>{value}</StatValue></StatRow></StatCard>
        ))}
      </Stats>

      <Tabs>
        {["Employees", "Staffs"].map((tab) => <Tab key={tab} $active={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</Tab>)}
      </Tabs>

      <WeekRow>
        <WeekPicker>
          <SquareButton onClick={() => { const date = new Date(`${weekStart}T00:00:00`); date.setDate(date.getDate() - 7); setWeekStart(localDate(date)); }}><FiChevronLeft /></SquareButton>
          <strong>{viewMode === "Month View" ? `Month starting ${weekStart.slice(0, 7)}` : `Week starting ${weekStart}`}</strong>
          <SquareButton $muted disabled={weekStart >= currentWeekStart} onClick={() => { const date = new Date(`${weekStart}T00:00:00`); date.setDate(date.getDate() + 7); setWeekStart(localDate(date)); }}><FiChevronRight /></SquareButton>
        </WeekPicker>
        <PrimaryButton onClick={() => setShowManualForm(true)}><FiPlus /> Add Manually</PrimaryButton>
      </WeekRow>

      <Toolbar>
        <SearchBox><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Employee" /></SearchBox>
        <ToolbarRight><CustomSelect value={selectedDepartment} onChange={setSelectedDepartment} placeholder="All Department" options={[{ value: "", label: "All Department" }, ...departments.map((item) => ({ value: item.id || item._id, label: item.name || item.departmentName }))]} /><CustomSelect value={selectedShift} onChange={setSelectedShift} placeholder="All Shifts" options={[{ value: "", label: "All Shifts" }, ...shifts.map((item) => ({ value: item.id || item._id, label: item.name || item.shiftName }))]} /><CustomSelect value={viewMode} onChange={setViewMode} placeholder="Week View" options={[{ value: "Week View", label: "Week View" }, { value: "Month View", label: "Month View" }]} /><FilterButton><FiFilter /> Filter</FilterButton></ToolbarRight>
      </Toolbar>

      <TableScroll>
        <Grid>
          <HeaderCell>Employee ID</HeaderCell>{Array.from({ length: viewMode === "Month View" ? 31 : 7 }, (_, index) => <HeaderCell key={index}>{viewMode === "Month View" ? String(index + 1).padStart(2, "0") : days[index]}</HeaderCell>)}
          {isLoadingEmployees ? (
            <EmptyStateCell colSpan={8}>Loading employees...</EmptyStateCell>
          ) : visibleEmployees.length === 0 ? (
            <EmptyStateCell colSpan={8}>No employees found.</EmptyStateCell>
          ) : visibleEmployees.map((employee) => {
            const rowIndex = employees.findIndex((item) => item.name === employee.name);
            const safeRowIndex = rowIndex >= 0 ? rowIndex : 0;
            return [<EmployeeCell key={`${employee.name}-employee`}><Avatar src={employee.profilePic || sampleProfile} alt="" /><EmployeeInfo><strong>{employee.name}</strong><span>{employee.role}</span></EmployeeInfo></EmployeeCell>, ...Array.from({ length: viewMode === "Month View" ? 31 : 7 }, (_, dayIndex) => {
              const day = weekData[safeRowIndex]?.days?.[dayIndex];
              const calendarDate = localDate(new Date(new Date(`${weekStart}T00:00:00`).getTime() + dayIndex * 86400000));
              const category = day?.effectiveCategory;
              const workedHours = Number(day?.workingHours || 0);
              const overtimeHours = Number(day?.overtimeHours ?? day?.overtime?.hours ?? day?.overtime?.duration ?? day?.overtime ?? 0);
              const entry = manualEntries[`${weekStart}-${safeRowIndex}-${dayIndex}`] || (workedHours > 0 ? `${workedHours.toFixed(2)} Hrs` : category ? category : "weekend");
              const isPartial = typeof entry === "string" && entry.startsWith("4.");
              return <DayCell key={`${weekStart}-${employee.name}-${dayIndex}`} $weekend={entry === 'weekend'} onClick={() => openDateDetail(employee, calendarDate)} role="button" tabIndex={0}><DayNumber>{String(new Date(`${calendarDate}T00:00:00`).getDate()).padStart(2, "0")}</DayNumber>{entry !== 'weekend' && <><Status $type={entry}>{entry === 'noAttendance' || entry === 'leave' ? <FiX /> : isPartial ? <FiClock /> : <FiCheck />}{categoryLabel(entry)}</Status>{overtimeHours > 0 && <Overtime>{overtimeLabel(overtimeHours)}</Overtime>}</>}</DayCell>;
            })];
          })}
        </Grid>
      </TableScroll>

      {selectedEmployee && (
        <DrawerOverlay onMouseDown={() => setSelectedEmployee(null)}>
          <Drawer onMouseDown={(event) => event.stopPropagation()}>
            <DrawerHeader><DrawerTitle>Attendance Details</DrawerTitle><CloseButton aria-label="Close attendance details" onClick={() => setSelectedEmployee(null)}><FiX /></CloseButton></DrawerHeader>
            <DrawerBody>
              <DetailDate>{selectedEmployee.detailLoading ? "Loading..." : `Date: ${selectedEmployee.selectedDate || "N/A"}`}</DetailDate>
              <DetailSection>
                <DetailTitle>Basic Details</DetailTitle>
                <DetailCard>
                  <DetailItem><span>Name</span><strong>{selectedEmployee.name}</strong></DetailItem>
                  <DetailItem><span>Employee ID</span><strong>#{567678 + employees.indexOf(selectedEmployee)}</strong></DetailItem>
                  <DetailItem><span>Position</span><strong>{selectedEmployee.role}</strong></DetailItem>
                  <DetailItem><span>Department</span><strong>IT Department</strong></DetailItem>
                </DetailCard>
              </DetailSection>
              <DetailSection>
                <DetailTitleRow><DetailTitle>Attendance Details</DetailTitle><EditButton aria-label="Edit attendance" onClick={() => { setManualForm((current) => ({ ...current, employee: String(employees.indexOf(selectedEmployee)) })); setSelectedEmployee(null); setShowManualForm(true); }}>✎</EditButton></DetailTitleRow>
                <DetailCard>
                  {selectedEmployee.detailLoading ? <DetailItem $wide><strong>Loading timesheet details...</strong></DetailItem> : selectedEmployee.detailError ? <DetailItem $wide><strong>Unable to load timesheet details.</strong></DetailItem> : [['Login', selectedEmployee.detail?.loginTime || selectedEmployee.detail?.inTime || "N/A"], ['Log Out', selectedEmployee.detail?.logoutTime || selectedEmployee.detail?.outTime || "N/A"], ['Break Hrs', selectedEmployee.detail?.breakHours ?? "N/A"], ['Working Hrs', selectedEmployee.detail?.workingHours ?? "N/A"], ['Over Time', selectedEmployee.detail?.overtime ?? "N/A"], ['Shift', selectedEmployee.detail?.shift?.name || selectedEmployee.detail?.shiftName || "N/A"], ['Status', selectedEmployee.detail?.status || "N/A"]].map(([label, value]) => <DetailItem key={label} $wide={label === 'Status'} $success={label === 'Status'}><span>{label}</span><strong>{String(value)}</strong></DetailItem>)}
                </DetailCard>
              </DetailSection>
              <DetailSection>
                <DetailTitle>Attendance Log</DetailTitle>
                <LogTable><LogRow $header><span>No.</span><span>Out Time</span><span>In Time</span><span>Total Hours</span></LogRow>{[1,2,3,4,5].map((number) => <LogRow key={number}><strong>{String(number).padStart(2, '0')}</strong><strong>10:36 AM</strong><strong>11:00 AM</strong><strong>24 Min</strong></LogRow>)}</LogTable>
              </DetailSection>
            </DrawerBody>
          </Drawer>
        </DrawerOverlay>
      )}

      {showManualForm && (
        <ModalOverlay onMouseDown={() => setShowManualForm(false)}>
          <ManualModal onMouseDown={(event) => event.stopPropagation()}>
            <DrawerHeader><DrawerTitle>Add Attendance Manually</DrawerTitle><CloseButton aria-label="Close form" onClick={() => setShowManualForm(false)}><FiX /></CloseButton></DrawerHeader>
            <ManualForm onSubmit={(event) => {
              event.preventDefault();
              const employeeIndex = Number(manualForm.employee);
              const dayIndex = Number(manualForm.day);
              const login = new Date(`2026-01-01T${manualForm.login}`);
              const logout = new Date(`2026-01-01T${manualForm.logout}`);
              const worked = Math.max(0, (logout - login) / 3600000 - Number(manualForm.breakHours || 0));
              const value = manualForm.status === "Absent" || manualForm.status === "Leave" ? manualForm.status : `${worked.toFixed(2)} Hrs`;
              setManualEntries((current) => ({ ...current, [`${weekStart}-${employeeIndex}-${dayIndex}`]: value }));
              setShowManualForm(false);
            }}>
              <FormGrid>
                <Field $wide><label>Employee</label><select value={manualForm.employee} onChange={(event) => setManualForm({...manualForm, employee:event.target.value})}>{employees.map((employee,index)=><option key={employee.id || employee.name} value={index}>{employee.name}</option>)}</select></Field>
                <Field><label>Date</label><input type="date" value={manualForm.date || `${weekStart}`} onChange={(event) => setManualForm({...manualForm, date:event.target.value})} /></Field>
                <Field><label>Status</label><select value={manualForm.status} onChange={(event) => setManualForm({...manualForm, status:event.target.value})}><option>Present</option><option>Absent</option><option>Leave</option></select></Field>
                <Field><label>Login Time</label><input type="time" required value={manualForm.login} onChange={(event) => setManualForm({...manualForm, login:event.target.value})} /></Field>
                <Field><label>Logout Time</label><input type="time" required value={manualForm.logout} onChange={(event) => setManualForm({...manualForm, logout:event.target.value})} /></Field>
                <Field><label>Break Hours</label><input type="number" min="0" step="0.25" value={manualForm.breakHours} onChange={(event) => setManualForm({...manualForm, breakHours:event.target.value})} /></Field>
                <Field><label>Shift</label><select value={manualForm.shift} onChange={(event) => setManualForm({...manualForm, shift:event.target.value})}><option>Morning</option><option>General</option><option>Night</option></select></Field>
              </FormGrid>
              <FormActions><CancelButton type="button" onClick={() => setShowManualForm(false)}>Cancel</CancelButton><SaveButton type="submit">Save Attendance</SaveButton></FormActions>
            </ManualForm>
          </ManualModal>
        </ModalOverlay>
      )}
    </Page>
  );
};

export default Timesheet;

const Page = styled.div`padding: 24px 0 40px; color: ${theme.colors.textColor};`;
const SectionHead = styled.div`display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px;`;
const Title = styled.h2`font:600 18px/1.4 "Inter-SemiBold",sans-serif;margin:0;`;
const Actions = styled.div`display:flex;gap:14px;`;
const Select = styled.select`height:40px;min-width:162px;padding:0 14px;border:1px solid #d8dde3;border-radius:10px;background:#fff;color:#10272b;font:14px "Inter-Regular",sans-serif;outline:none;cursor:pointer;&:hover{border-color:${theme.colors.primary};background:#fff;}&:focus{border:1px solid ${theme.colors.primary};background:#fff;color:#10272b;box-shadow:0 0 0 3px rgba(6,108,120,.15);}option{background:#fff;color:#10272b;}option:checked{background:${theme.colors.primary};color:#fff;}option:hover{background:#eff7f8;color:#10272b;}`;
const OutlineButton = styled.button`height:40px;min-width:154px;border:1px solid ${theme.colors.primary};border-radius:10px;background:#fff;color:${theme.colors.primary};font-weight:600;`;
const Stats = styled.div`display:grid;grid-template-columns:repeat(5,minmax(160px,1fr));gap:20px;margin-bottom:28px;@media(max-width:1100px){grid-template-columns:repeat(3,1fr);}`;
const StatCard = styled.div`height:130px;background:#fff;border-radius:10px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;`;
const StatLabel = styled.span`font-size:13px;font-weight:600;`;
const StatRow = styled.div`display:flex;align-items:flex-end;justify-content:space-between;gap:8px;`;
const StatValue = styled.strong`font-size:40px;line-height:1;font-family:"Inter-Bold",sans-serif;`;
const Tabs = styled.div`display:flex;gap:28px;border-bottom:1px solid #d9dde1;margin-bottom:24px;`;
const Tab = styled.button`padding:12px 0;border:0;border-bottom:4px solid ${({$active})=>$active?theme.colors.primary:'transparent'};background:transparent;color:${({$active})=>$active?theme.colors.primary:'#17282d'};font-size:16px;font-weight:600;cursor:pointer;`;
const WeekRow = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;`;
const WeekPicker = styled.div`display:flex;align-items:center;gap:8px;font-size:18px;span{font-size:16px;}`;
const SquareButton = styled.button`width:32px;height:32px;border:0;border-radius:8px;background:${({$muted})=>$muted?'#b9dce0':theme.colors.primary};color:#fff;display:grid;place-items:center;cursor:pointer;&:disabled{opacity:.35;cursor:not-allowed;}`;
const PrimaryButton = styled.button`height:40px;padding:0 18px;border:0;border-radius:10px;background:${theme.colors.primary};color:#fff;display:flex;align-items:center;gap:9px;font-weight:600;`;
const Toolbar = styled.div`display:flex;justify-content:space-between;gap:20px;margin-bottom:20px;`;
const SearchBox = styled.label`height:40px;width:356px;background:#fff;border:1px solid #d8dde3;border-radius:10px;display:flex;align-items:center;gap:10px;padding:0 13px;color:${theme.colors.primary};input{border:0;outline:0;width:100%;font-size:14px;}`;
const ToolbarRight = styled.div`display:flex;gap:14px;`;
const CustomSelectWrap = styled.div`position:relative;min-width:162px;`;
const CustomSelectButton = styled.button`width:100%;height:40px;padding:0 14px;border:1px solid ${({$open})=>$open?theme.colors.primary:'#d8dde3'};border-radius:10px;background:#fff;color:#10272b;font:14px "Inter-Regular",sans-serif;display:flex;align-items:center;justify-content:space-between;cursor:pointer;box-shadow:${({$open})=>$open?'0 0 0 3px rgba(6,108,120,.15)':'none'};`;
const CustomOptions = styled.div`position:absolute;z-index:30;top:46px;left:0;width:100%;padding:5px 0;background:#fff;border:1px solid #cbd3d6;border-radius:4px;box-shadow:0 8px 18px rgba(12,36,39,.14);`;
const CustomOption = styled.button`display:block;width:100%;height:36px;padding:0 14px;border:0;text-align:left;background:${({$selected})=>$selected?theme.colors.primary:'#fff'};color:${({$selected})=>$selected?'#fff':'#10272b'};font-size:14px;cursor:pointer;&:hover{background:#e7f3f4;color:#10272b;}`;
const FilterButton = styled.button`height:40px;padding:0 16px;border:1px solid ${theme.colors.primary};border-radius:10px;background:${theme.colors.primary};color:#fff;display:flex;align-items:center;gap:8px;font-weight:600;cursor:pointer;&:hover{background:#075d68;border-color:#075d68;}`;
const TableScroll = styled.div`overflow:auto;background:#fff;border-radius:10px;`;
const Grid = styled.div`display:grid;grid-template-columns:220px repeat(7,minmax(126px,1fr));min-width:1100px;`;
const HeaderCell = styled.div`height:58px;padding:20px 10px;border-bottom:1px solid #d8dde3;color:#8b8d90;font-size:14px;font-weight:600;`;
const EmployeeCell = styled.div`min-height:100px;padding:18px 10px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #d8dde3;`;
const EmployeeInfo = styled.div`min-width:0;flex:1;strong,span{display:block;}strong{font-size:15px;margin-bottom:8px;}span{color:#777;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}`;
const OpenButton = styled.button`border:0;background:transparent;color:${theme.colors.primary};font-size:12px;font-weight:600;cursor:pointer;padding:6px;&:hover{text-decoration:underline;}`;
const Avatar = styled.img`width:48px;height:48px;border-radius:50%;object-fit:cover;`;
const EmptyStateCell = styled.div`grid-column: 1 / -1; min-height: 120px; display: grid; place-items: center; background: #fff; border-bottom: 1px solid #d8dde3; color: #4f5e61; font-weight: 600;`;
const DayCell = styled.div`min-height:100px;padding:10px 12px;border-left:1px solid #d8dde3;border-bottom:1px solid #d8dde3;background:${({$weekend})=>$weekend?'repeating-linear-gradient(135deg,#fff,#fff 5px,#edf0f2 5px,#edf0f2 7px)':'#fff'};cursor:pointer;&:hover{background:#f0fafb;}`;
const DayNumber = styled.div`font-size:12px;font-weight:600;margin-bottom:12px;`;
const Status = styled.div`height:28px;border:1px solid ${({$type})=>['absent','noattendance'].includes(String($type).toLowerCase())?'#ff3131':String($type).toLowerCase()==='leave'?'#6542bd':$type==='4.26 Hrs'?'#ff8a3d':'#23b45b'};color:${({$type})=>['absent','noattendance'].includes(String($type).toLowerCase())?'#ff3131':String($type).toLowerCase()==='leave'?'#6542bd':$type==='4.26 Hrs'?'#ff8a3d':'#23b45b'};background:${({$type})=>['absent','noattendance'].includes(String($type).toLowerCase())?'#fff0f0':String($type).toLowerCase()==='leave'?'#f0ebff':$type==='4.26 Hrs'?'#fff3e9':'#edfbf2'};border-radius:7px;display:flex;align-items:center;justify-content:center;gap:5px;font-size:12px;white-space:nowrap;`;
const Overtime = styled.div`font-size:11px;font-weight:600;margin:8px 0 0 8px;white-space:nowrap;`;
const DrawerOverlay = styled.div`position:fixed;inset:0;z-index:1000;background:rgba(12,36,39,.42);display:flex;justify-content:flex-end;`;
const Drawer = styled.aside`width:min(584px,100vw);height:100%;background:#f7f9fc;box-shadow:-8px 0 30px rgba(12,36,39,.16);display:flex;flex-direction:column;animation:drawer-in .22s ease-out;@keyframes drawer-in{from{transform:translateX(100%)}to{transform:translateX(0)}}`;
const DrawerHeader = styled.div`height:74px;padding:0 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e0e3e6;background:#fff;`;
const DrawerTitle = styled.h2`font-size:18px;font-weight:600;margin:0;`;
const CloseButton = styled.button`width:34px;height:34px;border:0;background:transparent;color:#0c2427;font-size:24px;display:grid;place-items:center;cursor:pointer;`;
const DrawerBody = styled.div`padding:20px;overflow:auto;display:flex;flex-direction:column;gap:26px;`;
const DetailDate = styled.div`font-size:13px;color:#6d7b7e;font-weight:600;margin-bottom:-12px;`;
const DetailSection = styled.section`display:flex;flex-direction:column;gap:14px;`;
const DetailTitle = styled.h3`margin:0;color:${theme.colors.primary};font-size:16px;font-weight:600;`;
const DetailTitleRow = styled.div`display:flex;align-items:center;justify-content:space-between;`;
const EditButton = styled.button`border:0;background:transparent;color:${theme.colors.primary};font-size:24px;cursor:pointer;`;
const DetailCard = styled.div`padding:14px 20px;background:rgba(237,246,249,.4);border:1px solid #e0e3e6;border-radius:10px;display:grid;grid-template-columns:1fr 1fr;gap:20px 40px;`;
const DetailItem = styled.div`grid-column:${({$wide})=>$wide?'1 / -1':'auto'};display:flex;flex-direction:column;gap:3px;span{color:#7a7a7a;font-size:14px;}strong{font-size:16px;font-weight:500;color:${({$success})=>$success?'#22aa4e':'#0c2427'};}`;
const LogTable = styled.div`border-top:1px solid #e0e3e6;`;
const LogRow = styled.div`min-height:48px;display:grid;grid-template-columns:80px repeat(3,1fr);align-items:center;gap:20px;border-bottom:${({$header})=>$header?'1px solid #e0e3e6':'0'};color:${({$header})=>$header?'#999':'#0c2427'};font-size:14px;span:last-child,strong:last-child{text-align:right;}strong{font-weight:600;}`;
const ModalOverlay = styled.div`position:fixed;inset:0;z-index:1100;background:rgba(12,36,39,.45);display:grid;place-items:center;padding:20px;`;
const ManualModal = styled.div`width:min(620px,100%);background:#fff;border-radius:14px;box-shadow:0 18px 60px rgba(12,36,39,.22);overflow:hidden;`;
const ManualForm = styled.form`padding:24px;`;
const FormGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:18px;@media(max-width:600px){grid-template-columns:1fr;}`;
const Field = styled.div`grid-column:${({$wide})=>$wide?'1 / -1':'auto'};display:flex;flex-direction:column;gap:7px;label{font-size:13px;font-weight:600;color:#4f5e61;}input,select{height:42px;padding:0 12px;border:1px solid #d8dde3;border-radius:8px;background:#fff;color:#0c2427;font:14px "Inter-Regular",sans-serif;outline:none;&:focus{border-color:${theme.colors.primary};box-shadow:0 0 0 3px rgba(6,108,120,.1);}}`;
const FormActions = styled.div`display:flex;justify-content:flex-end;gap:12px;margin-top:26px;`;
const CancelButton = styled.button`height:40px;padding:0 20px;border:1px solid #d8dde3;border-radius:8px;background:#fff;color:#4f5e61;font-weight:600;cursor:pointer;`;
const SaveButton = styled.button`height:40px;padding:0 20px;border:0;border-radius:8px;background:${theme.colors.primary};color:#fff;font-weight:600;cursor:pointer;`;
