import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { FiDownload, FiZoomIn, FiZoomOut } from "react-icons/fi";

const ContractorWorkSummaryReport = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [reportFilters, setReportFilters] = useState({
    branch: "All Branches",
    reportType: "Custom",
    fromDate: "01/04/2026",
    toDate: "30/04/2026",
  });

  useEffect(() => {
    if (location.state?.filters) {
      setReportFilters(location.state.filters);
    }
  }, [location]);

  // Sample contractor data - in production, fetch from API
  const contractorData = {
    id: "CON-10024",
    name: "Manoj Kumar",
    companyName: "Ibboomi Pvt Ltd",
    specialty: "HVAC",
    getNumber: "29ABCDE1234F5Z",
    licenseNo: "LIC-99082-TN",
    photo: "👨‍💼",
  };

  // Sample work logs organized by branch and date
  const workLogsByBranch = {
    Headquarters: [
      {
        date: "04/04/2026",
        dayOfWeek: "Wednesday",
        totalAmount: "$240.00",
        items: [
          {
            sNo: 1,
            jobItem: "AC Installation - Building A",
            quantity: 2,
            unit: "No",
            pricePerUnit: "$120.00",
            remarks: "Pt 3, Route 301, 302",
            total: "$240.00",
          },
        ],
      },
      {
        date: "06/04/2026",
        dayOfWeek: "Wednesday",
        totalAmount: "$1,230.00",
        items: [
          {
            sNo: 1,
            jobItem: "Duct Cleaning - Main Hall",
            quantity: 500,
            unit: "Sq.Ft.",
            pricePerUnit: "$2.50 / SqFt",
            remarks: "Heavy dust accumulation",
            total: "$1,230.00",
          },
        ],
      },
    ],
    "North Region": [
      {
        date: "15/04/2026",
        dayOfWeek: "Wednesday",
        totalAmount: "$450.00",
        items: [
          {
            sNo: 1,
            jobItem: "Routine Maintenance Check",
            quantity: 15,
            unit: "No",
            pricePerUnit: "$45.00 / No",
            remarks: "Monthly schedule",
            total: "$450.00",
          },
        ],
      },
      {
        date: "23/04/2026",
        dayOfWeek: "Wednesday",
        totalAmount: "$150.00",
        items: [
          {
            sNo: 1,
            jobItem: "Emergency AC Repair",
            quantity: 1,
            unit: "Job",
            pricePerUnit: "$150.00 / No",
            remarks: "Sensor room breakdown",
            total: "$150.00",
          },
        ],
      },
    ],
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalEarned = 0;
    Object.values(workLogsByBranch).forEach((branch) => {
      branch.forEach((log) => {
        const amount = parseFloat(log.totalAmount.replace("$", "").replace(",", ""));
        totalEarned += amount;
      });
    });
    return totalEarned;
  };

  const totalEarned = calculateTotals();

  const handleDownloadReport = () => {
    // Future: Add PDF download functionality
    console.log("Downloading report...");
  };

  const handleZoomIn = () => {
    if (zoomLevel < 150) setZoomLevel(zoomLevel + 10);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) setZoomLevel(zoomLevel - 10);
  };

  return (
    <ReportWrapper>
      {/* Header Toolbar */}
      <ReportToolbar>
        <ToolbarLeft>
          <ZoomControl>
            <ZoomButton onClick={handleZoomOut}>
              <FiZoomOut size={18} />
            </ZoomButton>
            <ZoomPercentage>{zoomLevel}%</ZoomPercentage>
            <ZoomButton onClick={handleZoomIn}>
              <FiZoomIn size={18} />
            </ZoomButton>
          </ZoomControl>
        </ToolbarLeft>
        <ToolbarRight>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload size={18} />
            Download Report
          </DownloadButton>
        </ToolbarRight>
      </ReportToolbar>

      {/* Report Content */}
      <ReportContent style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}>
        {/* Report Header */}
        <ReportHeader>
          <ReportTitle>WORK SUMMARY REPORT</ReportTitle>
          <ReportSubtitle>Ace Workforce Management System</ReportSubtitle>
          <ReportMeta>
            <MetaItem>
              <MetaLabel>Report Period:</MetaLabel>
              <MetaValue>📅 {reportFilters.fromDate} — {reportFilters.toDate}</MetaValue>
            </MetaItem>
          </ReportMeta>
        </ReportHeader>

        {/* Contractor Info */}
        <ContractorSection>
          <SectionTitle>Contractor Information</SectionTitle>
          <ContractorInfoGrid>
            <ContractorPhoto>{contractorData.photo}</ContractorPhoto>
            <InfoColumnsGrid>
              <InfoColumn>
                <InfoLabel>CONTRACTOR ID</InfoLabel>
                <InfoValue>{contractorData.id}</InfoValue>
              </InfoColumn>
              <InfoColumn>
                <InfoLabel>CONTRACTOR NAME</InfoLabel>
                <InfoValue>{contractorData.name}</InfoValue>
              </InfoColumn>
              <InfoColumn>
                <InfoLabel>SPECIALTY</InfoLabel>
                <InfoValue>{contractorData.specialty}</InfoValue>
              </InfoColumn>
              <InfoColumn>
                <InfoLabel>COMPANY NAME</InfoLabel>
                <InfoValue>{contractorData.companyName}</InfoValue>
              </InfoColumn>
              <InfoColumn>
                <InfoLabel>GET NUMBER</InfoLabel>
                <InfoValue>{contractorData.getNumber}</InfoValue>
              </InfoColumn>
              <InfoColumn>
                <InfoLabel>LICENSE NO.</InfoLabel>
                <InfoValue>{contractorData.licenseNo}</InfoValue>
              </InfoColumn>
            </InfoColumnsGrid>
          </ContractorInfoGrid>
        </ContractorSection>

        {/* Detailed Work Logs Section */}
        <DetailedWorkLogsSection>
          <SectionTitle>Detailed Work Logs</SectionTitle>

          {Object.entries(workLogsByBranch).map(([branch, logs]) => (
            <BranchSection key={branch}>
              <BranchTitle>{branch}</BranchTitle>

              {logs.map((log, logIndex) => (
                <WorkLogEntry key={logIndex}>
                  <WorkLogDateHeader>
                    <WorkLogDate>📅 {log.date} ({log.dayOfWeek})</WorkLogDate>
                    <WorkLogTotal>Total Amount: {log.totalAmount}</WorkLogTotal>
                  </WorkLogDateHeader>

                  <WorkLogTable>
                    <WorkLogTableHead>
                      <WorkLogTableRow>
                        <WorkLogTh>S.NO</WorkLogTh>
                        <WorkLogTh>JOB ITEMS</WorkLogTh>
                        <WorkLogTh>QUANTITY/UNIT</WorkLogTh>
                        <WorkLogTh>PRICE/UNIT</WorkLogTh>
                        <WorkLogTh>REMARKS</WorkLogTh>
                        <WorkLogTh>TOTAL</WorkLogTh>
                      </WorkLogTableRow>
                    </WorkLogTableHead>
                    <WorkLogTableBody>
                      {log.items.map((item, itemIndex) => (
                        <WorkLogTableRow key={itemIndex}>
                          <WorkLogTd>{item.sNo}</WorkLogTd>
                          <WorkLogTd>{item.jobItem}</WorkLogTd>
                          <WorkLogTd>{item.quantity} {item.unit}</WorkLogTd>
                          <WorkLogTd>{item.pricePerUnit}</WorkLogTd>
                          <WorkLogTd>{item.remarks}</WorkLogTd>
                          <WorkLogTd $highlight>{item.total}</WorkLogTd>
                        </WorkLogTableRow>
                      ))}
                    </WorkLogTableBody>
                  </WorkLogTable>
                </WorkLogEntry>
              ))}
            </BranchSection>
          ))}
        </DetailedWorkLogsSection>

        {/* Bank Details Section */}
        <BankDetailsSection>
          <SectionTitle>BANK DETAILS</SectionTitle>
          <BankDetailsGrid>
            <BankDetailItem>
              <DetailLabel>Account Name</DetailLabel>
              <DetailValue>Manoj Kumar</DetailValue>
            </BankDetailItem>
            <BankDetailItem>
              <DetailLabel>Bank Name</DetailLabel>
              <DetailValue>State Bank of India</DetailValue>
            </BankDetailItem>
            <BankDetailItem>
              <DetailLabel>Account Number</DetailLabel>
              <DetailValue>3399 2250 6456</DetailValue>
            </BankDetailItem>
            <BankDetailItem>
              <DetailLabel>IFSC Code</DetailLabel>
              <DetailValue>SBIN0035154</DetailValue>
            </BankDetailItem>
            <BankDetailItem style={{ gridColumn: "1 / -1" }}>
              <DetailLabel>Subtotal</DetailLabel>
              <DetailValue>$2,070.00</DetailValue>
            </BankDetailItem>
            <BankDetailItem style={{ gridColumn: "1 / -1" }}>
              <DetailLabel>Adjustments</DetailLabel>
              <DetailValue>$0.00</DetailValue>
            </BankDetailItem>
            <BankDetailItem style={{ gridColumn: "1 / -1" }}>
              <DetailLabel style={{ fontWeight: 700, fontSize: "1.1rem" }}>Total Amount Earned</DetailLabel>
              <DetailValue style={{ fontWeight: 700, fontSize: "1.3rem", color: "#16A34A" }}>
                ${totalEarned.toFixed(2)}
              </DetailValue>
            </BankDetailItem>
          </BankDetailsGrid>
        </BankDetailsSection>

        {/* Footer */}
        <ReportFooter>
          <FooterText>This is a system generated report. No signature is required.</FooterText>
        </ReportFooter>
      </ReportContent>
    </ReportWrapper>
  );
};

