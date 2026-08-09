import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const AddContractor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profilePhoto: null,
    profilePhotoName: "",
    contractorId: "",
    contractorName: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    phoneNumber: "",
    emailAddress: "",
    workAddress: "",
    address: "",
    city: "",
    country: "",
    state: "",
    pinCode: "",
    country2: "",
    aadharNumber: "",
    aadharFile: null,
    aadharFileName: "",
    bankCardNumber: "",
    panFile: null,
    panFileName: "",
    emergencyContacts: [
      {
        id: 1,
        name: "",
        phone: "",
        relation: "",
        address: "",
        city: "",
        country: "",
        state: "",
        pinCode: "",
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePhoto: file,
        profilePhotoName: file.name,
      });
    }
  };

  const handleAadharUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        aadharFile: file,
        aadharFileName: file.name,
      });
    }
  };

  const handlePanUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        panFile: file,
        panFileName: file.name,
      });
    }
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index][field] = value;
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const handleAddMoreContact = () => {
    const newContact = {
      id: formData.emergencyContacts.length + 1,
      name: "",
      phone: "",
      relation: "",
      address: "",
      city: "",
      country: "",
      state: "",
      pinCode: "",
    };
    setFormData({
      ...formData,
      emergencyContacts: [...formData.emergencyContacts, newContact],
    });
  };

  const handleRemoveContact = (index) => {
    const newContacts = formData.emergencyContacts.filter((_, i) => i !== index);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call here to save contractor
    // After successful save, redirect to work & job details
    navigate("/admin/contractors/work-job-details");
  };

  const handleCancel = () => {
    navigate("/admin/contractors/contractors");
  };

  return (
    <Container>
      <PageHeader>
        <HeaderLeft>
          <Title>Add New Contractor</Title>
          <Subtitle>Fill in the details to add a new contractor to the database</Subtitle>
        </HeaderLeft>
      </PageHeader>

      <FormContainer onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <FormSection>
          <SectionHeader>
            <SectionTitle>Personal Information</SectionTitle>
          </SectionHeader>

          <PhotoUploadArea>
            <PhotoPlaceholder>
              {formData.profilePhotoName ? "✓" : "📷"}
            </PhotoPlaceholder>
            <PhotoInfo>
              <UploadText>Upload Photo</UploadText>
              <UploadSubtext>
                {formData.profilePhotoName
                  ? `Selected: ${formData.profilePhotoName}`
                  : "Recommended size 200 x 200px (Min 100 x 100px)"}
              </UploadSubtext>
              <FileInput
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                hidden
                id="photo-upload"
              />
              <UploadLabel htmlFor="photo-upload">
                {formData.profilePhotoName ? "Change Photo" : "Choose File"}
              </UploadLabel>
            </PhotoInfo>
          </PhotoUploadArea>

          <FormGrid>
            <FormGroup>
              <Label>Contractor ID</Label>
              <Input
                type="text"
                name="contractorId"
                placeholder="C12-0001"
                value={formData.contractorId}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Contractor Name</Label>
              <Input
                type="text"
                name="contractorName"
                placeholder="Enter full name"
                value={formData.contractorName}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Gender</Label>
              <Select name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Age</Label>
              <Input
                type="number"
                name="age"
                placeholder="Auto-calculated"
                value={formData.age}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                name="phoneNumber"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                name="emailAddress"
                placeholder="contractor@email.com"
                value={formData.emailAddress}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup fullWidth>
              <Label>Work Address</Label>
              <Input
                type="text"
                name="workAddress"
                placeholder="Paste your work address"
                value={formData.workAddress}
                onChange={handleInputChange}
              />
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Address Details Section */}
        <FormSection>
          <SectionTitle>Address Details</SectionTitle>
          <hr />

          <FormGrid>
            <FormGroup fullWidth>
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                placeholder="Street address, PO box, etc."
                value={formData.address}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                placeholder="City name"
                value={formData.city}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Country</Label>
              <Input
                type="text"
                name="country"
                placeholder="India"
                value={formData.country}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>State</Label>
              <Input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Pin Code</Label>
              <Input
                type="text"
                name="pinCode"
                placeholder="Postal code"
                value={formData.pinCode}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Country 2</Label>
              <Select name="country2" value={formData.country2} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="India">India</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Emergency Contact Information - Red Border */}
        {formData.emergencyContacts.map((contact, index) => (
          <EmergencySection key={contact.id}>
            <EmergencySectionHeader>
              <SectionTitle>
                Emergency Contact Information {formData.emergencyContacts.length > 1 && `#${index + 1}`}
              </SectionTitle>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {formData.emergencyContacts.length > 1 && (
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemoveContact(index)}
                  >
                    🗑 Remove
                  </RemoveButton>
                )}
                {index === formData.emergencyContacts.length - 1 && (
                  <AddMoreButton
                    type="button"
                    onClick={handleAddMoreContact}
                  >
                    + Add More Contact
                  </AddMoreButton>
                )}
              </div>
            </EmergencySectionHeader>

            <FormGrid>
              <FormGroup>
                <Label>Contact Name</Label>
                <Input
                  type="text"
                  placeholder="Contact name"
                  value={contact.name}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "name", e.target.value)
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={contact.phone}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "phone", e.target.value)
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Relation</Label>
                <Input
                  type="text"
                  placeholder="eg. Brother, Sister"
                  value={contact.relation}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "relation", e.target.value)
                  }
                />
              </FormGroup>

              <FormGroup fullWidth>
                <Label>Address</Label>
                <Input
                  type="text"
                  placeholder="Contact address"
                  value={contact.address}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "address", e.target.value)
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>City</Label>
                <Input
                  type="text"
                  placeholder="City name"
                  value={contact.city}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "city", e.target.value)
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Country</Label>
                <Select
                  value={contact.country}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "country", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="India">India</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>State</Label>
                <Input
                  type="text"
                  placeholder="State"
                  value={contact.state}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "state", e.target.value)
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Pin Code</Label>
                <Input
                  type="text"
                  placeholder="Postal code"
                  value={contact.pinCode}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "pinCode", e.target.value)
                  }
                />
              </FormGroup>
            </FormGrid>
          </EmergencySection>
        ))}

        {/* Documents Section */}
        <FormSection>
          <SectionTitle>Documents</SectionTitle>
          <hr /><br />

          <DocumentsGrid>
            <FormGroup>
              <Label>Aadhar Card Number</Label>
              <Input
                type="text"
                name="aadharNumber"
                placeholder="Enter 12 digit number"
                value={formData.aadharNumber}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Aadhar File</Label>
              <FileInput
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleAadharUpload}
                hidden
                id="aadhar-upload"
              />
              <CompactUploadButton as="label" htmlFor="aadhar-upload">
              
                {formData.aadharFileName ? `✓` : "Upload"}
              </CompactUploadButton>
              {formData.aadharFileName && (
                <CompactFileNameDisplay>{formData.aadharFileName}</CompactFileNameDisplay>
              )}
            </FormGroup>

            <FormGroup>
              <Label>PAN Card Number</Label>
              <Input
                type="text"
                name="bankCardNumber"
                placeholder="Enter PAN number"
                value={formData.bankCardNumber}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>PAN File</Label>
              <FileInput
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handlePanUpload}
                hidden
                id="pan-upload"
              />
              <CompactUploadButton as="label" htmlFor="pan-upload">
               
                {formData.panFileName ? `✓` : "Upload"}
              </CompactUploadButton>
              {formData.panFileName && (
                <CompactFileNameDisplay>{formData.panFileName}</CompactFileNameDisplay>
              )}
            </FormGroup>
          </DocumentsGrid>
        </FormSection>

        {/* Action Buttons */}
        <FormActions>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          <SubmitButton type="submit">Next →</SubmitButton>
        </FormActions>
      </FormContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 2rem;
  background: #F5F7FA;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
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

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const EmergencySection = styled(FormSection)`
  border: 1px solid #DC2626;
 
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const EmergencySectionHeader = styled(SectionHeader)``;

const AddMoreButton = styled.button`
  padding: 0.6rem 1rem;
  background: #DC2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #B91C1C;
  }
