import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiCheck } from "react-icons/fi";
import theme from "../../theme/theme";
import PersonalInfo from "./PersonalInfo/PersonalInfo";
import AddWorkDetails from "./Work Details/AddWorkDetails";
import Documents from "./Documents/Documents";
import Button from "../../components/Button";
import { patchFormData, post } from "../../helpers/api_helper";
import { EMPLOYEE_REGISTRATION } from "../../helpers/url_helper";
import { buildDocumentFormData } from "../../helpers/registration_form_data";
import { toast } from "react-toastify";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Use refs (not state) to store form data across steps.
  // State updates are async and cause stale closure bugs inside async handlers.
  // Refs update synchronously and always return the latest value.
  const savedPersonalData = useRef({});
  const savedWorkData = useRef({});

  const personalInfoRef = useRef();
  const workDetailsRef = useRef();
  const documentsRef = useRef();

  const steps = ["Personal Information", "Document Upload", "Work Details"];

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 3 && workDetailsRef.current?.formData) {
        savedWorkData.current = workDetailsRef.current.formData;
      }
      setCurrentStep((s) => s - 1);
    } else {
      navigate(-1);
    }
  };

  const handleCancel = () => {
    navigate("/admin/peopleHub/employees");
  };

  const handleNext = async () => {
    console.log("handleNext called, currentStep:", currentStep);
    if (currentStep < 3) {
      // Snapshot step 1 data into ref before PersonalInfo unmounts
      if (currentStep === 1 && personalInfoRef.current?.formData) {
        savedPersonalData.current = personalInfoRef.current.formData;
        console.log("Saved personal data:", savedPersonalData.current);
      }
      setCurrentStep((s) => s + 1);
    } else {
      // Step 3 is still mounted — read directly from its ref
      if (workDetailsRef.current?.formData) {
        savedWorkData.current = workDetailsRef.current.formData;
        console.log("Saved work data:", savedWorkData.current);
      }
      console.log("Calling handleSubmitEmployee...");
      await handleSubmitEmployee();
    }
  };

  const handleSubmitEmployee = async () => {
    setIsLoading(true);

    try {
      // Read from refs — always the latest values, no stale closure
      const personalData = savedPersonalData.current;
      const workData = savedWorkData.current;
      const documentsData = documentsRef.current?.formData || {};

      console.log("Personal Data:", personalData);
      console.log("Work Data:", workData);
      console.log("Documents Data:", documentsData);

      // --- Build payload: POST /v1/users/employee-registration ---
      const payload = {
        name: personalData.employeeName,
        email: personalData.email,
        password: personalData.password,
        phone: Number(personalData.contact),
        role: "employee",
        gender: personalData.gender?.value,
        dateOfBirth: personalData.dob,
        age: Number(personalData.age),
        spokenLanguages: personalData.spokenLanguages || [],
        martialStatus: personalData.maritalStatus?.value, // API typo preserved
        motherTongue: personalData.motherTongue?.value,
        identificationMark: personalData.identificationMark,
        religion: personalData.religion?.value,
        profilePic: personalData.profilePic || "",

        documentNo: {
          aadharNo: Number(personalData.aadharNo),
          panNo: personalData.panNo,
        },

        addresses: [
          {
            addressLine1: personalData.address,
            addressLine2: personalData.addressLine2 || "",
            city: personalData.city,
            pincode: Number(personalData.pinCode),
          },
        ],

        emergencyContacts: (personalData.emergencyContacts || []).map((contact) => ({
          contactName: contact.emergencyContactName,
          phone: Number(contact.emergencyContact),
          relationship: contact.relationship?.value,
          mobileNumber: Number(contact.emergencyContact),
        })),

        workInformation: {
          designation: workData.designation?.value,
          joinedDate: workData.dateOfJoining,
          experienceType: workData.experienceType?.value,
          department: workData.department?.value,
          team: workData.team?.value,
          branch: workData.branch?.value,
          contractAgent: workData.contractAgent?.value,
          reportingPerson: workData.reportingPerson?.value,
          AttendanceType: workData.attendanceType?.value,
          shiftId: workData.shift?.value,
          userRemarks: workData.remarks,
        },

        salaryDetails: {
          basicSalary: Number(workData.basicSalary),
          annualCTC: Number(workData.ctcAnnual),
          monthlyCTC: Number(workData.monthlyCTC),
          houseRentAllowance: Number(workData.hra),
          conveyanceAllowance: Number(workData.conveyanceAllowance),
          specialAllowance: Number(workData.specialAllowance),
          otherFixedAllowance: Number(workData.otherFixedAllowances) || 0,
        },

        bankDetails: [
          {
            accountHolderName: workData.accHolderName,
            bankName: workData.bank,
            accountNumber: String(workData.accNumber || "").trim(),
            ifscCode: workData.ifscCode,
            branch: workData.bankBranch,
            esiAndPf: {
              esiNumber: String(workData.esiNumber || "").trim(),
              pfNumber: String(workData.pfNumber || "").trim(),
            },
          },
        ],
      };

      console.log("Payload:", payload);

      const response = await post(EMPLOYEE_REGISTRATION, payload);
      console.log("Response:", response);

      const selectedDocuments = [
        ...(documentsData.governmentDocuments || []),
        ...(documentsData.personalDocuments || []),
      ].filter((document) => document.file instanceof File);
      const createdEmployee = response?.data || response?.user || response;
      const employeeId = createdEmployee?.id || createdEmployee?._id;

      if (selectedDocuments.length) {
        if (!employeeId) throw new Error("Employee created, but its ID was not returned for document upload");
        await patchFormData(
          `/v1/users/${employeeId}`,
          buildDocumentFormData(documentsData),
        );
      }

      toast.success("Employee created successfully!");
      navigate("/admin/peopleHub/employees", { state: { activeTab: "Employee", refresh: true } });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create employee. Please try again.";
      toast.error(errorMessage);
      console.error("Create employee error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Progress aria-label="Employee creation progress">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <ProgressStep key={step}>
              <StepContent aria-current={isActive ? "step" : undefined}>
                <StepNumber $active={isActive} $completed={isCompleted}>
                  {isCompleted ? <FiCheck aria-hidden="true" /> : stepNumber}
                </StepNumber>
                <StepLabel $active={isActive}>{step}</StepLabel>
              </StepContent>
              {index < steps.length - 1 && <StepLine />}
            </ProgressStep>
          );
        })}
      </Progress>

      <FormContent>
        <StepPanel $active={currentStep === 1} aria-hidden={currentStep !== 1}>
          <PersonalInfo ref={personalInfoRef} />
        </StepPanel>
        <StepPanel $active={currentStep === 2} aria-hidden={currentStep !== 2}>
          <Documents ref={documentsRef} />
        </StepPanel>
        <StepPanel $active={currentStep === 3} aria-hidden={currentStep !== 3}>
          <AddWorkDetails ref={workDetailsRef} />
        </StepPanel>
      </FormContent>

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
  min-height: calc(100vh - 5.625rem);
  padding: 1.5rem 0 1rem;