// Styled Components
const ReportWrapper = styled.div`
  width: 100%;
  background: #f5f5f5;
  min-height: 100vh;
  padding: 1.5rem;
  font-family: "Inter", sans-serif;
`;

const ReportToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
`;

const ZoomControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #34495e;
  padding: 0.5rem 1rem;
  border-radius: 6px;
`;

const ZoomButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const ZoomPercentage = styled.span`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 50px;
  text-align: center;
`;

const DownloadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #c0392b;
  }
`;

const ReportContent = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ReportHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #333;
  padding-bottom: 1rem;
`;

const ReportTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
  letter-spacing: 1px;
`;

const ReportSubtitle = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 1rem 0;
`;

const ReportMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 0.9rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetaLabel = styled.span`
  font-weight: 600;
  color: #333;
`;

const MetaValue = styled.span`
  color: #666;
`;

const ContractorSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 0.95rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

const ContractorInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 2rem;
  align-items: flex-start;
`;

const ContractorPhoto = styled.div`
  width: 100px;
  height: 100px;
  background: #e8e8e8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  flex-shrink: 0;
`;

const InfoColumnsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 3rem;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const InfoLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  color: #666;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
`;

const DetailedWorkLogsSection = styled.div`
  margin-bottom: 2rem;
`;

const BranchSection = styled.div`
  margin-bottom: 2rem;
`;

