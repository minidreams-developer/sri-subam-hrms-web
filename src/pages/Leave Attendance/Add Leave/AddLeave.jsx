import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
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
  createLeaveRequest,
  getDepartments,
  getLeaveTypes,
  getUsers,
} from "../../../services/apiServices";
import { toast } from "react-toastify";

const AddLeave = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const profileEmployee = location.state?.employee;
  const returnTo = location.state?.returnTo || "/admin/time-hub/leaveAttendance";

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
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [position, setPosition] = useState(null);
  const [department, setDepartment] = useState(null);
  const [date, setDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [leaveType, setLeaveType] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);
  const [fetchingDepartments, setFetchingDepartments] = useState(true);
  const [fetchingLeaveTypes, setFetchingLeaveTypes] = useState(true);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setFetchingEmployees(true);
        const response = await getUsers({ role: "employee", page: 1, limit: 100 });
        const employeeList = Array.isArray(response)
          ? response
          : response?.results || response?.data?.results || response?.data || response?.users || [];
        const formattedEmployees = (Array.isArray(employeeList) ? employeeList : []).map((emp) => {
          const work = emp.workInformation || emp.workDetails || {};
          const department = work.department || work.departmentId || emp.department || emp.departmentId;
          const designation = work.designationId || work.designation || emp.designationId || emp.designation;
          return {
          value: emp._id || emp.id,
          label: emp.name || emp.firstName,
          employeeId: emp.employeeId,
          department: typeof department === "object"
            ? department.departmentName || department.name || department.departmentCode || ""
            : department || "",
          designation: typeof designation === "object"
            ? designation.designationName || designation.name || designation.designationCode || ""
            : designation || "",
          };
        });
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

  useEffect(() => {
    if (!profileEmployee || employees.length === 0) return;

    const profileId = profileEmployee._id || profileEmployee.id;
    const profileEmployeeId = profileEmployee.employeeId;
    const selected = employees.find(
      (option) => option.value === profileId || option.employeeId === profileEmployeeId
    );

    if (selected) setEmployee(selected);
  }, [employees, profileEmployee]);

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

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        setFetchingLeaveTypes(true);
        const response = await getLeaveTypes();
        const leaveTypeList = Array.isArray(response)
          ? response
          : response.results || response.data || response.leaveTypes || [];
        const formattedLeaveTypes = leaveTypeList
          .map((type) => {
            const name = type.name || type.leaveType || type.type || type.label;
            return name ? { value: name, label: name } : null;
          })
          .filter(Boolean);
        setLeaveTypeOptions(formattedLeaveTypes);
      } catch (error) {
        console.error("Error fetching leave types:", error);
        toast.error("Failed to fetch leave types");
      } finally {
        setFetchingLeaveTypes(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  // Set leave type based on query parameter
  useEffect(() => {
    if (leaveTypeOptions.length === 0) return;
    const type = searchParams.get("type");
    if (type === "permission") {
      setLeaveType(
        leaveTypeOptions.find((option) => option.value.toLowerCase() === "permission") || null,
      );
    } else {
      setLeaveType(leaveTypeOptions[0] || null);
    }
  }, [searchParams, leaveTypeOptions]);

  // Update employee details when employee is selected
  useEffect(() => {
    if (employee) {
      setEmployeeId(employee.employeeId || "");
      
      // Find and set designation from designations list
      if (employee.designation) {
        const selectedDesignation = designationOptions.find(
          (des) => des.label.toLowerCase() === String(employee.designation).toLowerCase()
        );
        setPosition(selectedDesignation || null);
      }
      
      // Find and set department from departments list - match by value or name
      if (employee.department) {
        const selectedDept = departments.find(
          (dept) => 
            dept.label.toLowerCase() === employee.department.toLowerCase() ||
            dept.value === employee.department
        );
        setDepartment(selectedDept || null);
      }
    }
  }, [employee, departments]);

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
    if (leaveType?.value === "Permission") {
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
        // DatePicker returns a local Date. Using toISOString() converts it to
        // UTC and can shift a selected date to the previous day in India.
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
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

      const response = await createLeaveRequest(payload);

      if (response) {
        toast.success("Leave request submitted successfully");
        navigate(returnTo, { state: { activeTab: location.state?.returnTab } });
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
            placeholder={fetchingLeaveTypes ? "Loading leave types..." : "Select Leave Type"}
            styles={customSelectStyles}
            isSearchable
            isLoading={fetchingLeaveTypes}
          />
        </Col>
        <Col>
          {leaveType?.value === "Permission" && (
            <CalenderInput
              label="Date"
              onDateSelect={setDate}
              initialDate={date}
            />
          )}
        </Col>
      </Row>
      <Row>
        {leaveType?.value === "Permission" ? (
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
          onClick={() => navigate(returnTo, { state: { activeTab: location.state?.returnTab } })}
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
  width: 100%;
  max-width: 80%;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    flex-direction: column;
    
    button {
      width: 100% !important;
    }
  }
`;
