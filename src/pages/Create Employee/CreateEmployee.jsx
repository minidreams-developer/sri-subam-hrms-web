import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import Stepper from "../../components/Stepper";
import PersonalInfo from "./PersonalInfo/PersonalInfo";
import AddWorkDetails from "./Work Details/AddWorkDetails";
import Documents from "./Documents/Documents";
import Button from "../../components/Button";
import { post, postFormData } from "../../helpers/api_helper";
import { CREATE_EMPLOYEE } from "../../helpers/url_helper";
import { toast } from "react-toastify";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs to access child component data
  const personalInfoRef = useRef();
  const workDetailsRef = useRef();
  const documentsRef = useRef();

  const steps = ["Personal Information", "Document Upload", "Work Details"];

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleCancel = () => {
    navigate("/admin/peopleHub/employees");
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form on final step
      await handleSubmitEmployee();
    }
  };

  const handleSubmitEmployee = async () => {
    setIsLoading(true);

    try {
      // Validate required fields
      if (!personalInfoRef.current?.formData?.employeeName) {
        toast.error("Employee name is required");
        setIsLoading(false);
        return;
      }

      if (!personalInfoRef.current?.formData?.email) {
        toast.error("Email is required");
        setIsLoading(false);
        return;
      }

      if (!workDetailsRef.current?.formData?.department) {
        toast.error("Department is required");
        setIsLoading(false);
        return;
      }

      // Prepare payload
      const personalData = personalInfoRef.current?.formData || {};
      const workData = workDetailsRef.current?.formData || {};
      const documentsData = documentsRef.current?.getDocuments?.() || {};

      const payload = {
        // Personal Information
        employeeType: personalData.employeeType?.value,
        employeeId: personalData.employeeId,
        name: personalData.employeeName,
        gender: personalData.gender?.value,
        dateOfBirth: personalData.dob,
        age: personalData.age,
        phone: personalData.contact,
        email: personalData.email,
        maritalStatus: personalData.maritalStatus?.value,
        motherTongue: personalData.motherTongue?.value,
        identificationMark: personalData.identificationMark,
        religion: personalData.religion?.value,
        address: personalData.address,
        city: personalData.city,
        district: personalData.district?.value,
        state: personalData.state?.value,
        pinCode: personalData.pinCode,
        emergencyContacts: personalData.emergencyContacts || [],

        // Work Information
        dateOfJoining: workData.dateOfJoining,
        experienceType: workData.experienceType?.value,
        department: workData.department?.value,
        designation: workData.designation?.value,
        team: workData.team?.value,
        branch: workData.branch?.value,
        reportingPerson: workData.reportingPerson?.value,
        attendanceType: workData.attendanceType?.value,
        shift: workData.shift?.value,
        totalYearsOfExperience: workData.totalYearsOfExperience,
        lastCompanyName: workData.lastCompanyName,

        // Salary Details
        ctcAnnual: workData.ctcAnnual,
        monthlyCTC: workData.monthlyCTC,
        basicSalary: workData.basicSalary,
        hra: workData.hra,
        conveyanceAllowance: workData.conveyanceAllowance,
        specialAllowance: workData.specialAllowance,
        salaryDisbursementType: workData.salaryDisbursementType?.value,

        // Bank Details
        accountHolderName: workData.accHolderName,
        bankName: workData.bank,
        accountNumber: workData.accNumber,
        ifscCode: workData.ifscCode,
        bankBranch: workData.bankBranch,

        // ESI & PF
        esiNumber: workData.esiNumber,
        pfNumber: workData.pfNumber,

        remarks: workData.remarks,
      };

      // If there are documents, use FormData
      if (personalData.aadhaarImage || Object.keys(documentsData).length > 0) {
        const formData = new FormData();
        
        // Add all payload fields
        Object.keys(payload).forEach((key) => {
          if (payload[key] !== null && payload[key] !== undefined) {
            if (Array.isArray(payload[key])) {
              formData.append(key, JSON.stringify(payload[key]));
            } else {
              formData.append(key, payload[key]);
            }
          }
        });

        // Add profile image if exists
        if (personalData.aadhaarImage) {
          formData.append("profileImage", personalData.aadhaarImage);
        }

        // Add documents
        Object.keys(documentsData).forEach((key) => {
          if (documentsData[key]) {
            formData.append(`documents_${key}`, documentsData[key]);
          }
        });

        const response = await postFormData(CREATE_EMPLOYEE, formData);
        
        if (response) {
          toast.success("Employee created successfully!");
          navigate("/admin/peopleHub/employees");
        }
      } else {
        // Use regular POST if no files
        const response = await post(CREATE_EMPLOYEE, payload);

        if (response) {
          toast.success("Employee created successfully!");
          navigate("/admin/peopleHub/employees");
        }
      }
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
        {currentStep === 1 && (
          <PersonalInfo ref={personalInfoRef} />
        )}
        {currentStep === 2 && (
          <Documents ref={documentsRef} />
        )}
        {currentStep === 3 && (
          <AddWorkDetails ref={workDetailsRef} />
        )}
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

const Section = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0 0 1.5rem 0;
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
