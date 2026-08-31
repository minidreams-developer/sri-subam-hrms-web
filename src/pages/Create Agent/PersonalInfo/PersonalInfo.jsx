import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import InputComponent from "../../../components/InputComponent";
import CalenderInput from "../../../components/CalenderInput";
import Select from "react-select";
import { customSelectStyles } from "../../../theme/reactSelectStyles";
import ProfileImageUpload from "../../../components/ProfileImageUpload";
import { generateAgentId as requestAgentId, getBranches } from "../../../services/apiServices";
import { stateDistrictMap, stateOptions } from "../../../utils/statesAndDistricts";
import { toast } from "react-toastify";

const createPrefilledAgentData = () => {
  const uniqueValue = String(Date.now());
  const suffix = uniqueValue.slice(-4);

  return {
    agentType: { value: "full_time", label: "Full Time" },
    agentId: "",
    agentName: `Test Agent ${suffix}`,
    gender: { value: "male", label: "Male" },
    dob: "1992-06-15",
    age: "34",
    contact: uniqueValue.slice(-10),
    email: `agent.${uniqueValue}@example.com`,
    password: "Agent@123",
    maritalStatus: { value: "single", label: "Single" },
    motherTongue: { value: "tamil", label: "Tamil" },
    identificationMark: "Mole on left hand",
    religion: { value: "hindu", label: "Hindu" },
    spokenLanguages: ["tamil", "english"],
    aadhaarImage: null,
    profilePic: "",
    aadharNo: uniqueValue.slice(-12),
    panNo: `TAGNT${suffix}A`,
    address: "No. 20, Agent Test Street",
    addressLine2: "Near Bus Stand",
    city: "Chengalpattu",
    district: { value: "chengalpattu", label: "Chengalpattu" },
    state: { value: "tamil_nadu", label: "Tamil Nadu" },
    pinCode: "603001",
    branch: null,
  };
};

const PersonalInfo = forwardRef((_, ref) => {
  const [formData, setFormData] = useState(createPrefilledAgentData);

  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      emergencyContact: String(Date.now() + 1).slice(-10),
      emergencyContactName: "Test Emergency Contact",
      relationship: { value: "father", label: "Father" },
    },
  ]);

  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);

  // Generate Agent ID on component mount
  useEffect(() => {
    const generateAgentId = async () => {
      setIsGeneratingId(true);
      try {
        const response = await requestAgentId();
        const agentId =
          (typeof response === "string" && response) ||
          response?.agentId ||
          response?.employeeId ||
          response?.data?.agentId ||
          response?.data?.employeeId ||
          (typeof response?.data === "string" && response.data) ||
          response?.id ||
          "";
        if (agentId) {
          setFormData((prev) => ({
            ...prev,
            agentId,
          }));
        }
      } catch (error) {
        console.error("Failed to generate agent ID:", error);
        toast.error("Failed to generate agent ID");
      } finally {
        setIsGeneratingId(false);
      }
    };

    const fetchBranches = async () => {
      setBranchesLoading(true);
      try {
        const response = await getBranches({ page: 1, limit: 100 });
        
        // Handle different response structures
        let branchList = [];
        if (Array.isArray(response)) {
          branchList = response;
        } else if (response?.results && Array.isArray(response.results)) {
          branchList = response.results;
        } else if (response?.data && Array.isArray(response.data)) {
          branchList = response.data;
        }

        const formattedBranches = branchList.map((branch) => ({
          value: branch._id || branch.id,
          label: branch.name || branch.branchName || "",
        }));
        setBranches(formattedBranches);
        if (formattedBranches.length) {
          setFormData((previous) => ({ ...previous, branch: previous.branch || formattedBranches[0] }));
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        toast.error("Failed to fetch branches");
      } finally {
        setBranchesLoading(false);
      }
    };

    generateAgentId();
    fetchBranches();
  }, []);

  // Expose form data via ref
  useImperativeHandle(ref, () => ({
    formData: { ...formData, emergencyContacts },
  }));

  const agentTypeOptions = [
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

  // Get district options based on selected state
  const getDistrictOptions = () => {
    if (!formData.state) return [];
    return stateDistrictMap[formData.state.value] || [];
  };

  const relationshipOptions = [
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "spouse", label: "Spouse" },
    { value: "sibling", label: "Sibling" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
              <Label>Agent Type</Label>
              <Select
                options={agentTypeOptions}
                value={formData.agentType}
                onChange={(v) => handleChange("agentType", v)}
                placeholder="Select Type"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <InputComponent
              label="Agent ID"
              placeholder="Auto-generated"
              value={formData.agentId}
              onChange={(e) => handleChange("agentId", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              disabled={true}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Agent Name"
              placeholder="Enter Agent Name"
              value={formData.agentName}
              onChange={(e) => handleChange("agentName", e.target.value)}
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
            <ProfileImageUpload value={formData.profilePic} onChange={(url) => handleChange("profilePic", url)} />
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
                options={getDistrictOptions()}
                value={formData.district}
                onChange={(v) => handleChange("district", v)}
                placeholder={!formData.state ? "Select State first" : "Select District"}
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
                onChange={(v) => {
                  handleChange("state", v);
                  // Clear district when state changes
                  handleChange("district", null);
                }}
                placeholder="Select State"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Branch</Label>
              <Select
                options={branches}
                value={formData.branch}
                onChange={(v) => handleChange("branch", v)}
                placeholder={branchesLoading ? "Loading..." : "Select Branch"}
                styles={customSelectStyles}
                isSearchable
                isLoading={branchesLoading}
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
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
