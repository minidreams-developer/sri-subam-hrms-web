import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import InputComponent from "../../../components/InputComponent";
import CalenderInput from "../../../components/CalenderInput";
import Select from "react-select";
import { customSelectStyles } from "../../../theme/reactSelectStyles";
import ProfileImageUpload from "../../../components/ProfileImageUpload";
import {
  generateEmployeeId as requestEmployeeId,
  generateStaffId as requestStaffId,
  generateAgentId as requestAgentId,
  getBranches,
  getRoles,
} from "../../../services/apiServices";
import { stateDistrictMap, stateOptions } from "../../../utils/statesAndDistricts";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PersonalInfo = forwardRef(({ initialType = "employee", onTypeChange }, ref) => {
  const [formData, setFormData] = useState(() => ({
    employeeType: {
      value: initialType,
      label: initialType.charAt(0).toUpperCase() + initialType.slice(1),
    },
    roleId: "",
    employeeId: "",
    employeeName: "Test Employee",
    gender: { value: "male", label: "Male" },
    dob: new Date(1997, 4, 15),
    age: "",
    contact: "9876543210",
    email: `test.employee.${Date.now()}@example.com`,
    password: "Test@12345",
    maritalStatus: { value: "single", label: "Single" },
    motherTongue: { value: "tamil", label: "Tamil" },
    identificationMark: "Small mole on right hand",
    religion: { value: "hindu", label: "Hindu" },
    spokenLanguages: [
      { value: "tamil", label: "Tamil" },
      { value: "english", label: "English" },
    ],
    aadhaarImage: null,
    profilePic: "",
    aadharNo: "234567890123",
    panNo: "ABCDE1234F",
    address: "12 Test Street",
    addressLine2: "Near Central Park",
    city: "Chennai",
    district: { value: "chennai", label: "Chennai" },
    state: { value: "tamil_nadu", label: "Tamil Nadu" },
    pinCode: "600001",
    branch: null,
  }));

  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      emergencyContact: "9876501234",
      emergencyContactName: "Test Contact",
      relationship: { value: "father", label: "Father" },
    },
  ]);

  const [employeeIdLoading, setEmployeeIdLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchRoleId = async (type) => {
    try {
      const response = await getRoles({ search: type, page: 1, limit: 100 }, { skipGlobalLoading: true });
      const roleList = Array.isArray(response)
        ? response
        : Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.results)
              ? response.data.results
              : [];
      const normalizedType = String(type || "").toLowerCase();
      const role = roleList.find((item) =>
        String(item?.name || "").toLowerCase().includes(normalizedType)
      ) || roleList[0];
      setFormData((prev) => ({ ...prev, roleId: role?.id || role?._id || "" }));
    } catch (error) {
      console.error(`Error fetching ${type} role:`, error);
      setFormData((prev) => ({ ...prev, roleId: "" }));
      toast.error(`Failed to fetch ${type} role`);
    }
  };

  // Generate the ID for the default type and load branches once.
  useEffect(() => {
    generateIdForType(formData.employeeType.value);
    fetchRoleId(formData.employeeType.value);
    fetchBranches();
  }, [initialType]);

  const fetchBranches = async () => {
    setBranchesLoading(true);
    try {
      const response = await getBranches({ page: 1, limit: 100 }, { skipGlobalLoading: true });
      
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
        setFormData((prev) => ({ ...prev, branch: prev.branch || formattedBranches[0] }));
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to fetch branches");
    } finally {
      setBranchesLoading(false);
    }
  };

  const generateIdForType = async (type) => {
    setEmployeeIdLoading(true);
    try {
      const requestId = type === "agent" ? requestAgentId : type === "staff" ? requestStaffId : requestEmployeeId;
      const response = await requestId({ skipGlobalLoading: true });
      console.log(`${type} ID generated:`, response);
      
      // Handle different response structures
      let employeeId = "";
      if (typeof response === "string") {
        employeeId = response;
      } else if (response?.employeeId || response?.staffId || response?.agentId) {
        employeeId = response.employeeId || response.staffId || response.agentId;
      } else if (response?.data) {
        employeeId = response.data;
      } else if (response?.id) {
        employeeId = response.id;
      }
      
      setFormData((prev) => ({ ...prev, employeeId }));
    } catch (error) {
      console.error(`Error generating ${type} ID:`, error);
      toast.error(`Failed to generate ${type} ID`);
    } finally {
      setEmployeeIdLoading(false);
    }
  };

  // Expose form data via ref
  const calculateAge = (date) => {
    const birthDate = date instanceof Date ? date : new Date(date);
    if (!date || Number.isNaN(birthDate.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const birthday未Passed =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
    if (birthday未Passed) age -= 1;
    return String(age);
  };

  const handleDobChange = (date) => {
    setFormData((prev) => ({ ...prev, dob: date, age: calculateAge(date) }));
  };

  const validate = () => {
    const required = [
      ["Name", formData.employeeName], ["Gender", formData.gender?.value],
      ["DOB", formData.dob], ["Email", formData.email], ["Password", formData.password],
      ["Marital status", formData.maritalStatus?.value], ["Mother tongue", formData.motherTongue?.value],
      ["Religion", formData.religion?.value], ["Identification mark", formData.identificationMark],
      ["Aadhaar number", formData.aadharNo], ["PAN number", formData.panNo],
      ["Address", formData.address], ["City", formData.city], ["State", formData.state?.value],
      ["District", formData.district?.value], ["PIN code", formData.pinCode], ["Branch", formData.branch?.value],
    ];
    const missing = required.filter(([, value]) => !String(value ?? "").trim()).map(([label]) => label);
    const errors = [...missing];
    if (!/^\d{10}$/.test(String(formData.contact).trim())) errors.push("Contact must be exactly 10 digits");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formData.email).trim())) errors.push("Enter a valid email");
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(String(formData.password))) errors.push("Password must be 8+ characters with a number, uppercase and lowercase letter");
    // Password mismatch is shown inline below Confirm Password.
    if (!/^\d{16}$/.test(String(formData.aadharNo).trim())) errors.push("Aadhaar must be exactly 16 digits");
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(String(formData.panNo).trim().toUpperCase())) errors.push("Enter a valid PAN number");
    if (!/^\d{6}$/.test(String(formData.pinCode).trim())) errors.push("PIN code must be exactly 6 digits");
    emergencyContacts.forEach((contact, index) => {
      if (!/^\d{10}$/.test(String(contact.emergencyContact).trim())) errors.push(`Emergency contact ${index + 1} must be exactly 10 digits`);
      if (!String(contact.emergencyContactName || "").trim()) errors.push(`Emergency contact ${index + 1} name is required`);
      if (!contact.relationship?.value) errors.push(`Emergency contact ${index + 1} relationship is required`);
    });
    if (errors.length) {
      toast.error(`Please correct: ${errors.slice(0, 4).join(", ")}${errors.length > 4 ? " and other fields" : ""}`);
    }
    return errors.length === 0;
  };

  useImperativeHandle(ref, () => ({
    formData: { ...formData, emergencyContacts },
    validate,
  }));

  const employeeTypeOptions = [
    { value: "employee", label: "Employee" },
    { value: "staff", label: "Staff" },
    { value: "agent", label: "Agent" },
  ];

  // Keep the shared form data keys unchanged, but show the selected role in
  // the user-facing labels so the form reads Agent ID/Agent Name, Staff
  // ID/Staff Name, or Employee ID/Employee Name dynamically.
  const profileTypeLabel = {
    agent: "Agent",
    staff: "Staff",
    employee: "Employee",
  }[formData.employeeType?.value] || "Employee";
  const profileIdLabel = `${profileTypeLabel} ID`;
  const profileNameLabel = `${profileTypeLabel} Name`;

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

  // State to District mapping
  const stateDistrictMap = {
    tamil_nadu: [
      { value: "chennai", label: "Chennai" },
      { value: "coimbatore", label: "Coimbatore" },
      { value: "madurai", label: "Madurai" },
      { value: "trichy", label: "Trichy" },
      { value: "salem", label: "Salem" },
      { value: "erode", label: "Erode" },
      { value: "kanchipuram", label: "Kanchipuram" },
      { value: "villupuram", label: "Villupuram" },
      { value: "tiruppur", label: "Tiruppur" },
      { value: "karur", label: "Karur" },
    ],
    kerala: [
      { value: "kochi", label: "Kochi" },
      { value: "thiruvananthapuram", label: "Thiruvananthapuram" },
      { value: "kozhikode", label: "Kozhikode" },
      { value: "thrissur", label: "Thrissur" },
      { value: "pathanamthitta", label: "Pathanamthitta" },
      { value: "alappuzha", label: "Alappuzha" },
      { value: "wayanad", label: "Wayanad" },
      { value: "kannur", label: "Kannur" },
      { value: "idukki", label: "Idukki" },
    ],
    karnataka: [
      { value: "bangalore", label: "Bangalore" },
      { value: "mysore", label: "Mysore" },
      { value: "mangalore", label: "Mangalore" },
      { value: "belgaum", label: "Belgaum" },
      { value: "hubli", label: "Hubli" },
      { value: "tumkur", label: "Tumkur" },
      { value: "kolar", label: "Kolar" },
      { value: "hassan", label: "Hassan" },
      { value: "shimoga", label: "Shimoga" },
    ],
    andhra_pradesh: [
      { value: "hyderabad", label: "Hyderabad" },
      { value: "visakhapatnam", label: "Visakhapatnam" },
      { value: "vijayawada", label: "Vijayawada" },
      { value: "tirupati", label: "Tirupati" },
      { value: "guntur", label: "Guntur" },
      { value: "nellore", label: "Nellore" },
      { value: "kadapa", label: "Kadapa" },
    ],
    telangana: [
      { value: "hyderabad", label: "Hyderabad" },
      { value: "secunderabad", label: "Secunderabad" },
      { value: "warangal", label: "Warangal" },
      { value: "karimnagar", label: "Karimnagar" },
      { value: "khammam", label: "Khammam" },
      { value: "nizamabad", label: "Nizamabad" },
    ],
    maharashtra: [
      { value: "mumbai", label: "Mumbai" },
      { value: "pune", label: "Pune" },
      { value: "nagpur", label: "Nagpur" },
      { value: "nashik", label: "Nashik" },
      { value: "aurangabad", label: "Aurangabad" },
      { value: "kolhapur", label: "Kolhapur" },
      { value: "thane", label: "Thane" },
      { value: "navi_mumbai", label: "Navi Mumbai" },
    ],
  };

  const stateOptions = [
    { value: "tamil_nadu", label: "Tamil Nadu" },
    { value: "kerala", label: "Kerala" },
    { value: "karnataka", label: "Karnataka" },
    { value: "andhra_pradesh", label: "Andhra Pradesh" },
    { value: "telangana", label: "Telangana" },
    { value: "maharashtra", label: "Maharashtra" },
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
                onChange={(v) => {
                  handleChange("employeeType", v);
                  const type = v?.value || "employee";
                  onTypeChange?.(type);
                  generateIdForType(type);
                  fetchRoleId(type);
                }}
                placeholder="Select Type"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <InputComponent
              key={`id-${formData.employeeType?.value || "employee"}`}
              label={profileIdLabel}
              placeholder="Auto-generated"
              value={formData.employeeId}
              onChange={(e) => handleChange("employeeId", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              disabled={true}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              key={`name-${formData.employeeType?.value || "employee"}`}
              label={profileNameLabel}
              placeholder={`Enter ${profileNameLabel}`}
              value={formData.employeeName}
              onChange={(e) => handleChange("employeeName", e.target.value)}
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
              onDateSelect={handleDobChange}
              initialDate={formData.dob}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Age"
              placeholder="Enter Age"
              value={formData.age}
              readOnly
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
              onChange={(e) => handleChange("contact", e.target.value.replace(/\D/g, "").slice(0, 10))}
              labelMargin="0 0 0.625rem 0"
              suffix="+91"
            />
          </Col>
          <Col>
            <InputComponent
              label="Email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value.replace(/\s/g, "").slice(0, 254))}
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
              type={showPassword ? "text" : "password"}
              endAdornment={
                <PasswordToggle type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </PasswordToggle>
              }
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
              onChange={(e) => handleChange("aadharNo", e.target.value.replace(/\D/g, "").slice(0, 16))}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="PAN Number"
              placeholder="Enter PAN Number"
              value={formData.panNo}
              onChange={(e) => handleChange("panNo", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))}
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
              <Label>State</Label>
              <Select options={stateOptions} value={formData.state} onChange={(v) => { handleChange("state", v); handleChange("district", null); }} placeholder="Select State" styles={customSelectStyles} isSearchable />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
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
          <Col>
            <InputComponent
              label="Pin Code"
              placeholder="Enter Pin Code"
              value={formData.pinCode}
              onChange={(e) => handleChange("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Branch</Label>
              <Select
                options={branches}
                value={formData.branch}
                onChange={(v) => handleChange("branch", v)}
                placeholder={branchesLoading ? "Loading branches..." : "Select Branch"}
                styles={customSelectStyles}
                isSearchable
                isLoading={branchesLoading}
              />
            </SelectWrapper>
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
                  handleEmergencyContactChange(index, "emergencyContact", e.target.value.replace(/\D/g, "").slice(0, 10))
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

const PasswordToggle = styled.button`
  display: flex;
  align-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  color: ${theme.colors.secondaryTextColor};
  cursor: pointer;
  font-size: 1.1rem;
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
