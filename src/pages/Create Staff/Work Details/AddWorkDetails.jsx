import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import CalenderInput from "../../../components/CalenderInput";
import InputComponent from "../../../components/InputComponent";
import Select from "react-select";
import { customSelectStyles } from "../../../theme/reactSelectStyles";
import { get } from "../../../helpers/api_helper";
import { DEPARTMENTS, GET_SHIFTS, GET_ALL_EMPLOYEES, TEAMS, BRANCHES } from "../../../helpers/url_helper";
import { toast } from "react-toastify";

const createPrefilledWorkData = () => {
  const uniqueValue = String(Date.now());

  return {
    dateOfJoining: new Date().toISOString().slice(0, 10),
    experienceType: { value: "experienced", label: "Experienced" },
    department: null,
    designation: { value: "developer", label: "Developer" },
    team: null,
    branch: null,
    contractAgent: { value: "agent_1", label: "Agent 1" },
    reportingPerson: null,
    attendanceType: { value: "bio_metric", label: "Bio Metric" },
    totalYearsOfExperience: "3",
    lastCompanyName: "Test Technologies Pvt Ltd",
    experience: "3 years of software development",
    location: "Chengalpattu",
    shift: null,
    attendancePermission: { value: "auto", label: "Auto" },
    esiNumber: `ESI${uniqueValue.slice(-8)}`,
    pfNumber: `PF${uniqueValue.slice(-8)}`,
    ctcAnnual: "600000",
    monthlyCTC: "50000",
    basicSalary: "25000",
    hra: "10000",
    conveyanceAllowance: "3000",
    specialAllowance: "12000",
    specialAllowance2: "0",
    otherFixedAllowances: "0",
    salaryDisbursementType: { value: "bank_transfer", label: "Bank Transfer" },
    accHolderName: "Test Staff",
    bank: "State Bank of India",
    accNumber: uniqueValue.slice(-12),
    ifscCode: "SBIN0001234",
    bankBranch: "Chengalpattu",
    remarks: "Test staff record",
  };
};

