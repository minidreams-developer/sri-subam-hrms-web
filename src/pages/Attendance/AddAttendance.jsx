import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import { customSelectStyles } from "../../theme/reactSelectStyles";
import InputComponent from "../../components/InputComponent";
import Select from "react-select";
import { Label } from "reactstrap";
import CalenderInput from "../../components/CalenderInput";
import TimeInputComponent from "../../components/TimeInputComponent";
import Button from "../../components/Button";
import { get, post } from "../../helpers/api_helper";
import { GET_ALL_EMPLOYEES, CREATE_ATTENDANCE, DEPARTMENTS } from "../../helpers/url_helper";
import { toast } from "react-toastify";

function AddAttendanceComponent() {
  const navigate = useNavigate();

  const shiftOptions = [
    { value: "Morning", label: "Morning" },
    { value: "Afternoon", label: "Afternoon" },
    { value: "Night", label: "Night" },
  ];

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
  const [employee, setEmployee] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [position, setPosition] = useState(null);
  const [department, setDepartment] = useState(null);
  const [shift, setShift] = useState(shiftOptions[0]);
  const [date, setDate] = useState(null);
  const [checkStartTime, setCheckStartTime] = useState(null);
  const [checkEndTime, setCheckEndTime] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);
  const [fetchingDepartments, setFetchingDepartments] = useState(true);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setFetchingEmployees(true);
        // Using GET /v1/users to fetch all users (employees and staff)
        // API maximum limit is 100
        const response = await get(`${GET_ALL_EMPLOYEES}?page=1&limit=100`);
        
        // Handle different response structures
        let employeeList = [];
        if (Array.isArray(response)) {
          employeeList = response;
        } else if (response?.results && Array.isArray(response.results)) {
          employeeList = response.results;
        } else if (response?.data && Array.isArray(response.data)) {
          employeeList = response.data;
        } else if (response?.users && Array.isArray(response.users)) {
          employeeList = response.users;
        }

        const formattedEmployees = employeeList.map((emp) => ({
          value: emp._id || emp.id,
          label: `${emp.firstName || emp.name || ""} (${emp.employeeId || emp.staffId || "N/A"})`,
          employeeId: emp.employeeId || emp.staffId || "",
          department: emp.department?.name || emp.department || "",
          designation: emp.designation || "",
          email: emp.email || "",
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
        const response = await get(`${DEPARTMENTS}?page=1&limit=100`);
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

  // Update employee details when employee is selected
  useEffect(() => {
    if (employee) {
      setEmployeeId(employee.employeeId || "");
      
      // Find and set designation from designations list
      if (employee.designation) {
        const selectedDesignation = designations.find(
          (des) => des.label.toLowerCase() === employee.designation.toLowerCase()
        );
        setPosition(selectedDesignation || null);
      }
      
      // Find and set department from departments list
      if (employee.department) {
        const selectedDept = departments.find(
          (dept) => dept.label.toLowerCase() === employee.department.toLowerCase()
        );
        setDepartment(selectedDept || null);
      }
    }
  }, [employee, departments, designations]);

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

    if (!checkStartTime) {
      toast.error("Please select check-in time");
      return;
    }

    if (!checkEndTime) {
      toast.error("Please select check-out time");
      return;
    }

    try {
      setLoading(true);

      // Helper function to convert date to YYYY-MM-DD format
      const formatDateToString = (dateObj) => {
        if (!dateObj) return null;
        if (typeof dateObj === "string") return dateObj;
        return dateObj.toISOString().split("T")[0];
      };

      // Prepare payload
      const payload = {
        employeeId: employee.value,
        date: formatDateToString(date),
        shift: shift.value,
        checkInTime: checkStartTime,
        checkOutTime: checkEndTime,
        remarks: remarks || null,
      };

      const response = await post(CREATE_ATTENDANCE, payload);

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
            onChange={setEmployee}
            placeholder={fetchingEmployees ? "Loading employees..." : "Select Employee"}
            styles={customSelectStyles}
            isSearchable
            isLoading={fetchingEmployees}
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
            options={shiftOptions}
            value={shift}
            onChange={setShift}
            placeholder="Select Shift"
            styles={customSelectStyles}
            isSearchable
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
            label="Check Start Time"
            placeholder="Start Time"
            onTimeSelect={setCheckStartTime}
            initialTime={checkStartTime}
          />
        </Col>
        <Col>
          <TimeInputComponent
            label="Check End Time"
            placeholder="End Time"
            onTimeSelect={setCheckEndTime}
            initialTime={checkEndTime}
          />
        </Col>
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
    </Container>
  );
}

export default AddAttendanceComponent;

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
    border: 1px solid ${theme.colors.primary};
  }
  ::placeholder {
    color: ${theme.colors.textGray || "#9ca3af"};
    font-family: "Inter", sans-serif;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  width: 80%;
`;
