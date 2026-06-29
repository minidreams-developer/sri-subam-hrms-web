import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import deleteIcon from "../../assets/contractor/SVG.svg";
import clockIcon from "../../assets/contractor/iconify-icon.svg";
import earnedPayIcon from "../../assets/contractor/iconify-icon (1).svg";
import advanceIcon from "../../assets/contractor/iconify-icon (2).svg";
import reportIcon from "../../assets/contractor/SVG (1).svg";

const Contractors = () => {
  const navigate = useNavigate();
  const [contractors] = useState([
    {
      id: 1,
      initial: "S",
      name: "Safeq",
      role: "itboomi",
      specialization: ["HVAC", "Active"],
      specialColors: ["#0047AB", "#16A34A"],
      date: "Friday\n10/April/2026",
      todayPay: "$0.00",
      earnedPay: "$0.00",
      advanceReceived: "$0.00",
      avatarBg: "#E0E7FF",
      avatarTextColor: "#0047AB",
    },
    {
      id: 2,
      initial: "RC",
      name: "Rathna Kurrar",
      role: "Carpenter",
      specialization: ["Carpentry", "Active"],
      specialColors: ["#16A34A", "#16A34A"],
      date: "Friday\n15/Aug/2026",
      todayPay: "$5.00",
      earnedPay: "$5.00",
      advanceReceived: "$0.00",
      avatarBg: "#E0E7FF",
      avatarTextColor: "#16A34A",
    },
    {
      id: 3,
      initial: "A",
      name: "Arjun",
      role: "Electrician",
      specialization: ["Plumbing", "Active"],
      specialColors: ["#DC2626", "#16A34A"],
      date: "Friday\n16/Aug/2020",
      todayPay: "$0.99",
      earnedPay: "$0.98",
      advanceReceived: "$0.98",
      avatarBg: "#E0E7FF",
      avatarTextColor: "#DC2626",
    },
  ]);

  return (
    <Container>
      <PageHeader>
        <HeaderContent>
          <HeaderLeft>
            <Title>Contractors</Title>
            <Subtitle>Manage your contractor database</Subtitle>
          </HeaderLeft>
          <HeaderRight>
            <ReportsButton>
              <ButtonIcon src={reportIcon} alt="reports" />
              Reports
            </ReportsButton>
            <AddButton onClick={() => navigate("/admin/contractors/add")}>
              + Add Contractor
            </AddButton>
          </HeaderRight>
        </HeaderContent>
      </PageHeader>

      <CardsGrid>
        {contractors.map((contractor) => (
          <Card key={contractor.id}>
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
                <PaymentLabel $color="#0047AB">
                  <PaymentIcon src={clockIcon} alt="clock" />
                  <PaymentText $color="#0047AB">Today's Pay</PaymentText>
                </PaymentLabel>
                <PaymentAmount $color="#0047AB">{contractor.todayPay}</PaymentAmount>
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

            <ActionButtons>
              <LogButton>
                <IconImage src={clockIcon} alt="clock" />
                Log Work
              </LogButton>
              <PayButton>₹ Pay</PayButton>
            </ActionButtons>
          </Card>
        ))}
      </CardsGrid>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1rem;
  background: #F5F7FA;
  min-height: 100vh;
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
  border: 1px solid #0047AB;
  background: #F0F5FF;
  color: #0047AB;
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
    background: #F0F5FF;
  }
`;

const ButtonIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const AddButton = styled.button`
  padding: 0.7rem 1.5rem;
  background: #0047AB;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.25s ease;

  &:hover {
    background: #003580;
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
  border-top: 3px solid #0047AB;

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

const DateText = styled.p`
  font-size: 0.75rem;
  color: #333;
  margin: 0;
  white-space: pre-line;
  line-height: 1.3;
  font-family: "Inter", sans-serif;
  font-weight: 500;
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
  background: #0047AB;
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
    background: #003580;
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
  color: #0047AB;
  border: 2px solid #0047AB;
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
    background: #F0F5FF;
    border-color: #003580;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default Contractors;
