import styled from "styled-components";
import theme from "../theme/theme";
import { useState } from "react";
import EditIcon from "../assets/images/employee/editIcon.svg";
import CardDetails from "./CardDetails";
import PayrollIcon from "./Frame 1000009178 - Copy.svg";
import { patch } from "../helpers/api_helper";
import { toast } from "react-toastify";

const money = (value) => value === "" || value == null ? "-" : Number(value).toLocaleString("en-IN");

const PayrollComponent = ({ employee, onEmployeeUpdated }) => {
  const [expandedYear, setExpandedYear] = useState("2026");
  const [expandedMonth, setExpandedMonth] = useState("February 2026");
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const workInformation = employee?.workInformation || {};
  const salaryDetails = workInformation.salaryDetails || workInformation.SalaryDetails || employee?.salaryDetails || {};
  const currentSalary = employee?.currentMonthSalary || employee?.payrollDetails || {};

  const openBasicEditor = () => {
    setForm({
      annualCTC: salaryDetails.annualCTC ?? employee?.annualCTC ?? "",
      monthlyCTC: salaryDetails.monthlyCTC ?? employee?.monthlyCTC ?? "",
      effectiveFrom: salaryDetails.effectiveFrom ?? "",
      basicSalary: salaryDetails.basicSalary ?? salaryDetails.baseSalary ?? employee?.salary ?? "",
      houseRentAllowance: salaryDetails.houseRentAllowance ?? salaryDetails.hra ?? "",
      conveyanceAllowance: salaryDetails.conveyanceAllowance ?? "",
      specialAllowance: salaryDetails.specialAllowance ?? "",
      otherFixedAllowances: salaryDetails.otherFixedAllowances ?? "",
    });
    setEditor("basic");
  };

  const openSalaryEditor = () => {
    setForm({
      totalSalary: currentSalary.totalSalary ?? salaryDetails.monthlyCTC ?? "",
      overtimePayment: currentSalary.overtimePayment ?? "",
      additionPayment: currentSalary.additionPayment ?? "",
      deductions: currentSalary.deductions ?? "",
      totalPayableAmount: currentSalary.totalPayableAmount ?? "",
    });
    setEditor("current");
  };

  const change = (event) => setForm((values) => ({ ...values, [event.target.name]: event.target.value }));
  const save = async (event) => {
    event.preventDefault();
    const employeeId = employee?.id || employee?._id;
    if (!employeeId) return toast.error("Employee ID is missing");
    const numericForm = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, key === "effectiveFrom" ? value : (value === "" ? "" : Number(value))]));
    const payload = editor === "basic"
      ? { workInformation: { ...workInformation, salaryDetails: { ...salaryDetails, ...numericForm } } }
      : { currentMonthSalary: { ...currentSalary, ...numericForm } };
    setSaving(true);
    try {
      const response = await patch(`/v1/users/${employeeId}`, payload);
      const updated = response?.data || response?.user || response;
      onEmployeeUpdated?.({ ...employee, ...payload, ...(updated || {}) });
      setEditor(null);
      toast.success(editor === "basic" ? "Payroll details updated successfully" : "Salary updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update payroll details");
    } finally {
      setSaving(false);
    }
  };

  const toggleYear = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  const toggleMonth = (month) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  return (
    <Wrapper>
      
      <PayrollDetailsHeader>
        <PayrollHeaderIcon src={PayrollIcon} alt="payroll" />
        <PayrollDetailsTitle>Payroll details</PayrollDetailsTitle>
      </PayrollDetailsHeader>
      <CardDetails
        title="Basic Details"
        columns={3}
        showEdit={true}
        editIcon={EditIcon}
        editText="Edit details"
        onEdit={openBasicEditor}
        items={[
          {
            label: "CTC (Annual)",
            value: money(salaryDetails.annualCTC ?? employee?.annualCTC),
          },
          {
            label: "Monthly CTC",
            value: money(salaryDetails.monthlyCTC ?? employee?.monthlyCTC),
          },
          {
            label: "Effective From",
            value: salaryDetails.effectiveFrom || "Every Month 1 day",
          },
          {
            label: "Basic Salary",
            value: money(salaryDetails.basicSalary ?? salaryDetails.baseSalary ?? employee?.salary),
          },
          {
            label: "HRA (House Rent Allowance)",
            value: money(salaryDetails.houseRentAllowance ?? salaryDetails.hra),
          },
          {
            label: "Conveyance Allowance",
            value: money(salaryDetails.conveyanceAllowance),
          },
          {
            label: "Special Allowance",
            value: money(salaryDetails.specialAllowance),
          },
          {
            label: "Other Fixed Allowances",
            value: money(salaryDetails.otherFixedAllowances),
          },
        ]}
      />

      <CardDetails
        title="Current Month"
        columns={3}
        showEdit={true}
        editIcon={EditIcon}
        editText="Edit Salary"
        onEdit={openSalaryEditor}
        items={[
          {
            label: "Total Salary",
            value: money(currentSalary.totalSalary ?? salaryDetails.monthlyCTC),
          },
          {
            label: "Overtime Payment",
            value: money(currentSalary.overtimePayment),
          },
          {
            label: "Addition Payment",
            value: money(currentSalary.additionPayment),
          },
          {
            label: "Deductions",
            value: money(currentSalary.deductions ?? 0),
          },
          {
            label: "Total Payable Amount",
            value: money(currentSalary.totalPayableAmount),
          },
        ]}
      />

      <Section>
        <SectionHeader>
          <SectionTitleWithIcon>
            <SectionIcon src={PayrollIcon} alt="payroll" />
            <SectionTitle>Salary History</SectionTitle>
          </SectionTitleWithIcon>
        </SectionHeader>

        {/* Year 2026 */}
        <YearSection>
          <YearHeader onClick={() => toggleYear("2026")}>
            <YearTitle>2026</YearTitle>
            <ChevronIcon expanded={expandedYear === "2026"}>▼</ChevronIcon>
          </YearHeader>

          {expandedYear === "2026" && (
            <MonthsContainer>
              {/* February 2026 */}
              <MonthSection>
                <MonthHeader onClick={() => toggleMonth("February 2026")}>
                  <MonthTitle>February 2026</MonthTitle>
                  <MonthActions>
                    <DownloadLink>Download</DownloadLink>
                    <ChevronIcon expanded={expandedMonth === "February 2026"}>
                      ▼
                    </ChevronIcon>
                  </MonthActions>
                </MonthHeader>

                {expandedMonth === "February 2026" && (
                  <MonthDetails>
                    <DetailsGrid>
                      <DetailItem>
                        <DetailLabel>Total Salary</DetailLabel>
                        <DetailValue>4,00,000</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Overtime Payment</DetailLabel>
                        <DetailValue>5000</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Addition Payment</DetailLabel>
                        <DetailValue>2500</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Deductions</DetailLabel>
                        <DetailValue>0</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Total Payable Amount</DetailLabel>
                        <DetailValue>28</DetailValue>
                      </DetailItem>
                    </DetailsGrid>
                  </MonthDetails>
                )}
              </MonthSection>

              {/* January 2026 */}
              <MonthSection>
                <MonthHeader onClick={() => toggleMonth("January 2026")}>
                  <MonthTitle>January 2026</MonthTitle>
                  <MonthActions>
                    <DownloadLink>Download</DownloadLink>
                    <ChevronIcon expanded={expandedMonth === "January 2026"}>
                      ▼
                    </ChevronIcon>
                  </MonthActions>
                </MonthHeader>
              </MonthSection>
            </MonthsContainer>
          )}
        </YearSection>

        {/* Year 2025 */}
        <YearSection>
          <YearHeader onClick={() => toggleYear("2025")}>
            <YearTitle>2025</YearTitle>
            <ChevronIcon expanded={expandedYear === "2025"}>▼</ChevronIcon>
          </YearHeader>
        </YearSection>

        {/* Year 2024 */}
        <YearSection>
          <YearHeader onClick={() => toggleYear("2024")}>
            <YearTitle>2024</YearTitle>
            <ChevronIcon expanded={expandedYear === "2024"}>▼</ChevronIcon>
          </YearHeader>
        </YearSection>
      </Section>
      {editor && (
        <ModalBackdrop onMouseDown={(event) => event.target === event.currentTarget && setEditor(null)}>
          <Modal role="dialog" aria-modal="true" aria-labelledby="payroll-editor-title">
            <ModalTitle id="payroll-editor-title">{editor === "basic" ? "Edit Payroll Details" : "Edit Salary"}</ModalTitle>
            <EditForm onSubmit={save}>
              {(editor === "basic" ? [
                ["annualCTC", "CTC (Annual)", "number"], ["monthlyCTC", "Monthly CTC", "number"],
                ["effectiveFrom", "Effective From", "text"], ["basicSalary", "Basic Salary", "number"],
                ["houseRentAllowance", "HRA", "number"], ["conveyanceAllowance", "Conveyance Allowance", "number"],
                ["specialAllowance", "Special Allowance", "number"], ["otherFixedAllowances", "Other Fixed Allowances", "number"],
              ] : [
                ["totalSalary", "Total Salary", "number"], ["overtimePayment", "Overtime Payment", "number"],
                ["additionPayment", "Addition Payment", "number"], ["deductions", "Deductions", "number"],
                ["totalPayableAmount", "Total Payable Amount", "number"],
              ]).map(([name, label, type]) => (
                <Field key={name}><label htmlFor={`payroll-${name}`}>{label}</label><input id={`payroll-${name}`} type={type} min={type === "number" ? "0" : undefined} step={type === "number" ? "0.01" : undefined} name={name} value={form[name] ?? ""} onChange={change} /></Field>
              ))}
              <ModalActions><CancelButton type="button" onClick={() => setEditor(null)}>Cancel</CancelButton><SaveButton type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</SaveButton></ModalActions>
            </EditForm>
          </Modal>
        </ModalBackdrop>
      )}
    </Wrapper>
  );
};

