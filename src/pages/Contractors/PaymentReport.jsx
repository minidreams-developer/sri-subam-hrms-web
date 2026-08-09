import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiDownload, FiX, FiMinus, FiPlus } from "react-icons/fi";

const PaymentReport = () => {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(100);

  const reportData = {
    title: "Detailed Payment & Work Report",
    reportType: "Cashflow",
    period: "01 Oct 2023 - 31 Oct 2023",
    contractor: {
      photo: "👨",
      name: "Safeq",
      id: "AW-C-8402",
      company: "Roberts Construct & Build",
      specialty: "Masonry & Foundation",
      gstNo: "33AAAAA8000AI Z5",
      licenseNo: "LIC-MAS-2021-884",
      branch: "Chennai Central",
    },
    payments: [
      {
        date: "12 Oct 2023",
        day: "Thursday",
        status: "Paid",
        statusColor: "#10b981",
        total: "₹25,000",
        paymentVia: "Bank Transfer",
        reference: "UTR: HDFC829201",
        remarks: "Advance payment",
        jobs: [
          {
            slNo: 1,
            jobDate: "10 Oct 23",
            day: "Tue",
            jobItem: "Foundation Excavation",
            quantity: "1000 CFT",
            price: "₹25.00",
            total: "₹25,000.00",
            remarks: "Sector A block clear",
          },
        ],
      },
      {
        date: "12 Oct 2023",
        day: "Thursday",
        status: "Pending",
        statusColor: "#f59e0b",
        total: "₹20,000",
        paymentVia: "-",
        reference: "-",
        remarks: "Awaiting site QA inspection",
        jobs: [
          {
            slNo: 2,
            jobDate: "12 Oct 23",
            day: "Thu",
            jobItem: "Brick Laying Phase 1",
            quantity: "400 Sq.ft",
            price: "₹50.00",
            total: "₹20,000.00",
            remarks: "Ground floor outer walls",
          },
        ],
      },
      {
        date: "28 Oct 2023",
        day: "Saturday",
        status: "Paid",
        statusColor: "#10b981",
        total: "₹32,500",
        paymentVia: "UPI",
        reference: "Ref: 3239024RI2812",
        remarks: "Final settlement",
        jobs: [
          {
            slNo: 3,
            jobDate: "25 Oct 23",
            day: "Wed",
            jobItem: "Plastering Works",
            quantity: "650 Sq.ft",
            price: "₹50.00",
            total: "₹32,500.00",
            remarks: "Interior walls, smooth finish",
          },
        ],
      },
    ],
  };

  const handleDownload = () => {
    // Download functionality
    alert("Download Report functionality");
  };

  return (
    <Container>
      {/* Top Control Bar */}
      <ControlBar>
        <ZoomControl>
          <ZoomButton onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
            <FiMinus size={18} />
          </ZoomButton>
          <ZoomDisplay>{zoomLevel}%</ZoomDisplay>
          <ZoomButton onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
            <FiPlus size={18} />
          </ZoomButton>
        </ZoomControl>

        <ControlActions>
          <DownloadButton onClick={handleDownload}>
            <FiDownload size={18} />
            Download Report
          </DownloadButton>
          <CloseButton onClick={() => navigate("/admin/contractors/payments")}>
            <FiX size={20} />
          </CloseButton>
        </ControlActions>
      </ControlBar>

      {/* Report Content */}
      <ReportWrapper style={{ transform: `scale(${zoomLevel / 100})` }}>
        {/* Report Header */}
        <ReportHeader>
          <HeaderLeft>
            <ReportTitle>{reportData.title}</ReportTitle>
            <ReportPeriod>Report Period: {reportData.period}</ReportPeriod>
          </HeaderLeft>
          <HeaderRight>
            <ReportTypeLabel>Report Type:</ReportTypeLabel>
            <ReportType>{reportData.reportType}</ReportType>
          </HeaderRight>
        </ReportHeader>

        {/* Contractor Card */}
        <ContractorCard>
          <ContractorPhoto>{reportData.contractor.photo}</ContractorPhoto>

          <ContractorDetails>
            <DetailColumn>
              <DetailRow>
                <DetailLabel>Contractor Name</DetailLabel>
                <DetailValue>{reportData.contractor.name}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Specialty</DetailLabel>
                <DetailValue>{reportData.contractor.specialty}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Branch</DetailLabel>
                <DetailValue>{reportData.contractor.branch}</DetailValue>
              </DetailRow>
            </DetailColumn>

            <DetailColumn>
              <DetailRow>
                <DetailLabel>Contractor ID</DetailLabel>
                <DetailValue>{reportData.contractor.id}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>GST No.</DetailLabel>
                <DetailValue>{reportData.contractor.gstNo}</DetailValue>
              </DetailRow>
            </DetailColumn>

            <DetailColumn>
              <DetailRow>
                <DetailLabel>Company Name</DetailLabel>
                <DetailValue>{reportData.contractor.company}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>License No.</DetailLabel>
                <DetailValue>{reportData.contractor.licenseNo}</DetailValue>
              </DetailRow>
            </DetailColumn>
          </ContractorDetails>
        </ContractorCard>

        {/* Payment Items */}
        {reportData.payments.map((payment, index) => (
          <PaymentGroup key={index}>
            {/* Payment Header */}
            <PaymentHeader $statusColor={payment.statusColor}>
              <PaymentDateInfo>
                <PaymentDate>{payment.date}</PaymentDate>
                <PaymentDay>{payment.day}</PaymentDay>
                <StatusBadge $color={payment.statusColor}>{payment.status}</StatusBadge>
              </PaymentDateInfo>

              <PaymentTotal>{payment.total}</PaymentTotal>
            </PaymentHeader>

            {/* Payment Details */}
            <PaymentDetails>
              <PaymentDetailRow>
                <DetailLabel>PAYMENT VIA</DetailLabel>
                <DetailValue>{payment.paymentVia}</DetailValue>
              </PaymentDetailRow>
              <PaymentDetailRow>
                <DetailLabel>PAYMENT REFERENCE</DetailLabel>
                <DetailValue>{payment.reference}</DetailValue>
              </PaymentDetailRow>
              <PaymentDetailRow>
                <DetailLabel>REMARKS</DetailLabel>
                <DetailValue>{payment.remarks}</DetailValue>
              </PaymentDetailRow>
            </PaymentDetails>

            {/* Job Details Table */}
            <JobDetailsTable>
              <TableHeader>
                <HeaderCell>S.No</HeaderCell>
                <HeaderCell>Job Date</HeaderCell>
                <HeaderCell>Day</HeaderCell>
                <HeaderCell>Job Item</HeaderCell>
                <HeaderCell>Qty / Unit</HeaderCell>
                <HeaderCell>Price/Unit</HeaderCell>
                <HeaderCell>Total</HeaderCell>
                <HeaderCell>Remarks</HeaderCell>
              </TableHeader>
              <TableBody>
                {payment.jobs.map((job, jobIdx) => (
                  <TableRow key={jobIdx}>
                    <TableCell>{job.slNo}</TableCell>
                    <TableCell>{job.jobDate}</TableCell>
                    <TableCell>{job.day}</TableCell>
                    <TableCell>{job.jobItem}</TableCell>
                    <TableCell>{job.quantity}</TableCell>
                    <TableCell>{job.price}</TableCell>
                    <TableCell $bold>{job.total}</TableCell>
                    <TableCell>{job.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </JobDetailsTable>
          </PaymentGroup>
        ))}
      </ReportWrapper>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ControlBar = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ZoomControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f5f5f5;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
`;

const ZoomButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #222;
  }
`;

const ZoomDisplay = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  min-width: 50px;
  text-align: center;
`;

const ControlActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const DownloadButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: #dc2626;
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
    background: #b91c1c;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #222;
  }
`;

const ReportWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  transform-origin: top center;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;

    &:hover {
      background: #555;
    }
  }
`;

const ReportHeader = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ReportTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const ReportPeriod = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const ReportTypeLabel = styled.span`
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
  font-family: "Inter", sans-serif;
`;

const ReportType = styled.span`
  font-size: 0.9rem;
  color: #222;
  font-weight: 600;
  font-family: "Inter", sans-serif;
`;

const ContractorCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ContractorPhoto = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #a78bfa, #f472b6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  flex-shrink: 0;
`;

const ContractorDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  flex: 1;
`;

const DetailColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-family: "Inter", sans-serif;
`;

const DetailValue = styled.p`
  font-size: 0.95rem;
  color: #222;
  margin: 0;
  font-weight: 600;
  font-family: "Inter", sans-serif;
`;

const PaymentGroup = styled.div`
  background: white;
  border-left: 4px solid #066C78;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const PaymentHeader = styled.div`
  background: #f9f9f9;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
`;

const PaymentDateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PaymentDate = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #222;
  font-family: "Inter", sans-serif;
`;

const PaymentDay = styled.span`
  font-size: 0.85rem;
  color: #888;
  font-family: "Inter", sans-serif;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.75rem;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
  font-family: "Inter", sans-serif;
`;

const PaymentTotal = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #066C78;
  font-family: "Inter", sans-serif;
`;

const PaymentDetails = styled.div`
  padding: 1.5rem 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  border-bottom: 1px solid #e0e0e0;
`;

const PaymentDetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const JobDetailsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
`;

const TableHeader = styled.thead`
  background: #f5f5f5;
`;

const HeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 700;
  color: #222;
  font-size: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  text-align: left;
  color: #333;
  font-weight: ${(props) => (props.$bold ? "600" : "400")};
`;

export default PaymentReport;