const BranchTitle = styled.p`
  font-size: 0.9rem;
  font-weight: 700;
  color: #333;
  margin: 1rem 0;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
`;

const WorkLogEntry = styled.div`
  margin-bottom: 1.5rem;
`;

const WorkLogDateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f0f0;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const WorkLogDate = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
`;

const WorkLogTotal = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #066C78;
`;

const WorkLogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`;

const WorkLogTableHead = styled.thead`
  background: #f5f5f5;
`;

const WorkLogTableBody = styled.tbody``;

const WorkLogTableRow = styled.tr`
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: 1px solid #333;
  }
`;

const WorkLogTh = styled.th`
  padding: 0.75rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #333;
  border-bottom: 1px solid #999;
`;

const WorkLogTd = styled.td`
  padding: 0.75rem;
  font-size: 0.85rem;
  color: #333;
  font-weight: ${(props) => (props.$highlight ? "700" : "500")};
  color: ${(props) => (props.$highlight ? "#066C78" : "#333")};
`;

const BankDetailsSection = styled.div`
  margin-bottom: 2rem;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
`;

const BankDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem 3rem;
`;

const BankDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
`;

const DetailValue = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
`;

const ReportFooter = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #ddd;
`;

const FooterText = styled.p`
  font-size: 0.8rem;
  color: #999;
  margin: 0;
  font-style: italic;
`;

export default ContractorWorkSummaryReport;
