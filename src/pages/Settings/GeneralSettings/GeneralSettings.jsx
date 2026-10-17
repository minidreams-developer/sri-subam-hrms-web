import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SampleProfile from "../../../assets/images/employee/sampleProfile.jpg";
import EditIcon from "../../../assets/images/employee/edit-05_svgrepo.com.svg";
import theme from "../../../theme/theme";
import { getOrganizations } from "../../../services/apiServices";
import { toast } from "react-toastify";

const GeneralSettings = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      const response = await getOrganizations();
      // Handle API response with results array
      if (response && response.results && Array.isArray(response.results) && response.results.length > 0) {
        const org = response.results[0];
        setProfileData({
          id: org.id || org._id,
          companyName: org.companyName || "",
          email: org.email || "",
          mobileNumber: org.phone || "",
          gst: org.gst || "",
          pan: org.pan || "",
          tan: org.tan || "",
          organizationLogo: org.organizationLogo || "",
          address1: org.address?.addressLine1 || "",
          address2: org.address?.addressLine2 || "",
          city: org.address?.city || "",
          state: org.address?.state || "",
          zipCode: org.address?.pincode || "",
          country: org.address?.country || "",
        });
      } else if (Array.isArray(response) && response.length > 0) {
        const org = response[0];
        setProfileData({
          id: org.id || org._id,
          companyName: org.companyName || "",
          email: org.email || "",
          mobileNumber: org.phone || "",
          gst: org.gst || "",
          pan: org.pan || "",
          tan: org.tan || "",
          organizationLogo: org.organizationLogo || "",
          address1: org.address?.addressLine1 || "",
          address2: org.address?.addressLine2 || "",
          city: org.address?.city || "",
          state: org.address?.state || "",
          zipCode: org.address?.pincode || "",
          country: org.address?.country || "",
        });
      } else if (response && typeof response === "object") {
        const org = response;
        setProfileData({
          id: org.id || org._id,
          companyName: org.companyName || "",
          email: org.email || "",
          mobileNumber: org.phone || "",
          gst: org.gst || "",
          pan: org.pan || "",
          tan: org.tan || "",
          organizationLogo: org.organizationLogo || "",
          address1: org.address?.addressLine1 || "",
          address2: org.address?.addressLine2 || "",
          city: org.address?.city || "",
          state: org.address?.state || "",
          zipCode: org.address?.pincode || "",
          country: org.address?.country || "",
        });
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
      toast.error("Failed to load organization details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const handleEditPicture = () => {
    navigate("/admin/settings/organizationDetails", {
      state: { organization: profileData },
    });
  };

  if (loading) {
    return (
      <Container>
        <Section>
          <LoadingText>Loading...</LoadingText>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        {/* Personal Information */}
        <SubSection>
          <SectionHeader>
            <SectionTitle>Personal Information</SectionTitle>
            <EditPictureButton type="button" onClick={handleEditPicture}>
              <img src={EditIcon} alt="edit" width="16" height="16" />
              Edit
            </EditPictureButton>
          </SectionHeader>
          <PersonalInfoCard>
            <LeftSection>
              <ProfileImage src={profileData?.organizationLogo || SampleProfile} alt="Organization logo" />
            </LeftSection>
            <RightSection>
              <InfoGrid>
                <InfoItem>
                  <Label>Company Name</Label>
                  <Value>{profileData?.companyName || "N/A"}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Email</Label>
                  <Value>{profileData?.email || "N/A"}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Mobile Number</Label>
                  <Value>{profileData?.mobileNumber || "N/A"}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>GST</Label>
                  <Value>{profileData?.gst || "N/A"}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>PAN</Label>
                  <Value>{profileData?.pan || "N/A"}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>TAN</Label>
                  <Value>{profileData?.tan || "N/A"}</Value>
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
                <Value>{profileData?.address1 || "N/A"}</Value>
              </AddressItem>
              <AddressItem>
                <Label>Address 2</Label>
                <Value>{profileData?.address2 || "N/A"}</Value>
              </AddressItem>
              <AddressItem>
                <Label>City</Label>
                <Value>{profileData?.city || "N/A"}</Value>
              </AddressItem>
              <AddressItem>
                <Label>State</Label>
                <Value>{profileData?.state || "N/A"}</Value>
              </AddressItem>
              <AddressItem>
                <Label>ZIP Code</Label>
                <Value>{profileData?.zipCode || "N/A"}</Value>
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

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  width: auto;
  min-width: 86px;
  padding: 0 1rem;
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

const LoadingText = styled.div`
  font-size: 1rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  text-align: center;
  padding: 2rem;
`;
