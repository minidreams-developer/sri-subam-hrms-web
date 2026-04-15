import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import CalenderInput from "../../components/CalenderInput";
import InputComponent from "../../components/InputComponent";
import Select from "react-select";
import { customSelectStyles } from "../../theme/reactSelectStyles";
import CheckboxGroup from "../../components/CheckboxGroup";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import Button from "../../components/Button";
import UploadComponent from "../../components/UploadComponent";
import FileUploadComponent from "../../components/FileUploadComponent";
import AddNewFieldModal from "../../components/AddNewFieldModal";
import MinusIcon from "../../assets/images/employee/minus.svg";
import ConfirmationModal from "../../components/ConfirmationModal";

const CreateEmployeeOffboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: "",
    employee: null,
    department: "",
    designation: "",
    team: "",
    reportingPerson: "",
    dateOfJoining: null,
    employmentType: null,
    exitType: null,
    exitReason: null,
    resignationDate: null,
    lastWorkingDate: null,
    noticePeriod: null,
    actualNoticeServed: null,
    waiver: null,
    exitApprovedBy: null,
    approvalDate: null,
  });

  const [assets, setAssets] = useState([
    { asset: null, condition: null, returnStatus: null },
  ]);

  const [documents, setDocuments] = useState([
    { id: 1, label: "Select Document", file: null, keepOriginal: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const employeeOptions = [
    { value: "john", label: "John Doe" },
    { value: "jane", label: "Jane Smith" },
    { value: "bob", label: "Bob Johnson" },
  ];

  const employmentTypeOptions = [
    { value: "fulltime", label: "Full Time" },
    { value: "parttime", label: "Part Time" },
    { value: "contract", label: "Contract" },
  ];

  const exitTypeOptions = [
    { value: "resignation", label: "Resignation" },
    { value: "termination", label: "Termination" },
    { value: "retirement", label: "Retirement" },
  ];

  const exitReasonOptions = [
    { value: "personal", label: "Personal Reasons" },
    { value: "opportunity", label: "Better Opportunity" },
    { value: "health", label: "Health Issues" },
    { value: "relocation", label: "Relocation" },
  ];

  const noticePeriodOptions = [
    { value: "15", label: "15 Days" },
    { value: "30", label: "30 Days" },
    { value: "60", label: "60 Days" },
    { value: "90", label: "90 Days" },
  ];

  const waiverOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const approverOptions = [
    { value: "deepak", label: "Deepak" },
    { value: "arun", label: "Arun Kumar" },
    { value: "manoj", label: "Manoj Kumar" },
  ];

  const assetOptions = [
    { value: "laptop", label: "Laptop" },
    { value: "ipad", label: "iPad" },
    { value: "mobile", label: "Mobile Phone" },
    { value: "id_card", label: "ID Card" },
    { value: "access_card", label: "Access Card" },
  ];

  const conditionOptions = [
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "bad", label: "Bad" },
  ];

  const returnStatusOptions = [
    { value: "returned", label: "Returned" },
    { value: "pending", label: "Pending" },
    { value: "not_applicable", label: "Not Applicable" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssetChange = (index, field, value) => {
    const updatedAssets = [...assets];
    updatedAssets[index][field] = value;
    setAssets(updatedAssets);
  };

  const addAsset = () => {
    setAssets([...assets, { asset: null, condition: null, returnStatus: null }]);
  };

  const removeAsset = (index) => {
    if (assets.length > 1) {
      setAssets(assets.filter((_, i) => i !== index));
    }
  };

  const handleSaveAsDraft = () => {
    console.log("Save as draft:", formData, assets);
    // Add save as draft logic here
  };

  const handleCancel = () => {
    navigate("/admin/peopleHub/off-boarding");
  };

  const handleNext = () => {
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmation = (data) => {
    console.log("Confirmation data:", data);
    console.log("Form data:", formData, assets, documents);
    setIsConfirmationModalOpen(false);
    // Add your submission logic here
    // navigate to next page or submit data
  };

  // Document handlers
  const handleFileSelect = (id, file, keepOriginal) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, file, keepOriginal } : doc
      )
    );
  };

  const handleFileRemove = (id) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, file: null, keepOriginal: false } : doc
      )
    );
  };

  const handleAddMoreDocuments = () => {
    setIsModalOpen(true);
  };

  const handleRemoveDocument = (id) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  const handleLabelChange = (id, newLabel) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, label: newLabel } : doc))
    );
  };

  const handleModalSubmit = (documentName) => {
    const newId = Math.max(...documents.map((d) => d.id)) + 1;
    setDocuments([
      ...documents,
      { id: newId, label: documentName, file: null, keepOriginal: false },
    ]);
  };

  return (
    <Container>
      <AddNewFieldModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmation}
      />

      <Section>
        <SectionTitle>Employee Details</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="Employee ID"
              placeholder="Enter Employee ID"
              value={formData.employeeId}
              onChange={(e) => handleChange("employeeId", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Employee</Label>
              <Select
                options={employeeOptions}
                value={formData.employee}
                onChange={(value) => handleChange("employee", value)}
                placeholder="Select Employee"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Department"
              placeholder="Enter Department"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Designation"
              placeholder="Enter Designation"
              value={formData.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Team"
              placeholder="Enter Team"
              value={formData.team}
              onChange={(e) => handleChange("team", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Reporting Person"
              placeholder="Reporting Person"
              value={formData.reportingPerson}
              onChange={(e) => handleChange("reportingPerson", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <CalenderInput
              label="Date of Joining"
              placeholder="Joining Date"
              onDateSelect={(date) => handleChange("dateOfJoining", date)}
              initialDate={formData.dateOfJoining}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Employment Type</Label>
              <Select
                options={employmentTypeOptions}
                value={formData.employmentType}
                onChange={(value) => handleChange("employmentType", value)}
                placeholder="Select Employment Type"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Exit Information Section</SectionTitle>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Exit Type</Label>
              <Select
                options={exitTypeOptions}
                value={formData.exitType}
                onChange={(value) => handleChange("exitType", value)}
                placeholder="Select Type"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Exit Reason</Label>
              <Select
                options={exitReasonOptions}
                value={formData.exitReason}
                onChange={(value) => handleChange("exitReason", value)}
                placeholder="Select Type"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <CalenderInput
              label="Resignation Submitted Date"
              placeholder="Select date"
              onDateSelect={(date) => handleChange("resignationDate", date)}
              initialDate={formData.resignationDate}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <CalenderInput
              label="Last Working Date"
              placeholder="Select date"
              onDateSelect={(date) => handleChange("lastWorkingDate", date)}
              initialDate={formData.lastWorkingDate}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Notice Period</Label>
              <Select
                options={noticePeriodOptions}
                value={formData.noticePeriod}
                onChange={(value) => handleChange("noticePeriod", value)}
                placeholder="Select Notice Period"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Actual Notice Served</Label>
              <Select
                options={noticePeriodOptions}
                value={formData.actualNoticeServed}
                onChange={(value) => handleChange("actualNoticeServed", value)}
                placeholder="Select Notice Served"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Waiver</Label>
              <Select
                options={waiverOptions}
                value={formData.waiver}
                onChange={(value) => handleChange("waiver", value)}
                placeholder="Select Notice Served"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Exit Approved By</Label>
              <Select
                options={approverOptions}
                value={formData.exitApprovedBy}
                onChange={(value) => handleChange("exitApprovedBy", value)}
                placeholder="Select Employee"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <CalenderInput
              label="Approval Date"
              placeholder="Select date"
              onDateSelect={(date) => handleChange("approvalDate", date)}
              initialDate={formData.approvalDate}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Asset Management</SectionTitle>
        {assets.map((asset, index) => (
          <AssetRow key={index}>
            <AssetHeader>
              {assets.length > 1 && (
                <RemoveButton onClick={() => removeAsset(index)}>
                  Remove
                </RemoveButton>
              )}
            </AssetHeader>
            <Row>
              <Col>
                <SelectWrapper>
                  <Label>Asset {index + 1}</Label>
                  <Select
                    options={assetOptions}
                    value={asset.asset}
                    onChange={(value) => handleAssetChange(index, "asset", value)}
                    placeholder="Select Asset"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
              <Col>
                <SelectWrapper>
                  <Label>Condition</Label>
                  <Select
                    options={conditionOptions}
                    value={asset.condition}
                    onChange={(value) => handleAssetChange(index, "condition", value)}
                    placeholder="Select Type"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
            </Row>
            <Row>
              <Col>
                <SelectWrapper>
                  <Label>Return Status</Label>
                  <Select
                    options={returnStatusOptions}
                    value={asset.returnStatus}
                    onChange={(value) => handleAssetChange(index, "returnStatus", value)}
                    placeholder="Select Status"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
            </Row>
          </AssetRow>
        ))}
        <AddMoreButton onClick={addAsset}>
          <img src={PlusIcon} alt="add" width="16" height="16" />
          Add More
        </AddMoreButton>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Final Settlement (FnF) Details</SectionTitle>
        <FnFWrapper>
          <CheckboxGroup
            title="Earnings"
            options={[
              "Last Month Salary",
              "Pending Salary",
              "Leave Encashment",
              "Bonus / Incentives",
              "Reimbursements",
            ]}
            defaultChecked={[]}
          />
          <CheckboxGroup
            title="Deductions"
            options={[
              "Notice Pay",
              "Asset Damage",
              "Loan Recovery",
              "Advance Salary",
              "Tax Adjustments",
            ]}
            defaultChecked={[]}
          />
        </FnFWrapper>
      </Section>
      <Divider />
      <Section>
        <FnFWrapper>
          <CheckboxGroup
            title="Documents Return (Originals)"
            options={[
              "10th Marksheet",
              "12th Marksheet",
            ]}
            defaultChecked={[]}
          />
        </FnFWrapper>
      </Section>
      <Divider />

      <Section>
        <SectionTitle>Documents</SectionTitle>
        <DocumentRow>
          {documents.map((doc, index) => (
            <DocumentCol key={doc.id}>
              <DocumentWrapper>
                {index >= 1 && (
                  <RemoveIcon
                    src={MinusIcon}
                    alt="remove"
                    onClick={() => handleRemoveDocument(doc.id)}
                  />
                )}
                {doc.file ? (
                  <FileUploadComponent
                    label={doc.label}
                    fileName={doc.file.name}
                    showEye={false}
                    showCross={true}
                    showKeepOriginal={false}
                    keepOriginal={doc.keepOriginal}
                    onRemove={() => handleFileRemove(doc.id)}
                    onKeepOriginalChange={(checked) => {
                      setDocuments((prev) =>
                        prev.map((d) =>
                          d.id === doc.id ? { ...d, keepOriginal: checked } : d
                        )
                      );
                    }}
                  />
                ) : (
                  <UploadComponent
                    label={doc.label}
                    isEditable={index >= 2}
                    showKeepOriginal={false}
                    onLabelChange={(newLabel) => handleLabelChange(doc.id, newLabel)}
                    onFileSelect={(file, keepOriginal) =>
                      handleFileSelect(doc.id, file, keepOriginal)
                    }
                  />
                )}
              </DocumentWrapper>
            </DocumentCol>
          ))}
        </DocumentRow>
        <ButtonWrapper>
          <AddMoreButton onClick={handleAddMoreDocuments}>
            <img src={PlusIcon} alt="add" width="16" height="16" />
            Add More
          </AddMoreButton>
        </ButtonWrapper>
      </Section>

      <ButtonRow>
        <Button
          text="Save as Draft"
          bg="transparent"
          color={theme.colors.primary}
          border={`1px solid ${theme.colors.primary}`}
          width="150px"
          radius="0.5rem"
          fontSize="0.875rem"
          fontWeight="600"
          fontFamily="Inter-SemiBold"
          onClick={handleSaveAsDraft}
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
            text="Next"
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="150px"
            radius="0.5rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleNext}
          />
        </RightButtons>
      </ButtonRow>
    </Container>
  );
};

export default CreateEmployeeOffboard;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  width: 80%;
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

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #E0E3E6;
  margin: 1rem 0;
`;

const AssetRow = styled.div`
  margin-bottom: 1.5rem;
`;

const AssetHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const RemoveButton = styled.button`
  padding: 0.375rem 0.875rem;
  background: transparent;
  border: 1px solid #dc2626;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fee2e2;
  }
`;

const FnFWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const AddMoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: transparent;
  border: 1px solid ${theme.colors.primary};
  border-radius: 0.5rem;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.secondaryPrimary};
  }

  img {
    filter: brightness(0) saturate(100%) invert(37%) sepia(93%) saturate(1088%) hue-rotate(165deg) brightness(95%) contrast(101%);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${theme.colors.border};
`;

const RightButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const DocumentRow = styled.div`
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

const DocumentCol = styled.div`
  width: 100%;
`;

const DocumentWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const RemoveIcon = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  z-index: 10;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2.5rem;
`;

