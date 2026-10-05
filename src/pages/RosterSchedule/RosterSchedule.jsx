import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";
import {
  createRoster,
  deleteRoster,
  getRosters,
  getShifts,
  getUsers,
  updateRoster,
} from "../../services/apiServices";

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const id = (v) => String(v?.id || v?._id || v || "");
const list = (r) => r?.results || r?.data?.results || r?.data || r || [];
const employee = (r) =>
  r.employeeId?.personalInformation || r.employeeId || r.employee || {};
const employeeId = (r) =>
  id(r.employeeId?._id || r.employeeId?.id || r.employeeId || r.employee);
const employeeName = (e) =>
  e?.name ||
  [e?.firstName, e?.lastName].filter(Boolean).join(" ") ||
  "Employee";
const shift = (r) => r.shiftId || r.shift || {};
const shiftName = (r) =>
  typeof shift(r) === "object"
    ? shift(r).shiftName || shift(r).name || "Assigned"
    : "Assigned";
const shiftId = (r) => id(shift(r));
const monday = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - (x.getDay() || 7) + 1);
  return x;
};

export default function RosterSchedule() {
  const [date, setDate] = useState(new Date()),
    [view, setView] = useState("week"),
    [rosters, setRosters] = useState([]),
    [users, setUsers] = useState([]),
    [shifts, setShifts] = useState([]),
    [loading, setLoading] = useState(true),
    [modal, setModal] = useState(null),
    [saving, setSaving] = useState(false);
  const week = useMemo(() => {
    const s = monday(date);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(s);
      d.setDate(s.getDate() + i);
      return d;
    });
  }, [date]);
  const range =
    view === "week"
      ? [week[0], week[6]]
      : [
          new Date(date.getFullYear(), date.getMonth(), 1),
          new Date(date.getFullYear(), date.getMonth() + 1, 0),
        ];
  const load = async () => {
    setLoading(true);
    try {
      const [r, u, s] = await Promise.all([
        getRosters({
          fromDate: iso(range[0]),
          toDate: iso(range[1]),
          limit: 50,
        }),
        getUsers({ page: 1, limit: 50 }),
        getShifts({ page: 1, limit: 50 }),
      ]);
      setRosters(list(r));
      setUsers(list(u));
      setShifts(list(s));
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load roster");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [view, date]);
  const employees = useMemo(() => {
    const m = new Map();
    [...users, ...rosters.map(employee)].forEach((e) => {
      if (id(e) && !m.has(id(e))) m.set(id(e), e);
    });
    return [...m.values()];
  }, [users, rosters]);
  const record = (e, d) =>
    rosters.find(
      (r) =>
        employeeId(r) === id(e) && String(r.date || "").slice(0, 10) === iso(d),
    );
  const open = (r = null, e = null, d = new Date()) =>
    setModal({
      id: id(r),
      employee: employeeId(r || { employeeId: e }),
      shift: shiftId(r || {}),
      date: String(r?.date || iso(d)).slice(0, 10),
      notes: r?.notes || "",
    });
  const save = async (e) => {
    e.preventDefault();
    if (!modal.employee || !modal.shift || !modal.date)
      return toast.error("Employee, shift and date are required");
    if (!modal.id && modal.date < iso(new Date()))
      return toast.error("Past dates are not allowed");
    setSaving(true);
    try {
      if (modal.id)
        await updateRoster(modal.id, {
          shiftId: modal.shift,
          notes: modal.notes,
        });
      else
        await createRoster({
          employeeId: modal.employee,
          date: modal.date,
          shiftId: modal.shift,
          notes: modal.notes,
        });
      toast.success("Roster saved");
      setModal(null);
      load();
    } catch (x) {
      toast.error(x.response?.data?.message || "Failed to save roster");
    } finally {
      setSaving(false);
    }
  };
  const cancel = async (r) => {
    if (String(r.date || "").slice(0, 10) < iso(new Date()))
      return toast.error("Past dates are not allowed");
    if (!window.confirm("Cancel this roster schedule?")) return;
    try {
      await deleteRoster(id(r));
      toast.success("Roster cancelled");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to cancel roster");
    }
  };
  const color = (r) => {
    const n = shiftName(r).toLowerCase();
    return n.includes("night")
      ? "night"
      : n.includes("even")
        ? "evening"
        : "morning";
  };
  const move = (n) =>
    setDate((d) => {
      const x = new Date(d);
      view === "week"
        ? x.setDate(x.getDate() + n * 7)
        : x.setMonth(x.getMonth() + n);
      return x;
    });
  return (
    <Page>
      <Header>
        <Back>‹</Back>
        <Title>
          <h1>Roster Calendar</h1>
          <p>
            {date.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}{" "}
            • Three-shift weekly rotation
          </p>
        </Title>
        <MonthNav>
          <button onClick={() => move(-1)}>
            <FiChevronLeft />
          </button>
          <span>
            {date.toLocaleDateString("en-US", { month: "short" })}
            <b>{date.getFullYear()}</b>
          </span>
          <strong>
            {date.toLocaleDateString("en-US", { month: "long" })}
            <b>{date.getFullYear()}</b>
          </strong>
          <span>
            {new Date(
              date.getFullYear(),
              date.getMonth() + 1,
            ).toLocaleDateString("en-US", { month: "short" })}
            <b>{date.getFullYear()}</b>
          </span>
          <button onClick={() => move(1)}>
            <FiChevronRight />
          </button>
        </MonthNav>
        <Actions>
          <button>⇩ Download</button>
          <Primary>✣ Auto - Assign</Primary>
          <User>
            ◉ <b>Manoj Kumar</b>
            <small>Admin</small>
          </User>
        </Actions>
      </Header>
      <Legend>
        <b>LEGEND</b>
        <span className="morning">● Morning 07:00–15:00</span>
        <span className="evening">● Evening 15:00–23:00</span>
        <span className="night">● Night 23:00–07:00</span>
        <span className="off">● Day Off</span>
        <Auto>✣ Auto-assign every Wednesday</Auto>
      </Legend>
      <Content>
        <Toggle>
          <button
            className={view === "month" ? "active" : ""}
            onClick={() => setView("month")}
          >
            Month view
          </button>
          <button
            className={view === "week" ? "active" : ""}
            onClick={() => setView("week")}
          >
            Week View
          </button>
        </Toggle>
        {loading ? (
          <Empty>Loading roster...</Empty>
        ) : view === "month" ? (
          <Month
            date={date}
            employees={employees}
            record={record}
            open={open}
          />
        ) : (
          <Week
            days={week}
            employees={employees}
            record={record}
            open={open}
            color={color}
          />
        )}
      </Content>
      <Database
        employees={employees}
        rosters={rosters}
        open={open}
        cancel={cancel}
      />
      {modal && (
        <Overlay>
          <Modal onSubmit={save}>
            <h2>{modal.id ? "Edit" : "Add"} roster schedule</h2>
            <label>
              Employee
              <select
                value={modal.employee}
                onChange={(e) =>
                  setModal({ ...modal, employee: e.target.value })
                }
              >
                <option value="">Select employee</option>
                {employees.map((e) => (
                  <option key={id(e)} value={id(e)}>
                    {employeeName(e)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Shift
              <select
                value={modal.shift}
                onChange={(e) => setModal({ ...modal, shift: e.target.value })}
              >
                <option value="">Select shift</option>
                {shifts.map((s) => (
                  <option key={id(s)} value={id(s)}>
                    {s.shiftName || s.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                type="date"
                min={iso(new Date())}
                value={modal.date}
                onChange={(e) => setModal({ ...modal, date: e.target.value })}
              />
            </label>
            <label>
              Notes
              <textarea
                value={modal.notes}
                onChange={(e) => setModal({ ...modal, notes: e.target.value })}
              />
            </label>
            <Footer>
              <button type="button" onClick={() => setModal(null)}>
                Cancel
              </button>
              <Primary disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Primary>
            </Footer>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
const Week = ({ days, employees, record, open, color }) => (
  <WeekWrap>
    <WeekBar>
      <b>W1</b>
      <span>
        <strong>Week 1</strong>
        <small>
          {iso(days[0])} - {iso(days[6])}
        </small>
      </span>
      <Auto>✓ Auto-assigned: Wed {days[2].getDate()}</Auto>
    </WeekBar>
    <Grid>
      <GridHead>EMPLOYEE</GridHead>
      {days.map((d) => (
        <GridHead key={iso(d)}>
          {d.toLocaleDateString("en-US", { weekday: "short" })}
          <b>{String(d.getDate()).padStart(2, "0")}</b>
        </GridHead>
      ))}
      {employees.map((e) => (
        <>
          <Person key={id(e)}>
            <strong>{employeeName(e)}</strong>
            <small>
              {e.workInformation?.designation || e.designation || "Employee"}
            </small>
          </Person>
          {days.map((d) => {
            const r = record(e, d);
            return (
              <Slot
                key={iso(d) + id(e)}
                className={r ? color(r) : "empty"}
                onClick={() => open(r, e, d)}
              >
                {r ? shiftName(r) : <FiPlus />}
              </Slot>
            );
          })}
        </>
      ))}
    </Grid>
  </WeekWrap>
);
const Month = ({ date, employees, record, open }) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1),
    offset = (first.getDay() + 6) % 7;
  const days = Array.from(
    { length: 42 },
    (_, i) => new Date(date.getFullYear(), date.getMonth(), i - offset + 1),
  );
  return (
    <Calendar>
      {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((x) => (
        <DayHead key={x}>{x}</DayHead>
      ))}
      {days.map((d) => (
        <Day
          key={iso(d)}
          className={d.getMonth() !== date.getMonth() ? "muted" : ""}
          onClick={() => open(null, employees[0], d)}
        >
          <b>{d.getDate()}</b>
          {employees.slice(0, 3).map((e) => {
            const r = record(e, d);
            return (
              r && (
                <Mini key={id(e)}>
                  {shiftName(r).slice(0, 1)} <i>1</i>
                </Mini>
              )
            );
          })}
        </Day>
      ))}
    </Calendar>
  );
};
const Database = ({ employees, rosters, open, cancel }) => (
  <DatabaseBox>
    <h2>Employee Database</h2>
    <p>Assign names, roles and shift preferences for each person</p>
    <Add onClick={() => open()}>♙ Add Employee</Add>
    <table>
      <thead>
        <tr>
          <th>S.NO</th>
          <th>EMPLOYEE</th>
          <th>EMPLOYEE ID</th>
          <th>ROLE</th>
          <th>SHIFT PREFERENCE</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>
        {employees.slice(0, 8).map((e, i) => {
          const r = rosters.find((x) => employeeId(x) === id(e));
          return (
            <tr key={id(e)}>
              <td>{i + 1}</td>
              <td>
                <b>{employeeName(e)}</b>
              </td>
              <td>{e.employeeId || e.staffId || "—"}</td>
              <td>{e.workInformation?.designation || e.designation || "—"}</td>
              <td>{r && <Badge>{shiftName(r)}</Badge>}</td>
              <td>
                {r && (
                  <>
                    <button onClick={() => open(r, e)}>
                      <FiEdit2 />
                    </button>
                    <button onClick={() => cancel(r)}>
                      <FiTrash2 />
                    </button>
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </DatabaseBox>
);
const Page = styled.main`
  min-height: calc(100vh - 110px);
  background: #f7f9fa;
  color: #253438;
`;
const Header = styled.header`
  height: 72px;
  background: #fff;
  border-bottom: 1px solid #e4eaec;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 22px;
`;
const Back = styled.button`
  border: 1px solid #e4eaec;
  background: #fff;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  font-size: 25px;
  color: #718084;
`;
const Title = styled.div`
  min-width: 245px;
  h1 {
    font-size: 16px;
    margin: 0 0 5px;
  }
  p {
    font-size: 12px;
    color: #798689;
    margin: 0;
  }
`;
const MonthNav = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #dce4e6;
  border-radius: 10px;
  overflow: hidden;
  margin-left: auto;
  button,
  span,
  strong {
    height: 42px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background: #fff;
    color: #526164;
    font-size: 12px;
  }
  span {
    flex-direction: column;
    border-left: 1px solid #e6ebed;
    border-right: 1px solid #e6ebed;
  }
  b {
    font-size: 14px;
  }
  strong {
    background: #087783;
    color: #fff;
    flex-direction: column;
  }
`;
const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  button {
    height: 34px;
    border: 1px solid #087783;
    border-radius: 8px;
    background: #fff;
    color: #087783;
    padding: 0 14px;
    font-weight: 600;
  }
`;
const Primary = styled.button`
  background: #087783 !important;
  color: #fff !important;
  border: 0 !important;
  border-radius: 8px;
  padding: 0 16px;
  height: 34px;
  font-weight: 600;
`;
const User = styled.div`
  font-size: 20px;
  border-left: 1px solid #e5eaeb;
  padding-left: 14px;
  color: #087783;
  white-space: nowrap;
  b {
    color: #253438;
    font-size: 13px;
    margin-left: 6px;
  }
  small {
    display: block;
    color: #879294;
    font-size: 11px;
    margin-left: 28px;
  }
`;
const Legend = styled.div`
  height: 58px;
  background: #fff;
  border-bottom: 1px solid #e4eaec;
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 0 34px;
  font-size: 13px;
  .morning {
    color: #e9a100;
  }
  .evening {
    color: #16804b;
  }
  .night {
    color: #7d32be;
  }
  .off {
    color: #9aa2a4;
  }
`;
const Auto = styled.span`
  margin-left: auto;
  background: #e8fbf8;
  color: #087783;
  border-radius: 20px;
  padding: 10px 15px;
  font-size: 11px;
  white-space: nowrap;
`;
const Content = styled.section`
  padding: 24px 24px 8px;
`;
const Toggle = styled.div`
  display: flex;
  background: #edf6f8;
  border: 1px solid #dce8eb;
  border-radius: 8px;
  padding: 10px;
  width: max-content;
  margin-bottom: 22px;
  button {
    border: 0;
    background: transparent;
    padding: 11px 14px;
    color: #087783;
    font-size: 13px;
    border-radius: 7px;
  }
  .active {
    background: #087783;
    color: #fff;
  }
`;
const WeekWrap = styled.div`
  border: 1px solid #e0e8ea;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
`;
const WeekBar = styled.div`
  height: 60px;
  background: #f6f9fa;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 10px;
  > b {
    background: #087783;
    color: #fff;
    border-radius: 5px;
    padding: 7px;
  }
  span {
    display: flex;
    flex-direction: column;
    gap: 3px;
    font-size: 13px;
  }
  small {
    color: #758184;
    font-size: 11px;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 160px repeat(7, minmax(105px, 1fr));
  overflow: auto;
`;
const GridHead = styled.div`
  background: #eef7f9;
  text-align: center;
  padding: 13px 5px;
  font-size: 11px;
  color: #718083;
  border-right: 1px solid #e0e8ea;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;
const Person = styled.div`
  padding: 14px 12px;
  border-right: 1px solid #e5eaeb;
  border-bottom: 1px solid #edf0f1;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
  small {
    color: #7b888a;
    font-size: 10px;
  }
`;
const Slot = styled.div`
  margin: 12px 7px;
  padding: 7px 3px;
  text-align: center;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  background: #f4f5f5;
  color: #758083;
  min-height: 14px;
  &.morning {
    background: #fff1c8;
    color: #af6d1c;
  }
  .evening {
    background: #caf5e1;
    color: #268668;
  }
  .night {
    background: #f5eafd;
    color: #893bc0;
  }
  .empty {
    background: #fff;
  }
`;
const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;
const DayHead = styled.div`
  text-align: center;
  font-size: 11px;
  color: #6d797b;
  padding: 8px;
`;
const Day = styled.div`
  height: 105px;
  border: 1px solid #d7e1e3;
  border-radius: 14px;
  background: #fff;
  padding: 10px;
  cursor: pointer;
  &.muted {
    opacity: 0.4;
    background: #f3f5f5;
  }
`;
const Mini = styled.div`
  display: flex;
  justify-content: space-between;
  background: #fff0bd;
  border-radius: 4px;
  padding: 5px;
  margin-top: 8px;
  font-size: 10px;
`;
const DatabaseBox = styled.section`
  margin: 25px 24px;
  background: #fff;
  border: 1px solid #e1e8e9;
  border-radius: 10px;
  padding: 22px;
  position: relative;
  h2 {
    font-size: 16px;
    margin: 0 0 5px;
  }
  p {
    font-size: 12px;
    color: #778386;
    margin: 0 0 18px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  th {
    text-align: left;
    color: #778386;
    background: #f7f9fa;
    font-size: 10px;
    padding: 12px;
  }
  td {
    padding: 13px;
    border-top: 1px solid #edf0f1;
    color: #697679;
  }
  td button {
    border: 0;
    background: transparent;
    color: #087783;
    margin-right: 8px;
  }
`;
const Add = styled.button`
  position: absolute;
  right: 22px;
  top: 20px;
  background: #087783;
  color: #fff;
  border: 0;
  border-radius: 7px;
  padding: 10px 14px;
  font-weight: 600;
`;
const Badge = styled.span`
  background: #fff0c7;
  color: #a26b1d;
  padding: 5px 10px;
  border-radius: 14px;
  font-size: 10px;
`;
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #082b2b66;
  display: grid;
  place-items: center;
  z-index: 20;
`;
const Modal = styled.form`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: min(430px, calc(100vw - 30px));
  display: flex;
  flex-direction: column;
  gap: 14px;
  h2 {
    margin: 0;
    font-size: 18px;
  }
  label {
    font-size: 12px;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  input,
  select,
  textarea {
    border: 1px solid #dce4e6;
    border-radius: 7px;
    padding: 10px;
    background: #fff;
  }
  textarea {
    min-height: 70px;
  }
`;
const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 5px;
`;
const Empty = styled.div`
  padding: 100px;
  text-align: center;
  color: #718083;
`;
