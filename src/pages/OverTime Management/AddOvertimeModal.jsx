import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import theme from "../../theme/theme";
import { createOvertime, getDepartments, getUsers } from "../../services/apiServices";
import calendarIcon from "../../assets/images/DashboardImages/calendar_svgrepo.com.svg";
import clockIcon from "../../assets/images/Leavemanage/clock-circle.svg";

const emptyForm = {
  department: "",
  employee: "",
  overtimeDate: "2026-01-12",
  startTime: "",
  endTime: "",
  reason: "",
};

const asList = (response) =>
  Array.isArray(response)
    ? response
    : response?.results || response?.data || response?.users || [];

const AddOvertimeModal = ({ isOpen, onClose, onAdded }) => {
  const [form, setForm] = useState(emptyForm);
  // const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const loadOptions = async () => {
      try {
        const [departmentResponse, employeeResponse] = await Promise.all([
          getDepartments(),
          getUsers({ page: 1, limit: 100 }),
        ]);
        // setDepartments(asList(departmentResponse));
        setEmployees(asList(employeeResponse));
      } catch (error) {
        console.error("Failed to load overtime form options", error);
        toast.error("Failed to load departments or employees");
      }
    };
    loadOptions();
  }, [isOpen]);

  const filteredEmployees = useMemo(() => {
    if (!form.department) return employees;
    return employees.filter((employee) => {
      const department = employee.department || employee.workInformation?.department;
      const departmentId =
        typeof department === "object" ? department?._id || department?.id : department;
      return !departmentId || String(departmentId) === form.department;
    });
  }, [employees, form.department]);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const close = () => {
    setForm(emptyForm);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.employee || !form.overtimeDate || !form.startTime || !form.endTime) {
      toast.error("Please complete all required fields");
      return;
    }
    if (form.endTime <= form.startTime) {
      toast.error("End time must be after start time");
      return;
    }

    setLoading(true);
    try {
      const startTime = new Date(`${form.overtimeDate}T${form.startTime}:00`);
      const endTime = new Date(`${form.overtimeDate}T${form.endTime}:00`);
      await createOvertime({
        // department: form.department,
        employeeId: form.employee,
        // This is a date-only value. Keep the selected calendar date instead
        // of converting local midnight to UTC, which shifts it to the prior day.
        OvertimeDate: form.overtimeDate,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalDuration: Number(((endTime - startTime) / 3600000).toFixed(2)),
        reason: form.reason.trim() || undefined,
        // status: "pending",
      });
      toast.success("Overtime added successfully");
      onAdded?.();
      close();
    } catch (error) {
      console.error("Failed to add overtime", error);
      toast.error(error.response?.data?.message || "Failed to add overtime");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onMouseDown={close}>
      <Modal role="dialog" aria-modal="true" aria-labelledby="add-ot-title" onMouseDown={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <Header>
            <Title id="add-ot-title">Add New OT</Title>
            <CloseButton type="button" aria-label="Close" onClick={close}>×</CloseButton>
          </Header>
          <Body>
            {/* <Field>
              <label htmlFor="ot-department">Select Department</label>
              <select id="ot-department" value={form.department} onChange={update("department")}>
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department._id || department.id} value={department._id || department.id}>
                    {department.departmentName || department.name}
                  </option>
                ))}
              </select>
            </Field> */}
            <Field>
              <label htmlFor="ot-employee">Select Employee</label>
              <select id="ot-employee" value={form.employee} onChange={update("employee")}>
                <option value="">Select Employee</option>
                {filteredEmployees.map((employee) => (
                  <option key={employee._id || employee.id} value={employee._id || employee.id}>
                    {employee.name || [employee.firstName, employee.lastName].filter(Boolean).join(" ") || employee.email}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <label htmlFor="ot-date">OT Date</label>
              <IconField>
                <input id="ot-date" type="date" value={form.overtimeDate} onChange={update("overtimeDate")} />
                <img src={calendarIcon} alt="" />
              </IconField>
            </Field>
            <TimeRow>
              <Field>
                <label htmlFor="ot-start">Start Time</label>
                <IconField>
                  <input id="ot-start" type="time" value={form.startTime} onChange={update("startTime")} />
                  <img src={clockIcon} alt="" />
                </IconField>
              </Field>
              <Field>
                <label htmlFor="ot-end">End Time</label>
                <IconField>
                  <input id="ot-end" type="time" value={form.endTime} onChange={update("endTime")} />
                  <img src={clockIcon} alt="" />
                </IconField>
              </Field>
            </TimeRow>
            <Field>
              <label htmlFor="ot-reason">Reason <span>(Optional)</span></label>
              <input id="ot-reason" placeholder="Enter Reason" value={form.reason} onChange={update("reason")} />
            </Field>
          </Body>
          <Footer>
            <Button text="Cancel" onClick={close} bg={theme.colors.white} color={theme.colors.primary} border={`1px solid ${theme.colors.primary}`} width="100%" radius="8px" fontSize="0.875rem" fontWeight="600" />
            <Button type="submit" text="Add" loading={loading} bg={theme.colors.primary} color={theme.colors.white} width="100%" radius="8px" fontSize="0.875rem" fontWeight="600" />
          </Footer>
        </form>
      </Modal>
    </Overlay>
  );
};

export default AddOvertimeModal;

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 1200; display: grid; place-items: center;
  padding: 20px; background: rgba(0, 0, 0, 0.7);
`;
const Modal = styled.div`
  width: min(440px, 100%); max-height: calc(100vh - 40px); overflow-y: auto;
  border-radius: 10px; background: ${theme.colors.bgColor};
`;
const Header = styled.div`
  height: 61px; padding: 0 20px; display: flex; align-items: center;
  justify-content: space-between; border-bottom: 1px solid #e0e3e6;
`;
const Title = styled.h2`
  margin: 0; color: ${theme.colors.primary}; font: 600 16px/1.6 "Inter-SemiBold", sans-serif;
`;
const CloseButton = styled.button`
  border: 0; background: transparent; color: #7d96b3; padding: 0; cursor: pointer;
  font: 300 29px/24px Arial, sans-serif;
`;
const Body = styled.div`
  padding: 20px; display: flex; flex-direction: column; gap: 20px;
`;
const Field = styled.div`
  min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 10px;
  label { color: ${theme.colors.textColor}; font: 500 14px/1.6 "Inter", sans-serif; }
  label span { color: #7a7a7a; }
  input, select { width: 100%; height: 48px; padding: 0 16px; border: 1px solid #e0e3e6; border-radius: 10px; background: #fff; color: ${theme.colors.textColor}; font: 500 14px "Inter", sans-serif; outline: none; }
  input::placeholder { color: #b1b1b1; }
  input:focus, select:focus { border-color: ${theme.colors.primary}; }
`;
const IconField = styled.div`
  position: relative;
  input { padding-right: 48px; }
  input::-webkit-calendar-picker-indicator { opacity: 0; position: absolute; inset: 0; width: 100%; height: 100%; cursor: pointer; }
  img { position: absolute; right: 14px; top: 12px; width: 24px; height: 24px; pointer-events: none; }
`;
const TimeRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;
const Footer = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 2px 20px 20px;
`;
