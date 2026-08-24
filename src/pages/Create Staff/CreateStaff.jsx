import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import Stepper from "../../components/Stepper";
import PersonalInfo from "./PersonalInfo/PersonalInfo";
import Documents from "./Documents/Documents";
import AddWorkDetails from "./Work Details/AddWorkDetails";
import Button from "../../components/Button";
import { postFormData } from "../../helpers/api_helper";
import { STAFF_REGISTRATION } from "../../helpers/url_helper";
import { buildRegistrationFormData } from "../../helpers/registration_form_data";
import { toast } from "react-toastify";

const CreateStaff = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Use refs (not state) to store form data across steps.
  // State updates are async and cause stale closure bugs inside async handlers.
  // Refs update synchronously and always return the latest value.
  const savedPersonalData = useRef({});
  const savedWorkData = useRef({});

  const personalInfoRef = useRef();
  const documentsRef = useRef();
  const workDetailsRef = useRef();

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
      console.log("Calling handleSubmitStaff...");
      await handleSubmitStaff();
    }
  };

  const handleSubmitStaff = async () => {
    setIsLoading(true);

    try {
      // Read from refs — always the latest values, no stale closure
      const personalData = savedPersonalData.current;
      const workData = savedWorkData.current;
      const documentsData = documentsRef.current?.formData || {};

      console.log("Personal Data:", personalData);
      console.log("Work Data:", workData);
      console.log("Documents Data:", documentsData);

      // --- Build payload: POST /v1/users/staff-registration ---
      const payload = {
        name: personalData.staffName,
        email: personalData.email,
        password: personalData.password,
        phone: Number(personalData.contact),
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
            state: personalData.state?.value,
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
            accountNumber: Number(workData.accNumber),
            ifscCode: workData.ifscCode,
            branch: workData.bankBranch,
            esiAndPf: {
              esiNumber: Number(workData.esiNumber),
              pfNumber: Number(workData.pfNumber),
            },
          },
        ],

      };

      console.log("Payload:", payload);

      const registrationData = buildRegistrationFormData(payload, documentsData);
      const response = await postFormData(STAFF_REGISTRATION, registrationData);
      console.log("Response:", response);

      toast.success("Staff created successfully!");
      navigate("/admin/peopleHub/employees", { state: { activeTab: "Staffs", refresh: true } });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create staff. Please try again.";
      toast.error(errorMessage);
      console.error("Create staff error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Stepper steps={steps} currentStep={currentStep} />
      <div>
        <StepPanel $active={currentStep === 1} aria-hidden={currentStep !== 1}>
          <PersonalInfo ref={personalInfoRef} />
        </StepPanel>
        <StepPanel $active={currentStep === 2} aria-hidden={currentStep !== 2}>
          <Documents ref={documentsRef} />
        </StepPanel>
        <StepPanel $active={currentStep === 3} aria-hidden={currentStep !== 3}>
          <AddWorkDetails ref={workDetailsRef} />
        </StepPanel>
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
`;

const RightButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

export default CreateStaff;
