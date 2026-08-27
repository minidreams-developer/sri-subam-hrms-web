import React from "react";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import theme from "../../theme/theme";
import CardDetails from "../../components/CardDetails";
import EditIcon from "../../assets/images/employee/editIcon.svg";
import Switch from "react-switch";

const BranchDetailsSidebar = ({ open, onClose, data, onEdit }) => {
  const [isPrimary, setIsPrimary] = React.useState(data?.isPrimary || false);

  React.useEffect(() => {
    setIsPrimary(Boolean(data?.isPrimary));
  }, [data]);

  return (
    <>
      <Overlay $open={open} onClick={onClose} />
      <Container $open={open}>
        <Header>
          <Title>Branch Details</Title>
          <CloseBtn onClick={onClose}>
            <MdClose size={24} color={theme.colors.textColor} />
          </CloseBtn>
        </Header>

        <ScrollContent>
          <PrimarySection>
            <PrimaryLabel>Primary Branch</PrimaryLabel>
            <Switch
              checked={isPrimary}
              onChange={setIsPrimary}
              onColor={theme.colors.primary}
              offColor="#ccc"
              height={22}
              width={40}
              handleDiameter={18}
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </PrimarySection>

          <Section>
            <SectionHeader>
              <SectionTitle>Basic Details</SectionTitle>
              {isPrimary && <PrimaryBadge>(Primary)</PrimaryBadge>}
            </SectionHeader>
            <CardDetails
              columns={2}
              items={[
                { label: "Name", value: data?.branchName || "Branch 1" },
                { label: "Branch Type", value: data?.branchType || "Head Office" },
                {
                  label: "Branch Status",
                  value: (
                    <StatusText $status={data?.status || "Active"}>
                      {data?.status || "Active"}
                    </StatusText>
                  ),
                },
                { label: "Effective From Date", value: data?.effectiveDate || "20-09-1999" },
              ]}
            />
          </Section>

          <Section>
            <CardDetails
              title="Contact Details"
              columns={2}
              items={[
                { label: "Branch Head", value: data?.branchHead || "Manoj Kumar" },
                { label: "Phone Number", value: data?.phoneNumber || "+91 9500827645" },
                { label: "Emergency Contact Number", value: data?.emergencyContact || "+91 9500827645" },
                { label: "Email", value: data?.email || "testemail@gmail.com" },
              ]}
            />
          </Section>

          <Section>
            <CardDetails
              title="Address & Location Details"
              columns={1}
              items={[
                { 
                  label: "Branch Head", 
                  value: data?.address || "RKM Complex, Kondathukaliamman Temple Road, Perumanallar, Tiruppur Dist-641666" 
                },
                { 
                  label: "Geo Location", 
                  value: data?.geoLocation || "https://www.google.com/maps" 
                },
              ]}
            />
          </Section>

          <Section>
            <CardDetails
              title="Other Details"
              columns={2}
              items={[
                { label: "Total Employees", value: data?.totalEmployees || data?.noOfPeople || "56" },
                { label: "Departments in Branch", value: Array.isArray(data?.departments) ? data.departments.length : data?.departments || "4" },
                { label: "Active Shifts", value: data?.activeShifts || "2" },
                { label: "Managers Assigned", value: data?.managersAssigned || "2" },
              ]}
            />
          </Section>
        </ScrollContent>

        <Footer>
          <EditButton type="button" onClick={(event) => { event.stopPropagation(); onEdit?.(data); }}>
            <img src={EditIcon} alt="edit" width="16" height="16" />
            Edit details
          </EditButton>
        </Footer>
      </Container>
    </>
  );
};

export default BranchDetailsSidebar;

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
  width: min(36.5rem, 100vw);
  height: 100vh;
  background: ${theme.colors.white};
  z-index: 999;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
  }
`;

const Header = styled.div`
  min-height: 4.625rem;
  padding: 1.25rem;
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
  font-family: "Inter_18pt-Medium", sans-serif;
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
  padding: 1.5rem 1.25rem;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

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

const PrimarySection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PrimaryLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter_18pt-SemiBold", sans-serif;
  color: ${theme.colors.primary};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const PrimaryBadge = styled.span`
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  font-size: 10px;
  line-height: 160%;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: 4px 10px;
  border-radius: 4px;
`;

const StatusText = styled.span`
  color: ${({ $status }) => {
    const s = String($status).toLowerCase();
    if (s === "active") return "#16a34a";
    if (s === "inactive" || s === "in-active") return "#dc2626";
    return theme.colors.textColor;
  }};
  font-weight: 600;
`;

const Footer = styled.div`
  padding: 0 1.25rem 1.375rem;
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
