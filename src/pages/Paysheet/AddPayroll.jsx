import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import InputComponent from "../../components/InputComponent";
import Select from "react-select";
import { customSelectStyles } from "../../theme/reactSelectStyles";
import Button from "../../components/Button";
import { get, post } from "../../helpers/api_helper";
import { GET_ALL_EMPLOYEES, CREATE_PAYROLL } from "../../helpers/url_helper";
import { toast } from "react-toastify";

// Utility function to format currency
const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const AddPayroll = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    employee: null,
    employeeId: "",
    employeeName: "",
    department: "",
    designation: "",
    ctcAnnual: "",
    monthlyCTC: "",
    currentMonth: {
      totalSalary: "",
      overtimePayment: "",
      additionPayment: "",
      totalPayableAmount: "",
    },
  });

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const response = await get(`${GET_ALL_EMPLOYEES}?page=1&limit=100`);
      let employees = [];
      if (Array.isArray(response)) {
        employees = response;
      } else if (response?.results && Array.isArray(response.results)) {
        employees = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        employees = response.data;
      } else if (response?.users && Array.isArray(response.users)) {
        employees = response.users;
      }

      const options = employees.map((emp) => ({
        value: emp.id || emp._id,
        label: emp.name || (emp.firstName && emp.lastName ? `${emp.firstName} ${emp.lastName}` : emp.email || "Unknown"),
        empCode: emp.empCode || emp.employeeId || "N/A",
      }));
      setEmployeeOptions(options);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Fetch individual employee details using GET /v1/users/:userId
  const handleEmployeeSelect = async (option) => {
    if (!option || !option.value) {
      setSelectedEmployee(null);
      return;
    }

    setIsFetchingDetails(true);
    try {
      // Fetch detailed employee data from /v1/users/{userId}
      const employeeData = await get(`/v1/users/${option.value}`);

      if (employeeData) {
        // Extract CTC information
        const ctcAnnual = 
          employeeData.workInformation?.SalaryDetails?.annualCTC || 
          employeeData.ctcAnnual || 
          employeeData.annualCTC || 
          0;
        
        const ctcMonthly = ctcAnnual / 12;

        const empDetails = {
          id: employeeData.id || employeeData._id || option.value,
          name: employeeData.name || option.label,
          empCode: employeeData.employeeId || employeeData.empCode || option.empCode || "N/A",
          department: 
            employeeData.workInformation?.department?.departmentName || 
            employeeData.department?.name || 
            employeeData.department || 
            "N/A",
          designation: 
            employeeData.workInformation?.designation || 
            employeeData.designation?.name || 
            employeeData.designation || 
            "N/A",
          ctcAnnual: !isNaN(ctcAnnual) ? ctcAnnual : 0,
          ctcMonthly: !isNaN(ctcMonthly) ? ctcMonthly : 0,
        };

        setSelectedEmployee(empDetails);
        
        setFormData((prev) => ({
          ...prev,
          employee: option,
          employeeId: empDetails.empCode,
          employeeName: empDetails.name,
          department: empDetails.department,
          designation: empDetails.designation,
          ctcAnnual: empDetails.ctcAnnual,
          monthlyCTC: empDetails.ctcMonthly,
          currentMonth: {
            totalSalary: empDetails.ctcMonthly.toString(),
            overtimePayment: "",
            additionPayment: "",
            totalPayableAmount: empDetails.ctcMonthly.toFixed(2),
          },
        }));

        toast.success("Employee details loaded successfully");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error(error.message || "Failed to fetch employee details");
      setSelectedEmployee(null);
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCurrentMonthChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    
    setFormData((prev) => ({
      ...prev,
      currentMonth: {
        ...prev.currentMonth,
        [field]: value,
      },
    }));

    // Auto-calculate total payable amount
    // Formula: totalSalary + overtimePayment + additionPayment (no deduction)
    setTimeout(() => {
      const totalSalary = field === "totalSalary" ? numValue : parseFloat(formData.currentMonth.totalSalary) || 0;
      const overtime = field === "overtimePayment" ? numValue : parseFloat(formData.currentMonth.overtimePayment) || 0;
      const addition = field === "additionPayment" ? numValue : parseFloat(formData.currentMonth.additionPayment) || 0;
      
      // Total without deduction
      const totalPayable = totalSalary + overtime + addition;
      
      setFormData((prev) => ({
        ...prev,
        currentMonth: {
          ...prev.currentMonth,
          totalPayableAmount: totalPayable.toFixed(2),
        },
      }));
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employee) {
      toast.error("Please select an employee");
      return;
    }

    // Validate required fields
    if (!formData.currentMonth.totalSalary) {
      toast.error("Please enter total salary");
      return;
    }

    try {
      // Get current month and year
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1; // 1-12
      const year = currentDate.getFullYear();

      // Prepare payload for API - match backend requirements
      const payloadData = {
        employeeId: formData.employee.value,
        month: month,
        year: year,
        totalSalary: parseFloat(formData.currentMonth.totalSalary) || 0,
        overtimePayment: parseFloat(formData.currentMonth.overtimePayment) || 0,
        additionPayment: parseFloat(formData.currentMonth.additionPayment) || 0,
        // NOTE: 'deduction' is not allowed by backend
        // The total payable amount should be calculated as:
        // totalSalary + overtimePayment + additionPayment
      };

      console.log("Submitting payroll data:", payloadData);

      // Call API
      const response = await post(CREATE_PAYROLL, payloadData);
      
      console.log("Payroll created successfully:", response);
      toast.success("Payroll created successfully!");
      
      // Close modal and call parent callback
      onClose();
      onSubmit(response);
    } catch (error) {
      console.error("Error creating payroll:", error);
      toast.error(error.message || "Failed to create payroll");
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add Payroll</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <ModalContent>
          <Form onSubmit={handleSubmit}>
            {/* Employee Selection Section */}
            <Section>
              <SectionTitle>Employee Selection</SectionTitle>
              <SelectWrapper>
                <Label>Select Employee</Label>
                <Select
                  options={employeeOptions}
                  value={formData.employee}
                  onChange={handleEmployeeSelect}
                  placeholder="Search and select employee"
                  styles={customSelectStyles}
                  isSearchable
                  isLoading={employeesLoading || isFetchingDetails}
                  isClearable={false}
                />
              </SelectWrapper>
            </Section>

            {/* Employee Details Section */}
            {selectedEmployee && (
              <>
                <Divider />
                <Section>
                  <SectionTitle>Employee Details</SectionTitle>
                  <Row>
                    <Col>
                      <InputComponent
                        label="Employee ID"
                        placeholder="Enter Employee ID"
                        value={formData.employeeId}
                        disabled
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                    <Col>
                      <InputComponent
                        label="Employee Name"
                        placeholder="Enter Employee Name"
                        value={formData.employeeName}
                        disabled
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <InputComponent
                        label="Department"
                        placeholder="Enter Department"
                        value={formData.department}
                        disabled
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                    <Col>
                      <InputComponent
                        label="Designation"
                        placeholder="Enter Designation"
                        value={formData.designation}
                        disabled
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <InputComponent
                        label="CTC Annual"
                        placeholder="0.00"
                        value={formData.ctcAnnual ? formatCurrency(formData.ctcAnnual) : ""}
                        disabled
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                    <Col>
                      <InputComponent
                        label="Monthly CTC"
                        placeholder="0.00"
                        value={formData.monthlyCTC ? formatCurrency(formData.monthlyCTC) : ""}
                        disabled
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                  </Row>
                </Section>

                {/* Current Month Section */}
                <Divider />
                <Section>
                  <SectionTitle>Current Month Payroll</SectionTitle>
                  <Row>
                    <Col>
                      <InputComponent
                        label="Month"
                        placeholder="Month"
                        type="text"
                        value={new Date().toLocaleString('default', { month: 'long' })}
                        disabled
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                    <Col>
                      <InputComponent
                        label="Year"
                        placeholder="Year"
                        type="text"
                        value={new Date().getFullYear().toString()}
                        disabled
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <InputComponent
                        label="Total Salary"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        value={formData.currentMonth.totalSalary}
                        onChange={(e) => handleCurrentMonthChange("totalSalary", e.target.value)}
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                    <Col>
                      <InputComponent
                        label="Overtime Payment"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        value={formData.currentMonth.overtimePayment}
                        onChange={(e) => handleCurrentMonthChange("overtimePayment", e.target.value)}
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <InputComponent
                        label="Addition Payment"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        value={formData.currentMonth.additionPayment}
                        onChange={(e) => handleCurrentMonthChange("additionPayment", e.target.value)}
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <InputComponent
                        label="Total Payable Amount"
                        placeholder="0.00"
                        value={formatCurrency(formData.currentMonth.totalPayableAmount)}
                        disabled
                        labelMargin="0 0 0.625rem 0"
                      />
                    </Col>
                  </Row>
                </Section>
              </>
            )}

            {/* Form Actions */}
            <ButtonGroup>
              <SecondaryButton type="button" onClick={onClose}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit">
                Save Payroll
              </PrimaryButton>
            </ButtonGroup>
          </Form>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddPayroll;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: 0.875rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Inter_18pt-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.secondaryTextColor};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.secondaryPrimary};
    color: ${theme.colors.textColor};
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.searchBackground};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 10px;

    &:hover {
      background: ${theme.colors.secondaryTextColor};
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter_18pt-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0.5rem 0 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div`
  width: 100%;
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
  color: ${theme.colors.textColor};
  margin-bottom: 0.625rem;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${theme.colors.border};
  margin: 0.5rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid ${theme.colors.border};
  margin-top: 1rem;
`;

const PrimaryButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "Inter_18pt-SemiBold", sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: ${theme.colors.white};
  color: ${theme.colors.textColor};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "Inter_18pt-SemiBold", sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover {
    background: ${theme.colors.secondaryPrimary};
  }

  &:active {
    transform: translateY(0);
  }
`;