`;

const RemoveButton = styled.button`
  padding: 0.6rem 1rem;
  background: #DC2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #B91C1C;
  }
`;

const PhotoUploadArea = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #F9F9F9;
  border-radius: 8px;
  border: 1px dashed #D1D5DB;
`;

const PhotoPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: #E0E7FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`;

const PhotoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UploadText = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const UploadSubtext = styled.p`
  font-size: 0.8rem;
  color: #888;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const FileInput = styled.input``;

const UploadLabel = styled.label`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: white;
  color: #066C78;
  border: 2px solid #066C78;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  width: fit-content;
  transition: all 0.2s;

  &:hover {
    background: #EDF6F9;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: ${(props) => (props.fullWidth ? "1 / -1" : "auto")};
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #222;
  font-family: "Inter", sans-serif;
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

const UploadButton = styled.button`
  padding: 0.6rem 1rem;
  background: white;
  color: #066C78;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 50%;
  justify-content: center;
  margin-top: 0.5rem;

  &:hover {
    background: #EDF6F9;
    border-color: #066C78;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const FileNameDisplay = styled.p`
  font-size: 0.75rem;
  color: #16A34A;
  margin: 0.5rem 0 0 0;
  padding: 0.4rem 0.6rem;
  background: #ECFDF5;
  border-radius: 4px;
  border-left: 3px solid #16A34A;
  font-weight: 500;
  font-family: "Inter", sans-serif;
`;

const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CompactUploadButton = styled.label`
  padding: 0.6rem 0.8rem;
  background: white;
  color: #066C78;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;

  &:hover {
    background: #EDF6F9;
    border-color: #066C78;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CompactFileNameDisplay = styled.p`
  font-size: 0.65rem;
  color: #16A34A;
  margin: 0.3rem 0 0 0;
  padding: 0.3rem 0.4rem;
  background: #ECFDF5;
  border-radius: 4px;
  border-left: 2px solid #16A34A;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
`;

const CancelButton = styled.button`
  padding: 0.8rem 2rem;
  background: white;
  color: #222;
  border: 2px solid #D1D5DB;
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

const SubmitButton = styled.button`
  padding: 0.8rem 2rem;
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

export default AddContractor;
