import styled from "styled-components";
import { useState } from "react";
import theme from "../../theme/theme";
import DocIcon from "../../assets/images/employee/document.svg";
import EditIcon from "../../assets/images/employee/editIcon.svg";
import CardDetails from "../../components/CardDetails";
import CardDetailsAlt from "../../components/CardDetailsAlt";
import FileUploadComponent from "../../components/FileUploadComponent";
import CheckboxGroup from "../../components/CheckboxGroup";

export const EmployeeOffboardDetails = () => {
  const [docFiles, setDocFiles] = useState([]);

  return (
    <Wrapper>
      <HeaderRow>
        <LeftHead>
          <IconWrap>
            <Icon src={DocIcon} alt="offboard" />
          </IconWrap>
          <Title>Off-Board  Details</Title>
        </LeftHead>
        <EditBtn>
          <img src={EditIcon} alt="edit" width="16" height="16" />
          Edit details
        </EditBtn>
      </HeaderRow>
      <CardDetails
        title="Employee Information"
        columns={3}
        items={[
          { label: "Employee Name", value: "John Doe" },
          { label: "Employee ID", value: "EMP001" },
          { label: "Designation", value: "Software Engineer" },
          { label: "Department", value: "IT Department" },
          { label: "Team", value: "Development Team" },
          { label: "Reporting Manager", value: "Arun Kumar" },
          { label: "Date Of Joining", value: "15-01-2023" },
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
          { label: "Asset 1", value: "iPad" },
          { label: "Condition", value: "Bad" },
          { label: "Return Status", value: "Pending" },
        ]}
      />
      
      <FnFSection>
        <FnFTitle>Final Settlement (FnF) Details</FnFTitle>
        
        <FnFContent>
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
        </FnFContent>
      </FnFSection>

      <FnFSection>
        <FnFTitle>Final Settlement (FnF) Details</FnFTitle>
        
        <FnFContent>
                  
          <CheckboxGroup
            options={[
              "10th Marksheet",
              "12th Marksheet",
            ]}
          />
        </FnFContent>
      </FnFSection>

      <CardDetailsAlt
        title="Documents"
        columns={3}
        onUpload={(file) => {
          const name = file?.name || "";
          const ext = name.split(".").pop()?.toLowerCase() || "";
          const type =
            ext === "pdf"
              ? "PDF"
              : ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)
                ? "Image"
                : ["doc", "docx"].includes(ext)
                  ? "Word"
                  : ["xls", "xlsx"].includes(ext)
                    ? "Excel"
                    : ["txt"].includes(ext)
                      ? "Text"
                      : ext
                        ? ext.toUpperCase()
                        : "File";
          setDocFiles((prev) => [...prev, { label: type, fileName: name }]);
        }}
        accept="*"
      >
        {docFiles.map((doc, idx) => (
          <FileUploadComponent
            key={idx}
            label={doc.label}
            fileName={doc.fileName}
          />
        ))}
      </CardDetailsAlt>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border-radius: 12px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  padding: 1rem;
`;

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftHead = styled.div`
  display: flex;
  align-items: center;
  gap: 1.125rem;
`;

const IconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem;
  border-radius: 6px;
  background: ${theme.colors.secondaryPrimary};
`;

const Icon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  line-height: 160%;
  margin: 0;
`;

const EditBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  height: 40px;
  padding: 0 0.875rem;
  background: ${theme.colors.secondaryPrimary};
  border: none;
  border-radius: 0.5rem;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
`;

const FnFSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FnFTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const FnFContent = styled.div`
  background: #EDF6F966;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export default EmployeeOffboardDetails;