const AddWorkDetails = forwardRef(({ onNext, onBack }, ref) => {
  const [formData, setFormData] = useState(createPrefilledWorkData);

  // Loading states
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [shiftsLoading, setShiftsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [branchesLoading, setBranchesLoading] = useState(false);

  // Options states
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [reportingPersonOptions, setReportingPersonOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchDepartments();
    fetchShifts();
    fetchUsers();
    fetchTeams();
    fetchBranches();
  }, []);

  const fetchDepartments = async () => {
    setDepartmentsLoading(true);
    try {
      const response = await get(`${DEPARTMENTS}?page=1&limit=100`);
      let departments = [];
      if (Array.isArray(response)) {
        departments = response;
      } else if (response?.results && Array.isArray(response.results)) {
        departments = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        departments = response.data;
      }
      
      const options = departments.map((dept) => ({
        value: dept.id || dept._id,
        label: dept.departmentName || dept.name || "Unknown",
      }));
      setDepartmentOptions(options);
      if (options.length) setFormData((previous) => ({ ...previous, department: previous.department || options[0] }));
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const fetchShifts = async () => {
    setShiftsLoading(true);
    try {
      const response = await get(`${GET_SHIFTS}?page=1&limit=100`);
      let shifts = [];
      if (Array.isArray(response)) {
        shifts = response;
      } else if (response?.results && Array.isArray(response.results)) {
        shifts = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        shifts = response.data;
      }
      
      const options = shifts.map((shift) => ({
        value: shift.id || shift._id,
        label: shift.shiftName || shift.name || "Unknown",
      }));
      setShiftOptions(options);
      if (options.length) setFormData((previous) => ({ ...previous, shift: previous.shift || options[0] }));
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error("Failed to fetch shifts");
    } finally {
      setShiftsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await get(`${GET_ALL_EMPLOYEES}?page=1&limit=100`);
      let users = [];
      if (Array.isArray(response)) {
        users = response;
      } else if (response?.results && Array.isArray(response.results)) {
        users = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        users = response.data;
      } else if (response?.users && Array.isArray(response.users)) {
        users = response.users;
      }
      
      const options = users.map((user) => ({
        value: user.id || user._id,
        label: user.name || user.employeeName || "Unknown",
      }));
      setReportingPersonOptions(options);
      if (options.length) setFormData((previous) => ({ ...previous, reportingPerson: previous.reportingPerson || options[0] }));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchTeams = async () => {
    setTeamsLoading(true);
    try {
      const response = await get(`${TEAMS}?page=1&limit=100`);
      let teams = [];
      if (Array.isArray(response)) {
        teams = response;
      } else if (response?.results && Array.isArray(response.results)) {
        teams = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        teams = response.data;
      }
      
      const options = teams.map((team) => ({
        value: team.id || team._id,
        label: team.teamName || team.name || "Unknown",
      }));
      setTeamOptions(options);
      if (options.length) setFormData((previous) => ({ ...previous, team: previous.team || options[0] }));
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setTeamsLoading(false);
    }
  };

  const fetchBranches = async () => {
    setBranchesLoading(true);
    try {
      const response = await get(`${BRANCHES}?page=1&limit=100`);
      let branches = [];
      if (Array.isArray(response)) {
        branches = response;
      } else if (response?.results && Array.isArray(response.results)) {
        branches = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        branches = response.data;
      }
      
      const options = branches.map((branch) => ({
        value: branch.id || branch._id,
        label: branch.branchName || branch.name || "Unknown",
      }));
      setBranchOptions(options);
      if (options.length) setFormData((previous) => ({ ...previous, branch: previous.branch || options[0] }));
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setBranchesLoading(false);
    }
  };

  // Expose form data via ref
  useImperativeHandle(ref, () => ({
    formData,
  }));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const experienceTypeOptions = [
    { value: "fresher", label: "Fresher" },
    { value: "experienced", label: "Experienced" },
  ];

  const designationOptions = [
    { value: "manager", label: "Manager" },
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
  ];

  const contractAgentOptions = [
    { value: "agent_1", label: "Agent 1" },
    { value: "agent_2", label: "Agent 2" },
  ];

  const attendanceTypeOptions = [
    { value: "bio_metric", label: "Bio Metric" },
    { value: "manual", label: "Manual" },
  ];

  const attendancePermissionOptions = [
    { value: "auto", label: "Auto" },
    { value: "manual", label: "Manual" },
  ];

  const salaryDisbursementOptions = [
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "cash", label: "Cash" },
    { value: "cheque", label: "Cheque" },
  ];

  return (
    <Container>
      <Section>
        <SectionTitle>Work Information</SectionTitle>
        <Row>
          <Col>
            <CalenderInput
              label="Date Of Joining"
              onDateSelect={(date) => handleChange("dateOfJoining", date)}
              initialDate={formData.dateOfJoining}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Experience Type</Label>
              <Select
                options={experienceTypeOptions}
                value={formData.experienceType}
                onChange={(value) => handleChange("experienceType", value)}
                placeholder="Select Type"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Department</Label>
              <Select
                options={departmentOptions}
                value={formData.department}
                onChange={(value) => handleChange("department", value)}
                placeholder="Select Department"
                styles={customSelectStyles}
                isSearchable
                isLoading={departmentsLoading}
              />
            </SelectWrapper>
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Designation</Label>
              <Select
                options={designationOptions}
                value={formData.designation}
                onChange={(value) => handleChange("designation", value)}
                placeholder="Select Designation"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Team</Label>
              <Select
                options={teamOptions}
                value={formData.team}
                onChange={(value) => handleChange("team", value)}
                placeholder="Select Team"
                styles={customSelectStyles}
                isSearchable
                isLoading={teamsLoading}
              />
            </SelectWrapper>
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Branch</Label>
              <Select
                options={branchOptions}
                value={formData.branch}
                onChange={(value) => handleChange("branch", value)}
                placeholder="Select Branch"
                styles={customSelectStyles}
                isSearchable
                isLoading={branchesLoading}
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Contract Agent</Label>
              <Select
                options={contractAgentOptions}
                value={formData.contractAgent}
                onChange={(value) => handleChange("contractAgent", value)}
                placeholder="Select Agent"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Reporting Person</Label>
              <Select
                options={reportingPersonOptions}
                value={formData.reportingPerson}
                onChange={(value) => handleChange("reportingPerson", value)}
                placeholder="Select"
                styles={customSelectStyles}
                isSearchable
                isLoading={usersLoading}
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Attendance Type</Label>
              <Select
                options={attendanceTypeOptions}
                value={formData.attendanceType}
                onChange={(value) => handleChange("attendanceType", value)}
                placeholder="Bio Metric"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Experience Details</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="Total Years of Experience"
              placeholder="Enter PF Number"
              value={formData.totalYearsOfExperience}
              onChange={(e) => handleChange("totalYearsOfExperience", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Last Company Name"
              placeholder="Enter Company Name"
              value={formData.lastCompanyName}
              onChange={(e) => handleChange("lastCompanyName", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Experience"
              placeholder="Enter experience"
              value={formData.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Location"
              placeholder="Enter Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Shift & Attendance Details</SectionTitle>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Shift</Label>
              <Select
                options={shiftOptions}
                value={formData.shift}
                onChange={(value) => handleChange("shift", value)}
                placeholder="Select Shift"
                styles={customSelectStyles}
                isSearchable
                isLoading={shiftsLoading}
              />
            </SelectWrapper>
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Attendance Permission</Label>
              <Select
                options={attendancePermissionOptions}
                value={formData.attendancePermission}
                onChange={(value) => handleChange("attendancePermission", value)}
                placeholder="Auto"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
      </Section>

      <Section>
        <SectionTitle>ESI & PF Details</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="ESI Number"
              placeholder="Enter ESI Number"
              value={formData.esiNumber}
              onChange={(e) => handleChange("esiNumber", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="PF Number"
              placeholder="Enter PF Number"
              value={formData.pfNumber}
              onChange={(e) => handleChange("pfNumber", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Salary Details</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="CTC (Annual)"
              placeholder="4,00,000"
              value={formData.ctcAnnual}
              onChange={(e) => handleChange("ctcAnnual", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Monthly CTC"
              placeholder="33,333"
              value={formData.monthlyCTC}
              onChange={(e) => handleChange("monthlyCTC", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Basic Salary"
              placeholder="1500"
              value={formData.basicSalary}
              onChange={(e) => handleChange("basicSalary", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
          <Col>
            <InputComponent
              label="HRA (House Rent Allowance)"
              placeholder="1500"
              value={formData.hra}
              onChange={(e) => handleChange("hra", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Conveyance Allowance"
              placeholder="1500"
              value={formData.conveyanceAllowance}
              onChange={(e) => handleChange("conveyanceAllowance", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
          <Col>
            <InputComponent
              label="Special Allowance"
              placeholder="0"
              value={formData.specialAllowance}
              onChange={(e) => handleChange("specialAllowance", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Special Allowance"
              placeholder="0"
              value={formData.specialAllowance2}
              onChange={(e) => handleChange("specialAllowance2", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
          <Col>
            <InputComponent
              label="Other Fixed Allowances"
              placeholder="0"
              value={formData.otherFixedAllowances}
              onChange={(e) => handleChange("otherFixedAllowances", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Salary Disbursement Type</Label>
              <Select
                options={salaryDisbursementOptions}
                value={formData.salaryDisbursementType}
                onChange={(value) => handleChange("salaryDisbursementType", value)}
                placeholder="Select Type"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Bank Details</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="Acc Holder Name"
              placeholder="Enter Acc Holder Name"
              value={formData.accHolderName}
              onChange={(e) => handleChange("accHolderName", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Bank"
              placeholder="Enter Bank"
              value={formData.bank}
              onChange={(e) => handleChange("bank", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Acc Number"
              placeholder="Enter Acc Number"
              value={formData.accNumber}
              onChange={(e) => handleChange("accNumber", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="IFSC Code"
              placeholder="Enter IFSC Code"
              value={formData.ifscCode}
              onChange={(e) => handleChange("ifscCode", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Branch"
              placeholder="Enter Branch"
              value={formData.bankBranch}
              onChange={(e) => handleChange("bankBranch", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Reference Details</SectionTitle>
        <Row>
          <FullCol>
            <RemarksLabel>Remarks</RemarksLabel>
            <RemarksTextarea
              placeholder="Enter Remarks"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
            />
          </FullCol>
        </Row>
      </Section>
    </Container>
  );
});

// ── Styled Components ──

const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e3e6;

  &:last-of-type {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin: 0 0 1.5rem 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div`
  width: 100%;
`;

const FullCol = styled.div`
  width: 100%;
  grid-column: 1 / -1;
`;

const SelectWrapper = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin-bottom: 0.625rem;
`;

const RemarksLabel = styled.p`
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin: 0 0 0.625rem 0;
`;

const RemarksTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.searchBackground};
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  color: ${theme.colors.textColor};
  outline: none;
  resize: vertical;

  &:focus {
    border: 2px solid ${theme.colors.primary};
  }

  ::placeholder {
    color: ${theme.colors.textGray || "#9ca3af"};
    font-family: "Inter_18pt-Medium", sans-serif;
  }
`;

export default AddWorkDetails;
