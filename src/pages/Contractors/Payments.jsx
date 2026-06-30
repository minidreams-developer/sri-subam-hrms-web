import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiChevronDown, FiBarChart2, FiX, FiCalendar } from "react-icons/fi";

const Payments = () => {
  const navigate = useNavigate();
  const [selectedContractor, setSelectedContractor] = useState("Safeq");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFilters, setReportFilters] = useState({
    contractor: "All Contractors",
    fromDate: "",
    toDate: "",
    paymentStatus: "All",
    paymentMethod: "All Methods",
    branch: "All Branches",
    reportFormat: "Excel Spreadsheet",
    includeJobItems: true,
    includeCancelledPayments: false,
  });

  const contractors = [
    {
      id: "AW-CCN-001",
      name: "Arjun Sharma",
      company: "BuildRight Construction Co.",
      photo: "👨",
      payments: [
        {
          slNo: 1,
          paymentDate: "12 Oct 2023",
          paymentVia: "Bank Transfer",
          reference: "REF-582374 92",
          payOut: "₹ 45,000",
        },
        {
          slNo: 2,
          paymentDate: "28 Sep 2023",
          paymentVia: "UPI",
          reference: "UTR-4820194 9",
          payOut: "₹ 12,500",
        },
        {
          slNo: 3,
          paymentDate: "15 Sep 2023",
          paymentVia: "Bank Transfer",
          reference: "REF-T14229103",
          payOut: "₹ 30,000",
        },
        {
          slNo: 4,
          paymentDate: "02 Sep 2023",
          paymentVia: "Cheque",
          reference: "CHQ-0649 21",
          payOut: "₹ 25,000",
        },
        {
          slNo: 5,
          paymentDate: "18 Aug 2023",
          paymentVia: "Bank Transfer",
          reference: "REF-1 3:2864 15",
          payOut: "₹ 50,000",
        },
      ],
    },
    {
      id: "AW-CCN-002",
      name: "Safeq",
      company: "SafeGuard Services Ltd.",
      photo: "👨",
      payments: [
        {
          slNo: 1,
          paymentDate: "10 Oct 2023",
          paymentVia: "Bank Transfer",
          reference: "REF-582374 92",
          payOut: "₹ 55,000",
        },
        {
          slNo: 2,
          paymentDate: "25 Sep 2023",
          paymentVia: "UPI",
          reference: "UTR-4820194 9",
          payOut: "₹ 15,500",
        },
      ],
    },
    {
      id: "AW-CCN-003",
      name: "Ramesh Tech",
      company: "TechBuild Solutions",
      photo: "👨",
      payments: [
        {
          slNo: 1,
          paymentDate: "05 Oct 2023",
          paymentVia: "Cheque",
          reference: "CHQ-0649 21",
          payOut: "₹ 35,000",
        },
      ],
    },
  ];

  const currentContractor = contractors.find((c) => c.name === selectedContractor) || contractors[0];

  return (
    <Container>
      <HeaderSection>
        <HeaderLeft>
          <PageTitle>Payments</PageTitle>
          <PageSubtitle>View and manage payment records for your contractors.</PageSubtitle>
        </HeaderLeft>
       
      </HeaderSection>

      <ContentSection>
        {/* Contractor Selection */}
        <SelectionBar>
          <SelectionLeft>
            <SelectLabel>Select Contractor :</SelectLabel>
            <DropdownWrapper>
              <DropdownButton onClick={() => setShowDropdown(!showDropdown)}>
                {selectedContractor}
                <FiChevronDown size={18} />
              </DropdownButton>
              {showDropdown && (
                <DropdownMenu>
                  {contractors.map((contractor) => (
                    <DropdownItem
                      key={contractor.id}
                      onClick={() => {
                        setSelectedContractor(contractor.name);
                        setShowDropdown(false);
                      }}
                    >
                      {contractor.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </DropdownWrapper>
          </SelectionLeft>
          <SelectionRight>
            <ReportsButton onClick={() => setShowReportModal(true)}>
              <FiBarChart2 size={18} />
              Reports
            </ReportsButton>
          </SelectionRight>
        </SelectionBar>

        {/* Contractor Info Card */}
        <ContractorCard>
          <ContractorInfo>
            <ContractorName>{currentContractor.name}</ContractorName>
            <ContractorDetails>
              <DetailItem>{currentContractor.id}</DetailItem>
              <DetailSeparator>•</DetailSeparator>
              <DetailItem>{currentContractor.company}</DetailItem>
            </ContractorDetails>
          </ContractorInfo>
          <ContractorPhoto>{currentContractor.photo}</ContractorPhoto>
        </ContractorCard>

        {/* Payment Table */}
        <TableSection>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>S.no</TableHeaderCell>
                  <TableHeaderCell>Payment Date</TableHeaderCell>
                  <TableHeaderCell>Payment Via</TableHeaderCell>
                  <TableHeaderCell>Reference</TableHeaderCell>
                  <TableHeaderCell>Pay Out</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentContractor.payments.map((payment) => (
                  <TableRow key={payment.slNo}>
                    <TableCell>{payment.slNo}</TableCell>
                    <TableCell>{payment.paymentDate}</TableCell>
                    <TableCell>{payment.paymentVia}</TableCell>
                    <TableCell>{payment.reference}</TableCell>
                    <TableCell $highlight>{payment.payOut}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </TableSection>
      </ContentSection>

      {/* Report Modal */}
      {showReportModal && (
        <ModalOverlay onClick={() => setShowReportModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Generate Spreadsheet Report</ModalTitle>
              <CloseIcon onClick={() => setShowReportModal(false)}>
                <FiX size={24} />
              </CloseIcon>
            </ModalHeader>

            <ModalBody>
              {/* Contractor */}
              <FormGroup>
                <FormLabel>Contractor</FormLabel>
                <FormSelect
                  value={reportFilters.contractor}
                  onChange={(e) =>
                    setReportFilters({ ...reportFilters, contractor: e.target.value })
                  }
                >
                  <option>All Contractors</option>
                  <option>Arjun Sharma</option>
                  <option>Safeq</option>
                  <option>Ramesh Tech</option>
                </FormSelect>
              </FormGroup>

              {/* Date Range */}
              <FormRow>
                <FormGroup>
                  <FormLabel>From Date</FormLabel>
                  <DateInputWrapper>
                    <DateInput
                      type="date"
                      value={reportFilters.fromDate}
                      onChange={(e) =>
                        setReportFilters({ ...reportFilters, fromDate: e.target.value })
                      }
                    />
                    <DateIcon>
                      <FiCalendar size={18} />
                    </DateIcon>
                  </DateInputWrapper>
                </FormGroup>
                <FormGroup>
                  <FormLabel>To Date</FormLabel>
                  <DateInputWrapper>
                    <DateInput
                      type="date"
                      value={reportFilters.toDate}
                      onChange={(e) =>
                        setReportFilters({ ...reportFilters, toDate: e.target.value })
                      }
                    />
                    <DateIcon>
                      <FiCalendar size={18} />
                    </DateIcon>
                  </DateInputWrapper>
                </FormGroup>
              </FormRow>

              {/* Payment Status & Method */}
              <FormRow>
                <FormGroup>
                  <FormLabel>Payment Status</FormLabel>
                  <FormSelect
                    value={reportFilters.paymentStatus}
                    onChange={(e) =>
                      setReportFilters({ ...reportFilters, paymentStatus: e.target.value })
                    }
                  >
                    <option>All</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Payment Method</FormLabel>
                  <FormSelect
                    value={reportFilters.paymentMethod}
                    onChange={(e) =>
                      setReportFilters({ ...reportFilters, paymentMethod: e.target.value })
                    }
                  >
                    <option>All Methods</option>
                    <option>Bank Transfer</option>
                    <option>UPI</option>
                    <option>Cheque</option>
                  </FormSelect>
                </FormGroup>
              </FormRow>

              {/* Branch */}
              <FormGroup>
                <FormLabel>Branch</FormLabel>
                <FormSelect
                  value={reportFilters.branch}
                  onChange={(e) =>
                    setReportFilters({ ...reportFilters, branch: e.target.value })
                  }
                >
                  <option>All Branches</option>
                  <option>Headquarters</option>
                  <option>North Region</option>
                  <option>South Region</option>
                </FormSelect>
              </FormGroup>

              {/* Report Format */}
              <FormGroup>
                <FormLabel>Report Format</FormLabel>
                <FormatButtonGroup>
                  <FormatButton
                    $active={reportFilters.reportFormat === "PDF Document"}
                    onClick={() =>
                      setReportFilters({ ...reportFilters, reportFormat: "PDF Document" })
                    }
                  >
                    📄 PDF Document
                  </FormatButton>
                  <FormatButton
                    $active={reportFilters.reportFormat === "Excel Spreadsheet"}
                    onClick={() =>
                      setReportFilters({ ...reportFilters, reportFormat: "Excel Spreadsheet" })
                    }
                  >
                    📊 Excel Spreadsheet
                  </FormatButton>
                </FormatButtonGroup>
              </FormGroup>

              {/* Checkboxes */}
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  id="jobItems"
                  checked={reportFilters.includeJobItems}
                  onChange={(e) =>
                    setReportFilters({ ...reportFilters, includeJobItems: e.target.checked })
                  }
                />
                <CheckboxLabel htmlFor="jobItems">
                  Include detailed job items breakdown
                </CheckboxLabel>
              </CheckboxGroup>
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  id="cancelledPayments"
                  checked={reportFilters.includeCancelledPayments}
                  onChange={(e) =>
                    setReportFilters({
                      ...reportFilters,
                      includeCancelledPayments: e.target.checked,
                    })
                  }
                />
                <CheckboxLabel htmlFor="cancelledPayments">
                  Include cancelled and failed payments
                </CheckboxLabel>
              </CheckboxGroup>
            </ModalBody>

            <ModalFooter>
              <CancelButton onClick={() => setShowReportModal(false)}>Cancel</CancelButton>
              <ViewReportButton
                onClick={() => {
                  setShowReportModal(false);
                  navigate("/admin/contractors/payment-report");
                }}
              >
                View Report →
              </ViewReportButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  background: #f5f7fa;
  min-height: 100vh;
  padding: 1.5rem;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
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
  font-weight: 500;
`;

const ReportsButton = styled.button`
  padding: 0.7rem 1.5rem;
  background: #0047ab;
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
    background: #003580;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SelectionBar = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SelectionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const SelectionRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
`;

const SelectLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const DropdownWrapper = styled.div`
  position: relative;
  min-width: 180px;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    border-color: #0047ab;
  }

  &:focus {
    outline: none;
    border-color: #0047ab;
    box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.1);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  margin-top: 0.5rem;
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    color: #0047ab;
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

const ContractorCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ContractorPhoto = styled.div`
  width: 80px;
  height: 80px;
  background: #d4d4d4;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  flex-shrink: 0;
  margin-left: auto;
`;

const ContractorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
`;

const ContractorName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const ContractorDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #666;
`;

const DetailItem = styled.span`
  font-family: "Inter", sans-serif;
`;

const DetailSeparator = styled.span`
  color: #ccc;
`;

const TableSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
`;

const TableHeader = styled.thead`
  background: #f5f5f5;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  background: white;

  &:hover {
    background: #fafafa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 700;
  color: #222;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.8rem;
`;

const TableCell = styled.td`
  padding: 1rem;
  text-align: left;
  color: ${(props) => (props.$highlight ? "#0047ab" : "#333")};
  font-weight: ${(props) => (props.$highlight ? "600" : "500")};
`;

// Modal Styled Components
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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const CloseIcon = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #222;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #222;
  font-family: "Inter", sans-serif;
`;

const FormSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #0047ab;
  }

  &:focus {
    outline: none;
    border-color: #0047ab;
    box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.1);
  }
`;

const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  color: #333;
  transition: all 0.2s;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #0047ab;
    box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.1);
  }
`;

const DateIcon = styled.span`
  position: absolute;
  right: 1rem;
  color: #999;
  pointer-events: none;
`;

const FormatButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const FormatButton = styled.button`
  padding: 1rem;
  border: 2px solid ${(props) => (props.$active ? "#0047ab" : "#d0d0d0")};
  background: ${(props) => (props.$active ? "#f0f5ff" : "white")};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${(props) => (props.$active ? "#0047ab" : "#333")};
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    border-color: #0047ab;
    background: #f0f5ff;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #0047ab;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  margin: 0;
`;

const ModalFooter = styled.div`
  padding: 2rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  color: #222;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }
`;

const ViewReportButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #0047ab;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #003580;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default Payments;
