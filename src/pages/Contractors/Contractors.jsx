import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import deleteIcon from "../../assets/contractor/SVG.svg";
import clockIcon from "../../assets/contractor/iconify-icon.svg";
import earnedPayIcon from "../../assets/contractor/iconify-icon (1).svg";
import advanceIcon from "../../assets/contractor/iconify-icon (2).svg";
import reportIcon from "../../assets/contractor/SVG (1).svg";

const Contractors = () => {
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLogWorkModal, setShowLogWorkModal] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    reportType: "All Contractors",
    period: "May 2026",
  });

  // Fetch contractors from API
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/contractors`;
        console.log("🔗 Fetching contractors from:", apiUrl);
        
        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        console.log("✅ Contractors fetched successfully:", response.data);
        
        // Transform API data to component format
        const results = response.data?.results || [];
        const transformedContractors = (Array.isArray(results) ? results : []).map((contractor, index) => {
          const initials = (contractor.name || "C")
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          // Get specialty from workInformation
          const specialty = contractor.workInformation?.specialty || contractor.specialty || "Contractor";
          
          // Format date
          const joinedDate = new Date(contractor.workInformation?.joinedDate || contractor.dateOfBirth || Date.now());
          const dateStr = joinedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });

          return {
            id: contractor.id || contractor._id || index,
            initial: initials,
            name: contractor.name || "Unknown",
            role: specialty || "Contractor",
            contractorId: contractor.employeeId || contractor.contractorId || `CON-${10024 + index}`,
            specialization: [
              specialty || "General",
              "Active"
            ],
            specialColors: ["#066C78", "#16A34A"],
            date: dateStr,
            todayPay: "$0.00",
            earnedPay: "$0.00",
            advanceReceived: "$0.00",
            avatarBg: "#E0E7FF",
            avatarTextColor: "#066C78",
            // Store original contractor data for details view
            _originalData: contractor
          };
        });

        setContractors(transformedContractors);
      } catch (error) {
        console.error("❌ Error fetching contractors:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            error.message || 
                            "Failed to fetch contractors";
        
        setError(errorMessage);
        toast.error(`Failed to load contractors: ${errorMessage}`);
        
        // Set empty array on error
        setContractors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  return (
    <Container>
      <PageHeader>
        <HeaderContent>
          <HeaderLeft>
            <Title>Contractors</Title>
            <Subtitle>Manage your contractor database</Subtitle>
          </HeaderLeft>
          <HeaderRight>
            <ReportsButton onClick={() => setShowReportModal(true)}>
              <ButtonIcon src={reportIcon} alt="reports" />
              Reports
            </ReportsButton>
            <AddButton onClick={() => navigate("/admin/contractors/add")}>
              + Add Contractor
            </AddButton>
          </HeaderRight>
        </HeaderContent>
      </PageHeader>

      {/* Loading State */}
      {loading && (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading contractors...</LoadingText>
        </LoadingContainer>
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>{error}</ErrorText>
          <RetryButton onClick={() => window.location.reload()}>
            Retry
          </RetryButton>
        </ErrorContainer>
      )}

      {/* Empty State */}
      {!loading && !error && contractors.length === 0 && (
        <EmptyContainer>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyText>No contractors found</EmptyText>
          <EmptySubtext>Add your first contractor to get started</EmptySubtext>
          <AddButton onClick={() => navigate("/admin/contractors/add")}>
            + Add Contractor
          </AddButton>
        </EmptyContainer>
      )}

      {/* Contractors Grid */}
      {!loading && !error && contractors.length > 0 && (
        <CardsGrid>
          {contractors.map((contractor) => (
            <Card key={contractor.id} onClick={() => navigate(`/admin/contractors/${contractor.id}/details`)}>
              <CardTop>
                <CardHeader>
                  <AvatarWithInfo>
                    <Avatar $bg={contractor.avatarBg} $textColor={contractor.avatarTextColor}>
                      {contractor.initial}
                    </Avatar>
                    <InfoSection>
                      <Name>{contractor.name}</Name>
                      <Role>{contractor.role}</Role>
                    </InfoSection>
                  </AvatarWithInfo>
                  <DeleteButton>
                    <DeleteIcon src={deleteIcon} alt="delete" />
                  </DeleteButton>
                </CardHeader>

                <Tags>
                  {contractor.specialization.map((spec, idx) => (
                    <Tag key={idx} $color={contractor.specialColors[idx]}>
                      {spec}
                    </Tag>
                  ))}
                </Tags>

                <DateSection>
                  <Subtitle>{contractor.date}</Subtitle>
                </DateSection>
              </CardTop>

              <PaymentSection>
                <PaymentItem>
                  <PaymentLabel $color="#066C78">
                    <PaymentIcon src={clockIcon} alt="clock" />
                    <PaymentText $color="#066C78">Today's Pay</PaymentText>
                  </PaymentLabel>
                  <PaymentAmount $color="#066C78">{contractor.todayPay}</PaymentAmount>
                </PaymentItem>
                <PaymentItem>
                  <PaymentLabel $color="#16A34A">
                    <PaymentIcon src={earnedPayIcon} alt="earned" />
                    <PaymentText $color="#16A34A">Earned Pay</PaymentText>
                  </PaymentLabel>
                  <PaymentAmount $color="#16A34A">{contractor.earnedPay}</PaymentAmount>
                </PaymentItem>
                <PaymentItem>
                  <PaymentLabel $color="#DC2626">
                    <PaymentIcon src={advanceIcon} alt="advance" />
                    <PaymentText $color="#DC2626">Advance Received</PaymentText>
                  </PaymentLabel>
                  <PaymentAmount $color="#DC2626">{contractor.advanceReceived}</PaymentAmount>
                </PaymentItem>
              </PaymentSection>

              <ActionButtons onClick={(e) => e.stopPropagation()}>
                <LogButton onClick={() => { setSelectedContractor(contractor); setShowLogWorkModal(true); }}>
                  <IconImage src={clockIcon} alt="clock" />
                  Log Work
                </LogButton>
                <PayButton onClick={() => navigate(`/admin/contractors/pay/${contractor.name}`)}>
                  ₹ Pay
                </PayButton>
              </ActionButtons>
            </Card>
          ))}
        </CardsGrid>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ModalOverlay onClick={() => setShowReportModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Generate Report</ModalTitle>

            <FormGroup>
              <Label>Report Type</Label>
              <Select
                value={reportData.reportType}
                onChange={(e) =>
                  setReportData({ ...reportData, reportType: e.target.value })
                }
              >
                <option value="All Contractors">All Contractors</option>
                <option value="Bio Data Report">Bio Data Report</option>
              </Select>
            </FormGroup>

            {reportData.reportType === "Bio Data Report" && (
              <FormGroup>
                <Label>Contractor Name</Label>
                <Select
                  value={reportData.contractorName || ""}
                  onChange={(e) =>
                    setReportData({ ...reportData, contractorName: e.target.value })
                  }
                >
                  <option value="">Select Contractor</option>
                  <option value="Manraj">Manraj</option>
                  <option value="Ramesh">Ramesh</option>
                  <option value="Kumar">Kumar</option>
                </Select>
              </FormGroup>
            )}

            <FormGroup>
              <Label>Period</Label>
              <Input
                type="text"
                value={reportData.period}
                onChange={(e) =>
                  setReportData({ ...reportData, period: e.target.value })
                }
                placeholder="May 2026"
              />
            </FormGroup>

            <ModalButtons>
              <CancelModalButton onClick={() => setShowReportModal(false)}>
                Cancel
              </CancelModalButton>
              <ProceedButton
                onClick={() => {
                  if (reportData.reportType === "Bio Data Report") {
                    navigate("/admin/contractors/bio-data-report", {
                      state: { reportData },
                    });
                  } else {
                    navigate("/admin/contractors/report/all-contractors", {
                      state: { period: reportData.period },
                    });
                  }
                  setShowReportModal(false);
                }}
              >
                Proceed →
              </ProceedButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Log Work Modal */}
      {showLogWorkModal && selectedContractor && (
        <ModalOverlay onClick={() => setShowLogWorkModal(false)}>
          <LogWorkModalContent onClick={(e) => e.stopPropagation()}>
            <LogWorkModalHeader>
              <LogWorkModalTitle>Log Work</LogWorkModalTitle>
              <LogWorkCloseButton onClick={() => setShowLogWorkModal(false)}>
                ✕
              </LogWorkCloseButton>
            </LogWorkModalHeader>

            <FormGroup>
              <Label>Contractor Name</Label>
              <DisabledInput value={selectedContractor.name} disabled />
            </FormGroup>

            <FormGroup>
              <Label>Contractor ID</Label>
              <DisabledInput value={selectedContractor.contractorId} disabled />
            </FormGroup>

            <FormGroup>
              <Label>Branch</Label>
              <Select>
                <option value="">Select Branch</option>
                <option value="headquarters">Headquarters</option>
                <option value="north">North Region</option>
              </Select>
            </FormGroup>

            <LogWorkModalButtons>
              <CancelModalButton onClick={() => setShowLogWorkModal(false)}>
                Close
              </CancelModalButton>
              <EnterWorkLogButton onClick={() => {
                // Navigate to add work entry page
                navigate("/admin/contractors/add-work-entry", {
                  state: { contractor: selectedContractor }
                });
                setShowLogWorkModal(false);
              }}>
                Enter Work-Log →
              </EnterWorkLogButton>
            </LogWorkModalButtons>
          </LogWorkModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1rem;
  background: #F5F7FA;
  min-height: 100vh;
`;

