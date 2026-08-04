import { useMemo, useState } from "react";
import styled from "styled-components";
import { FiCheck, FiChevronLeft, FiChevronRight, FiClock, FiFilter, FiPlus, FiSearch, FiX } from "react-icons/fi";
import theme from "../../theme/theme";
import sampleProfile from "../../assets/images/employee/sampleProfile.jpg";

const employees = [
  { name: "Manoj Kumar", role: "Senior UI UX Designer" },
  { name: "Deepak Kumar", role: "Co Founder" },
  { name: "Maheshwari", role: "Co founder" },
  { name: "Arun Prince", role: "Team Lead" },
  { name: "Ruban", role: "Developer" },
];

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

const Timesheet = () => {
  const [activeTab, setActiveTab] = useState("Employees");
  const [search, setSearch] = useState("");
  const [weekIndex, setWeekIndex] = useState(2);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualEntries, setManualEntries] = useState({});
  const [manualForm, setManualForm] = useState({ employee: "0", day: "0", login: "09:00", logout: "17:30", breakHours: "0.30", shift: "Morning", status: "Present" });
  const week = weeks[weekIndex];
  const stats = useMemo(() => {
    const workingEntries = week.entries.flat().filter((entry) => entry !== "weekend");
    const absent = workingEntries.filter((entry) => entry === "Absent").length;
    const leave = workingEntries.filter((entry) => entry === "Leave").length;
    const partial = workingEntries.filter((entry) => entry.startsWith("4.")).length;
    const present = workingEntries.length - absent - leave;
    return [
      ["Present This Week", present, "+4.2 %", "up"],
      ["Absent", absent, "-1.1 %", "down"],
      ["On Time", present - partial, "+3.5 %", "up"],
      ["Late entry", partial, "+0.8 %", "up"],
      ["On Leave", leave, "-0.5 %", "down"],
    ];
  }, [week]);
  const visibleEmployees = useMemo(
    () => employees.filter((employee) => employee.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  return (
    <Page>
      <SectionHead>
        <Title>Quick Stats</Title>
        <Actions>
          <Select defaultValue="Today"><option>Today</option><option>Last 7 days</option><option>Last 30 days</option></Select>
          <OutlineButton>Export Data</OutlineButton>
        </Actions>
      </SectionHead>

      <Stats>
        {stats.map(([label, value, change, direction]) => (
          <StatCard key={label}><StatLabel>{label}</StatLabel><StatRow><StatValue>{value}</StatValue><Trend $down={direction === 'down'}>{change} {direction === 'down' ? '↓' : '↑'}</Trend></StatRow></StatCard>
        ))}
      </Stats>

      <Tabs>
        {["Employees", "Staffs"].map((tab) => <Tab key={tab} $active={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</Tab>)}
      </Tabs>

      <WeekRow>
        <WeekPicker>
          <SquareButton onClick={() => setWeekIndex((index) => Math.max(0, index - 1))} disabled={weekIndex === 0}><FiChevronLeft /></SquareButton>
          <strong>{week.label}</strong><span>({week.range})</span>
          <SquareButton $muted onClick={() => setWeekIndex((index) => Math.min(weeks.length - 1, index + 1))} disabled={weekIndex === weeks.length - 1}><FiChevronRight /></SquareButton>
        </WeekPicker>
        <PrimaryButton onClick={() => setShowManualForm(true)}><FiPlus /> Add Manually</PrimaryButton>
      </WeekRow>

      <Toolbar>
        <SearchBox><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Employee" /></SearchBox>
        <ToolbarRight><Select defaultValue="All Department"><option>All Department</option></Select><Select defaultValue="All Shifts"><option>All Shifts</option></Select><Select defaultValue="Week View"><option>Week View</option></Select><FilterButton><FiFilter /> Filter</FilterButton></ToolbarRight>
      </Toolbar>

      <TableScroll>
        <Grid>
          <HeaderCell>Employee ID</HeaderCell>{days.map((day) => <HeaderCell key={day}>{day}</HeaderCell>)}
          {visibleEmployees.map((employee) => {
            const rowIndex = employees.findIndex((item) => item.name === employee.name);
            return [<EmployeeCell key={`${employee.name}-employee`}><Avatar src={sampleProfile} alt="" /><EmployeeInfo><strong>{employee.name}</strong><span>{employee.role}</span></EmployeeInfo><OpenButton onClick={() => setSelectedEmployee(employee)}>Open</OpenButton></EmployeeCell>, ...days.map((_, dayIndex) => {
              const entry = manualEntries[`${weekIndex}-${rowIndex}-${dayIndex}`] || week.entries[rowIndex][dayIndex];
              const isPartial = entry.startsWith("4.");
              return <DayCell key={`${week.label}-${employee.name}-${dayIndex}`} $weekend={entry === 'weekend'}><DayNumber>{String(week.dates[dayIndex]).padStart(2, "0")}</DayNumber>{entry !== 'weekend' && <Status $type={entry}>{entry === 'Absent' ? <FiX /> : isPartial ? <FiClock /> : <FiCheck />}{entry}</Status>}{week.overtime.row === rowIndex && week.overtime.day === dayIndex && <Overtime>{week.overtime.value}</Overtime>}</DayCell>;
            })];
          })}
        </Grid>
      </TableScroll>

      {selectedEmployee && (
        <DrawerOverlay onMouseDown={() => setSelectedEmployee(null)}>
          <Drawer onMouseDown={(event) => event.stopPropagation()}>
            <DrawerHeader><DrawerTitle>Attendance Details</DrawerTitle><CloseButton aria-label="Close attendance details" onClick={() => setSelectedEmployee(null)}><FiX /></CloseButton></DrawerHeader>
            <DrawerBody>
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
                <DetailTitleRow><DetailTitle>Attendance Details</DetailTitle><EditButton aria-label="Edit attendance">✎</EditButton></DetailTitleRow>
                <DetailCard>
                  {[['Login', '10:30 AM'], ['Log Out', '10:30 PM'], ['Break Hrs', '1.36 Hrs'], ['Working Hrs', '12.00 Hrs'], ['Over Time', '4.00 Hrs'], ['Shift', 'Morning'], ['Status', 'On Time']].map(([label, value]) => <DetailItem key={label} $wide={label === 'Status'} $success={label === 'Status'}><span>{label}</span><strong>{value}</strong></DetailItem>)}
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
              setManualEntries((current) => ({ ...current, [`${weekIndex}-${employeeIndex}-${dayIndex}`]: value }));
              setShowManualForm(false);
            }}>
              <FormGrid>
                <Field $wide><label>Employee</label><select value={manualForm.employee} onChange={(event) => setManualForm({...manualForm, employee:event.target.value})}>{employees.map((employee,index)=><option key={employee.name} value={index}>{employee.name}</option>)}</select></Field>
                <Field><label>Date</label><select value={manualForm.day} onChange={(event) => setManualForm({...manualForm, day:event.target.value})}>{week.dates.map((date,index)=><option key={date} value={index}>{String(date).padStart(2,"0")} {week.range.split(" ")[1]}</option>)}</select></Field>
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
const Select = styled.select`height:40px;min-width:162px;padding:0 14px;border:1px solid #d8dde3;border-radius:10px;background:#fff;color:#10272b;font:14px "Inter-Regular",sans-serif;outline:none;`;
const OutlineButton = styled.button`height:40px;min-width:154px;border:1px solid ${theme.colors.primary};border-radius:10px;background:#fff;color:${theme.colors.primary};font-weight:600;`;
const Stats = styled.div`display:grid;grid-template-columns:repeat(5,minmax(160px,1fr));gap:20px;margin-bottom:28px;@media(max-width:1100px){grid-template-columns:repeat(3,1fr);}`;
const StatCard = styled.div`height:130px;background:#fff;border-radius:10px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;`;
const StatLabel = styled.span`font-size:13px;font-weight:600;`;
const StatRow = styled.div`display:flex;align-items:flex-end;justify-content:space-between;gap:8px;`;
const StatValue = styled.strong`font-size:40px;line-height:1;font-family:"Inter-Bold",sans-serif;`;
const Trend = styled.span`padding:5px 9px;border-radius:20px;font-size:12px;color:${({$down})=>$down?'#f04444':'#15ad55'};background:${({$down})=>$down?'#ffe1e1':'#e1f9e9'};white-space:nowrap;`;
const Tabs = styled.div`display:flex;gap:28px;border-bottom:1px solid #d9dde1;margin-bottom:24px;`;
const Tab = styled.button`padding:12px 0;border:0;border-bottom:4px solid ${({$active})=>$active?theme.colors.primary:'transparent'};background:transparent;color:${({$active})=>$active?theme.colors.primary:'#17282d'};font-size:16px;font-weight:600;cursor:pointer;`;
const WeekRow = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;`;
const WeekPicker = styled.div`display:flex;align-items:center;gap:8px;font-size:18px;span{font-size:16px;}`;
const SquareButton = styled.button`width:32px;height:32px;border:0;border-radius:8px;background:${({$muted})=>$muted?'#b9dce0':theme.colors.primary};color:#fff;display:grid;place-items:center;cursor:pointer;&:disabled{opacity:.35;cursor:not-allowed;}`;
const PrimaryButton = styled.button`height:40px;padding:0 18px;border:0;border-radius:10px;background:${theme.colors.primary};color:#fff;display:flex;align-items:center;gap:9px;font-weight:600;`;
const Toolbar = styled.div`display:flex;justify-content:space-between;gap:20px;margin-bottom:20px;`;
const SearchBox = styled.label`height:40px;width:356px;background:#fff;border:1px solid #d8dde3;border-radius:10px;display:flex;align-items:center;gap:10px;padding:0 13px;color:${theme.colors.primary};input{border:0;outline:0;width:100%;font-size:14px;}`;
const ToolbarRight = styled.div`display:flex;gap:14px;`;
const FilterButton = styled.button`height:40px;padding:0 14px;border:1px solid #d8dde3;border-radius:10px;background:#fff;display:flex;align-items:center;gap:8px;`;
const TableScroll = styled.div`overflow:auto;background:#fff;border-radius:10px;`;
const Grid = styled.div`display:grid;grid-template-columns:220px repeat(7,minmax(126px,1fr));min-width:1100px;`;
const HeaderCell = styled.div`height:58px;padding:20px 10px;border-bottom:1px solid #d8dde3;color:#8b8d90;font-size:14px;font-weight:600;`;
const EmployeeCell = styled.div`min-height:100px;padding:18px 10px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #d8dde3;`;
const EmployeeInfo = styled.div`min-width:0;flex:1;strong,span{display:block;}strong{font-size:15px;margin-bottom:8px;}span{color:#777;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}`;
const OpenButton = styled.button`border:0;background:transparent;color:${theme.colors.primary};font-size:12px;font-weight:600;cursor:pointer;padding:6px;&:hover{text-decoration:underline;}`;
const Avatar = styled.img`width:48px;height:48px;border-radius:50%;object-fit:cover;`;
const DayCell = styled.div`min-height:100px;padding:10px 12px;border-left:1px solid #d8dde3;border-bottom:1px solid #d8dde3;background:${({$weekend})=>$weekend?'repeating-linear-gradient(135deg,#fff,#fff 5px,#edf0f2 5px,#edf0f2 7px)':'#fff'};`;
const DayNumber = styled.div`font-size:12px;font-weight:600;margin-bottom:12px;`;
const Status = styled.div`height:28px;border:1px solid ${({$type})=>$type==='Absent'?'#ff3131':$type==='Leave'?'#6542bd':$type==='4.26 Hrs'?'#ff8a3d':'#23b45b'};color:${({$type})=>$type==='Absent'?'#ff3131':$type==='Leave'?'#6542bd':$type==='4.26 Hrs'?'#ff8a3d':'#23b45b'};background:${({$type})=>$type==='Absent'?'#fff0f0':$type==='Leave'?'#f0ebff':$type==='4.26 Hrs'?'#fff3e9':'#edfbf2'};border-radius:7px;display:flex;align-items:center;justify-content:center;gap:5px;font-size:12px;white-space:nowrap;`;
const Overtime = styled.div`font-size:11px;font-weight:600;margin:8px 0 0 8px;white-space:nowrap;`;
const DrawerOverlay = styled.div`position:fixed;inset:0;z-index:1000;background:rgba(12,36,39,.42);display:flex;justify-content:flex-end;`;
const Drawer = styled.aside`width:min(584px,100vw);height:100%;background:#f7f9fc;box-shadow:-8px 0 30px rgba(12,36,39,.16);display:flex;flex-direction:column;animation:drawer-in .22s ease-out;@keyframes drawer-in{from{transform:translateX(100%)}to{transform:translateX(0)}}`;
const DrawerHeader = styled.div`height:74px;padding:0 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e0e3e6;background:#fff;`;
const DrawerTitle = styled.h2`font-size:18px;font-weight:600;margin:0;`;
const CloseButton = styled.button`width:34px;height:34px;border:0;background:transparent;color:#0c2427;font-size:24px;display:grid;place-items:center;cursor:pointer;`;
const DrawerBody = styled.div`padding:20px;overflow:auto;display:flex;flex-direction:column;gap:26px;`;
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
