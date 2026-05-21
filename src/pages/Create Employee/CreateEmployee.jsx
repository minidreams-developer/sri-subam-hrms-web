import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import Stepper from "../../components/Stepper";
import PersonalInfo from "./PersonalInfo/PersonalInfo";
import AddWorkDetails from "./Work Details/AddWorkDetails";
import Documents from "./Documents/Documents";
import Button from "../../components/Button";
import { post } from "../../helpers/api_helper";
import { EMPLOYEE_REGISTRATION } from "../../helpers/url_helper";
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
          relattionship: contact.relationship?.value, // API typo preserved
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

        documents: {
          governmentDocuments: documentsData.governmentDocuments || [],
          personalDocuments: documentsData.personalDocuments || [],
        },
      };

      console.log("Payload:", payload);

      const response = await post(EMPLOYEE_REGISTRATION, payload);
      console.log("Response:", response);

      toast.success("Employee created successfully!");
      navigate("/admin/peopleHub/employees");
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
      <Stepper steps={steps} currentStep={currentStep} />
      <div>
        {currentStep === 1 && <PersonalInfo ref={personalInfoRef} />}
        {currentStep === 2 && <Documents ref={documentsRef} />}
        {currentStep === 3 && <AddWorkDetails ref={workDetailsRef} />}
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

export default CreateEmployee;
