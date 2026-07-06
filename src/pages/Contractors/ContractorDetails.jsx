import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ContractorDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("day");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contractor, setContractor] = useState(null);
  const [reportFilters, setReportFilters] = useState({
    branch: "All Branches",
    reportType: "Custom",
    fromDate: "01/04/2026",
    toDate: "30/04/2026",
  });

  // Fetch contractor details from API
  useEffect(() => {
    const fetchContractorDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/contractors/${id}`;
        console.log("🔗 Fetching contractor details from:", apiUrl);
        
        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        console.log("✅ Contractor details fetched successfully:", response.data);
        
        // Transform API data to component format
        const data = response.data;
        const transformedContractor = {
          id: data.id || data._id,
          name: data.name || "Unknown",
          role: data.workInformation?.specialty || "Contractor",
          phone: `📞 +${data.phone}` || "N/A",
          totalAmount: data.totalEarned || 0,
          paidAmount: data.payOut || 0,
          balanceAmount: data.outstanding || 0,
          totalEarned: data.totalEarned || 0,
          payOut: data.payOut || 0,
          outstanding: data.outstanding || 0,
          tags: [data.workInformation?.specialty || "General", "Active"],
          // Store original data for reference
          _originalData: data
        };

        setContractor(transformedContractor);
      } catch (error) {
        console.error("❌ Error fetching contractor details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            error.message || 
                            "Failed to fetch contractor details";
        
        setError(errorMessage);
        toast.error(`Failed to load contractor: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContractorDetails();
    }
  }, [id]);

  const handlePrint = (section) => {
    // Navigate to print view with section parameter
    navigate(`/admin/contractors/${id}/print`, { state: { section } });
  };

  const handleViewReport = () => {
    // Navigate to report view with filters
    navigate(`/admin/contractors/${id}/report`, { state: { filters: reportFilters } });
    setShowReportModal(false);
  };

  // Sample data for job items and work logs - will be replaced by API data
  const jobItemsHQ = contractor?._originalData?.workInformation?.jobItems 
    ? (Array.isArray(contractor._originalData.workInformation.jobItems) 
        ? contractor._originalData.workInformation.jobItems 
        : [contractor._originalData.workInformation.jobItems])
      .filter(item => item.region === "headquarters")
      .map((item, idx) => ({
        date: new Date(contractor._originalData.workInformation.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        job: item.jobItems || "Job Detail",
        quantity: item.unit || "1",
        price: `$${item.price || 0}`,
        total: `$${item.price || 0}`
      }))
    : [{ date: "Apr 8", job: "Job Detail", quantity: "1", price: "$20.00", total: "$20.00" }];

  const jobItemsNR = contractor?._originalData?.workInformation?.jobItems 
    ? (Array.isArray(contractor._originalData.workInformation.jobItems) 
        ? contractor._originalData.workInformation.jobItems 
        : [contractor._originalData.workInformation.jobItems])
      .filter(item => item.region === "north")
      .map((item, idx) => ({
        date: new Date(contractor._originalData.workInformation.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        job: item.jobItems || "Job Detail",
        quantity: item.unit || "1",
        price: `$${item.price || 0}`,
        total: `$${item.price || 0}`
      }))
    : [{ date: "Apr 10", job: "Job Detail", quantity: "1", price: "$10.00", total: "$10.00" }];

  const dayViewData = [
    { date: "Apr 1", jobName: "AC Installation", location: "Building A, F1.3", hours: "8hrs", pay: "$120.00" },
    { date: "Apr 2", jobName: "Duct Cleaning", location: "Building A, F1.3", hours: "6hrs", pay: "$90.00" },
    { date: "Apr 5", jobName: "Routine Maintenance", location: "Building A, F1.3", hours: "5hrs", pay: "$75.00" }
  ];

  // Loading state
  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading contractor details...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  // Error state
  if (error || !contractor) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>{error || "Contractor not found"}</ErrorText>
          <RetryButton onClick={() => window.history.back()}>
            Go Back
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumb>
        <Crumb onClick={() => navigate("/admin/contractors/contractors")}>Contractors</Crumb>
        <Divider>›</Divider>
        <Crumb active>Details</Crumb>
      </Breadcrumb>

      <PageHeader>
        <HeaderLeft>
          <Avatar />
          <Info>
            <Name>{contractor.name}</Name>
            <Role>{contractor.role}</Role>
          </Info>
        </HeaderLeft>
        <HeaderRight>
          <Phone>📞 {contractor.phone}</Phone>
          <Tags>
            {contractor.tags.map((tag, idx) => (
              <Tag key={idx} $color={idx === 0 ? "#0047AB" : "#16A34A"}>{tag}</Tag>
            ))}
          </Tags>
          <HeaderButtons>
            <SecondaryButton onClick={() => handlePrint("all")}>📄 Print</SecondaryButton>
           
          </HeaderButtons>
        </HeaderRight>
      </PageHeader>

      <Section>
        <SectionHeader>
          <SectionTitle>Assigned Job Items - Headquarters</SectionTitle>
          <Buttons>
            <SecondaryButton onClick={() => handlePrint("hq")}>📄 Print</SecondaryButton>
          </Buttons>
        </SectionHeader>
        <Table>
          <TableHead>
            <tr>
              <Th>Date</Th>
              <Th>Job Detail</Th>
              <Th>Quantity</Th>
              <Th>Price/Unit</Th>
              <Th>Total Amount</Th>
              <Th></Th>
            </tr>
          </TableHead>
          <TableBody>
            {jobItemsHQ.map((item, idx) => (
              <TableRow key={idx}>
                <Td><DateTag>{item.date}</DateTag></Td>
                <Td>{item.job}</Td>
                <Td>{item.quantity}</Td>
                <Td>{item.price}</Td>
                <Td>{item.total}</Td>
                <Td><ActionButtons><EditButton>✏️</EditButton><DeleteButton>🗑️</DeleteButton></ActionButtons></Td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Assigned Job Items - North Region</SectionTitle>
          <Buttons>
            <SecondaryButton onClick={() => handlePrint("north")}>📄 Print</SecondaryButton>
          </Buttons>
        </SectionHeader>
        <Table>
          <TableHead>
            <tr>
              <Th>Date</Th>
              <Th>Job Detail</Th>
              <Th>Quantity</Th>
              <Th>Price/Unit</Th>
              <Th>Total Amount</Th>
              <Th></Th>
            </tr>
          </TableHead>
          <TableBody>
            {jobItemsNR.map((item, idx) => (
              <TableRow key={idx}>
                <Td><DateTag>{item.date}</DateTag></Td>
                <Td>{item.job}</Td>
                <Td>{item.quantity}</Td>
                <Td>{item.price}</Td>
                <Td>{item.total}</Td>
                <Td><ActionButtons><EditButton>✏️</EditButton><DeleteButton>🗑️</DeleteButton></ActionButtons></Td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Day view work logs - Headquarters</SectionTitle>
          <Controls>
          

            
           
            <DateText>Apr 5 2026</DateText>
            <DateButtons>
              <ArrowButton>‹</ArrowButton>
              <PrimaryButton>📅 Today</PrimaryButton>
              <ArrowButton>›</ArrowButton>
            </DateButtons>

               <SecondaryButton onClick={() => setShowReportModal(true)}>📊 Reports</SecondaryButton>
            <PrimaryButton>➕ Log Work</PrimaryButton>
          </Controls>
        </SectionHeader>
        <Table>
          <TableHead>
            <tr>
              <Th>Date</Th>
              <Th>Job Name</Th>
              <Th>Location</Th>
              <Th>Hours</Th>
              <Th>Pay</Th>
              <Th></Th>
            </tr>
          </TableHead>
          <TableBody>
            {dayViewData.map((item, idx) => (
              <TableRow key={idx}>
                <Td><DateTag>{item.date}</DateTag></Td>
                <Td>{item.jobName}</Td>
                <Td>{item.location}</Td>
                <Td>{item.hours}</Td>
                <Td>{item.pay}</Td>
                <Td><ActionButtons><EditButton>✏️</EditButton><DeleteButton>🗑️</DeleteButton></ActionButtons></Td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <StatsSection>
        <StatCard>
          <StatLabel>Total Amount</StatLabel>
          <StatValue $color="#0047AB">${contractor?.totalEarned || "$0.00"}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Paid</StatLabel>
          <StatValue $color="#16A34A">${contractor?.payOut || "$0.00"}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Balance</StatLabel>
          <StatValue $color="#DC2626">${contractor?.outstanding || "$0.00"}</StatValue>
        </StatCard>
      </StatsSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Day view work logs - Headquarters</SectionTitle>
          <Tabs>
            <Tab $active={activeTab === "day"} onClick={() => setActiveTab("day")}>Day</Tab>
            <Tab $active={activeTab === "week"} onClick={() => setActiveTab("week")}>Week</Tab>
            <Tab $active={activeTab === "month"} onClick={() => setActiveTab("month")}>Month</Tab>
          </Tabs>
        </SectionHeader>
        <Table>
          <TableHead>
            <tr>
              <Th>Date</Th>
              <Th>Job Name</Th>
              <Th>Location</Th>
              <Th>Hours</Th>
              <Th>Pay</Th>
              <Th></Th>
            </tr>
          </TableHead>
          <TableBody>
            {dayViewData.map((item, idx) => (
              <TableRow key={idx}>
                <Td><DateTag>{item.date}</DateTag></Td>
                <Td>{item.jobName}</Td>
                <Td>{item.location}</Td>
                <Td>{item.hours}</Td>
                <Td>{item.pay}</Td>
                <Td><ActionButtons><EditButton>✏️</EditButton><DeleteButton>🗑️</DeleteButton></ActionButtons></Td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Day view work logs - North Region</SectionTitle>
        </SectionHeader>
        <Table>
          <TableHead>
            <tr>
              <Th>Date</Th>
              <Th>Job Name</Th>
              <Th>Location</Th>
              <Th>Hours</Th>
              <Th>Pay</Th>
              <Th></Th>
            </tr>
          </TableHead>
          <TableBody>
            {dayViewData.map((item, idx) => (
              <TableRow key={idx}>
                <Td><DateTag>{item.date}</DateTag></Td>
                <Td>{item.jobName}</Td>
                <Td>{item.location}</Td>
                <Td>{item.hours}</Td>
                <Td>{item.pay}</Td>
                <Td><ActionButtons><EditButton>✏️</EditButton><DeleteButton>🗑️</DeleteButton></ActionButtons></Td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Footer>
        <CancelButton>Back</CancelButton>
        <SaveButton>₹ Pay Now</SaveButton>
      </Footer>

      {/* Report Modal */}
      {showReportModal && (
        <ModalOverlay onClick={() => setShowReportModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Generate Report</ModalTitle>
            </ModalHeader>

            <ModalBody>
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

              {/* Report Type */}
              <FormGroup>
                <FormLabel>Report Type</FormLabel>
                <FormSelect
                  value={reportFilters.reportType}
                  onChange={(e) =>
                    setReportFilters({ ...reportFilters, reportType: e.target.value })
                  }
                >
                  <option>Custom</option>
                  <option>Summary</option>
                  <option>Detailed</option>
                  <option>Bio Data</option>
                </FormSelect>
              </FormGroup>

              {/* Date Range */}
              <DateRangeRow>
                <FormGroup>
                  <FormLabel>From Date</FormLabel>
                  <DateInput
                    type="date"
                    value={reportFilters.fromDate}
                    onChange={(e) =>
                      setReportFilters({ ...reportFilters, fromDate: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>To Date</FormLabel>
                  <DateInput
                    type="date"
                    value={reportFilters.toDate}
                    onChange={(e) =>
                      setReportFilters({ ...reportFilters, toDate: e.target.value })
                    }
                  />
                </FormGroup>
              </DateRangeRow>
            </ModalBody>

            <ModalFooter>
              <CloseButton onClick={() => setShowReportModal(false)}>
                ✕ Close
              </CloseButton>
              <ViewReportButton onClick={handleViewReport}>
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
  padding: 1.5rem;
  background: #F5F7FA;
  min-height: 100vh;
`;

// Loading and Error States
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 500px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E7E7E7;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #E5E7EB;
  border-top: 4px solid #0047AB;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 500px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E7E7E7;
  padding: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
`;

const ErrorText = styled.p`
  font-size: 0.95rem;
  color: #DC2626;
  margin: 0;
  font-family: "Inter", sans-serif;
  text-align: center;
  max-width: 400px;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #0047AB;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.25s ease;

  &:hover {
    background: #003580;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  color: #666;
`;

const Crumb = styled.span`
  cursor: ${props => props.active ? "default" : "pointer"};
  color: ${props => props.active ? "#0047AB" : "#666"};
`;

const Divider = styled.span`
  color: #666;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #E7E7E7;
  margin-bottom: 1.5rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #E0E7FF;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Name = styled.h2`
  margin: 0;
  font-family: "Inter", sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
`;

const Role = styled.p`
  margin: 0;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  color: #666;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Phone = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  color: #333;
`;

const Tags = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Tag = styled.span`
  padding: 0.4rem 0.8rem;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  border-radius: 16px;
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #E7E7E7;
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E7E7E7;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #222;
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Filters = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Filter = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.$active ? "#0047AB" : "white"};
  color: ${props => props.$active ? "white" : "#333"};
  border: ${props => props.$active ? "none" : "1px solid #E7E7E7"};
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
`;

const DateText = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  color: #333;
`;

const DateButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ArrowButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: #F5F5F5;
  border: 1px solid #E7E7E7;
  border-radius: 6px;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-size: 1rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.25rem;
  background: #F5F5F5;
  padding: 0.25rem;
  border-radius: 8px;
`;

const Tab = styled.button`
  padding: 0.5rem 1.25rem;
  background: ${props => props.$active ? "#0047AB" : "transparent"};
  color: ${props => props.$active ? "white" : "#333"};
  border: none;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #F8FAFC;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1.5rem;
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  border-bottom: 1px solid #E7E7E7;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #E7E7E7;
  &:last-child { border-bottom: none; }
`;

const Td = styled.td`
  padding: 0.75rem 1.5rem;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: #333;
`;

const DateTag = styled.span`
  padding: 0.35rem 0.75rem;
  background: #E0E7FF;
  color: #0047AB;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
`;

const PrimaryButton = styled.button`
  padding: 0.5rem 1rem;
  background: #0047AB;
  color: white;
  border: none;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  padding: 0.5rem 1rem;
  background: white;
  color: #333;
  border: 1px solid #E7E7E7;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #E7E7E7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const StatLabel = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  color: #666;
`;

const StatValue = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.$color};
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CancelButton = styled.button`
  padding: 0.75rem 2rem;
  background: white;
  color: #333;
  border: 1px solid #E7E7E7;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
`;

const SaveButton = styled.button`
  padding: 0.75rem 2rem;
  background: #0047AB;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
`;

// Report Modal Styled Components
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
  max-width: 500px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #E7E7E7;
`;

const ModalTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
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

const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #222;
  font-family: "Inter", sans-serif;
`;

const FormSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #0047AB;
    box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.1);
  }
`;

const DateRangeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const DateInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #0047AB;
    box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.1);
  }
`;

const ModalFooter = styled.div`
  padding: 2rem;
  border-top: 1px solid #E7E7E7;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const CloseButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  color: #333;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #F5F7FA;
    border-color: #999;
  }
`;

const ViewReportButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #0047AB;
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

export default ContractorDetails;
