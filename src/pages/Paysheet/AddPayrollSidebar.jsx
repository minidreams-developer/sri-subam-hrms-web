import { useState, useEffect } from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MdClose } from "react-icons/md";
import theme from "../../theme/theme";
import InputComponent from "../../components/InputComponent";
import { createPayroll, getUser, getUsers } from "../../services/apiServices";
import { toast } from "react-toastify";

// Validation schema with proper type checking
const payrollValidationSchema = Yup.object({
  employee: Yup.string().required("Employee is required"),
  overtimePayment: Yup.number()
    .typeError("Overtime Payment must be a number")
    .min(0, "Overtime Payment cannot be negative")
    .required("Overtime Payment is required"),
  additionPayment: Yup.number()
    .typeError("Addition Payment must be a number")
    .min(0, "Addition Payment cannot be negative")
    .required("Addition Payment is required"),
  deductions: Yup.number()
    .typeError("Deduction must be a number")
    .min(0, "Deduction cannot be negative")
    .required("Deduction is required"),
});

// Utility function to safely calculate total
const calculateTotal = (selectedEmployee, overtime = 0, addition = 0, deduction = 0) => {
  const monthly = selectedEmployee?.ctcMonthly || 0;
  const ot = isNaN(parseFloat(overtime)) ? 0 : parseFloat(overtime);
  const add = isNaN(parseFloat(addition)) ? 0 : parseFloat(addition);
  const ded = isNaN(parseFloat(deduction)) ? 0 : parseFloat(deduction);
  return monthly + ot + add - ded;
};

