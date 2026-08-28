import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../../theme/theme";
import { customSelectStyles } from "../../../theme/reactSelectStyles";
import InputComponent from "../../../components/InputComponent";
import Select from "react-select";
import { Label } from "reactstrap";
import CalenderInput from "../../../components/CalenderInput";
import TimeInputComponent from "../../../components/TimeInputComponent";
import Button from "../../../components/Button";
import { updateLeaveRequest } from "../../../services/apiServices";
import { toast } from "react-toastify";

const EditLeave = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profileEmployee = location.state?.employee;
  const leave = location.state?.leave || {};
  const leaveId = location.state?.leaveId || leave.id || leave._id;
  const readOnly = Boolean(location.state?.readOnly);
  const returnTo = location.state?.returnTo || "/admin/time-hub/leaveAttendance";
  const selectedPerson = profileEmployee || (typeof leave.employeeId === "object" ? leave.employeeId : null);
  const employeeOption = selectedPerson ? {
    value: selectedPerson._id || selectedPerson.id,
    label: selectedPerson.name || selectedPerson.firstName || "Employee",
  } : null;
  const options = employeeOption ? [employeeOption] : [];

  const leaveOptions = [
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Casual Leave", label: "Casual Leave" },
    { value: "Annual Leave", label: "Annual Leave" },
    { value: "Permission", label: "Permission" },
  ];

  const [employee, setEmployee] = useState(employeeOption);
  const [employeeId, setEmployeeId] = useState(selectedPerson?.employeeId || "");
  const [date, setDate] = useState(leave.singleDate || null);
  const [fromDate, setFromDate] = useState(leave.startDate || null);
  const [toDate, setToDate] = useState(leave.endDate || null);
  const [leaveType, setLeaveType] = useState(leaveOptions.find((option) => option.value === leave.leaveType) || leaveOptions[0]);
  const [startTime, setStartTime] = useState(leave.startTime || null);
  const [endTime, setEndTime] = useState(leave.endTime || null);
  const [remarks, setRemarks] = useState(leave.remarks || leave.reason || "");
  const [saving, setSaving] = useState(false);
  const updateLeave = async () => {
    if (!leaveId) return toast.error("Leave request ID is missing");
    setSaving(true);
    try {
      await updateLeaveRequest(leaveId, { employeeId: employee?.value || leave.employeeId?.id || leave.employeeId?._id || leave.employeeId, leaveType: leaveType?.value, singleDate: date, startDate: fromDate, endDate: toDate, startTime, endTime, remarks });
      toast.success("Leave request updated successfully");
      navigate(returnTo, { state: { activeTab: location.state?.returnTab } });
    } catch (error) { toast.error(error.response?.data?.message || "Failed to update leave request"); }
    finally { setSaving(false); }
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
            options={options}
            value={employee}
            onChange={setEmployee}
            placeholder="Select Employee"
            styles={customSelectStyles}
            isSearchable
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
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputComponent
            label="Position"
            placeholder="Position"
            value={profileEmployee?.workInformation?.designation || profileEmployee?.designation || ""}
            labelMargin="0 0 0.625rem 0"
            height="45px"
            disabled
          />
        </Col>
        <Col>
          <Label
            htmlFor="departmentSelect"
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
            id="employeeSelect"
            options={profileEmployee?.department ? [{
              value: profileEmployee.department?._id || profileEmployee.department,
              label: profileEmployee.department?.name || profileEmployee.department,
            }] : []}
            value={profileEmployee?.department ? {
              value: profileEmployee.department?._id || profileEmployee.department,
              label: profileEmployee.department?.name || profileEmployee.department,
            } : null}
            placeholder="Select Department"
            styles={customSelectStyles}
            isDisabled
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
            options={leaveOptions}
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
        {!readOnly && <Button
          text="Update"
          bg={theme.colors.primary}
          color={theme.colors.white}
          width="120px"
          radius="0.625rem"
          onClick={updateLeave}
          loading={saving}
          disabled={saving}
        />}
        <Button
          text="Cancel"
          bg={theme.colors.white}
          color={theme.colors.primary}
          border={`1px solid ${theme.colors.primary}`}
          width="120px"
          radius="0.625rem"
          onClick={() => navigate(returnTo, { state: { activeTab: location.state?.returnTab } })}
        />
      </ButtonRow>
    </Container>
  );
};

export default EditLeave;

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
`;
