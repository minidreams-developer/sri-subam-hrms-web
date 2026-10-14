import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import { downloadPayrollPayslip, getPayrollPayslip } from "../../services/apiServices";

const Payslip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [apiPayslipData, setApiPayslipData] = useState(null);
  const [loading, setLoading] = useState(Boolean(location.state?.payrollId));
  const [loadError, setLoadError] = useState("");
  const dropdownRef = useRef(null);
  
  // Get data from location state (or use default sample data)
  const fallbackPayslipData = {
    employeeName: "Sangeetha",
    employeeId: "EMP001",
    department: "IT",
    state: "Tamil Nadu",
    dateOfJoining: "10 Apr 2021",
    pfNo: "TN/XXX/XXXXX",
    esiNo: "XXXXX/XXXXX",
    designation: "Store Manager",
    uanNumber: "101042309812",
    workingDays: "22",
    monthYear: "April 2026",
    netPayable: "₹9,800.00",
    netPayableWords: "Rupees Nine Thousand Eight Hundred Only",
    earnings: [
      { label: "Basic Pay", amount: "₹9,000.00" },
      { label: "House Rent Allowance", amount: "₹1,000.00" },
      { label: "Conveyance", amount: "₹500.00" },
      { label: "Medical Allowance", amount: "₹500.00" },
      { label: "OT Pay", amount: "₹0.00" },
    ],
    deductions: [
      { label: "Provident Fund", amount: "₹1,080.00" },
      { label: "ESI", amount: "₹0.00" },
      { label: "Professional Tax", amount: "₹0.00" },
      { label: "TDS", amount: "₹0.00" },
      { label: "Loss of Pay", amount: "₹0.00" },
    ],
  };

  useEffect(() => {
    const payrollId = location.state?.payrollId;
    if (!payrollId) return;

    setLoading(true);
    getPayrollPayslip(payrollId)
      .then((response) => setApiPayslipData(response?.data || response?.result || response))
      .catch(() => setLoadError("Failed to load payslip details."))
      .finally(() => setLoading(false));
  }, [location.state?.payrollId]);

  const apiData = apiPayslipData || {};
  const source = apiData.payroll || apiData.payslip || apiData;
  const employeeDetails = source.employeeDetails || {};
  const workInformation = employeeDetails.workInformation || {};
  const bankDetails = workInformation.bankDetails?.[0] || {};
  const address = employeeDetails.address?.[0] || {};
  const attendance = source.attendance || {};
  const asAmount = (value) => {
    if (typeof value === "number") return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    return value == null || value === "" ? "₹0.00" : String(value).includes("₹") ? String(value) : `₹${value}`;
  };
  const listItems = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => ({
        label: item.label || item.name || item.title,
        amount: asAmount(item.amount ?? item.value ?? item.total),
      }));
    }
    if (value && typeof value === "object") {
      return Object.entries(value)
        .filter(([, amount]) => amount !== null && amount !== undefined)
        .map(([label, amount]) => ({
          label: label.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase()),
          amount: asAmount(amount),
        }));
    }
    return [];
  };
  const payslipData = apiPayslipData ? {
    employeeName: source.employeeName || source.employee?.name || source.name,
    employeeId: source.employeeId || source.employee?.employeeId || source.employee?.employeeCode,
    department: source.department?.name || source.department || source.employee?.department,
    state: source.state || address.state,
    dateOfJoining: source.dateOfJoining || source.date_of_joining || workInformation.joinedDate,
    pfNo: source.pfNo || source.pfNumber || source.pf_no || bankDetails.esiAndPf?.pfNumber,
    esiNo: source.esiNo || source.esiNumber || source.esi_no || bankDetails.esiAndPf?.esiNumber,
    designation: source.designation?.name || source.designation || source.employee?.designation,
    uanNumber: source.uanNumber || source.uan_number,
    workingDays: source.workingDays || source.working_days || attendance.fullDays,
    status: source.status,
    processedAt: source.processedAt,
    paidAt: source.paidAt,
    fullDays: attendance.fullDays,
    halfDays: attendance.halfDays,
    absentDays: attendance.absentDays,
    paidLeaves: attendance.paidLeaves,
    unpaidLeaves: attendance.unpaidLeaves,
    overtimeHours: attendance.overtimeHours,
    location: workInformation.location || address.city,
    monthYear: source.monthYear || source.month_year || source.payrollMonth
      || (source.month && source.year ? `${source.month}/${source.year}` : ""),
    netPayable: asAmount(source.netPayable ?? source.net_payable ?? source.takeHome ?? source.netTakeHome),
    netPayableWords: source.netPayableWords || source.net_payable_words,
    earnings: listItems(source.earnings || source.earningDetails),
    deductions: listItems(source.deductions || source.deductionDetails),
  } : (location.state || fallbackPayslipData);

  const totalEarnings = payslipData.earnings.reduce((sum, item) => {
    // Remove ₹ and commas, then parse as number
    const amount = parseFloat(item.amount.replace(/₹|,/g, ""));
    return sum + amount;
  }, 0);

  const totalDeductions = payslipData.deductions.reduce((sum, item) => {
    const amount = parseFloat(item.amount.replace(/₹|,/g, ""));
    return sum + amount;
  }, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <StatusMessage>Loading payslip...</StatusMessage>;
  if (loadError) return <StatusMessage>{loadError}</StatusMessage>;

  const handleDownload = async (type) => {
    const payrollId = location.state?.payrollId;
    if (!payrollId) return;

    try {
      const format = type === "sheet" ? "csv" : "pdf";
      const blob = await downloadPayrollPayslip(payrollId, format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payslip-${payslipData.employeeId || payrollId}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Failed to download payslip ${type}:`, error);
      alert(`Failed to download payslip ${type === "sheet" ? "CSV" : "PDF"}.`);
    }
    setShowDropdown(false);
  };

  return (
    <Container>
      <PayslipContainer>
        <PayslipHeader>
        <PayslipCompanyInfo>
          <PayslipCompanyName>Ace Workforce</PayslipCompanyName>
          <PayslipCompanyTag>Industrial & Facility Management</PayslipCompanyTag>
        </PayslipCompanyInfo>
        <PayslipActions>
          <DropdownContainer ref={dropdownRef}>
            <DropdownButton onClick={() => setShowDropdown(!showDropdown)}>
              Download ▼
            </DropdownButton>
            {showDropdown && (
              <DropdownMenu>
                <DropdownItem onClick={() => handleDownload("sheet")}>
                  Download Sheet
                </DropdownItem>
                <DropdownItem onClick={() => handleDownload("pdf")}>
                  Download PDF
                </DropdownItem>
              </DropdownMenu>
            )}
          </DropdownContainer>
          <PayslipBackButton onClick={() => navigate(-1)}>Back</PayslipBackButton>
        </PayslipActions>
      </PayslipHeader>

        <PayslipTitle>PAYSLIP</PayslipTitle>

        <PayslipEmployeeInfo>
          <EmployeeInfoColumn>
            <InfoRow>
              <InfoLabel>Employee Name</InfoLabel>
              <InfoValue>{payslipData.employeeName}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Date of Joining</InfoLabel>
              <InfoValue>{payslipData.dateOfJoining}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Designation</InfoLabel>
              <InfoValue>{payslipData.designation}</InfoValue>
            </InfoRow>
          </EmployeeInfoColumn>
          <EmployeeInfoColumn>
            <InfoRow>
              <InfoLabel>Employee ID</InfoLabel>
              <InfoValue>{payslipData.employeeId}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>PF No.</InfoLabel>
              <InfoValue>{payslipData.pfNo}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>UAN Number</InfoLabel>
              <InfoValue>{payslipData.uanNumber}</InfoValue>
            </InfoRow>
          </EmployeeInfoColumn>
          <EmployeeInfoColumn>
            <InfoRow>
              <InfoLabel>Department</InfoLabel>
              <InfoValue>{payslipData.department}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>ESI No.</InfoLabel>
              <InfoValue>{payslipData.esiNo}</InfoValue>
            </InfoRow>
          </EmployeeInfoColumn>
          <EmployeeInfoColumn>
            <InfoRow>
              <InfoLabel>State</InfoLabel>
              <InfoValue>{payslipData.state}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Working Days</InfoLabel>
              <InfoValue>{payslipData.workingDays}</InfoValue>
            </InfoRow>
          </EmployeeInfoColumn>
        </PayslipEmployeeInfo>

        <PayslipAdditionalInfo>
          <AdditionalInfoItem>
            <InfoLabel>Payroll Status</InfoLabel>
            <InfoValue>{payslipData.status || "-"}</InfoValue>
          </AdditionalInfoItem>
          <AdditionalInfoItem>
            <InfoLabel>Full Days</InfoLabel>
            <InfoValue>{payslipData.fullDays ?? "-"}</InfoValue>
          </AdditionalInfoItem>
          <AdditionalInfoItem>
            <InfoLabel>Half Days</InfoLabel>
            <InfoValue>{payslipData.halfDays ?? "-"}</InfoValue>
          </AdditionalInfoItem>
          <AdditionalInfoItem>
            <InfoLabel>Absent Days</InfoLabel>
            <InfoValue>{payslipData.absentDays ?? "-"}</InfoValue>
          </AdditionalInfoItem>
          <AdditionalInfoItem>
            <InfoLabel>Paid Leaves</InfoLabel>
            <InfoValue>{payslipData.paidLeaves ?? "-"}</InfoValue>
          </AdditionalInfoItem>
          <AdditionalInfoItem>
            <InfoLabel>Unpaid Leaves</InfoLabel>
            <InfoValue>{payslipData.unpaidLeaves ?? "-"}</InfoValue>
          </AdditionalInfoItem>
          <AdditionalInfoItem>
            <InfoLabel>Overtime Hours</InfoLabel>
            <InfoValue>{payslipData.overtimeHours ?? "-"}</InfoValue>
          </AdditionalInfoItem>
          <AdditionalInfoItem>
            <InfoLabel>Location</InfoLabel>
            <InfoValue>{payslipData.location || "-"}</InfoValue>
          </AdditionalInfoItem>
        </PayslipAdditionalInfo>

        <PayslipEarningsDeductions>
          <EarningsSection>
            <SectionTitle>EARNINGS</SectionTitle>
            <EarningsDeductionsList>
              {payslipData.earnings.map((item, index) => (
                <EDRow key={index}>
                  <EDLabel>{item.label}</EDLabel>
                  <EDValue>{item.amount}</EDValue>
                </EDRow>
              ))}
              <EDTotalRow>
                <EDLabel>Gross Earnings</EDLabel>
                <EDValue>₹{totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</EDValue>
              </EDTotalRow>
            </EarningsDeductionsList>
          </EarningsSection>

          <DeductionsSection>
            <SectionTitle>DEDUCTIONS</SectionTitle>
            <EarningsDeductionsList>
              {payslipData.deductions.map((item, index) => (
                <EDRow key={index}>
                  <EDLabel>{item.label}</EDLabel>
                  <EDValue>{item.amount}</EDValue>
                </EDRow>
              ))}
              <EDTotalRow>
                <EDLabel>Total Deductions</EDLabel>
                <EDValue>₹{totalDeductions.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</EDValue>
              </EDTotalRow>
            </EarningsDeductionsList>
          </DeductionsSection>
        </PayslipEarningsDeductions>

        <PayslipNetPay>
          <NetPayInfo>
            <NetPayLabel>Net Payable</NetPayLabel>
            <NetPayAmount>{payslipData.netPayable}</NetPayAmount>
            <NetPayWords>{payslipData.netPayableWords}</NetPayWords>
          </NetPayInfo>
          <NetPayMonth>{payslipData.monthYear}</NetPayMonth>
        </PayslipNetPay>

        <PayslipFooter>
          <PayslipNote>This is a computer generated document and does not require a signature</PayslipNote>
        </PayslipFooter>
      </PayslipContainer>
    </Container>
  );
};

export default Payslip;

const Container = styled.div`
  width: 100%;
  padding: 2rem;
`;

const StatusMessage = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${theme.colors.text || "#17313a"};
`;

const PayslipContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
  background: ${theme.colors.white};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const PayslipHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const PayslipCompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PayslipCompanyName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin: 0;
`;

const PayslipCompanyTag = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin: 0;
`;

const PayslipActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PayslipBackButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${theme.colors.bgColor};
  color: ${theme.colors.textColor};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.secondaryWhite};
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 180px;
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${theme.colors.textColor};
  font-family: "Inter", sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  &:hover {
    background: ${theme.colors.secondaryPrimary};
  }
`;

const PayslipTitle = styled.h2`
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 1.5rem 0;
`;

const PayslipEmployeeInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const PayslipAdditionalInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem 1.5rem;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`;

const AdditionalInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const EmployeeInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  color: #888;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 0.9rem;
  color: #222;
  font-weight: 600;
`;

const PayslipEarningsDeductions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const EarningsSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const DeductionsSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const EarningsDeductionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const EDRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EDTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
`;

const EDLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
`;

const EDValue = styled.span`
  font-size: 0.875rem;
  color: #222;
  font-weight: 600;
`;

const PayslipNetPay = styled.div`
  background: ${theme.colors.bgColor};
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const NetPayInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NetPayLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const NetPayAmount = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${theme.colors.primary};
`;

const NetPayWords = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const NetPayMonth = styled.span`
  font-size: 1rem;
  color: #222;
  font-weight: 600;
`;

const PayslipFooter = styled.div`
  text-align: center;
`;

const PayslipNote = styled.p`
  font-size: 0.75rem;
  color: #999;
  margin: 0;
`;