// Loading, Error, Empty States
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  margin-top: 2rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #E5E7EB;
  border-top: 4px solid #066C78;
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
  min-height: 400px;
  background: white;
  border-radius: 8px;
  margin-top: 2rem;
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
  background: #066C78;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.25s ease;

  &:hover {
    background: #055B65;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  margin-top: 2rem;
  padding: 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const EmptySubtext = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    gap: 0.75rem;
  }
`;

const ReportsButton = styled.button`
  padding: 0.7rem 1.25rem;
  border: 1px solid #066C78;
  background: #EDF6F9;
  color: #066C78;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #EDF6F9;
  }
`;

const ButtonIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const AddButton = styled.button`
  padding: 0.7rem 1.5rem;
  background: #066C78;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.25s ease;

  &:hover {
    background: #055B65;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const Card = styled.div`
  background: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  border-top: 3px solid #066C78;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const CardTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`;

const AvatarWithInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${(props) => props.$bg};
  color: ${(props) => props.$textColor};
  font-weight: 700;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: "Inter", sans-serif;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-top: 0.1rem;
`;

const Name = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const Role = styled.p`
  font-size: 0.75rem;
  color: #999;
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const DeleteIcon = styled.img`
  width: 18px;
  height: 18px;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Tags = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 0.3rem 0.7rem;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
`;

const DateSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PaymentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.8rem;
  background: #f1f7ffff;
  border-radius: 6px;
`;

const PaymentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const PaymentLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const PaymentIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const PaymentText = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.$color};
  font-family: "Inter", sans-serif;
  font-weight: 600;
`;

const PaymentAmount = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${(props) => props.$color};
  font-family: "Inter", sans-serif;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LogButton = styled.button`
  flex: 1;
  padding: 0.5rem 0.6rem;
  background: #066C78;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;

  &:hover {
    background: #055B65;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const IconImage = styled.img`
  width: 14px;
  height: 14px;
  filter: brightness(0) invert(1);
`;

const PayButton = styled.button`
  flex: 1;
  padding: 0.5rem 0.6rem;
  background: white;
  color: #066C78;
  border: 2px solid #066C78;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;

  &:hover {
    background: #EDF6F9;
    border-color: #055B65;
  }

  &:active {
    transform: scale(0.98);
  }
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
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 1.5rem 0;
  font-family: "Inter", sans-serif;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #222;
  font-family: "Inter", sans-serif;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #066C78;
    box-shadow: 0 0 0 3px rgba(6, 108, 120, 0.1);
  }

  option {
    padding: 0.5rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #066C78;
    box-shadow: 0 0 0 3px rgba(6, 108, 120, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const CancelModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  color: #222;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
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

const ProceedButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #066C78;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #055B65;
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Log Work Modal Styled Components
const LogWorkModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
`;

const LogWorkModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const LogWorkModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const LogWorkCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

const DisabledInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #E7E7E7;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  background: #F5F5F5;
  color: #333;
  cursor: not-allowed;
  font-weight: 500;
`;

const LogWorkModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 2rem;
`;

const EnterWorkLogButton = styled.button`
  padding: 0.75rem 2rem;
  background: #066C78;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #055B65;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default Contractors;
