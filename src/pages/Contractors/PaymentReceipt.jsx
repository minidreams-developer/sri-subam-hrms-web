import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft, FiDownload } from "react-icons/fi";

const PaymentReceipt = () => {
  const navigate = useNavigate();
  const { contractorName = "Safeq" } = useParams();
  const location = useLocation();

  const receiptData = location.state || {
    contractorId: "CON-0005-SKY",
    contractorName: "Rathna Kurrar",
    phone: "+91 98765 43210",
    paymentDate: "24 Oct 2023",
    paymentVia: "Bank Transfer",
    paymentReference: "UTR1234567890ABC",
    amount: 1920.60,
    workDetails: {
      Headquarters: [
        {
          date: "12 Apr 2026, Friday",
          dayTotal: 2340.00,
          jobs: [
            {
              slNo: 1,
              jobItem: "AC Installation",
              quantity: "2 Piece",
              price: "₹ 10.00",
              remarks: "Remove excess supply",
              total: "₹ 20.00",
            },
            {
              slNo: 2,
              jobItem: "Duct Cleaning",
              quantity: "500 Sq. Ft.",
              price: "₹ 2.30",
              remarks: "Thorough cleaning done",
              total: "₹ 1,150.00",
            },
          ],
        },
      ],
      "North Region": [
        {
          date: "16 Apr 2026, Wednesday",
          dayTotal: 450.00,
          jobs: [
            {
              slNo: 1,
              jobItem: "Routine Maintenance",
              quantity: "10 Hour",
              price: "₹ 45.00",
              remarks: "Standard maintenance",
              total: "₹ 450.00",
            },
          ],
        },
      ],
    },
    summary: {
      subTotal: 1920.60,
      tds: 192.06,
      gst: 0.00,
      totalPaid: 1920.60,
    },
  };

  const handleDownloadPDF = () => {
    // PDF download logic here
    alert("Downloading PDF...");
  };

  return (
    <Container>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbItem onClick={() => navigate("/admin/contractors/pay/" + contractorName)}>
          <FiArrowLeft size={18} />
          Pay {contractorName}
        </BreadcrumbItem>
        <BreadcrumbSeparator>›</BreadcrumbSeparator>
        <BreadcrumbItem active>Payment Receipt</BreadcrumbItem>
      </Breadcrumb>

      {/* Page Header */}
      <PageHeader>
        <HeaderLeft>
          <PageTitle>Payment Receipt</PageTitle>
          <PageSubtitle>Receipt of successfully payment</PageSubtitle>
        </HeaderLeft>
        <HeaderRight>
          <DownloadButton onClick={handleDownloadPDF}>
            <FiDownload size={18} />
            Download PDF
          </DownloadButton>
        </HeaderRight>
      </PageHeader>

      {/* Receipt Content */}
      <ReceiptCard>
        {/* PAID Watermark */}
        <PaidWatermark>PAID</PaidWatermark>
        {/* Details Section */}
        <DetailsSection>
          <DetailsColumn>
            <DetailTitle>Contractor Details</DetailTitle>
            <DetailRow>
              <DetailLabel>Contractor ID</DetailLabel>
              <DetailValue>{receiptData.contractorId}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Name</DetailLabel>
              <DetailValue>{receiptData.contractorName}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Phone Number</DetailLabel>
              <DetailValue>{receiptData.phone}</DetailValue>
            </DetailRow>
          </DetailsColumn>

          <DetailsColumn>
            <DetailTitle>Payment Details</DetailTitle>
            <DetailRow>
              <DetailLabel>Payment Date</DetailLabel>
              <DetailValue>{receiptData.paymentDate}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Payment Via</DetailLabel>
              <DetailValue>{receiptData.paymentVia}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Payment Reference</DetailLabel>
              <DetailValue>{receiptData.paymentReference}</DetailValue>
            </DetailRow>
          </DetailsColumn>
        </DetailsSection>

        {/* Amount Display */}
        <AmountSection>
          <AmountDisplay>
            <AmountValue>₹ {receiptData.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</AmountValue>
            <AmountLabel>English: Payment One Thousand Nine Hundred and Sixty Paise Only</AmountLabel>
            <AmountDescription>विवरण: भुगतान एक हजार नौ सौ साठ पैसे केवल</AmountDescription>
          </AmountDisplay>
        </AmountSection>

        {/* Work Details Section */}
        <WorkDetailsSection>
          <SectionTitle>Details of Amount Paid for Jobs</SectionTitle>

          {Object.entries(receiptData.workDetails).map(([branch, workGroups]) => (
            <BranchSection key={branch}>
              {workGroups.map((workGroup, idx) => (
                <div key={idx}>
                  <DateHeader>
                    <DateText>{workGroup.date}</DateText>
                    <DayTotal>Day Total: ₹ {workGroup.dayTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</DayTotal>
                  </DateHeader>

                  <JobTable>
                    <TableHeader>
                      <HeaderCell $width="8%">S.NO</HeaderCell>
                      <HeaderCell $width="25%">JOB ITEM</HeaderCell>
                      <HeaderCell $width="15%">QUANTITY/UNIT</HeaderCell>
                      <HeaderCell $width="15%">PRICE/UNIT</HeaderCell>
                      <HeaderCell $width="25%">REMARKS</HeaderCell>
                      <HeaderCell $width="12%" $alignRight>
                        TOTAL
                      </HeaderCell>
                    </TableHeader>
                    <TableBody>
                      {workGroup.jobs.map((job, jobIdx) => (
                        <TableRow key={jobIdx}>
                          <TableCell $width="8%">{job.slNo}</TableCell>
                          <TableCell $width="25%">{job.jobItem}</TableCell>
                          <TableCell $width="15%">{job.quantity}</TableCell>
                          <TableCell $width="15%">{job.price}</TableCell>
                          <TableCell $width="25%">{job.remarks}</TableCell>
                          <TableCell $width="12%" $alignRight $bold>
                            {job.total}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </JobTable>
                </div>
              ))}
            </BranchSection>
          ))}
        </WorkDetailsSection>

        {/* Summary Section */}
        <SummarySection>
          <SummaryContent>
            <SummaryRow>
              <SummaryLabel>Sub Total</SummaryLabel>
              <SummaryValue>₹ {receiptData.summary.subTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</SummaryValue>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>TDS (TDS)</SummaryLabel>
              <SummaryValue $negative>-₹ {receiptData.summary.tds.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</SummaryValue>
            </SummaryRow>

            <SummaryRow>
              <SummaryLabel>GST (SGST)</SummaryLabel>
              <SummaryValue>₹ {receiptData.summary.gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</SummaryValue>
            </SummaryRow>

            <TotalPaidRow>
              <TotalLabel>Total Paid</TotalLabel>
              <TotalValue>₹ {receiptData.summary.totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TotalValue>
            </TotalPaidRow>
          </SummaryContent>
        </SummarySection>

        {/* Signature Section */}
        <SignatureSection>
          <SignatureBlock>
            <SignatureLine />
            <SignatureLabel>Prepared By</SignatureLabel>
            <SignatureName>Admin User</SignatureName>
          </SignatureBlock>

          <SignatureBlock>
            <SignatureLine />
            <SignatureLabel>Contractor Sign</SignatureLabel>
            <SignatureName>{receiptData.contractorName}</SignatureName>
          </SignatureBlock>

          <SignatureBlock>
            <SignatureLine />
            <SignatureLabel>Authorised Signatory</SignatureLabel>
            <SignatureName>Authority Sign</SignatureName>
          </SignatureBlock>
        </SignatureSection>
      </ReceiptCard>

      {/* Footer Button */}
      <FooterButtonContainer>
        <DoneButton onClick={() => navigate("/admin/contractors/contractors")}>
          Done
        </DoneButton>
      </FooterButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  background: #f5f7fa;
  min-height: 100vh;
  padding: 1.5rem;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const BreadcrumbItem = styled.span`
  color: ${(props) => (props.active ? "#222" : "#0047ab")};
  cursor: ${(props) => (props.active ? "default" : "pointer")};
  font-weight: ${(props) => (props.active ? "600" : "500")};
  font-family: "Inter", sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    text-decoration: ${(props) => (props.active ? "none" : "underline")};
  }
`;

const BreadcrumbSeparator = styled.span`
  color: #ccc;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const DownloadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #b91c1c;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ReceiptCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
  font-family: "Inter", sans-serif;
  position: relative;
`;

const PaidWatermark = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  font-size: 8rem;
  font-weight: 700;
  color: rgba(22, 163, 74, 0.15);
  pointer-events: none;
  z-index: 0;
  user-select: none;
`;

const DetailsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
`;

const DetailsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 0.5rem 0;
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.8rem;
  color: #888;
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 0.9rem;
  color: #222;
  font-weight: 600;
`;

const AmountSection = styled.div`
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 2rem;
`;

const AmountDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AmountValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #222;
`;

const AmountLabel = styled.div`
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
  line-height: 1.4;
`;

const AmountDescription = styled.div`
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
  line-height: 1.4;
`;

const WorkDetailsSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 1.5rem 0;
`;

const BranchSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
`;

const DateText = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #222;
`;

const DayTotal = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #0047ab;
`;

const JobTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
`;

const TableHeader = styled.thead`
  background: #f5f5f5;
`;

const HeaderCell = styled.th`
  padding: 0.75rem;
  text-align: ${(props) => (props.$alignRight ? "right" : "left")};
  font-weight: 700;
  color: #222;
  font-size: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
  width: ${(props) => props.$width};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;

  &:hover {
    background: #fafafa;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  text-align: ${(props) => (props.$alignRight ? "right" : "left")};
  color: #333;
  font-weight: ${(props) => (props.$bold ? "600" : "400")};
  width: ${(props) => props.$width};
`;

const SummarySection = styled.div`
  padding: 1.5rem 0;
  margin-bottom: 2rem;
  border-top: 2px solid #e0e0e0;
  border-bottom: 2px solid #e0e0e0;
`;

const SummaryContent = styled.div`
  max-width: 400px;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SummaryLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const SummaryValue = styled.span`
  font-size: 0.9rem;
  color: ${(props) => (props.$negative ? "#dc2626" : "#222")};
  font-weight: 600;
`;

const TotalPaidRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
`;

const TotalLabel = styled.span`
  font-size: 1rem;
  color: #222;
  font-weight: 700;
`;

const TotalValue = styled.span`
  font-size: 1rem;
  color: #0047ab;
  font-weight: 700;
`;

const SignatureSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 2rem;
`;

const SignatureBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`;

const SignatureLine = styled.div`
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #222;
  margin-bottom: 0.5rem;
`;

const SignatureLabel = styled.span`
  font-size: 0.8rem;
  color: #222;
  font-weight: 600;
`;

const SignatureName = styled.span`
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
`;

const FooterButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const DoneButton = styled.button`
  padding: 0.75rem 3rem;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  width: 100%;
  max-width: 600px;

  &:hover {
    background: #0052cc;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default PaymentReceipt;