export default PayrollComponent;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border-radius: 12px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  padding: 1rem;
`;

const PayrollDetailsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const PayrollHeaderIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const PayrollDetailsTitle = styled.h5`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  line-height: 160%;
  margin: 0;
`;

const SectionTitleWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const YearSection = styled.div`
  margin-bottom: 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.625rem;
  overflow: hidden;
  background: ${theme.colors.white};
`;

const YearHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${theme.colors.bgColor};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.bgColor}dd;
  }
`;

const YearTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const MonthsContainer = styled.div`
  background: ${theme.colors.white};
`;

const MonthSection = styled.div`
  border-top: 1px solid ${theme.colors.border};

  &:first-child {
    border-top: none;
  }
`;

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.bgColor}40;
  }
`;

const MonthTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const MonthActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DownloadLink = styled.a`
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.primary}dd;
  }
`;

const ChevronIcon = styled.span`
  color: ${theme.colors.secondaryText};
  font-size: 0.75rem;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.expanded ? "rotate(0deg)" : "rotate(-90deg)")};
`;

const MonthDetails = styled.div`
  padding: 1rem;
  background: ${theme.colors.bgColor};
  border-top: 1px solid ${theme.colors.border};
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.secondaryText};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
`;

const ModalBackdrop = styled.div`position:fixed;inset:0;z-index:1000;background:#0c242780;display:grid;place-items:center;padding:24px;`;
const Modal = styled.div`width:min(720px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 20px 60px #0003;`;
const ModalTitle = styled.h2`margin:0 0 20px;color:${theme.colors.textColor};font:600 20px "Inter-SemiBold",sans-serif;`;
const EditForm = styled.form`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;@media(max-width:650px){grid-template-columns:1fr;}`;
const Field = styled.div`display:flex;flex-direction:column;gap:6px;label{color:${theme.colors.secondaryTextColor};font:500 12px "Inter-Medium",sans-serif;}input{height:42px;border:1px solid ${theme.colors.border};border-radius:7px;padding:0 11px;color:${theme.colors.textColor};font:500 13px "Inter-Medium",sans-serif;outline:none;}input:focus{border-color:${theme.colors.primary};box-shadow:0 0 0 2px #087d8820;}`;
const ModalActions = styled.div`grid-column:1/-1;display:flex;justify-content:flex-end;gap:12px;margin-top:8px;`;
const CancelButton = styled.button`height:40px;padding:0 22px;border:1px solid ${theme.colors.primary};border-radius:7px;background:#fff;color:${theme.colors.primary};cursor:pointer;font-weight:600;`;
const SaveButton = styled.button`height:40px;padding:0 22px;border:0;border-radius:7px;background:${theme.colors.primary};color:#fff;cursor:pointer;font-weight:600;&:disabled{opacity:.65;cursor:not-allowed;}`;
