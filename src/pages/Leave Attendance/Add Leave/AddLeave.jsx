import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../../theme/theme";
import { customSelectStyles } from "../../../theme/reactSelectStyles";
import InputComponent from "../../../components/InputComponent";
import Select from "react-select";
import { Label } from "reactstrap";
import CalenderInput from "../../../components/CalenderInput";
import TimeInputComponent from "../../../components/TimeInputComponent";
import Button from "../../../components/Button";
import { get, post } from "../../../helpers/api_helper";
import { GET_ALL_EMPLOYEES, CREATE_LEAVE_REQUEST, DEPARTMENTS } from "../../../helpers/url_helper";
import { toast } from "react-toastify";

const AddLeave = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const leaveTypeOptions = [
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Casual Leave", label: "Casual Leave" },
    { value: "Annual Leave", label: "Annual Leave" },
    { value: "Permission", label: "Permission" },
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
  const [date, setDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [leaveType, setLeaveType] = useState(leaveTypeOptions[0]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);
  const [fetchingDepartments, setFetchingDepartments] = useState(true);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setFetchingEmployees(true);
        const response = await get(`${GET_ALL_EMPLOYEES}?page=1&limit=1000`);
        const employeeList = response.results || response.data || response.users || [];
        const formattedEmployees = employeeList.map((emp) => ({
          value: emp._id || emp.id,
          label: emp.name || emp.firstName,
          employeeId: emp.employeeId,
          department: emp.department?.name || emp.department || "",
          designation: emp.designation || "",
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
        const response = await get(`${DEPARTMENTS}?page=1&limit=1000`);
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

  // Set leave type based on query parameter
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "permission") {
      setLeaveType(leaveTypeOptions[3]); // Permission
    } else {
      setLeaveType(leaveTypeOptions[0]); // Sick Leave (default)
    }
  }, [searchParams]);

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

    if (!leaveType) {
      toast.error("Please select leave type");
      return;
    }

    // Validate dates based on leave type
    if (leaveType.value === "Permission") {
      if (!date) {
        toast.error("Please select a date for permission");
        return;
      }
      if (!startTime || !endTime) {
        toast.error("Please select start and end time for permission");
        return;
      }
    } else {
      if (!fromDate || !toDate) {
        toast.error("Please select from and to dates for leave");
        return;
      }
    }

    try {
      setLoading(true);

      // Helper function to convert date to YYYY-MM-DD format
      const formatDateToString = (dateObj) => {
        if (!dateObj) return null;
        if (typeof dateObj === "string") return dateObj;
        return dateObj.toISOString().split("T")[0];
      };

      // Prepare payload based on leave type
      let payload = {
        employeeId: employee.value,
        leaveType: leaveType.value,
        reason: remarks,
      };

      if (leaveType.value === "Permission") {
        // For permission, use singleDate
        payload.singleDate = formatDateToString(date);
        payload.startDate = null;
        payload.endDate = null;
      } else {
        // For leave, use startDate and endDate
        payload.startDate = formatDateToString(fromDate);
        payload.endDate = formatDateToString(toDate);
        payload.singleDate = null;
      }

      const response = await post(CREATE_LEAVE_REQUEST, payload);

      if (response) {
        toast.success("Leave request submitted successfully");
        navigate("/admin/time-hub/leaveAttendance");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast.error(error.response?.data?.message || "Failed to submit leave request");
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
      <Title>Leave Details</Title>
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
            Leave Type
          </Label>
          <Select
            options={leaveTypeOptions}
            value={leaveType}
            onChange={setLeaveType}
            placeholder="Select Leave Type"
            styles={customSelectStyles}
            isSearchable
          />
        </Col>
        <Col>
          {leaveType.value === "Permission" && (
            <CalenderInput
              label="Date"
              onDateSelect={setDate}
              initialDate={date}
            />
          )}
        </Col>
      </Row>
      <Row>
        {leaveType.value === "Permission" ? (
          <>
            <Col>
              <TimeInputComponent
                label="From"
                placeholder="Start Time"
                onTimeSelect={setStartTime}
                initialTime={startTime}
              />
            </Col>
            <Col>
              <TimeInputComponent
                label="To"
                placeholder="End Time"
                onTimeSelect={setEndTime}
                initialTime={endTime}
              />
            </Col>
          </>
        ) : (
          <>
            <Col>
              <CalenderInput
                label="From Date"
                onDateSelect={setFromDate}
                initialDate={fromDate}
              />
            </Col>
            <Col>
              <CalenderInput
                label="To Date"
                onDateSelect={setToDate}
                initialDate={toDate}
              />
            </Col>
          </>
        )}
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
          onClick={() => navigate("/admin/time-hub/leaveAttendance")}
          disabled={loading}
        />
      </ButtonRow>
    </Container>
  );
};

export default AddLeave;

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
