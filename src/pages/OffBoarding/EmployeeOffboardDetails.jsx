import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import DocIcon from "../../assets/images/employee/document.svg";
import EditIcon from "../../assets/images/employee/edit-05_svgrepo.com.svg";
import CardDetails from "../../components/CardDetails";
import CardDetailsAlt from "../../components/CardDetailsAlt";
import FileUploadComponent from "../../components/FileUploadComponent";
import CheckboxGroup from "../../components/CheckboxGroup";

const earnings = [
  "Last Month Salary",
  "Pending Salary",
  "Leave Encashment",
  "Bonus / Incentives",
  "Reimbursements",
];

const deductions = [
  "Notice Pay",
  "Asset Damage",
  "Loan Recovery",
  "Advance Salary",
  "Tax Adjustments",
];

export const EmployeeOffboardDetails = () => {
  const navigate = useNavigate();
  const { setHeaderTitle, setHeaderBackAction } = useOutletContext();
  const [docFiles, setDocFiles] = useState([
    { label: "Aadhaar", fileName: "File Name" },
    { label: "Aadhaar", fileName: "File Name" },
    { label: "Aadhaar", fileName: "File Name" },
    { label: "Aadhaar", fileName: "File Name" },
    { label: "Aadhaar", fileName: "File Name" },
  ]);

  useEffect(() => {
    setHeaderTitle("Employee Off-Board Details");
    setHeaderBackAction(() => () => navigate("/admin/peopleHub/off-boarding"));
    return () => {
      setHeaderTitle("");
      setHeaderBackAction(null);
    };
  }, [navigate, setHeaderBackAction, setHeaderTitle]);

  const handleUpload = (file) => {
    const extension = file?.name?.split(".").pop()?.toLowerCase();
    const label = extension === "pdf" ? "PDF" : "Document";
    setDocFiles((files) => [...files, { label, fileName: file.name }]);
  };

  return (
    <PageCard>
      <HeaderRow>
        <Heading>
          <IconWrap><img src={DocIcon} alt="" /></IconWrap>
          <Title>Off-Board Details</Title>
        </Heading>
        <EditButton
          type="button"
          onClick={() => navigate("/admin/peopleHub/off-boarding/createEmployeeOffBoard")}
        >
          <img src={EditIcon} alt="" />
          Edit details
        </EditButton>
      </HeaderRow>

      <CardDetails
        title="Employee Details"
        columns={3}
        items={[
          { label: "Employee ID", value: "EMP001" },
          { label: "Employee", value: "Manoj Kumar" },
          { label: "Date Of Joining", value: "20-09-2025" },
          { label: "Department", value: "Senior UI/UX Designer" },
          { label: "Designation", value: "Core UI / Design Systems" },
          { label: "Team", value: "Design Team" },
          { label: "Reporting Manager", value: "Arun Kumar" },
          { label: "Work Experience", value: "3 Years 3 Months" },
        ]}
      />

      <CardDetails
        title="Exit Information Section"
        columns={3}
        items={[
          { label: "Exit Type", value: "Termination" },
          { label: "Exit Reason", value: "Personal Reasons" },
          { label: "Resignation Submitted Date", value: "20-09-2025" },
          { label: "Last Working Date", value: "20-09-2025" },
          { label: "Notice Period", value: "-" },
          { label: "Actual Notice Served", value: "-" },
          { label: "Waiver", value: "Yes" },
          { label: "Exit Approved By", value: "Deepak" },
          { label: "Approval Date", value: "20-09-2025" },
        ]}
      />

      <CardDetails
        title="Asset Management"
        columns={3}
        items={[
          { label: "Asset 1", value: "Laptop" },
          { label: "Condition", value: "Good" },
          { label: "Return Status", value: "Returned" },
          { label: "Asset 2", value: "iPad" },
          { label: "Condition", value: "Bad" },
          { label: "Return Status", value: "Pending" },
        ]}
      />

      <Section>
        <SectionTitle>Final Settlement (FnF) Details</SectionTitle>
        <TintedPanel>
          <CheckboxGroup title="Earnings" options={earnings} defaultChecked={["Pending Salary", "Leave Encashment", "Reimbursements"]} />
          <CheckboxGroup title="Deductions" options={deductions} defaultChecked={deductions} />
        </TintedPanel>
      </Section>

      <Section>
        <SectionTitle>Final Settlement (FnF) Details</SectionTitle>
        <TintedPanel>
          <CheckboxGroup title="Documents Return (Originals)" options={["10th Marksheet", "12th Marksheet"]} />
        </TintedPanel>
      </Section>

      <CardDetailsAlt title="Documents" columns={3} onUpload={handleUpload} accept="*">
        {docFiles.map((doc, index) => (
          <FileUploadComponent key={`${doc.fileName}-${index}`} label={doc.label} fileName={doc.fileName} />
        ))}
      </CardDetailsAlt>
    </PageCard>
  );
};

export default EmployeeOffboardDetails;

const PageCard = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1.25rem;
  border-radius: 10px;
  background: ${theme.colors.white};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 1.125rem;
`;

const IconWrap = styled.span`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: ${theme.colors.secondaryPrimary};
  img { width: 20px; height: 20px; }
`;

const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.textColor};
  font: 600 1.125rem/1.6 "Inter-SemiBold", sans-serif;
`;

const EditButton = styled.button`
  width: 200px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  border: 0;
  border-radius: 8px;
  background: ${theme.colors.secondaryPrimary};
  color: ${theme.colors.primary};
  font: 600 0.875rem/1.6 "Inter-SemiBold", sans-serif;
  cursor: pointer;
  img { width: 24px; height: 24px; }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.primary};
  font: 600 1rem/1.6 "Inter-SemiBold", sans-serif;
`;

const TintedPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.875rem 1.25rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  background: rgba(237, 246, 249, 0.4);
`;