`;

const Progress = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
`;

const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;

  &:last-child {
    flex: 0 0 auto;
  }
`;

const StepContent = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 0.75rem;
`;

const StepNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex: 0 0 2rem;
  border-radius: 50%;
  background: ${({ $active, $completed }) =>
    $active || $completed ? theme.colors.primary : theme.colors.white};
  color: ${({ $active, $completed }) =>
    $active || $completed ? theme.colors.white : theme.colors.primaryGreen};
  font-family: "Inter-SemiBold", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;

  svg {
    width: 1.125rem;
    height: 1.125rem;
    stroke-width: 3;
  }
`;

const StepLabel = styled.span`
  color: ${({ $active }) =>
    $active ? theme.colors.primary : theme.colors.primaryGreen};
  font-family: "Inter_18pt-Medium", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
`;

const StepLine = styled.span`
  height: 1px;
  min-width: 2rem;
  flex: 1;
  margin: 0 1.5rem;
  background: ${theme.colors.border};
`;

const FormContent = styled.div`
  width: 100%;
`;

// Keep every step mounted so typed values and selected File objects survive
// moving forward and backward through the form.
const StepPanel = styled.div`
  display: ${({ $active }) => ($active ? "block" : "none")};
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.border};
  margin-top: 2rem;

  @media (max-width: 640px) {
    align-items: stretch;
    flex-direction: column-reverse;
    gap: 0.75rem;

    > button,
    > div,
    > div > button {
      width: 100%;
    }
  }
`;

const RightButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 640px) {
    gap: 0.75rem;
  }
`;

export default CreateEmployee;
