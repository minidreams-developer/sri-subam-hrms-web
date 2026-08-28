import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import InputComponent from "../../components/InputComponent";
import CalenderInput from "../../components/CalenderInput";
import Button from "../../components/Button";
import Select from "react-select";
import { customSelectStyles } from "../../theme/reactSelectStyles";
import { IoArrowBack } from "react-icons/io5";
import { createBranch, generateBranchId, getDepartments, getShifts, getUsers, updateBranch } from "../../services/apiServices";
import { toast } from "react-toastify";
import { stateDistrictMap, stateOptions } from "../../utils/statesAndDistricts";

const CreateBranch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editBranch = location.state?.mode === "edit" ? location.state.branch : null;
  const editBranchId = location.state?.branchId || editBranch?.id || editBranch?._id;
  const isEditMode = Boolean(editBranch);
  const [isLoading, setIsLoading] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [shiftsLoading, setShiftsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [branchHeadOptions, setBranchHeadOptions] = useState([]);
  
  const [formData, setFormData] = useState(() => ({
    branchNumber: editBranch?.branchNumber || "",
    name: editBranch?.branchName || editBranch?.name || "",
    branchType: editBranch?.branchType
      ? { value: editBranch.branchType, label: editBranch.branchType }
      : null,
    branchStatus: editBranch?.branchStatus || editBranch?.status
      ? { value: editBranch.branchStatus || editBranch.status, label: editBranch.branchStatus || editBranch.status }
      : null,
    effectiveFromDate: editBranch?.effectiveFromDate || editBranch?.effectiveDate || null,
    branchHead: editBranch?.branchHead
      ? { value: editBranch.branchHead?.id || editBranch.branchHead?._id || editBranch.branchHead, label: editBranch.branchHead?.name || String(editBranch.branchHead) }
      : null,
    phoneNumber: editBranch?.phoneNumber || "",
    emergencyContact: editBranch?.emergencyContact || editBranch?.emergencyContactNumber || "",
    email: editBranch?.email || "",
    address: editBranch?.address || "",
    city: editBranch?.city || "",
    district: editBranch?.district ? { value: editBranch.district, label: editBranch.district } : null,
    state: editBranch?.state ? { value: editBranch.state, label: editBranch.state } : null,
    pinCode: editBranch?.pinCode || editBranch?.pincode || "",
    geoLocation: editBranch?.geoLocation || "",
    selectDepartments: editBranch?.departments
      ? { value: Array.isArray(editBranch.departments) ? editBranch.departments.map((item) => item.id || item._id || item) : editBranch.departments, label: "Assigned departments" }
      : null,
    selectShifts: editBranch?.shifts
      ? { value: Array.isArray(editBranch.shifts) ? editBranch.shifts.map((item) => item.id || item._id || item) : editBranch.shifts, label: "Assigned shifts" }
      : null,
  }));

  // Generate branch number and fetch dropdown data on component mount
  useEffect(() => {
    if (!isEditMode) generateBranchNumber();
    fetchDepartments();
    fetchShifts();
    fetchBranchHeads();
  }, [isEditMode]);

  const generateBranchNumber = async () => {
    try {
      const response = await generateBranchId();
      console.log("Branch number generated:", response);
      
      // Handle different response structures
      let branchNumber = "";
      if (typeof response === "string") {
        branchNumber = response;
      } else if (response?.branchNumber) {
        branchNumber = response.branchNumber;
      } else if (response?.data) {
        branchNumber = response.data;
      } else if (response?.id) {
        branchNumber = response.id;
      }
      
      setFormData((prev) => ({ ...prev, branchNumber }));
    } catch (error) {
      console.error("Error generating branch number:", error);
      toast.error("Failed to generate branch number");
    }
  };

  const fetchDepartments = async () => {
    setDepartmentsLoading(true);
    try {
      const response = await getDepartments();
      console.log("Departments fetched:", response);
      
      // Handle different response structures
      let departments = [];
      if (Array.isArray(response)) {
        departments = response;
      } else if (response?.results && Array.isArray(response.results)) {
        departments = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        departments = response.data;
      }
      
      // Map to select options
      const options = departments.map((dept) => ({
        value: dept.id || dept._id,
        label: dept.departmentName || dept.name || "Unknown",
      }));
      
      setDepartmentOptions(options);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const fetchShifts = async () => {
    setShiftsLoading(true);
    try {
      const response = await getShifts();
      console.log("Shifts fetched:", response);
      
      // Handle different response structures
      let shifts = [];
      if (Array.isArray(response)) {
        shifts = response;
      } else if (response?.results && Array.isArray(response.results)) {
        shifts = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        shifts = response.data;
      }
      
      // Map to select options
      const options = shifts.map((shift) => ({
        value: shift.id || shift._id,
        label: shift.shiftName || shift.name || "Unknown",
      }));
      
      setShiftOptions(options);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error("Failed to fetch shifts");
    } finally {
      setShiftsLoading(false);
    }
  };

  const fetchBranchHeads = async () => {
    setUsersLoading(true);
    try {
      // Fetch with a large limit to get all employees (or implement pagination)
      const response = await getUsers({ page: 1, limit: 100 });
      console.log("Users fetched:", response);
      
      // Handle different response structures
      let users = [];
      if (Array.isArray(response)) {
        users = response;
      } else if (response?.results && Array.isArray(response.results)) {
        users = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        users = response.data;
      } else if (response?.users && Array.isArray(response.users)) {
        users = response.users;
      }
      
      console.log("Mapped users:", users);
      
      // Map to select options - handle various field name formats
      const options = users.map((user) => ({
        value: user.id || user._id,
        label: 
          (user.firstName && user.lastName) 
            ? `${user.firstName} ${user.lastName}`
            : (user.employeeName || user.name || user.email || "Unknown"),
      }));
      
      console.log("Branch head options:", options);
      setBranchHeadOptions(options);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch branch heads");
    } finally {
      setUsersLoading(false);
    }
  };

  const branchTypeOptions = [
    { value: "main", label: "Main Branch" },
    { value: "sub", label: "Sub Branch" },
    { value: "regional", label: "Regional Office" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Get district options based on selected state
  const getDistrictOptions = () => {
    if (!formData.state) return [];
    return stateDistrictMap[formData.state.value] || [];
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    if (isReviewing) {
      setIsReviewing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(-1);
  };

  const handleCancel = () => {
    navigate("/admin/peopleHub/branch");
  };

  const validateForm = () => {
    // Validate required fields
    if (!formData.name) {
      toast.error("Branch name is required");
      return false;
    }
    if (!formData.branchType) {
      toast.error("Branch type is required");
      return false;
    }
    if (!formData.branchStatus) {
      toast.error("Branch status is required");
      return false;
    }
    if (!formData.email) {
      toast.error("Email is required");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;
    setIsReviewing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setIsReviewing(false);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare payload for API
      const payload = {
        branchNumber: formData.branchNumber,
        branchName: formData.name,
        branchType: formData.branchType?.value,
        branchStatus: formData.branchStatus?.value,
        effectiveFromDate: formData.effectiveFromDate,
        branchHead: formData.branchHead?.value,
        phoneNumber: formData.phoneNumber,
        emergencyContact: formData.emergencyContact,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        district: formData.district?.value,
        state: formData.state?.value,
        pinCode: formData.pinCode,
        geoLocation: formData.geoLocation,
        departments: formData.selectDepartments?.value,
        shifts: formData.selectShifts?.value,
      };

      const branchId = editBranchId || editBranch?.branchNumber;
      if (isEditMode && !branchId) {
        toast.error("Branch ID is missing. Please reopen the branch and try again.");
        return;
      }
      const response = isEditMode
        ? await updateBranch(branchId, payload)
        : await createBranch(payload);

      if (response) {
        toast.success(isEditMode ? "Branch updated successfully!" : "Branch created successfully!");
        navigate("/admin/peopleHub/branch");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "create"} branch. Please try again.`;
      toast.error(errorMessage);
      console.error("Create branch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <IoArrowBack size={20} />
        </BackButton>
        <Title>{isReviewing ? `Review ${isEditMode ? "Branch Changes" : "New Branch"}` : isEditMode ? "Edit Branch" : "Create New Branch"}</Title>
      </Header>

      <FormContainer>
        <Section>
          <SectionTitle>Basic Details</SectionTitle>
          <Row>
            <Col>
              <InputComponent
                label="Branch Number"
                placeholder="Auto-generated"
                value={formData.branchNumber}
                onChange={(e) => handleChange("branchNumber", e.target.value)}
                labelMargin="0 0 0.625rem 0"
                disabled={true}
              />
            </Col>
            <Col>
              <InputComponent
                label="Name"
                placeholder="Enter Branch Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                labelMargin="0 0 0.625rem 0"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>Branch Type</Label>
                <Select
                  options={branchTypeOptions}
                  value={formData.branchType}
                  onChange={(value) => handleChange("branchType", value)}
                  placeholder="Select Type"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
            <Col>
              <SelectWrapper>
                <Label>Branch Status</Label>
                <Select
                  options={statusOptions}
                  value={formData.branchStatus}
                  onChange={(value) => handleChange("branchStatus", value)}
                  placeholder="Select Status"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
          </Row>
          <Row>
            <Col>
              <CalenderInput
                label="Effective From Date"
                onDateSelect={(date) => handleChange("effectiveFromDate", date)}
                initialDate={formData.effectiveFromDate}
                labelMargin="0 0 0.625rem 0"
              />
            </Col>
            <Col></Col>
          </Row>
        </Section>

        <Section>
          <SectionTitle>Contact Details</SectionTitle>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>Branch Head</Label>
                <Select
                  options={branchHeadOptions}
                  value={formData.branchHead}
                  onChange={(value) => handleChange("branchHead", value)}
                  placeholder="Select Branch Head"
                  styles={customSelectStyles}
                  isSearchable
                  isLoading={usersLoading}
                />
              </SelectWrapper>
            </Col>
            <Col>
              <InputComponent
                label="Phone Number"
                placeholder="Enter Contact Number"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                labelMargin="0 0 0.625rem 0"
                suffix="+91"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputComponent
                label="Emergency Contact Number"
                placeholder="Enter Contact Number"
                value={formData.emergencyContact}
                onChange={(e) => handleChange("emergencyContact", e.target.value)}
                labelMargin="0 0 0.625rem 0"
                suffix="+91"
              />
            </Col>
            <Col>
              <InputComponent
                label="Email"
                placeholder="Select DOB"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                labelMargin="0 0 0.625rem 0"
              />
            </Col>
          </Row>
        </Section>

        <Section>
          <SectionTitle>Address</SectionTitle>
          <Row>
            <Col>
              <InputComponent
                label="Address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                labelMargin="0 0 0.625rem 0"
              />
            </Col>
            <Col>
              <InputComponent
                label="City"
                placeholder="Enter City"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                labelMargin="0 0 0.625rem 0"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>District</Label>
                <Select
                  options={getDistrictOptions()}
                  value={formData.district}
                  onChange={(value) => handleChange("district", value)}
                  placeholder={!formData.state ? "Select State first" : "Select District"}
                  styles={customSelectStyles}
                  isSearchable
                  isDisabled={!formData.state}
                />
              </SelectWrapper>
            </Col>
            <Col>
              <SelectWrapper>
                <Label>State</Label>
                <Select
                  options={stateOptions}
                  value={formData.state}
                  onChange={(value) => {
                    handleChange("state", value);
                    // Clear district when state changes
                    handleChange("district", null);
                  }}
                  placeholder="Select State"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputComponent
                label="Pin code"
                placeholder="Enter Pin code"
                value={formData.pinCode}
                onChange={(e) => handleChange("pinCode", e.target.value)}
                labelMargin="0 0 0.625rem 0"
              />
            </Col>
            <Col>
              <InputComponent
                label="Geo Location"
                placeholder="Enter Geo Location Link"
                value={formData.geoLocation}
                onChange={(e) => handleChange("geoLocation", e.target.value)}
                labelMargin="0 0 0.625rem 0"
              />
            </Col>
          </Row>
        </Section>

        <Section>
          <SectionTitle>Other Details</SectionTitle>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>Select Departments</Label>
                <Select
                  options={departmentOptions}
                  value={formData.selectDepartments}
                  onChange={(value) => handleChange("selectDepartments", value)}
                  placeholder="Select Departments"
                  styles={customSelectStyles}
                  isSearchable
                  isLoading={departmentsLoading}
                />
              </SelectWrapper>
            </Col>
            <Col>
              <SelectWrapper>
                <Label>Select Shifts</Label>
                <Select
                  options={shiftOptions}
                  value={formData.selectShifts}
                  onChange={(value) => handleChange("selectShifts", value)}
                  placeholder="Select Shifts"
                  styles={customSelectStyles}
                  isSearchable
                  isLoading={shiftsLoading}
                />
              </SelectWrapper>
            </Col>
          </Row>
        </Section>

        {isReviewing && <ReviewNotice>Please review the details above. The API will only be called when you click {isEditMode ? "Update" : "Create"}.</ReviewNotice>}
        <ButtonRow>
          <Button
            text="Back"
            bg="transparent"
            color={theme.colors.primary}
            border={`1px solid ${theme.colors.primary}`}
            width="150px"
            radius="0.5rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleBack}
          />
          <RightButtons>
            <Button
              text="Cancel"
              bg="transparent"
              color={theme.colors.primary}
              border={`1px solid ${theme.colors.primary}`}
              width="150px"
              radius="0.5rem"
              fontSize="0.875rem"
              fontWeight="600"
              fontFamily="Inter-SemiBold"
              onClick={handleCancel}
            />
            <Button
              text={isReviewing ? (isEditMode ? "Update" : "Create") : "Next"}
              bg={theme.colors.primary}
              color={theme.colors.white}
              width="150px"
              radius="0.5rem"
              fontSize="0.875rem"
              fontWeight="600"
              fontFamily="Inter-SemiBold"
              onClick={isReviewing ? handleSubmit : handleNext}
              loading={isLoading}
              disabled={isLoading}
            />
          </RightButtons>
        </ButtonRow>
      </FormContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 80%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border: none;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const FormContainer = styled.div`
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #E0E3E6;

  &:last-of-type {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
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
`;

const Col = styled.div`
  width: 100%;
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

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${theme.colors.border};
`;

const ReviewNotice = styled.div`
  margin-top: 1.5rem;
  padding: 0.875rem 1rem;
  border: 1px solid #b8dce0;
  border-radius: 8px;
  background: #edf6f9;
  color: ${theme.colors.primary};
  font: 500 0.875rem/1.5 "Inter-Medium", sans-serif;
`;

const RightButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

export default CreateBranch;
