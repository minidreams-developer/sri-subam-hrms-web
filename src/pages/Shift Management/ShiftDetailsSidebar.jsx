import React from "react";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import theme from "../../theme/theme";
import CardDetails from "../../components/CardDetails";
import EditIcon from "../../assets/images/employee/editIcon.svg";

const ShiftDetailsSidebar = ({ open, onClose, data }) => {
  return (
    <>
      <Overlay $open={open} onClick={onClose} />
      <Container $open={open}>
        <Header>
          <Title>Shift Details</Title>
          <CloseBtn onClick={onClose}>
            <MdClose size={24} color={theme.colors.textColor} />
          </CloseBtn>
        </Header>

        <ScrollContent>
          <Section>
            <CardDetails
              title="Basic Details"
              columns={2}
              items={[
                { label: "Name", value: data?.shiftName || "General" },
                { label: "Shift Code", value: data?.shiftCode || "#GEN-01" },
                {
                  label: "Status",
                  value: (
                    <StatusText $status={data?.status || "Active"}>
                      {data?.status || "Active"}
                    </StatusText>
                  ),
                },
              ]}
            />
          </Section>

          <Section>
            <CardDetails
              title="Shift Timing Information"
              columns={2}
              items={[
                {
                  label: "Shift Type",
                  value: data?.shifttype || "Rotational",
                },
                { label: "Start Time", value: data?.startTime || "10:30 AM" },
                { label: "End Time", value: data?.endTime || "07:30 PM" },
                {
                  label: "Total Shift Duration",
                  value: data?.workingHours || "9.00 Hrs",
                },
                { label: "Minimum working hours", value: "5.00 Hrs" },
                { label: "Grace Period (Early check-in)", value: "20 Min" },
                { label: "Grace Period (Late check-in)", value: "15 Min" },
                { label: "Grace Period (Early check-out)", value: "10 Min" },
              ]}
            />
          </Section>

          <Section>
            <CardWrapper>
              <CardHead>
                <CardTitle>Break Management</CardTitle>
              </CardHead>
              <CardPanel>
                <CardGrid $cols={2}>
                  <InfoItem>
                    <Label>Break Type</Label>
                    <Value>Flexible</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>Total Break duration</Label>
                    <Value>1.30 Hrs</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>Multiple breaks support</Label>
                    <Value>Yes</Value>
                  </InfoItem>
                </CardGrid>
                <BreakTitle>Break 1</BreakTitle>
                <CardGrid $cols={2}>
                  <InfoItem>
                    <Label>Name</Label>
                    <Value>Morning Tea Break</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>Break duration</Label>
                    <Value>15 min</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>Start Time</Label>
                    <Value>12:30 AM</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>End Time</Label>
                    <Value>12:45PM</Value>
                  </InfoItem>
                </CardGrid>
              </CardPanel>
            </CardWrapper>
          </Section>

          <Section>
            <CardDetails
              title="Attendance Rules Linked to Shift"
              columns={2}
              items={[
                { label: "Late mark after", value: "20 Min" },
                {
                  label: "Auto half-day after X mins late",
                  value: "1.30 Hrs",
                },
                {
                  label: "Auto absent if working hours < X",
                  value: "4 Hrs",
                },
                { label: "Overtime eligibility", value: "Yes" },
              ]}
            />
          </Section>

          {/* Section removed */}

          {/* Re-doing Weekly Pattern to match mixed column layout */}
          <Section>
            <CardWrapper>
              <CardHead>
                <CardTitle>Weekly Pattern & Working Days</CardTitle>
              </CardHead>
              <CardPanel>
                <CardGrid $cols={1}>
                  <InfoItem>
                    <Label>Fixed days</Label>
                    <Value>Mon, Tue, Wed, Fri, Sat, Sun</Value>
                  </InfoItem>
                </CardGrid>
                <Spacer />
                <CardGrid $cols={2}>
                  <InfoItem>
                    <Label>Fixed days</Label>
                    <Value>Mon, Tue, Wed, Fri, Sat, Sun</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>Week Off</Label>
                    <Value>Thursday</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>Working on holiday</Label>
                    <Value>Yes</Value>
                  </InfoItem>
                  <InfoItem>
                    <Label>Comp-off</Label>
                    <Value>No</Value>
                  </InfoItem>
                </CardGrid>
              </CardPanel>
            </CardWrapper>
          </Section>
        </ScrollContent>

        <Footer>
          <EditButton>
            <img src={EditIcon} alt="edit" width="16" height="16" />
            Edit details
          </EditButton>
        </Footer>
      </Container>
    </>
  );
};

export default ShiftDetailsSidebar;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 998;
  display: ${({ $open }) => ($open ? "block" : "none")};
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 584px;
  height: 100vh;
  background: ${theme.colors.white};
  z-index: 999;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.textColor};
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.5rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusText = styled.span`
  color: ${({ $status }) => {
    const s = String($status).toLowerCase();
    if (s === "active") return "#16a34a"; // Green
    if (s === "inactive") return "#dc2626"; // Red
    return theme.colors.textColor;
  }};
  font-weight: 600;
`;

// --- Custom Card Styles matching CardDetails.jsx ---
const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0 0 0.5rem 0;
`;

const CardTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const CardPanel = styled.div`
  width: 100%;
  background: #edf6f966;
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  padding: 1rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols || 3}, minmax(150px, 1fr));
  gap: 1rem 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  line-height: 160%;
  color: ${theme.colors.secondaryTextColor};
`;

const Value = styled.span`
  font-size: 1rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  line-height: 160%;
  color: ${theme.colors.textColor};
`;

const BreakTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin: 1.5rem 0 1rem 0;
  font-family: "Inter-SemiBold", sans-serif;
`;

const Spacer = styled.div`
  height: 1rem;
`;

const Footer = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${theme.colors.border};
  background: ${theme.colors.white};
  display: flex;
  justify-content: center;
`;

const EditButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.primary};
  border-radius: 8px;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;

  &:hover {
    background: ${theme.colors.secondaryWhite};
  }
`;