// Utility function to format currency
const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const AddPayrollSidebar = ({ open, onClose, onSuccess }) => {
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      
      if (!response?.results || !Array.isArray(response.results)) {
        throw new Error("Invalid employee data format");
      }

      const mappedEmployees = response.results.map(emp => {
        // Safe property access with proper fallbacks
        const id = emp?.id || emp?._id || null;
        const name = emp?.name || "N/A";
        const empCode = emp?.employeeId || emp?.empCode || "N/A";
        const department = emp?.workInformation?.department?.departmentName || emp?.department?.name || "N/A";
        const designation = emp?.workInformation?.designation || emp?.designation?.name || "N/A";
        
        // Safe salary calculation
        let ctcAnnual = 0;
        if (emp?.workInformation?.SalaryDetails?.annualCTC) {
          ctcAnnual = parseFloat(emp.workInformation.SalaryDetails.annualCTC) || 0;
        } else if (emp?.workInformation?.SalaryDetails?.basicSalary) {
          ctcAnnual = parseFloat(emp.workInformation.SalaryDetails.basicSalary) * 12 || 0;
        }
        
        const ctcMonthly = ctcAnnual / 12;

        return {
          id,
          name,
          empCode,
          department,
          designation,
          ctcAnnual: !isNaN(ctcAnnual) ? ctcAnnual : 0,
          ctcMonthly: !isNaN(ctcMonthly) ? ctcMonthly : 0,
        };
      }).filter(emp => emp.id !== null); // Filter out employees without ID

      if (mappedEmployees.length === 0) {
        toast.warning("No employees found");
      }

      setEmployeeOptions(mappedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error(error.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Validate that employee is selected
      if (!selectedEmployee || !selectedEmployee.id) {
        toast.error("Please select a valid employee");
        return;
      }

      // Ensure employeeId is a valid string (not empty, not wrapped in quotes)
      const employeeId = String(selectedEmployee.id).trim();
      if (!employeeId || employeeId === "" || employeeId === '""') {
        toast.error("Invalid employee ID");
        return;
      }

      // Calculate total safely
      const total = calculateTotal(
        selectedEmployee,
        values.overtimePayment,
        values.additionPayment,
        values.deductions
      );

      // Prepare payload - ensure all values are proper types
      const payload = {
        employeeId: employeeId, // Ensure it's a clean string
        month: parseInt(new Date().getMonth() + 1),
        year: parseInt(new Date().getFullYear()),
        totalSalary: parseFloat(selectedEmployee.ctcMonthly || 0),
        overtimePayment: parseFloat(values.overtimePayment || 0),
        additionPayment: parseFloat(values.additionPayment || 0),
        deductions: parseFloat(values.deductions || 0),
        extras: 0,
        penalties: 0,
        loanAndAdvance: 0,
        otherDeductions: 0,
        otherWages: 0,
        totalPayableAmount: parseFloat(total),
        status: "draft",
        remarks: "",
      };

      console.log("Employee ID being sent:", employeeId);
      console.log("Employee ID type:", typeof employeeId);
      console.log("Employee ID length:", employeeId.length);
      console.log("Submitting payroll payload:", payload); // Debug log

      // Submit to API
      const response = await createPayroll(payload);
      
      console.log("Payroll submission response:", response); // Debug log

      toast.success("Payroll added successfully");
      
      // Reset form and clear selected employee
      resetForm();
      setSelectedEmployee(null);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error submitting payroll:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to add payroll";
      toast.error(errorMessage);
    }
  };

  const handleEmployeeChange = async (e, setFieldValue) => {
    const empId = e.target.value;
    
    // Update Formik field
    setFieldValue("employee", empId);
    
    if (!empId) {
      setSelectedEmployee(null);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch detailed employee data from /v1/users/{userId}
      const employeeData = await getUser(empId);
      
      console.log("Fetched employee data:", employeeData); // Debug log
      
      if (employeeData) {
        // Map the detailed employee data
        const ctcAnnual = employeeData.workInformation?.SalaryDetails?.annualCTC || 0;
        const ctcMonthly = ctcAnnual / 12;
        
        const selectedEmployee = {
          id: employeeData.id || employeeData._id,
          name: employeeData.name || "N/A",
          empCode: employeeData.employeeId || employeeData.empCode || "N/A",
          department: employeeData.workInformation?.department?.departmentName || employeeData.department?.name || "N/A",
          designation: employeeData.workInformation?.designation || employeeData.designation?.name || "N/A",
          ctcAnnual: !isNaN(ctcAnnual) ? ctcAnnual : 0,
          ctcMonthly: !isNaN(ctcMonthly) ? ctcMonthly : 0,
        };
        
        console.log("Selected employee mapped:", selectedEmployee); // Debug log
        
        setSelectedEmployee(selectedEmployee);
      } else {
        toast.error("Failed to fetch employee details");
        setSelectedEmployee(null);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error(error.message || "Failed to fetch employee details");
      setSelectedEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Overlay $open={open} onClick={onClose} />
      <Container $open={ open}>
        <Header>
          <Title>Add Payroll</Title>
          <CloseBtn onClick={onClose}>
            <MdClose size={24} color={theme.colors.textColor} />
          </CloseBtn>
        </Header>

        <ScrollContent>
          <Formik
            initialValues={{
              employee: "",
              overtimePayment: "",
              additionPayment: "",
              deductions: "",
            }}
            validationSchema={payrollValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
              <Form>
                <FormContent>
                  {/* Employee Dropdown */}
                  <SelectWrapper>
                    <Label>Employee *</Label>
                    <SelectInput
                      name="employee"
                      value={values.employee}
                      onChange={(e) => handleEmployeeChange(e, setFieldValue)}
                      disabled={loading || isSubmitting}
                    >
                      <option value="">Select employee</option>
                      {employeeOptions.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.empCode})
                        </option>
                      ))}
                    </SelectInput>
                    {errors.employee && touched.employee && (
                      <ErrorMessage>{errors.employee}</ErrorMessage>
                    )}
                  </SelectWrapper>

                  {/* Employee ID - Auto-populated */}
                  <InputComponent
                    label="Employee ID"
                    placeholder="Auto-populated"
                    value={selectedEmployee?.empCode || ""}
                    disabled
                    readOnly
                  />

                  {/* Department - Auto-populated */}
                  <InputComponent
                    label="Department"
                    placeholder="Auto-populated"
                    value={selectedEmployee?.department || ""}
                    disabled
                    readOnly
                  />

                  {/* Designation - Auto-populated */}
                  <InputComponent
                    label="Designation"
                    placeholder="Auto-populated"
                    value={selectedEmployee?.designation || ""}
                    disabled
                    readOnly
                  />

                  {/* CTC Annual - Auto-populated */}
                  <InputComponent
                    label="CTC Annual"
                    placeholder="Auto-populated"
                    value={selectedEmployee ? formatCurrency(selectedEmployee.ctcAnnual) : ""}
                    disabled
                    readOnly
                  />

                  {/* Monthly CTC - Auto-populated */}
                  <InputComponent
                    label="Monthly CTC"
                    placeholder="Auto-populated"
                    value={selectedEmployee ? formatCurrency(selectedEmployee.ctcMonthly) : ""}
                    disabled
                    readOnly
                  />

                  {/* Current Month: Total Salary - Auto-populated */}
                  <InputComponent
                    label="Current Month: Total Salary"
                    placeholder="Auto-populated"
                    value={selectedEmployee ? formatCurrency(selectedEmployee.ctcMonthly) : ""}
                    disabled
                    readOnly
                  />

                  {/* Overtime Payment - User Input */}
                  <InputComponent
                    label="Overtime Payment *"
                    placeholder="Enter overtime payment"
                    type="number"
                    min="0"
                    step="0.01"
                    name="overtimePayment"
                    value={values.overtimePayment}
                    onChange={(e) => setFieldValue("overtimePayment", e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.overtimePayment && touched.overtimePayment && (
                    <ErrorMessage>{errors.overtimePayment}</ErrorMessage>
                  )}

                  {/* Addition Payment - User Input */}
                  <InputComponent
                    label="Addition Payment *"
                    placeholder="Enter addition payment"
                    type="number"
                    min="0"
                    step="0.01"
                    name="additionPayment"
                    value={values.additionPayment}
                    onChange={(e) => setFieldValue("additionPayment", e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.additionPayment && touched.additionPayment && (
                    <ErrorMessage>{errors.additionPayment}</ErrorMessage>
                  )}

                  {/* Deduction - User Input */}
                  <InputComponent
                    label="Deduction *"
                    placeholder="Enter deduction"
                    type="number"
                    min="0"
                    step="0.01"
                    name="deductions"
                    value={values.deductions}
                    onChange={(e) => setFieldValue("deductions", e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.deductions && touched.deductions && (
                    <ErrorMessage>{errors.deductions}</ErrorMessage>
                  )}

                  {/* Total Payable Amount - Auto-calculated */}
                  <InputComponent
                    label="Total Payable Amount"
                    placeholder="Auto-calculated"
                    value={formatCurrency(
                      calculateTotal(
                        selectedEmployee,
                        values.overtimePayment,
                        values.additionPayment,
                        values.deductions
                      )
                    )}
                    disabled
                    readOnly
                  />
                </FormContent>

                <ButtonSection>
                  <CancelButton
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting || loading}
                  >
                    Cancel
                  </CancelButton>
                  <SubmitButton
                    type="submit"
                    disabled={isSubmitting || loading || !selectedEmployee}
                  >
                    {isSubmitting ? "Adding..." : "Add Payroll"}
                  </SubmitButton>
                </ButtonSection>
              </Form>
            )}
          </Formik>
        </ScrollContent>
      </Container>
    </>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 998;
  display: ${({ $open }) => ($open ? "block" : "none")};
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 584px;
  height: 100vh;
  background: ${theme.colors.white};
  z-index: 999;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.textColor};
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.5rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.p`
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: #0c0c0c;
  margin: 1rem 0 0.625rem 0;
`;

const SelectInput = styled.select`
  max-width: 100%;
  width: 100%;
  height: auto;
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.searchBackground};
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  color: ${theme.colors.textColor};
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  &:focus {
    border: 2px solid ${theme.colors.primary};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  font-family: "Inter", sans-serif;
  margin-top: 0.25rem;
`;

const ButtonSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.border};
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.textColor};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: ${theme.colors.secondaryPrimary};
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default AddPayrollSidebar;
