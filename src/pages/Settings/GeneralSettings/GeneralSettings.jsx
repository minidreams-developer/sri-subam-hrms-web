import { useState } from "react";
import styled from "styled-components";
import SampleProfile from "../../../assets/images/employee/sampleProfile.jpg";
import EditIcon from "../../../assets/images/employee/edit-05_svgrepo.com.svg";
import theme from "../../../theme/theme";

const GeneralSettings = () => {
  const [profileData] = useState({
    companyName: "Manoj Kumar",
    email: "designedbymanoj@gmail.com",
    mobileNumber: "+91 9500827645",
    gst: "Male",
    pan: "20-09-1999",
    tan: "31 Years",
    address1: "123/3 1st Floor",
    address2: "Agasthiyar street, Tango Colony,",
    city: "Tirupur",
    state: "Tamil Nadu",
    zipCode: "641666",
  });

  const handleEditPicture = () => {
    console.log("Edit picture clicked");
  };

  return (
    <Container>
      <Section>
        {/* Personal Information */}
        <SubSection>
          <SectionTitle>Personal Information</SectionTitle>
          <PersonalInfoCard>
            <LeftSection>
              <ProfileImage src={SampleProfile} alt="Profile" />
              <EditPictureButton onClick={handleEditPicture}>
                <img src={EditIcon} alt="edit" width="16" height="16" />
                Edit Picture
              </EditPictureButton>
            </LeftSection>
            <RightSection>
              <InfoGrid>
                <InfoItem>
                  <Label>Company Name</Label>
                  <Value>{profileData.companyName}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Email</Label>
                  <Value>{profileData.email}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Mobile Number</Label>
                  <Value>{profileData.mobileNumber}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>GST</Label>
                  <Value>{profileData.gst}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>PAN</Label>
                  <Value>{profileData.pan}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>TAN</Label>
                  <Value>{profileData.tan}</Value>
                </InfoItem>
              </InfoGrid>
            </RightSection>
          </PersonalInfoCard>
        </SubSection>

        {/* Address Information */}
        <SubSection>
          <SectionTitle>Address Information</SectionTitle>
          <AddressCard>
            <AddressGrid>
              <AddressItem>
                <Label>Address 1</Label>
                <Value>{profileData.address1}</Value>
              </AddressItem>
              <AddressItem>
                <Label>Address 2</Label>
                <Value>{profileData.address2}</Value>
              </AddressItem>
              <AddressItem>
                <Label>City</Label>
                <Value>{profileData.city}</Value>
              </AddressItem>
              <AddressItem>
                <Label>State</Label>
                <Value>{profileData.state}</Value>
              </AddressItem>
              <AddressItem>
                <Label>ZIP Code</Label>
                <Value>{profileData.zipCode}</Value>
              </AddressItem>
            </AddressGrid>
          </AddressCard>
        </SubSection>
      </Section>
    </Container>
  );
};

export default GeneralSettings;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.25rem;
`;

const SubSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const PersonalInfoCard = styled.div`
  display: flex;
  gap: 2rem;
  background: #edf6f966;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ProfileImage = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const EditPictureButton = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 0.5rem;
  background: ${theme.colors.primary};
  color: #edf6f9;
  font-size: 12px;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const RightSection = styled.div`
  flex: 1;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.span`
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.secondaryTextColor};
`;

const Value = styled.span`
  font-size: 1rem;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  word-break: break-word;
`;

const AddressCard = styled.div`
  display: flex;
  flex-direction: column;
  background: #edf6f966;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AddressItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
