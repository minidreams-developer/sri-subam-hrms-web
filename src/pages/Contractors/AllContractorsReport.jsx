import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FiDownload, FiX } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AllContractorsReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const period = location.state?.period || "May 2026";
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setReportData({
      companyName: "Ace Workforce",
      reportPeriod: period,
      generatedDate: new Date().toLocaleDateString("en-IN"),
      contractorBreakdown: [
        {
          slNo: 1,
          contractorId: "CTR-4081",
          contractorName: "Manoj",
          monthTotal: "₹45,500.00",
          payOut: "₹42,000.00",
          outstanding: "₹3,500.00",
        },
        {
          slNo: 2,
          contractorId: "CTR-4082",
          contractorName: "Sunitha",
          monthTotal: "₹32,800.00",
          payOut: "₹32,800.00",
          outstanding: "₹0.00",
        },
        {
          slNo: 3,
          contractorId: "CTR-4083",
          contractorName: "Kumar",
          monthTotal: "₹28,400.00",
          payOut: "₹20,000.00",
          outstanding: "₹8,400.00",
        },
        {
          slNo: 4,
          contractorId: "CTR-4084",
          contractorName: "Ramesh Tech",
          monthTotal: "₹36,200.00",
          payOut: "₹45,000.00",
          outstanding: "₹9,200.00",
        },
        {
          slNo: 5,
          contractorId: "CTR-4085",
          contractorName: "Vikram Dutta",
          monthTotal: "₹18,300.00",
          payOut: "₹10,000.00",
          outstanding: "₹8.00",
        },
      ],
      contractorBreakdownTotals: {
        monthTotal: "₹161,200.00",
        payOut: "₹149,800.00",
        outstanding: "₹21,100.00",
      },
      branchWiseTotals: [
        {
          slNo: 1,
          branchName: "Headquarters",
          monthTotal: "₹65,900.00",
          payOut: "₹72,000.00",
          outstanding: "₹0.00",
        },
        {
          slNo: 2,
          branchName: "North Region",
          monthTotal: "₹84,700.00",
          payOut: "₹84,700.00",
          outstanding: "₹0.00",
        },
        {
          slNo: 3,
          branchName: "South Region",
          monthTotal: "₹41,200.00",
          payOut: "₹32,200.00",
          outstanding: "₹9,000.00",
        },
      ],
      branchWiseTotalsGrand: {
        monthTotal: "₹190,900.00",
        payOut: "₹188,900.00",
        outstanding: "₹9,000.00",
      },
      branchContractorBreakdown: [
        {
          slNo: 1,
          branchName: "Headquarters",
          contractorId: "CTR-4085",
          contractorName: "Manoj",
          monthTotal: "₹45,500.00",
          payOut: "₹40,000.00",
          outstanding: "₹5,500.00",
        },
        {
          slNo: 2,
          branchName: "Headquarters",
          contractorId: "CTR-4062",
          contractorName: "Sunitha",
          monthTotal: "₹45,400.00",
          payOut: "₹32,000.00",
          outstanding: "₹13,400.00",
        },
        {
          slNo: 3,
          branchName: "North Region",
          contractorId: "CTR-4084",
          contractorName: "Darnesh Tech",
          monthTotal: "₹35,000.00",
          payOut: "₹35,000.00",
          outstanding: "₹0.00",
        },
        {
          slNo: 4,
          branchName: "North Region",
          contractorId: "CTR-4085",
          contractorName: "Vikram Dutta",
          monthTotal: "₹9,300.00",
          payOut: "₹9,700.00",
          outstanding: "₹0.00",
        },
        {
          slNo: 5,
          branchName: "South Region",
          contractorId: "CTR-4093",
          contractorName: "Kumar",
          monthTotal: "₹28,400.00",
          payOut: "₹20,000.00",
          outstanding: "₹8,400.00",
        },
        {
          slNo: 6,
          branchName: "South Region",
          contractorId: "CTR-4094",
          contractorName: "Ramesh Tech",
          monthTotal: "₹54,800.00",
          payOut: "₹12,700.00",
          outstanding: "₹42,100.00",
        },
      ],
      branchContractorTotals: {
        monthTotal: "₹183,800.00",
        payOut: "₹168,400.00",
        outstanding: "₹15,400.00",
      },
    });
    setLoading(false);
  }, [period]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-content");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(`All_Contractors_Report_${period}.pdf`);
  };

  if (loading) {
    return <LoadingContainer>Loading report...</LoadingContainer>;
  }

  return (
    <ReportWrapper>
      <ReportHeader>
        <HeaderLeft>
          <ReportTitle>All Contractors Summary Report</ReportTitle>
          <ReportSubtitle>{period}</ReportSubtitle>
        </HeaderLeft>
        <HeaderRight>
          <DownloadButton onClick={handleDownloadPDF}>
            <FiDownload size={18} />
            Download Report
          </DownloadButton>
          <CloseButton onClick={() => navigate("/admin/contractors/contractors")}>
            <FiX size={20} />
          </CloseButton>
        </HeaderRight>
      </ReportHeader>

      <ReportContent id="report-content">
        {/* Report Header */}
        <PDFHeader>
          <CompanyLogo>▲</CompanyLogo>
          <CompanyInfo>
            <CompanyName>{reportData.companyName}</CompanyName>
            <ReportName>Monthly Contractor Payment Summary</ReportName>
          </CompanyInfo>
          <HeaderMeta>
            <MetaItem>
              <MetaLabel>Report Period</MetaLabel>
              <MetaValue>{reportData.reportPeriod}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Branches</MetaLabel>
              <MetaValue>All Branches</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Generated On</MetaLabel>
              <MetaValue>{reportData.generatedDate}</MetaValue>
            </MetaItem>
          </HeaderMeta>
        </PDFHeader>

        <Divider />

        {/* Contractor Breakdown Section */}
        <Section>
          <SectionTitle>Contractor Breakdown</SectionTitle>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>S.No</TableHeaderCell>
                  <TableHeaderCell>Contractor ID</TableHeaderCell>
                  <TableHeaderCell>Contractor Name</TableHeaderCell>
                  <TableHeaderCell>Month Total</TableHeaderCell>
                  <TableHeaderCell>Pay Out</TableHeaderCell>
                  <TableHeaderCell>Outstanding</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.contractorBreakdown.map((row) => (
                  <TableRow key={row.slNo}>
                    <TableCell>{row.slNo}</TableCell>
                    <TableCell>{row.contractorId}</TableCell>
                    <TableCell>{row.contractorName}</TableCell>
                    <TableCell>{row.monthTotal}</TableCell>
                    <TableCell>{row.payOut}</TableCell>
                    <TableCell $highlight={!row.outstanding.includes("0")}>
                      {row.outstanding}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow $isTotalRow>
                  <TableCell colSpan="3">
                    <strong>Grand Total</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{reportData.contractorBreakdownTotals.monthTotal}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{reportData.contractorBreakdownTotals.payOut}</strong>
                  </TableCell>
                  <TableCell $highlight>
                    <strong>{reportData.contractorBreakdownTotals.outstanding}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>

        {/* Branch-wise Totals Section */}
        <Section>
          <SectionTitle>Branch-wise Totals</SectionTitle>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>S.No</TableHeaderCell>
                  <TableHeaderCell>Branch Name</TableHeaderCell>
                  <TableHeaderCell>Month Total</TableHeaderCell>
                  <TableHeaderCell>Pay Out</TableHeaderCell>
                  <TableHeaderCell>Outstanding</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.branchWiseTotals.map((row) => (
                  <TableRow key={row.slNo}>
                    <TableCell>{row.slNo}</TableCell>
                    <TableCell>{row.branchName}</TableCell>
                    <TableCell>{row.monthTotal}</TableCell>
                    <TableCell>{row.payOut}</TableCell>
                    <TableCell $highlight={!row.outstanding.includes("0")}>
                      {row.outstanding}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow $isTotalRow>
                  <TableCell colSpan="2">
                    <strong>Grand Total</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{reportData.branchWiseTotalsGrand.monthTotal}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{reportData.branchWiseTotalsGrand.payOut}</strong>
                  </TableCell>
                  <TableCell $highlight>
                    <strong>{reportData.branchWiseTotalsGrand.outstanding}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>

        {/* Branch & Contractor-wise Breakdown Section */}
        <Section>
          <SectionTitle>Branch & Contractor-wise Breakdown</SectionTitle>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>S.No</TableHeaderCell>
                  <TableHeaderCell>Branch Name</TableHeaderCell>
                  <TableHeaderCell>Contractor ID</TableHeaderCell>
                  <TableHeaderCell>Contractor Name</TableHeaderCell>
                  <TableHeaderCell>Month Total</TableHeaderCell>
                  <TableHeaderCell>Pay Out</TableHeaderCell>
                  <TableHeaderCell>Outstanding</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.branchContractorBreakdown.map((row) => (
                  <TableRow key={row.slNo}>
                    <TableCell>{row.slNo}</TableCell>
                    <TableCell>{row.branchName}</TableCell>
                    <TableCell>{row.contractorId}</TableCell>
                    <TableCell>{row.contractorName}</TableCell>
                    <TableCell>{row.monthTotal}</TableCell>
                    <TableCell>{row.payOut}</TableCell>
                    <TableCell $highlight={!row.outstanding.includes("0")}>
                      {row.outstanding}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow $isTotalRow>
                  <TableCell colSpan="4">
                    <strong>Grand Total</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{reportData.branchContractorTotals.monthTotal}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{reportData.branchContractorTotals.payOut}</strong>
                  </TableCell>
                  <TableCell $highlight>
                    <strong>{reportData.branchContractorTotals.outstanding}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>

        {/* Footer */}
        <ReportFooter>
          <FooterItem>
            <FooterLabel>Prepared By</FooterLabel>
            <FooterLine />
          </FooterItem>
          <FooterItem>
            <FooterLabel>Checked By</FooterLabel>
            <FooterLine />
          </FooterItem>
          <FooterItem>
            <FooterLabel>Arjith Seal Sign</FooterLabel>
            <FooterLine />
          </FooterItem>
        </ReportFooter>
      </ReportContent>
    </ReportWrapper>
  );
};

// Styled Components
const ReportWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ReportHeader = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const ReportTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const ReportSubtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const HeaderRight = styled.div`
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

const ReportContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;

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

const PDFHeader = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media print {
    box-shadow: none;
  }
`;

const CompanyLogo = styled.div`
  font-size: 2.5rem;
  color: #0047ab;
  font-weight: 700;
  flex-shrink: 0;
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
`;

const CompanyName = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const ReportName = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const HeaderMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding-left: 2rem;
  border-left: 1px solid #e0e0e0;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const MetaLabel = styled.span`
  font-size: 0.75rem;
  color: #999;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  text-transform: uppercase;
`;

const MetaValue = styled.span`
  font-size: 0.9rem;
  color: #222;
  font-weight: 600;
  font-family: "Inter", sans-serif;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 1.5rem 0;
`;

const Section = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media print {
    box-shadow: none;
    page-break-inside: avoid;
  }
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 1rem 0;
  padding-left: 0.75rem;
  padding-bottom: 0;
  border-left: 3px solid #f0b735;
  border-bottom: none;
  font-family: "Inter", sans-serif;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Inter", sans-serif;
  font-size: 0.8rem;
`;

const TableHeader = styled.thead`
  background: #f5f5f5;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  background: ${(props) => (props.$isTotalRow ? "#f0f0f0" : "white")};

  &:hover {
    background: ${(props) => (props.$isTotalRow ? "#f0f0f0" : "#fafafa")};
  }

  @media print {
    &:hover {
      background: ${(props) => (props.$isTotalRow ? "#f0f0f0" : "white")};
    }
  }
`;

const TableHeaderCell = styled.th`
  padding: 0.65rem 0.75rem;
  text-align: left;
  font-weight: 700;
  color: #333;
  background: #f5f5f5;
  border-bottom: 1px solid #d0d0d0;
  font-size: 0.8rem;
`;

const TableCell = styled.td`
  padding: 0.65rem 0.75rem;
  text-align: left;
  color: ${(props) => (props.$highlight ? "#dc2626" : "#333")};
  font-weight: ${(props) => (props.$highlight ? "600" : "500")};
  white-space: nowrap;
  font-size: 0.8rem;
`;

const ReportFooter = styled.div`
  background: white;
  padding: 2rem 1.5rem;
  border-radius: 0;
  margin-top: 2rem;
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media print {
    box-shadow: none;
  }
`;

const FooterItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const FooterLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #222;
  font-family: "Inter", sans-serif;
`;

const FooterLine = styled.div`
  width: 120px;
  height: 1px;
  background: #333;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  font-size: 1.1rem;
  color: #666;
  font-family: "Inter", sans-serif;
`;

export default AllContractorsReport;
