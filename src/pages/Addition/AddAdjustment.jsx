import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import InputComponent from "../../components/InputComponent";
import CalenderInput from "../../components/CalenderInput";
import Button from "../../components/Button";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customSelectStyles } from "../../theme/reactSelectStyles";
import { createAdjustment, getDepartments, getTeams, getUser, getUserDropdown } from "../../services/apiServices";
import { toast } from "react-toastify";

const AddAdjustment = () => {
  const navigate = useNavigate();
  const [forWhom, setForWhom] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [_isLoadingDepts, _setIsLoadingDepts] = useState(false);
  const [_isLoadingTeams, _setIsLoadingTeams] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [isFetchingEmployeeDetails, setIsFetchingEmployeeDetails] = useState(false);
  const [formData, setFormData] = useState({
    // Team fields
    department: null,
    team: null,
    teamId: "",
    teamLead: "",
    // Individual fields
    employeeId: "",
    employee: null,
    designation: "",
    // Adjustment Details
    type: null,
    component: null,
    date: null,
    amount: "",
    affectFrom: null,
    to: null,
    totalMonths: "",
    perMonthDeduction: "",
    payrollMonth: null,
    appliedToPayroll: null,
    remarks: "",
  });

  const forWhomOptions = [
    { value: "team", label: "Team" },
    { value: "individual", label: "Individual" },
  ];

  const typeOptions = [
    { value: "addition", label: "Addition" },
    { value: "deduction", label: "Deduction" },
  ];

  const componentOptions = [
    { value: "emi", label: "EMI" },
    { value: "bonus", label: "Bonus" },
    { value: "incentive", label: "Incentive" },
    { value: "allowance", label: "Allowance" },
  ];

  const generateMonthOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const options = [];
    
    for (let i = currentMonth; i < 12; i++) {
      options.push({
        value: `${months[i].toLowerCase()}${currentYear}`,
        label: `${months[i]} ${currentYear}`
      });
    }
    
    for (let i = 0; i < 12; i++) {
      options.push({
        value: `${months[i].toLowerCase()}${currentYear + 1}`,
        label: `${months[i]} ${currentYear + 1}`
      });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  const monthOptionFromDate = (date) => {
    if (!date) return null;
    const option = monthOptions.find(
      (item) => item.value === `${date.toLocaleString("en-US", { month: "short" }).toLowerCase()}${date.getFullYear()}`,
    );
    return option || {
      value: `${date.toLocaleString("en-US", { month: "short" }).toLowerCase()}${date.getFullYear()}`,
      label: `${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`,
    };
  };

  const dateFromMonthOption = (option) => {
    if (!option?.value) return null;
    const match = option.value.match(/^([a-z]+)(\d{4})$/i);
    if (!match) return null;
    const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(match[1].toLowerCase());
    return month < 0 ? null : new Date(Number(match[2]), month, 1);
  };

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  // Fetch employees from API
  const fetchEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const response = await getUserDropdown();
      let employees = [];
      if (Array.isArray(response)) {
        employees = response;
      } else if (response?.results && Array.isArray(response.results)) {
        employees = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        employees = response.data;
      } else if (response?.users && Array.isArray(response.users)) {
        employees = response.users;
      } else if (response?.employees && Array.isArray(response.employees)) {
        employees = response.employees;
      }

      const options = employees.map((emp) => ({
        value: emp.id || emp._id || emp.userId,
        label: emp.name || emp.employeeName || (emp.firstName && emp.lastName ? `${emp.firstName} ${emp.lastName}` : emp.email || "Unknown"),
        empCode: emp.employeeId || emp.empCode || "N/A",
      }));
      setEmployeeOptions(options);
      console.log("Employee options:", options);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Handle employee selection and fetch details
  const handleEmployeeSelect = async (option) => {
    if (!option || !option.value) {
      handleChange("employee", null);
      handleChange("employeeId", "");
      handleChange("designation", "");
      return;
    }

    setIsFetchingEmployeeDetails(true);
    try {
      // Fetch detailed employee data
      const employeeData = await getUser(option.value);

      if (employeeData) {
        const empDetails = {
          id: employeeData.id || employeeData._id || option.value,
          name: employeeData.name || option.label,
          empCode: employeeData.employeeId || employeeData.empCode || option.empCode || "N/A",
          designation:
            employeeData.workInformation?.designation ||
            employeeData.designation?.name ||
            employeeData.designation ||
            "N/A",
        };

        handleChange("employee", option);
        handleChange("employeeId", empDetails.empCode);
        handleChange("designation", empDetails.designation);

        toast.success("Employee details loaded successfully");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error(error.message || "Failed to fetch employee details");
      handleChange("employee", null);
    } finally {
      setIsFetchingEmployeeDetails(false);
    }
  };

  // Fetch departments - Use same pattern as AddTeamModal
  const fetchDepartments = async () => {
    _setIsLoadingDepts(true);
    try {
      const response = await getDepartments();
      console.log("Departments response:", response);
      
      // Handle different response structures - same as AddTeamModal
      const departmentsList = response?.results || response?.data || response || [];
      
      // Transform departments to select options
      const options = departmentsList.map((dept) => {
        // Extract MongoDB _id for API calls
        const mongoId = dept._id;
        
        return {
          value: mongoId || dept.id, // Use _id as primary value for API
          _id: mongoId, // Explicitly store _id
          label: dept.departmentName || dept.name || "N/A",
        };
      });
      
      console.log("Department options:", options);
      setDepartmentOptions(options);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
      setDepartmentOptions([]);
    } finally {
      _setIsLoadingDepts(false);
    }
  };

  // Fetch all teams without filtering by department
  const fetchTeams = async () => {
    _setIsLoadingTeams(true);
    try {
      // Fetch all teams from the API
      // The API does NOT support departmentId filtering - it rejects the parameter
      const response = await getTeams();
      console.log("Teams response:", response);
      
      // Handle different response structures
      const teamsList = response?.results || response?.data || response || [];
      console.log("Total teams fetched:", teamsList.length);
      
      // Transform teams to select options without any filtering
      // Display ALL teams for user to select manually
      const options = teamsList.map((team) => {
        // Extract MongoDB _id for API calls
        const mongoId = team._id;
        const teamCode = team.teamId || team.teamCode || team.id;
        
        // Extract team lead name - try multiple field names
        const teamLeadName = team.teamLead 
          ? (typeof team.teamLead === 'string' ? team.teamLead : team.teamLead.name || team.teamLead.fullName || String(team.teamLead))
          : (team.leadName || team.lead || "");
        
        console.log(`Team: ${team.teamName}, TeamLead field:`, team.teamLead, "Extracted name:", teamLeadName);
        
        return {
          value: mongoId || team.id, // Use _id as primary value for API
          _id: mongoId, // Explicitly store _id
          label: team.teamName || team.name || "N/A",
          teamId: teamCode || "",
          teamLead: teamLeadName || "", // Extracted team lead name
        };
      });
      
      console.log("Team options (all teams, no filtering):", options);
      setTeamOptions(options);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams");
      setTeamOptions([]);
    } finally {
      _setIsLoadingTeams(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "affectFrom" || field === "to") {
        const from = field === "affectFrom" ? value : prev.affectFrom;
        const to = field === "to" ? value : prev.to;
        next.totalMonths = getMonthRangeCount(from, to);
      }

      return next;
    });
  };

  // Month ranges are inclusive: Oct 2026 to Aug 2027 = 11 months.
  const getMonthRangeCount = (from, to) => {
    if (!from?.value || !to?.value) return "";

    const parseMonth = (value) => {
      const match = String(value).match(/^([a-z]+)(\d{4})$/i);
      if (!match) return null;
      const monthIndex = [
        "jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec",
      ].indexOf(match[1].toLowerCase());
      return monthIndex < 0 ? null : Number(match[2]) * 12 + monthIndex;
    };

    const start = parseMonth(from.value);
    const end = parseMonth(to.value);
    if (start === null || end === null || end < start) return "";
    return String(end - start + 1);
  };

  // Handle department selection - fetch all teams (not filtered by department)
  const handleDepartmentChange = (value) => {
    console.log("Department selected:", value);
    handleChange("department", value);
    // Reset team selection
    handleChange("team", null);
    handleChange("teamId", "");
    handleChange("teamLead", "");
    
    // Fetch teams (will fetch ALL teams from API, user selects manually)
    if (value?.value || value?._id) {
      console.log("Department changed, fetching all teams");
      fetchTeams();
    }
  };

  // Handle team selection and auto-fill team details
  const handleTeamChange = (value) => {
    console.log("Team selected:", value);
    handleChange("team", value);
    
    if (value) {
      // Auto-fill team ID and team lead from selection data
      console.log("Auto-filling teamId:", value.teamId, "teamLead:", value.teamLead);
      handleChange("teamId", value.teamId || "");
      handleChange("teamLead", value.teamLead || "");
    }
  };

  const handleCancel = () => {
    navigate("/admin/pay-hub/additionDeductions");
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!forWhom) {
        toast.error("Please select 'For Whom'");
        return;
      }

      if (!formData.type) {
        toast.error("Please select Type (Addition/Deduction)");
        return;
      }

      if (!formData.component) {
        toast.error("Please select Component");
        return;
      }

      if (!formData.amount) {
        toast.error("Please enter Amount");
        return;
      }

      // Build payload based on forWhom type
      let payload = {
        type: formData.type.value === "addiction" ? "addition" : formData.type.value, // Convert "addiction" to "addition" for API
        component: formData.component.value, // "emi", "bonus", "incentive", "allowance"
        amount: parseFloat(formData.amount),
        remarks: formData.remarks || "",
      };

      // Add date if selected
      if (formData.date) {
        payload.date = formData.date instanceof Date 
          ? formData.date.toISOString().split('T')[0]
          : formData.date;
      }

      // Parse payroll month/year from the user's selected payroll month.
      // For EMI, Affect From is the payroll month when no separate payroll
      // month was selected. Never substitute the current month.
      let payrollMonth = null;
      let payrollYear = null;
      const payrollOption = formData.payrollMonth || formData.affectFrom;
      if (payrollOption?.value) {
        const match = payrollOption.value.match(/^([a-z]+)(\d{4})$/i);
        const months = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
        payrollMonth = months[match?.[1]?.toLowerCase()];
        payrollYear = Number(match?.[2]);
      }

      if (payrollMonth && payrollYear) {
        payload.payrollMonth = payrollMonth;
        payload.payrollYear = payrollYear;
      }

      // For Team
      if (forWhom.value === "team") {
        if (!formData.department) {
          toast.error("Please select Department");
          return;
        }
        if (!formData.team) {
          toast.error("Please select Team");
          return;
        }
        if (!formData.teamId) {
          toast.error("Selected team is invalid. Please choose another team or ensure the team has members assigned.");
          return;
        }

        payload.forWhom = "team";
        // Only the backend team identifier is accepted by this endpoint.
        payload.teamId = formData.teamId;
      }
      // For Individual
      else if (forWhom.value === "individual") {
        if (!formData.employee) {
          toast.error("Please select Employee");
          return;
        }

        payload.forWhom = "individual";
        // The API expects the selected user's MongoDB ID in employeeId.
        payload.employeeId = formData.employee.value;
      }

      // Add EMI-specific fields
      if (formData.component?.value === "emi") {
        if (!formData.affectFrom || !formData.to) {
          toast.error("Please select 'Affect From' and 'To' dates for EMI");
          return;
        }
        if (!formData.totalMonths) {
          toast.error("Please enter Total Months");
          return;
        }
        if (!formData.perMonthDeduction) {
          toast.error("Please enter Per Month Deduction");
          return;
        }

        const getMonthYear = (option) => {
          const match = option.value.match(/^([a-z]+)(\d{4})$/i);
          const months = {
            jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
            jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
          };
          return { month: months[match[1].toLowerCase()], year: Number(match[2]) };
        };

        payload.emiDetails = {
          affectFrom: getMonthYear(formData.affectFrom),
          affectTo: getMonthYear(formData.to),
          totalMonths: parseInt(formData.totalMonths, 10),
          perMonthDeduction: parseFloat(formData.perMonthDeduction),
        };
      }

      console.log("Sending adjustment payload:", payload);

      // Make API call
      const response = await createAdjustment(payload);
      
      console.log("API Response:", response);
      toast.success("Adjustment created successfully!");
      
      // Navigate back to list
      navigate("/admin/pay-hub/additionDeductions");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to create adjustment";
      console.error("Error creating adjustment:", error);
      toast.error(errorMessage);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Section>
          <SectionTitle>Adjustment Type</SectionTitle>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>For Whom</Label>
                <Select
                  options={forWhomOptions}
                  value={forWhom}
                  onChange={(value) => setForWhom(value)}
                  placeholder="Team"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
          </Row>
        </Section>

        {forWhom?.value === "team" && (
          <Section>
            <SectionTitle>Team Details</SectionTitle>
            <Row>
              <Col>
                <SelectWrapper>
                  <Label>Department</Label>
                  <Select
                    options={departmentOptions}
                    value={formData.department}
                    onChange={handleDepartmentChange}
                    placeholder={_isLoadingDepts ? "Loading..." : "Select Department"}
                    styles={customSelectStyles}
                    isSearchable
                    isClearable
                    isDisabled={_isLoadingDepts}
                    isLoading={_isLoadingDepts}
                  />
                </SelectWrapper>
              </Col>
              <Col>
                <SelectWrapper>
                  <Label>Team</Label>
                  <Select
                    options={teamOptions}
                    value={formData.team}
                    onChange={handleTeamChange}
                    placeholder={_isLoadingTeams ? "Loading..." : "Select Team"}
                    styles={customSelectStyles}
                    isSearchable
                    isClearable
                    isDisabled={_isLoadingTeams || teamOptions.length === 0}
                    isLoading={_isLoadingTeams}
                  />
                </SelectWrapper>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputComponent
                  label="Team ID"
                  placeholder="#1253366"
                  value={formData.teamId}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                  readOnly
                  disabled
                />
              </Col>
              <Col>
                <InputComponent
                  label="Team lead"
                  placeholder="Manoj Kumar"
                  value={formData.teamLead}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                  readOnly
                  disabled
                />
              </Col>
            </Row>
          </Section>
        )}

        {forWhom?.value === "individual" && (
          <Section>
            <SectionTitle>Employee Details</SectionTitle>
            <Row>
              <Col>
                <InputComponent
                  label="Employee ID"
                  placeholder="Enter Employee ID"
                  value={formData.employeeId}
                  onChange={(e) => handleChange("employeeId", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
              <Col>
                <SelectWrapper>
                  <Label>Employee</Label>
                  <Select
                    options={employeeOptions}
                    value={formData.employee}
                    onChange={handleEmployeeSelect}
                    placeholder={employeesLoading || isFetchingEmployeeDetails ? "Loading..." : "Select Employee"}
                    styles={customSelectStyles}
                    isSearchable
                    isLoading={employeesLoading || isFetchingEmployeeDetails}
                  />
                </SelectWrapper>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputComponent
                  label="Designation"
                  placeholder="Enter Designation"
                  value={formData.designation}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
            </Row>
          </Section>
        )}

        <Section>
          <SectionTitle>Adjustment Details</SectionTitle>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>Type</Label>
                <Select
                  options={typeOptions}
                  value={formData.type}
                  onChange={(value) => handleChange("type", value)}
                  placeholder="Addiction"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
            <Col>
              <SelectWrapper>
                <Label>Component</Label>
                <Select
                  options={componentOptions}
                  value={formData.component}
                  onChange={(value) => handleChange("component", value)}
                  placeholder={forWhom?.value === "team" ? "EMI" : "Bonus"}
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
          </Row>

          {/* Bonus Component Fields */}
          {formData.component?.value === "bonus" && (
            <>
              <Row>
                <Col>
                  <CalenderInput
                    label="Date"
                    placeholder="Select date"
                    onDateSelect={(date) => handleChange("date", date)}
                    initialDate={formData.date}
                    labelMargin="0 0 0.625rem 0"
                  />
                </Col>
                <Col>
                  <SelectWrapper>
                    <Label>Payroll Month</Label>
                    <Select
                      options={monthOptions}
                      value={formData.payrollMonth}
                      onChange={(value) => handleChange("payrollMonth", value)}
                      placeholder="Jan 2026"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputComponent
                    label="Amount"
                    placeholder="₹ Enter Amount"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </Col>
                <Col>
                  <SelectWrapper>
                    <Label>Applied to Payroll</Label>
                    <Select
                      options={yesNoOptions}
                      value={formData.appliedToPayroll}
                      onChange={(value) => handleChange("appliedToPayroll", value)}
                      placeholder="Yes"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </Col>
              </Row>
              <Row>
                <FullCol>
                  <InputComponent
                    label="Remarks (Optional)"
                    placeholder="Enter Remarks"
                    value={formData.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </FullCol>
              </Row>
            </>
          )}

          {/* EMI Component Fields */}
          {formData.component?.value === "emi" && (
            <>
              <Row>
                <Col>
                  <CalenderInput
                    label="Date"
                    placeholder="Select date"
                    onDateSelect={(date) => handleChange("date", date)}
                    initialDate={formData.date}
                    labelMargin="0 0 0.625rem 0"
                  />
                </Col>
                <Col>
                  <InputComponent
                    label="Amount"
                    placeholder="₹ Enter Amount"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </Col>
              </Row>
              <ThreeColRow>
                <SmallCol>
                  <SelectWrapper>
                    <Label>Affect From</Label>
                    <MonthPicker
                      selected={dateFromMonthOption(formData.affectFrom)}
                      onChange={(date) => handleChange("affectFrom", monthOptionFromDate(date))}
                      placeholderText="Select month"
                      showMonthYearPicker
                      dateFormat="MMM yyyy"
                    />
                  </SelectWrapper>
                </SmallCol>
                <SmallCol>
                  <SelectWrapper>
                    <Label>To</Label>
                    <MonthPicker
                      selected={dateFromMonthOption(formData.to)}
                      onChange={(date) => handleChange("to", monthOptionFromDate(date))}
                      placeholderText="Select month"
                      showMonthYearPicker
                      dateFormat="MMM yyyy"
                    />
                  </SelectWrapper>
                </SmallCol>
                <LargeCol>
                  <InputComponent
                    label="Total Months"
                    placeholder="Enter Total Months"
                    value={formData.totalMonths}
                    readOnly
                    disabled
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </LargeCol>
              </ThreeColRow>
              <Row>
                <Col>
                  <InputComponent
                    label="Per Month Deduction"
                    placeholder="₹ Enter Amount"
                    value={formData.perMonthDeduction}
                    onChange={(e) =>
                      handleChange("perMonthDeduction", e.target.value)
                    }
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </Col>
                <Col>
                  <SelectWrapper>
                    <Label>Applied to Payroll</Label>
                    <Select
                      options={yesNoOptions}
                      value={formData.appliedToPayroll}
                      onChange={(value) => handleChange("appliedToPayroll", value)}
                      placeholder="Yes"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </Col>
              </Row>
              <Row>
                <FullCol>
                  <InputComponent
                    label="Remarks (Optional)"
                    placeholder="Enter Remarks"
                    value={formData.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </FullCol>
              </Row>
            </>
          )}

          {/* Other Components (Incentive, Allowance) - Show Bonus-like fields */}
          {formData.component && 
           formData.component.value !== "bonus" && 
           formData.component.value !== "emi" && (
            <>
              <Row>
                <Col>
                  <CalenderInput
                    label="Date"
                    placeholder="Select date"
                    onDateSelect={(date) => handleChange("date", date)}
                    initialDate={formData.date}
                    labelMargin="0 0 0.625rem 0"
                  />
                </Col>
                <Col>
                  <SelectWrapper>
                    <Label>Payroll Month</Label>
                    <Select
                      options={monthOptions}
                      value={formData.payrollMonth}
                      onChange={(value) => handleChange("payrollMonth", value)}
                      placeholder="Jan 2026"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputComponent
                    label="Amount"
                    placeholder="₹ Enter Amount"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </Col>
                <Col>
                  <SelectWrapper>
                    <Label>Applied to Payroll</Label>
                    <Select
                      options={yesNoOptions}
                      value={formData.appliedToPayroll}
                      onChange={(value) => handleChange("appliedToPayroll", value)}
                      placeholder="Yes"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </Col>
              </Row>
              <Row>
                <FullCol>
                  <InputComponent
                    label="Remarks (Optional)"
                    placeholder="Enter Remarks"
                    value={formData.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </FullCol>
              </Row>
            </>
          )}
        </Section>

        <ButtonRow>
          <Button
            text="Cancel"
            bg="transparent"
            color={theme.colors.primary}
            border={`1px solid ${theme.colors.primary}`}
            width="150px"
            radius="0.5rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleCancel}
          />
          <Button
            text="Save"
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="150px"
            radius="0.5rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleSave}
          />
        </ButtonRow>
      </FormContainer>
    </Container>
  );
};

export default AddAdjustment;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  width: 80%;
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

const ThreeColRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
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

const SmallCol = styled.div`
  width: 100%;
`;

const LargeCol = styled.div`
  width: 100%;
`;

const FullCol = styled.div`
  width: 100%;
  grid-column: 1 / -1;
`;

const SelectWrapper = styled.div`
  width: 100%;
`;

const MonthPicker = styled(DatePicker)`
  width: 100%;
  height: 45px;
  box-sizing: border-box;
  padding: 0 0.875rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.625rem;
  background: ${theme.colors.searchBackground};
  color: ${theme.colors.textColor};
  font: 500 0.875rem "Inter_18pt-Medium", sans-serif;
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary};
  }
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

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${theme.colors.border};
`;
