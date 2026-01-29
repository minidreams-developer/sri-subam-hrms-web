import React from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import UserIcon from "../../../assets/images/employee/uprofileIcon.svg";
import EditIcon from "../../../assets/images/employee/editIcon.svg";
import EditIconLight from "../../../assets/images/employee/edit-05_svgrepo.com.svg";
import SampleProfile from "../../../assets/images/employee/sampleProfile.jpg";
import CardDetails from "../../../components/CardDetails";
import CardDetailsAlt from "../../../components/CardDetailsAlt";
import FileUploadComponent from "../../../components/FileUploadComponent";

export const PersonalDetails = () => {
  const details = {
    fullName: "Manoj Kumar",
    employeeId: "#ST5683",
    employeeType: "Full Time",
    gender: "Male",
    dob: "20-09-1999",
    age: "31 Years",
    contact: "+91 9500827645",
    email: "designedbymanoj@gmail.com",
    maritalStatus: "Married",
    motherTongue: "Tamil",
    identificationMark: "Small mole on right cheek",
  };

  return (
    <Wrapper>
      <HeaderRow>
        <LeftHead>
          <IconWrap>
            <Icon src={UserIcon} alt="user" />
          </IconWrap>
          <Title>Personal Details</Title>
        </LeftHead>
        <EditBtn>
          <img src={EditIcon} alt="edit" width="16" height="16" />
          Edit details
        </EditBtn>
      </HeaderRow>

      <SectionTitle>Personal Information</SectionTitle>

      <Card>
        <ProfileCol>
          <ProfileImage src={SampleProfile} alt="profile" />
          <EditPictureBtn>
            <img src={EditIconLight} alt="edit" width="16" height="16" />
            Edit Picture
          </EditPictureBtn>
        </ProfileCol>

        <InfoGrid>
          <InfoItem>
            <Label>Full Name</Label>
            <Value>{details.fullName}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Employee ID</Label>
            <Value>{details.employeeId}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Employee Type</Label>
            <Value>{details.employeeType}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Gender</Label>
            <Value>{details.gender}</Value>
          </InfoItem>
          <InfoItem>
            <Label>DOB</Label>
            <Value>{details.dob}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Age</Label>
            <Value>{details.age}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Contact</Label>
            <Value>{details.contact}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Email</Label>
            <Value>{details.email}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Marital Status</Label>
            <Value>{details.maritalStatus}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Mother Tongue</Label>
            <Value>{details.motherTongue}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Identification Mark</Label>
            <Value>{details.identificationMark}</Value>
          </InfoItem>
        </InfoGrid>
      </Card>

      <CardDetails
        title="Address Information"
        columns={3}
        items={[
          { label: "Address 1", value: details.fullName },
          { label: "Address 2", value: details.email },
          { label: "City", value: "Tirupur" },
          { label: "State", value: "Tamil Nadu" },
          { label: "ZIP Code", value: "641666" },
        ]}
      />
      <CardDetails
        title="Emergency Contact"
        columns={3}
        items={[
          { label: "Emergency Contact Name", value: details.fullName },
          { label: "Relationship", value: details.email },
          { label: "Mobile Number", value: "8987676756" },
        ]}
      />
      <CardDetailsAlt title="Documents" columns={3}>
        <FileUploadComponent label="Aadhaar" />
        <FileUploadComponent label="PAN Card" />
        <FileUploadComponent label="Address Proof" />
      </CardDetailsAlt>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border-radius: 12px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  padding: 1rem;
`;

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftHead = styled.div`
  display: flex;
  align-items: center;
  gap: 1.125rem;
`;

const IconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem;
  border-radius: 6px;
  background: ${theme.colors.secondaryPrimary};
`;

const Icon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  line-height: 160%;
  margin: 0;
`;

const EditBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  height: 40px;
  padding: 0 0.875rem;
  background: ${theme.colors.secondaryPrimary};
  border: none;
  border-radius: 0.5rem;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
`;

const SectionTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0 0 0 0;
`;

const Card = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  border-radius: 12px;
  background: #edf6f966;
  border: 1px solid ${theme.colors.border};
  padding: 0.875rem;
`;

const ProfileCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.063rem;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 194px;
  border-radius: 12px;
  object-fit: cover;
  box-sizing: border-box;
`;

const EditPictureBtn = styled.button`
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 1.5rem 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
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
