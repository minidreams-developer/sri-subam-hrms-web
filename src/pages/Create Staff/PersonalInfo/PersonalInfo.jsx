import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import InputComponent from "../../../components/InputComponent";
import CalenderInput from "../../../components/CalenderInput";
import Select from "react-select";
import { customSelectStyles } from "../../../theme/reactSelectStyles";
import UploadIcon from "../../../assets/images/employee/upload2.svg";
import { get } from "../../../helpers/api_helper";
import { GENERATE_STAFF_ID } from "../../../helpers/url_helper";
import { stateDistrictMap, stateOptions } from "../../../utils/statesAndDistricts";
import { toast } from "react-toastify";

const createPrefilledStaffData = () => {
  const uniqueValue = String(Date.now());
  const suffix = uniqueValue.slice(-4);

  return {
    employeeType: { value: "full_time", label: "Full Time" },
    staffId: "",
    staffName: `Test Staff ${suffix}`,
    gender: { value: "male", label: "Male" },
    dob: "1995-01-15",
    age: "31",
    contact: uniqueValue.slice(-10),
    email: `staff.${uniqueValue}@example.com`,
    password: "Staff@123",
    maritalStatus: { value: "single", label: "Single" },
    motherTongue: { value: "tamil", label: "Tamil" },
    identificationMark: "Mole on right hand",
    religion: { value: "hindu", label: "Hindu" },
    spokenLanguages: ["tamil", "english"],
    aadhaarImage: null,
    profilePic: "",
    aadharNo: uniqueValue.slice(-12),
    panNo: `TSTAF${suffix}F`,
    address: "No. 10, Test Street",
    addressLine2: "Near Main Road",
    city: "Chengalpattu",
    district: { value: "chengalpattu", label: "Chengalpattu" },
    state: { value: "tamil_nadu", label: "Tamil Nadu" },
    pinCode: "603001",
  };
};

