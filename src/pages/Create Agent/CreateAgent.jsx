import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import Stepper from "../../components/Stepper";
import PersonalInfo from "./PersonalInfo/PersonalInfo";
import Documents from "./Documents/Documents";
import CommissionDetails from "./Commission Details/CommissionDetails";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { createEmployee } from "../../services/apiServices";

const CreateAgent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Use refs (not state) to store form data across steps.
  const savedPersonalData = useRef({});
  const savedDocumentsData = useRef({});

  const personalInfoRef = useRef();
  const documentsRef = useRef();
  const commissionDetailsRef = useRef();

  const steps = ["Personal Information", "Document Upload", "Commission Details"];

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 3 && commissionDetailsRef.current?.formData) {
        savedDocumentsData.current = documentsRef.current?.formData || {};
      }
      setCurrentStep((s) => s - 1);
    } else {
      navigate(-1);
    }
  };

  const handleCancel = () => {
    navigate("/admin/people/agents");
  };

  const handleNext = async () => {
    console.log("handleNext called, currentStep:", currentStep);
    if (currentStep < 3) {
      // Snapshot step 1 data into ref before PersonalInfo unmounts
      if (currentStep === 1 && personalInfoRef.current?.formData) {
        savedPersonalData.current = personalInfoRef.current.formData;
        console.log("Saved personal data:", savedPersonalData.current);
      }
      if (currentStep === 2 && documentsRef.current?.formData) {
        savedDocumentsData.current = documentsRef.current.formData;
        console.log("Saved documents data:", savedDocumentsData.current);
      }
      setCurrentStep((s) => s + 1);
    } else {
      // Step 3 is still mounted — read directly from its ref
      if (commissionDetailsRef.current?.formData) {
        console.log("Saved commission data:", commissionDetailsRef.current.formData);
      }
      console.log("Calling handleSubmitAgent...");
      await handleSubmitAgent();
    }
  };

  const handleSubmitAgent = async () => {
    setIsLoading(true);

    try {
      // Read from refs — always the latest values, no stale closure
      const personalData = savedPersonalData.current;
      const documentsData = savedDocumentsData.current;
      const commissionData = commissionDetailsRef.current?.formData || {};

      console.log("Personal Data:", personalData);
      console.log("Documents Data:", documentsData);
      console.log("Commission Data:", commissionData);

      // --- Build payload: POST /v1/users/employee-registration ---
      const payload = {
        role: "agent",
        agentId: personalData.agentId,
        name: personalData.agentName,
        email: personalData.email,
        password: personalData.password,
        phone: String(personalData.contact).replace(/\D/g, ""), // Remove non-digit chars
        gender: personalData.gender?.value,
        dateOfBirth: personalData.dob,
        age: Number(personalData.age),
        martialStatus: personalData.maritalStatus?.value, // API typo preserved
        motherTongue: personalData.motherTongue?.value,
        identificationMark: personalData.identificationMark,
        religion: personalData.religion?.value,
        profilePic: personalData.profilePic || "",
        branch: personalData.branch?.value,

        documentNo: {
          aadharNo:
            Number(String(personalData.aadharNo || "").replace(/\D/g, "")) ||
            null,
          panNo: String(personalData.panNo || "").trim().toUpperCase(),
        },

        address: [
          {
            addressLine1: personalData.address,
            addressLine2: personalData.addressLine2 || "",
            city: personalData.city,
            district: personalData.district?.value,
            state: personalData.state?.value,
            pincode: Number(personalData.pinCode),
            country: "India",
          },
        ],

        emergencyContacts: (personalData.emergencyContacts || [])
          .filter((contact) => contact.emergencyContact && contact.emergencyContactName) // Filter out empty contacts
          .map((contact) => ({
            contactName: contact.emergencyContactName,
            phone: Number(contact.emergencyContact.replace(/\D/g, "")),
            relationship: contact.relationship?.value,
            address: {
              addressLine1: personalData.address,
              city: personalData.city,
              state: personalData.state?.value,
              pincode: Number(personalData.pinCode),
              country: "India",
            },
          })),

        documentImage: (documentsData.governmentDocuments || [])
          .concat(documentsData.personalDocuments || [])
          .filter((doc) => doc.file) // Only include uploaded documents
          .map((doc) => ({
            documentName: doc.label,
            documentType: documentsData.governmentDocuments?.includes(doc) ? "government" : "personal",
            fileName: doc.file?.name || "",
            fileUrl: doc.file?.url || "",
            publicId: doc.file?.publicId || "",
            mimeType: doc.file?.mimeType || "",
            keepOriginal: Boolean(doc.keepOriginal),
          })),

        commissionDetails: {
          commission: Number(commissionData.commissionPercentage) || 0,
          allowance: Number(commissionData.allowance) || 0,
          salaryDisbursementType: commissionData.salaryDisbursementType?.value || "monthly",
        },

        bankDetails: [
          {
            accountHolderName: commissionData.accHolderName,
            bankName: commissionData.bank,
            accountNumber: Number(commissionData.accNumber.replace(/\D/g, "")) || null,
            ifscCode: commissionData.ifscCode,
            branch: commissionData.branch,
          },
        ],

        referenceDetails: commissionData.remarks || "",
      };

      console.log("Payload:", payload);

      const response = await createEmployee(payload);
      console.log("Response:", response);

      toast.success("Agent created successfully!");
      navigate("/admin/people/agents");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create agent. Please try again.";
      toast.error(errorMessage);
      console.error("Create agent error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Stepper steps={steps} currentStep={currentStep} />
      <div>
        {currentStep === 1 && <PersonalInfo ref={personalInfoRef} />}
        {currentStep === 2 && <Documents ref={documentsRef} />}
        {currentStep === 3 && <CommissionDetails ref={commissionDetailsRef} />}
      </div>

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
            text={currentStep === 3 ? "Submit" : "Next"}
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="150px"
            radius="0.5rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleNext}
            loading={isLoading}
            disabled={isLoading}
          />
        </RightButtons>
      </ButtonRow>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.border};
  margin-top: 2rem;
`;

const RightButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

export default CreateAgent;
