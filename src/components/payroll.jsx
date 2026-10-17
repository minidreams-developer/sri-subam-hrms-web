import styled from "styled-components";
import theme from "../theme/theme";
import { useEffect, useMemo, useState } from "react";
import EditIcon from "../assets/images/employee/editIcon.svg";
import CardDetails from "./CardDetails";
import PayrollIcon from "./Frame 1000009178 - Copy.svg";
import {
  getEmployeePayrollHistory,
  getPayrollPreview,
  updateSalaryDetails,
  updateUser,
} from "../services/apiServices";
import { toast } from "react-toastify";

const money = (value) =>
  value === "" || value == null ? "N/A" : Number(value).toLocaleString("en-IN");

const payrollRecords = (response, fallback = {}) => {
  const records = response?.results || response?.data?.results || response?.data || response?.result || [];
  if (!Array.isArray(records)) return [];
  return records.map((record) => ({
    ...record,
    month: Number(record.month || response?.month || fallback.month),
    year: Number(record.year || response?.year || fallback.year),
  }));
};

const PayrollComponent = ({ employee, onEmployeeUpdated }) => {
  const [expandedYear, setExpandedYear] = useState("2026");
  const [expandedMonth, setExpandedMonth] = useState(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
  );
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [currentSalary, setCurrentSalary] = useState({});
  const [historyRecords, setHistoryRecords] = useState([]);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const workInformation = employee?.workInformation || {};
  const salaryDetails =
    workInformation.salaryDetails ||
    workInformation.SalaryDetails ||
    employee?.salaryDetails ||
    {};
  const employeeId = employee?.id || employee?._id;
  const commission =
    employee?.commission ||
    employee?.commissionDetails ||
    workInformation.commission ||
    {};
  const salaryHistory = employee?.salaryHistory || employee?.payrollHistory || {};
  const isAgent =
    String(
      employee?.role || employee?.employeeType || employee?.type || "",
    ).toLowerCase() === "agent";

  useEffect(() => {
    if (!employeeId || isAgent) return;
    let active = true;
    const now = new Date();
    setPayrollLoading(true);
    Promise.all([
      getPayrollPreview(employeeId, { month: now.getMonth() + 1, year: now.getFullYear() }),
      getEmployeePayrollHistory({ employeeId, page: 1, limit: 100, sortBy: "-year,-month" }),
    ])
      .then(([preview, history]) => {
        if (!active) return;
        setCurrentSalary(preview?.data || preview?.result || preview || {});
        setHistoryRecords(payrollRecords(history));
      })
      .catch(() => {
        if (active) {
          setCurrentSalary({});
          setHistoryRecords([]);
        }
      })
      .finally(() => active && setPayrollLoading(false));
    return () => { active = false; };
  }, [employeeId, isAgent]);

  const groupedHistory = useMemo(() => historyRecords.reduce((groups, record) => {
    const year = String(record.year || new Date().getFullYear());
    (groups[year] ||= []).push(record);
    return groups;
  }, {}), [historyRecords]);
  const historyYears = useMemo(() => ({
    ...groupedHistory,
    [String(new Date().getFullYear())]: groupedHistory[String(new Date().getFullYear())] || [],
  }), [groupedHistory]);

  const openBasicEditor = () => {
    setForm({
      commissionPerPerson:
        commission.commissionPerPerson ?? commission.commission ?? "",
      gasAllowance: commission.gasAllowance ?? commission.allowance ?? "",
      salaryDisbursementType: commission.salaryDisbursementType ?? "",
    });
    setEditor("basic");
  };

  const openSalaryEditor = () => {
    setForm({
      totalSalary: currentSalary.grossWages ?? currentSalary.totalSalary ?? salaryDetails.monthlyCTC ?? "",
      overtimePayment: currentSalary.overtimePayment ?? "",
      additionPayment: currentSalary.extras ?? currentSalary.additionPayment ?? "",
      deductions: currentSalary.totalDeductions ?? currentSalary.deductions ?? "",
      totalPayableAmount: currentSalary.takeHome ?? currentSalary.totalPayableAmount ?? "",
    });
    setEditor("current");
  };

  const openBasicSalaryEditor = () => {
    setForm({
      basicSalary: salaryDetails.basicSalary ?? "",
      monthlyCTC: salaryDetails.monthlyCTC ?? "",
      annualCTC: salaryDetails.annualCTC ?? "",
      houseRentAllowance: salaryDetails.houseRentAllowance ?? "",
      conveyanceAllowance: salaryDetails.conveyanceAllowance ?? "",
      specialAllowance: salaryDetails.specialAllowance ?? "",
      otherFixedAllowance: salaryDetails.otherFixedAllowance ?? "",
      pfAmount: salaryDetails.pfAmount ?? "",
      esiAmount: salaryDetails.esiAmount ?? "",
    });
    setEditor("salaryBasic");
  };

  const change = (event) =>
    setForm((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  const save = async (event) => {
    event.preventDefault();
    if (!employeeId) return toast.error("Employee ID is missing");
    const numericForm = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [
        key,
        key === "effectiveFrom" ? value : value === "" ? "" : Number(value),
      ]),
    );
    const payload =
      editor === "basic"
        ? { commission: { ...commission, ...numericForm } }
        : editor === "salaryBasic"
          ? {
              workInformation: {
                SalaryDetails: { ...salaryDetails, ...numericForm },
              },
            }
          : { currentMonthSalary: { ...currentSalary, ...numericForm } };
    setSaving(true);
    try {
      const response = editor === "salaryBasic"
        ? await (salaryDetails.id || salaryDetails._id || salaryDetails.salaryId
            ? updateSalaryDetails(
                salaryDetails.id || salaryDetails._id || salaryDetails.salaryId,
                numericForm,
              )
            : Promise.reject(new Error("Salary ID is missing")))
        : await updateUser(employeeId, payload);
      const updated = response?.data || response?.user || response;
      const locallyUpdatedEmployee =
        editor === "salaryBasic"
          ? {
              ...employee,
              workInformation: {
                ...workInformation,
                SalaryDetails: payload.workInformation.SalaryDetails,
              },
            }
          : { ...employee, ...payload };
      onEmployeeUpdated?.({ ...locallyUpdatedEmployee, ...(updated || {}) });
      setEditor(null);
      toast.success(
        editor === "basic"
          ? "Commission details updated successfully"
          : "Salary details updated successfully",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update payroll details",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleYear = async (year) => {
    const nextYear = expandedYear === year ? null : year;
    setExpandedYear(nextYear);
    if (!nextYear || !employeeId) return;
    setPayrollLoading(true);
    try {
      const response = await getEmployeePayrollHistory({
        employeeId,
        year: Number(year),
        page: 1,
        limit: 100,
        sortBy: "-year,-month",
      });
      const records = payrollRecords(response, { year: Number(year) });
      setHistoryRecords((previous) => {
        const otherYears = previous.filter((record) => String(record.year) !== String(year));
        return [...otherYears, ...(Array.isArray(records) ? records : [])];
      });
    } catch {
      setHistoryRecords((previous) => previous.filter((record) => String(record.year) !== String(year)));
    } finally {
      setPayrollLoading(false);
    }
  };

  const toggleMonth = async (month, year) => {
    const nextMonth = expandedMonth === month ? null : month;
    setExpandedMonth(nextMonth);
    if (!nextMonth || !employeeId) return;
    const keyMatch = String(month).match(/^(\d{4})-(\d{1,2})$/);
    const parsedYear = Number(year || keyMatch?.[1] || String(month).match(/\d{4}$/)?.[0]);
    const monthNumber = keyMatch
      ? Number(keyMatch[2])
      : Number.isFinite(Number(month))
        ? Number(month)
        : new Date(`${String(month).replace(/\s+\d{4}$/, "")} 1, ${parsedYear}`).getMonth() + 1;
    setPayrollLoading(true);
    try {
      const response = await getEmployeePayrollHistory({
        employeeId,
        year: parsedYear,
        month: monthNumber,
        page: 1,
        limit: 1,
      });
      const records = payrollRecords(response, { year: parsedYear, month: monthNumber });
      if (Array.isArray(records) && records.length) {
        setHistoryRecords((previous) => [
          ...previous.filter((record) => !(String(record.year) === String(parsedYear) && Number(record.month) === monthNumber)),
          ...records,
        ]);
      }
    } finally {
      setPayrollLoading(false);
    }
  };

  return (
    <Wrapper>
      <PayrollDetailsHeader>
        <PayrollHeaderIcon src={PayrollIcon} alt="payroll" />
        <PayrollDetailsTitle>
          {isAgent ? "Commission Details" : "Salary Details"}
        </PayrollDetailsTitle>
      </PayrollDetailsHeader>
      {isAgent ? (
        <CardDetails
          title="Basic Details"
          columns={3}
          showEdit={true}
          editIcon={EditIcon}
          editText="Edit details"
          onEdit={openBasicEditor}
          items={[
            {
              label: "Commission Per Person",
              value: money(
                commission.commissionPerPerson ?? commission.commission,
              ),
            },
            {
              label: "Allowance (Gas)",
              value: money(commission.gasAllowance ?? commission.allowance),
            },
            {
              label: "Salary Disbursement Type",
              value:
                commission.salaryDisbursementType?.label ||
                commission.salaryDisbursementType ||
                "N/A",
            },
          ]}
        />
      ) : (
        <CardDetails
          title="Basic Details"
          columns={3}
          showEdit={true}
          editIcon={EditIcon}
          editText="Edit salary details"
          onEdit={openBasicSalaryEditor}
          items={[
            { label: "Basic Salary", value: money(salaryDetails.basicSalary) },
            { label: "Monthly CTC", value: money(salaryDetails.monthlyCTC) },
            { label: "Annual CTC", value: money(salaryDetails.annualCTC) },
            {
              label: "House Rent Allowance",
              value: money(salaryDetails.houseRentAllowance),
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
              label: "Other Fixed Allowance",
              value: money(salaryDetails.otherFixedAllowance),
            },
            { label: "PF Amount", value: money(salaryDetails.pfAmount) },
            { label: "ESI Amount", value: money(salaryDetails.esiAmount) },
          ]}
        />
      )}

      <CardDetails
        title="Current Month"
        columns={3}
        showEdit={true}
        editIcon={EditIcon}
        editText="Edit Salary"
        onEdit={openSalaryEditor}
        items={[
          {
            label: isAgent ? "Total Commission" : "Total Salary",
            value: money(
              isAgent
                ? (currentSalary.totalCommission ??
                    currentSalary.totalSalary ??
                    commission.commission)
                : (currentSalary.grossWages ??
                    currentSalary.totalSalary ??
                    salaryDetails.monthlyCTC),
            ),
          },
          {
            label: isAgent ? "Total Allowance (Gas)" : "Basic Salary",
            value: money(
              isAgent
                ? (currentSalary.totalAllowanceGas ??
                    currentSalary.allowance ??
                    commission.gasAllowance ??
                    commission.allowance)
                : salaryDetails.basicSalary,
            ),
          },
          {
            label: "Addition Payment",
            value: money(currentSalary.extras ?? currentSalary.additionPayment),
          },
          {
            label: "Deductions",
            value: money(currentSalary.totalDeductions ?? currentSalary.deductions),
          },
          {
            label: "Total Payable Amount",
            value: money(currentSalary.takeHome ?? currentSalary.totalPayableAmount),
          },
        ]}
      />

      <Section>
        {payrollLoading && <EmptyHistory>Loading salary history...</EmptyHistory>}
        {!payrollLoading && historyRecords.length === 0 && <EmptyHistory>No salary history available.</EmptyHistory>}
        {!payrollLoading && historyRecords.length > 0 && <>
        <SectionHeader>
          <SectionTitleWithIcon>
            <SectionTitle>Salary History</SectionTitle>
          </SectionTitleWithIcon>
        </SectionHeader>

        {Object.entries(historyYears).sort(([a], [b]) => Number(b) - Number(a)).map(([year, records]) => (
          <YearSection key={year}>
            <YearHeader onClick={() => toggleYear(year)}><YearTitle>{year}</YearTitle><ChevronIcon expanded={expandedYear === year}>▼</ChevronIcon></YearHeader>
            {expandedYear === year && <MonthsContainer>{Array.from({ length: Number(year) === new Date().getFullYear() ? new Date().getMonth() + 1 : 12 }, (_, index) => {
              const monthCount = Number(year) === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
              const month = monthCount - index;
              const record = records.find((item) => Number(item.month) === month) || {};
              const monthKey = `${year}-${month}`;
              const label = new Date(Number(year), month - 1, 1).toLocaleString("en-US", { month: "long" });
              return <MonthSection key={monthKey}>
                <MonthHeader onClick={() => toggleMonth(monthKey, year)}><MonthTitle>{label} {year}</MonthTitle><MonthActions><img src={EditIcon} alt="Edit month salary" width="14" height="14" /><ChevronIcon expanded={expandedMonth === monthKey}>⌄</ChevronIcon></MonthActions></MonthHeader>
                {expandedMonth === monthKey && <MonthDetails><DetailsGrid>
                  <DetailItem><DetailLabel>Total Salary</DetailLabel><DetailValue>{money(record.grossWages ?? record.totalSalary)}</DetailValue></DetailItem>
                  <DetailItem><DetailLabel>Overtime Payment</DetailLabel><DetailValue>{money(record.overtimeAmount ?? record.overtimePayment)}</DetailValue></DetailItem>
                  <DetailItem><DetailLabel>Addition Payment</DetailLabel><DetailValue>{money(record.extras ?? record.additionPayment)}</DetailValue></DetailItem>
                  <DetailItem><DetailLabel>Deductions</DetailLabel><DetailValue>{money(record.totalDeductions ?? record.deductions)}</DetailValue></DetailItem>
                  <DetailItem><DetailLabel>Total Payable Amount</DetailLabel><DetailValue>{money(record.takeHome ?? record.totalPayableAmount)}</DetailValue></DetailItem>
                </DetailsGrid></MonthDetails>}
              </MonthSection>;
            })}</MonthsContainer>}
          </YearSection>
        ))}
        {false && <>
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
                        <DetailValue>
                          {money(
                            salaryHistory.february?.totalSalary ??
                              currentSalary.totalSalary,
                          )}
                        </DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Overtime Payment</DetailLabel>
                        <DetailValue>
                          {money(
                            salaryHistory.february?.overtimePayment ??
                              currentSalary.overtimePayment,
                          )}
                        </DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Addition Payment</DetailLabel>
                        <DetailValue>
                          {money(
                            salaryHistory.february?.additionPayment ??
                              currentSalary.additionPayment,
                          )}
                        </DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Deductions</DetailLabel>
                        <DetailValue>
                          {money(
                            salaryHistory.february?.deductions ??
                              currentSalary.deductions,
                          )}
                        </DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Total Payable Amount</DetailLabel>
                        <DetailValue>
                          {money(
                            salaryHistory.february?.totalPayableAmount ??
                              currentSalary.totalPayableAmount,
                          )}
                        </DetailValue>
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
        </>}
        </>}
      </Section>
      {editor && (
        <ModalBackdrop
          onMouseDown={(event) =>
            event.target === event.currentTarget && setEditor(null)
          }
        >
          <Modal
            role="dialog"
            aria-modal="true"
            aria-labelledby="payroll-editor-title"
          >
            <ModalTitle id="payroll-editor-title">
              {editor === "basic"
                ? "Edit Payroll Details"
                : editor === "salaryBasic"
                  ? "Edit Salary Details"
                  : "Edit Salary"}
            </ModalTitle>
            <EditForm onSubmit={save}>
              {(editor === "basic"
                ? [
                    ["commissionPerPerson", "Commission Per Person", "number"],
                    ["gasAllowance", "Allowance (Gas)", "number"],
                    [
                      "salaryDisbursementType",
                      "Salary Disbursement Type",
                      "text",
                    ],
                  ]
                : editor === "salaryBasic"
                  ? [
                      ["basicSalary", "Basic Salary", "number"],
                      ["monthlyCTC", "Monthly CTC", "number"],
                      ["annualCTC", "Annual CTC", "number"],
                      ["houseRentAllowance", "House Rent Allowance", "number"],
                      ["conveyanceAllowance", "Conveyance Allowance", "number"],
                      ["specialAllowance", "Special Allowance", "number"],
                      [
                        "otherFixedAllowance",
                        "Other Fixed Allowance",
                        "number",
                      ],
                      ["pfAmount", "PF Amount", "number"],
                      ["esiAmount", "ESI Amount", "number"],
                    ]
                  : [
                      ["totalSalary", "Total Salary", "number"],
                      ["overtimePayment", "Overtime Payment", "number"],
                      ["additionPayment", "Addition Payment", "number"],
                      ["deductions", "Deductions", "number"],
                      ["totalPayableAmount", "Total Payable Amount", "number"],
                    ]
              ).map(([name, label, type]) => (
                <Field key={name}>
                  <label htmlFor={`payroll-${name}`}>{label}</label>
                  <input
                    id={`payroll-${name}`}
                    type={type}
                    min={type === "number" ? "0" : undefined}
                    step={type === "number" ? "0.01" : undefined}
                    name={name}
                    value={form[name] ?? ""}
                    onChange={change}
                  />
                </Field>
              ))}
              <ModalActions>
                <CancelButton type="button" onClick={() => setEditor(null)}>
                  Cancel
                </CancelButton>
                <SaveButton type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </SaveButton>
              </ModalActions>
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
  gap: 2rem;
  border-radius: 12px;
  background: ${theme.colors.white};
  border: 0;
  padding: 1.5rem 1.25rem;
`;

const PayrollDetailsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
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
  gap: 1.5rem;
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
  margin-bottom: 0.5rem;
  background: transparent;
`;

const YearHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  background: transparent;
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: transparent;
`;

const MonthSection = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f8fafb;
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
  background: #f8fafc;
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

const EmptyHistory = styled.div`
  padding: 1rem;
  color: ${theme.colors.secondaryTextColor};
  font-size: 0.875rem;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #0c242780;
  display: grid;
  place-items: center;
  padding: 24px;
`;
const Modal = styled.div`
  width: min(720px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 60px #0003;
`;
const ModalTitle = styled.h2`
  margin: 0 0 20px;
  color: ${theme.colors.textColor};
  font:
    600 20px "Inter-SemiBold",
    sans-serif;
`;
const EditForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label {
    color: ${theme.colors.secondaryTextColor};
    font:
      500 12px "Inter-Medium",
      sans-serif;
  }
  input {
    height: 42px;
    border: 1px solid ${theme.colors.border};
    border-radius: 7px;
    padding: 0 11px;
    color: ${theme.colors.textColor};
    font:
      500 13px "Inter-Medium",
      sans-serif;
    outline: none;
  }
  input:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px #087d8820;
  }
`;
const ModalActions = styled.div`
  grid-column: 1/-1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;
const CancelButton = styled.button`
  height: 40px;
  padding: 0 22px;
  border: 1px solid ${theme.colors.primary};
  border-radius: 7px;
  background: #fff;
  color: ${theme.colors.primary};
  cursor: pointer;
  font-weight: 600;
`;
const SaveButton = styled.button`
  height: 40px;
  padding: 0 22px;
  border: 0;
  border-radius: 7px;
  background: ${theme.colors.primary};
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