const PersonalInfo = forwardRef((_, ref) => {
  const [formData, setFormData] = useState(createPrefilledStaffData);

  const [staffIdLoading, setStaffIdLoading] = useState(false);

  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      emergencyContact: String(Date.now() + 1).slice(-10),
      emergencyContactName: "Test Emergency Contact",
      relationship: { value: "father", label: "Father" },
    },
  ]);

  // Generate Staff ID on component mount
  useEffect(() => {
    generateStaffId();
  }, []);

  const generateStaffId = async () => {
    setStaffIdLoading(true);
    try {
      const response = await get(GENERATE_STAFF_ID, { skipGlobalLoading: true });
      console.log("Staff ID generated:", response);
      
      // Handle different response structures
      let staffId = "";
      if (typeof response === "string") {
        staffId = response;
      } else if (response?.staffId) {
        staffId = response.staffId;
      } else if (response?.employeeId) {
        staffId = response.employeeId;
      } else if (response?.data) {
        staffId = response.data;
      } else if (response?.id) {
        staffId = response.id;
      }
      
      setFormData((prev) => ({ ...prev, staffId }));
    } catch (error) {
      console.error("Error generating staff ID:", error);
      toast.error("Failed to generate staff ID");
    } finally {
      setStaffIdLoading(false);
    }
  };

  // Expose form data via ref
  useImperativeHandle(ref, () => ({
    formData: { ...formData, emergencyContacts },
  }));

  const employeeTypeOptions = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
  ];

  const religionOptions = [
    { value: "hindu", label: "Hindu" },
    { value: "muslim", label: "Muslim" },
    { value: "christian", label: "Christian" },
    { value: "other", label: "Other" },
  ];

  const motherTongueOptions = [
    { value: "tamil", label: "Tamil" },
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "telugu", label: "Telugu" },
    { value: "kannada", label: "Kannada" },
    { value: "malayalam", label: "Malayalam" },
  ];

  const spokenLanguagesOptions = [
    { value: "tamil", label: "Tamil" },
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "telugu", label: "Telugu" },
    { value: "kannada", label: "Kannada" },
    { value: "malayalam", label: "Malayalam" },
  ];

  const relationshipOptions = [
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "spouse", label: "Spouse" },
    { value: "sibling", label: "Sibling" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile picture must be smaller than 2 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        aadhaarImage: file,
        profilePic: reader.result,
      }));
    };
    reader.onerror = () => toast.error("Could not read the selected image");
    reader.readAsDataURL(file);
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const updated = [...emergencyContacts];
    updated[index][field] = value;
    setEmergencyContacts(updated);
  };

  const handleAddMoreContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { emergencyContact: "", emergencyContactName: "", relationship: null },
    ]);
  };

  const handleRemoveContact = (index) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
    }
  };

  return (
    <Container>
      {/* ── Personal Information ── */}
      <Section>
        <SectionTitle>Personal Information</SectionTitle>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Employee Type</Label>
              <Select
                options={employeeTypeOptions}
                value={formData.employeeType}
                onChange={(v) => handleChange("employeeType", v)}
                placeholder="Select Type"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <InputComponent
              label="Staff ID"
              placeholder="Auto-generated"
              value={formData.staffId}
              onChange={(e) => handleChange("staffId", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              disabled={true}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Staff Name"
              placeholder="Enter Staff Name"
              value={formData.staffName}
              onChange={(e) => handleChange("staffName", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Gender</Label>
              <Select
                options={genderOptions}
                value={formData.gender}
                onChange={(v) => handleChange("gender", v)}
                placeholder="Select Gender"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <CalenderInput
              label="DOB"
              onDateSelect={(date) => handleChange("dob", date)}
              initialDate={formData.dob}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Age"
              placeholder="Enter Age"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Contact"
              placeholder="Enter Contact Number"
              value={formData.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              suffix="+91"
            />
          </Col>
          <Col>
            <InputComponent
              label="Email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Password"
              placeholder="Min 8 chars, 1 letter & 1 number"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              type="password"
            />
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Marital Status</Label>
              <Select
                options={maritalStatusOptions}
                value={formData.maritalStatus}
                onChange={(v) => handleChange("maritalStatus", v)}
                placeholder="Select Marital Status"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Mother Tongue</Label>
              <Select
                options={motherTongueOptions}
                value={formData.motherTongue}
                onChange={(v) => handleChange("motherTongue", v)}
                placeholder="Select Language"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Religion</Label>
              <Select
                options={religionOptions}
                value={formData.religion}
                onChange={(v) => handleChange("religion", v)}
                placeholder="Select Religion"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Identification Mark"
              placeholder="Enter Identification Mark"
              value={formData.identificationMark}
              onChange={(e) => handleChange("identificationMark", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Spoken Languages</Label>
              <Select
                options={spokenLanguagesOptions}
                value={spokenLanguagesOptions.filter((o) =>
                  formData.spokenLanguages.includes(o.value)
                )}
                onChange={(selected) =>
                  handleChange(
                    "spokenLanguages",
                    selected ? selected.map((s) => s.value) : []
                  )
                }
                placeholder="Select Languages"
                styles={customSelectStyles}
                isSearchable
                isMulti
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <FullCol>
            <UploadLabel>Profile Image</UploadLabel>
            <UploadArea>
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="profile-upload" style={{ cursor: "pointer", width: "100%" }}>
                <UploadContent>
                  <img src={UploadIcon} alt="upload" width="32" height="32" />
                  <UploadText>
                    {formData.aadhaarImage
                      ? formData.aadhaarImage.name
                      : "Upload Image"}
                  </UploadText>
                </UploadContent>
              </label>
            </UploadArea>
          </FullCol>
        </Row>
      </Section>

      {/* ── Address & Document Numbers ── */}
      <Section>
        <SectionTitle>Address & Document Numbers</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="Aadhaar Number"
              placeholder="Enter Aadhaar Number"
              value={formData.aadharNo}
              onChange={(e) => handleChange("aadharNo", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="PAN Number"
              placeholder="Enter PAN Number"
              value={formData.panNo}
              onChange={(e) => handleChange("panNo", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Address Line 1"
              placeholder="Enter Address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Address Line 2"
              placeholder="Landmark / Area (optional)"
              value={formData.addressLine2}
              onChange={(e) => handleChange("addressLine2", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="City"
              placeholder="Enter City"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <SelectWrapper>
              <Label>District</Label>
              <Select
                options={formData.state ? stateDistrictMap[formData.state.value] || [] : []}
                value={formData.district}
                onChange={(v) => handleChange("district", v)}
                placeholder={formData.state ? "Select District" : "Select State first"}
                styles={customSelectStyles}
                isSearchable
                isDisabled={!formData.state}
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>State</Label>
              <Select
                options={stateOptions}
                value={formData.state}
                onChange={(v) => setFormData((prev) => ({ ...prev, state: v, district: null }))}
                placeholder="Select State"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <InputComponent
              label="Pin Code"
              placeholder="Enter Pin Code"
              value={formData.pinCode}
              onChange={(e) => handleChange("pinCode", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
      </Section>

      {/* ── Emergency Contacts ── */}
      {emergencyContacts.map((contact, index) => (
        <Section key={index}>
          <SectionHeader>
            <SectionTitle>Emergency Contact {index + 1}</SectionTitle>
            {emergencyContacts.length > 1 && (
              <RemoveButton onClick={() => handleRemoveContact(index)}>
                Remove
              </RemoveButton>
            )}
          </SectionHeader>
          <Row>
            <Col>
              <InputComponent
                label="Emergency Contact Number"
                placeholder="Enter Contact Number"
                value={contact.emergencyContact}
                onChange={(e) =>
                  handleEmergencyContactChange(index, "emergencyContact", e.target.value)
                }
                labelMargin="0 0 0.625rem 0"
                suffix="+91"
              />
            </Col>
            <Col>
              <InputComponent
                label="Emergency Contact Name"
                placeholder="Enter Name"
                value={contact.emergencyContactName}
                onChange={(e) =>
                  handleEmergencyContactChange(index, "emergencyContactName", e.target.value)
                }
                labelMargin="0 0 0.625rem 0"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>Relationship</Label>
                <Select
                  options={relationshipOptions}
                  value={contact.relationship}
                  onChange={(v) =>
                    handleEmergencyContactChange(index, "relationship", v)
                  }
                  placeholder="Select Relationship"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
          </Row>
        </Section>
      ))}

      <ButtonWrapper>
        <AddMoreButton onClick={handleAddMoreContact}>
          <span>+</span> Add More
        </AddMoreButton>
      </ButtonWrapper>
    </Container>
  );
});

// ── Styled Components ──

const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e3e6;

  &:last-of-type {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin: 0 0 1.5rem 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div`
  width: 100%;
`;

const FullCol = styled.div`
  width: 100%;
  grid-column: 1 / -1;
`;

const SelectWrapper = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin-bottom: 0.625rem;
`;

const UploadLabel = styled.p`
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin: 0 0 0.625rem 0;
`;

const UploadArea = styled.div`
  width: 100%;
  min-height: 150px;
  border: 2px dashed ${theme.colors.primary};
  border-radius: 0.625rem;
  background: #066c781a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f9ff;
  }
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const UploadText = styled.p`
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  color: ${theme.colors.primary};
  margin: 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const AddMoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid ${theme.colors.primary};
  border-radius: 0.5rem;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.secondaryWhite};
  }

  span {
    font-size: 1.2rem;
  }
`;

const RemoveButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #dc2626;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fee2e2;
  }
`;

export default PersonalInfo;
