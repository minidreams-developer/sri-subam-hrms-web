import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../../theme/theme";
import { customSelectStyles } from "../../../theme/reactSelectStyles";
import InputComponent from "../../../components/InputComponent";
import Select from "react-select";
import { Label } from "reactstrap";
import CalenderInput from "../../../components/CalenderInput";
import TimeInputComponent from "../../../components/TimeInputComponent";
import Button from "../../../components/Button";
import {
  createAttendance,
  getDepartments,
  getShifts,
  getUser,
  getUserDropdown,
} from "../../../services/apiServices";
import { toast } from "react-toastify";

const AddAttendance = () => {
  const navigate = useNavigate();

  const designationOptions = [
    { value: "manager", label: "Manager" },
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "analyst", label: "Analyst" },
    { value: "executive", label: "Executive" },
    { value: "coordinator", label: "Coordinator" },
  ];

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [position, setPosition] = useState(null);
  const [department, setDepartment] = useState(null);
  const [shift, setShift] = useState(null);
  const [date, setDate] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [logoutTime, setLogoutTime] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({ value: "onTime", label: "On Time" });
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [fetchingDepartments, setFetchingDepartments] = useState(true);
  
  const [fetchingShifts, setFetchingShifts] = useState(true);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setFetchingEmployees(true);
        const response = await getUserDropdown();
        const employeeList = Array.isArray(response)
          ? response
          : response?.results || response?.data?.results || response?.data || response?.users || [];
        const formattedEmployees = employeeList.map((emp) => ({
          value: emp._id || emp.id,
          label: emp.name || [emp.firstName, emp.lastName].filter(Boolean).join(" ") || emp.email,
          employeeId: emp.employeeId || emp.staffId || "",
        }));
        setEmployees(formattedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to fetch employees");
      } finally {
        setFetchingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setFetchingDepartments(true);
        const response = await getDepartments({ page: 1, limit: 100 });
        const departmentList = response.results || response.data || [];
        const formattedDepartments = departmentList.map((dept) => ({
          value: dept._id || dept.id,
          label: dept.name || dept.departmentName || "",
          id: dept._id || dept.id,
        }));
        setDepartments(formattedDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Failed to fetch departments");
      } finally {
        setFetchingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch shifts on component mount
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setFetchingShifts(true);
        const response = await getShifts({ page: 1, limit: 100 });
        const shiftList = response.results || response.data || [];
        const formattedShifts = shiftList.map((shift) => ({
          value: shift._id || shift.id,
          label: shift.name || shift.shiftName || "",
          id: shift._id || shift.id,
        }));
        setShifts(formattedShifts);
        // Set first shift as default
        if (formattedShifts.length > 0) {
          setShift(formattedShifts[0]);
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
        toast.error("Failed to fetch shifts");
      } finally {
        setFetchingShifts(false);
      }
    };

    fetchShifts();
  }, []);

  const getValue = (value) =>
    value && typeof value === "object" ? value._id || value.id || value.value : value;

  const getLabel = (value, fallback = "") =>
    value && typeof value === "object"
      ? value.name || value.departmentName || value.designationName || value.label || fallback
      : value || fallback;

  const findOption = (options, value, label) => {
    const valueId = getValue(value);
    return options.find((option) => option.value === valueId || option.label === getLabel(value, label)) ||
      (valueId || label ? { value: valueId || label, label: label || getLabel(value) } : null);
  };

  const handleEmployeeChange = async (selectedEmployee) => {
    setEmployee(selectedEmployee);
    setPosition(null);
    setDepartment(null);
    if (!selectedEmployee?.value) return;

    try {
      setFetchingUser(true);
      const response = await getUser(selectedEmployee.value);
      const user = response?.data || response?.user || response;
      const work = user?.workInformation || {};
      const employeeNumber = user?.employeeId || user?.staffId || selectedEmployee.employeeId || "";
      const designation = work.designationId || user.designationId || work.designation || user.designation;
      const departmentValue = work.department || user.department;
      const shiftId = user?.shiftId || work.shiftId || user?.shift?._id || user?.shift?.id;
      const shiftName = user?.shiftName || work.shiftName || user?.shift?.name;

      setEmployee((current) => ({ ...current, employeeId: employeeNumber }));
      setEmployeeId(employeeNumber);
      setPosition(findOption(designationOptions, designation));
      setDepartment(findOption(departments, departmentValue));
      setShift(findOption(shifts, shiftId, shiftName));
    } catch (error) {
      console.error("Error fetching selected employee:", error);
      toast.error(error.response?.data?.message || "Failed to load employee details");
    } finally {
      setFetchingUser(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employee) {
      toast.error("Please select an employee");
      return;
    }

    if (!shift) {
      toast.error("Please select a shift");
      return;
    }

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (!loginTime) {
      toast.error("Please select login time");
      return;
    }

    if (!logoutTime) {
      toast.error("Please select logout time");
      return;
    }

    try {
      setLoading(true);

      // Helper function to convert date to YYYY-MM-DD format
      const formatDateToString = (dateObj) => {
        if (!dateObj) return null;
        if (typeof dateObj === "string") return dateObj;
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // TimePicker returns a Date whose calendar day is incidental (usually today).
      // Build the timestamp from the selected attendance date so the picker day and
      // the browser timezone cannot change the submitted login/logout date.
      const formatAttendanceTimestamp = (timeValue, attendanceDate, addDay = false) => {
        const result = new Date(attendanceDate);
        result.setHours(timeValue.getHours(), timeValue.getMinutes(), 0, 0);
        if (addDay) result.setDate(result.getDate() + 1);
        return result.toISOString();
      };

      const loginDate = new Date(date);
      const logoutDate = new Date(date);
      logoutDate.setHours(logoutTime.getHours(), logoutTime.getMinutes(), 0, 0);
      const loginMinutes = loginTime.getHours() * 60 + loginTime.getMinutes();
      const logoutMinutes = logoutTime.getHours() * 60 + logoutTime.getMinutes();

      // Prepare payload according to API spec
      const payload = {
        employeeId: employee.value,
        date: formatDateToString(date),
        shiftId: shift.value,
        loginTime: formatAttendanceTimestamp(loginTime, loginDate),
        logoutTime: formatAttendanceTimestamp(logoutTime, loginDate, logoutMinutes < loginMinutes),
        attendanceStatus: attendanceStatus.value,
        IsOverTimeWoked: false,
        overTimeWorkedHours: 0,
        totalWorkedHours: 0,
        remarks: remarks || null,
      };

      const response = await createAttendance(payload);

      if (response) {
        toast.success("Attendance recorded successfully");
        navigate("/admin/time-hub/attendance");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error(error.response?.data?.message || "Failed to record attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Container>
      <Title>Employee Details</Title>
      <Row>
        <Col>
          <Label
            htmlFor="employeeSelect"
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              fontFamily: "Inter, sans-serif",
              color: theme.colors.primaryGreen,
              marginBottom: "0.625rem",
            }}
          >
            Employee Name
          </Label>
          <Select
            id="employeeSelect"
            options={employees}
            value={employee}
            onChange={handleEmployeeChange}
            placeholder={fetchingEmployees ? "Loading employees..." : "Select Employee"}
            styles={customSelectStyles}
            isSearchable
            isLoading={fetchingEmployees || fetchingUser}
          />
        </Col>
        <Col>
          <InputComponent
            label="Employee ID"
            placeholder="Enter Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            labelMargin="0 0 0.625rem 0"
            height="45px"
            disabled
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Label
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              fontFamily: "Inter, sans-serif",
              color: theme.colors.primaryGreen,
              marginBottom: "0.625rem",
            }}
          >
            Position
          </Label>
          <Select
            options={designationOptions}
            value={position}
            onChange={setPosition}
            placeholder="Select Position"
            styles={customSelectStyles}
            isSearchable
          />
        </Col>
        <Col>
          <Label
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              fontFamily: "Inter, sans-serif",
              color: theme.colors.primaryGreen,
              marginBottom: "0.625rem",
            }}
          >
            Department
          </Label>
          <Select
            options={departments}
            value={department}
            onChange={setDepartment}
            placeholder={fetchingDepartments ? "Loading departments..." : "Select Department"}
            styles={customSelectStyles}
            isSearchable
            isLoading={fetchingDepartments}
          />
        </Col>
      </Row>
      <Divider />
      <Title>Attendance Details</Title>
      <Row>
        <Col>
          <Label
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              fontFamily: "Inter, sans-serif",
              color: theme.colors.primaryGreen,
              marginBottom: "0.625rem",
            }}
          >
            Shift
          </Label>
          <Select
            options={shifts}
            value={shift}
            onChange={setShift}
            placeholder={fetchingShifts ? "Loading shifts..." : "Select Shift"}
            styles={customSelectStyles}
            isSearchable
            isLoading={fetchingShifts}
          />
        </Col>
        <Col>
          <CalenderInput
            label="Date"
            onDateSelect={setDate}
            initialDate={date}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <TimeInputComponent
            label="Login Time"
            placeholder="Start Time"
            onTimeSelect={setLoginTime}
            initialTime={loginTime}
            timeFormat="HH:mm"
          />
        </Col>
        <Col>
          <TimeInputComponent
            label="Logout Time"
            placeholder="End Time"
            onTimeSelect={setLogoutTime}
            initialTime={logoutTime}
            timeFormat="HH:mm"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Label
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              fontFamily: "Inter, sans-serif",
              color: theme.colors.primaryGreen,
              marginBottom: "0.625rem",
            }}
          >
            Attendance Status
          </Label>
          <Select
            options={[
              { value: "onTime", label: "On Time" },
              { value: "earlyOut", label: "Early Out" },
              { value: "arrivedLate", label: "Arrived Late" },
            ]}
            value={attendanceStatus}
            onChange={setAttendanceStatus}
            placeholder="Select Status"
            styles={customSelectStyles}
            isSearchable
          />
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col>
          <RemarksLabel>Remarks (Optional)</RemarksLabel>
          <TextArea
            placeholder="Enter Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </Col>
      </Row>
    </Container>


     <ButtonRow>
        <Button
          text="Submit"
          bg={theme.colors.primary}
          color={theme.colors.white}
          width="120px"
          radius="0.625rem"
          onClick={handleSubmit}
          disabled={loading}
        />
        <Button
          text="Cancel"
          bg={theme.colors.white}
          color={theme.colors.primary}
          border={`1px solid ${theme.colors.primary}`}
          width="120px"
          radius="0.625rem"
          onClick={() => navigate("/admin/time-hub/attendance")}
          disabled={loading}
        />
      </ButtonRow>
    </>
  );
};

export default AddAttendance;

const Container = styled.div``;

const Title = styled.h2`
  font-size: 1.125rem;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: ${theme.colors.primary};
`;

const Row = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 80%;
  margin-bottom: 0.5rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Col = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e0e3e6;
  width: 100%;
  margin: 2rem 0;
`;

const RemarksLabel = styled.p`
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin: 1rem 0 0.625rem 0;
`;



const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    flex-direction: row;
    
    button {
      width: 100% !important;
    }
  }
`;


const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 0.875rem;
  border-radius: 0.625rem;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.searchBackground};
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.textColor};
  outline: none;
  resize: none;

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textGray || "#9ca3af"};
    font-family: "Inter", sans-serif;
  }
`;
