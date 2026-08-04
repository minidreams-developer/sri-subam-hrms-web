import { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import DocIcon from "../../../assets/images/employee/document.svg";
import EditIcon from "../../../assets/images/employee/editIcon.svg";
import CardDetails from "../../../components/CardDetails";

const fields = [
  ["designation", "Designation", "Senior UI/UX Designer"],
  ["team", "Team", "Core UI / Design Systems"],
  ["department", "Department", "IT Department"],
  ["dateOfJoining", "Date Of Joining", "20-09-2025"],
  ["experienceType", "Experience Type", "Fresher"],
  ["workExperience", "Work Experience", "8 Months"],
  ["shift", "Shift", "Morning"],
  ["terminationDate", "Termination Date", "-"],
  ["exitDate", "Exit Date", "-"],
  ["reportingPerson", "Reporting Person", "Arun Kumar"],
  ["reference", "Reference", "Ruban Kumar"],
  ["contractAgent", "Contract Agent", "Deepak Kumar"],
  ["totalExperience", "Total Years of Experience", "Senior UI/UX Designer"],
  ["lastCompanyName", "Last Company Name", "Core UI / Design Systems"],
  ["lastCompanyExperience", "Last Company Experience", "IT Department"],
  ["relievedDate", "Relieved Date", "20-09-2025"],
  ["location", "Location", "Tirupur"],
  ["attendancePermission", "Attendance Permission", "Auto"],
  ["accountHolderName", "Acc Holder Name", "Manoj Kumar"],
  ["bank", "Bank", "State bank of india"],
  ["accountNumber", "Acc Number", "1234 5678 9012 3456"],
  ["ifscCode", "IFSC Code", "SBI15669"],
  ["branch", "Branch", "Tirupur"],
  ["esiNumber", "ESI Number", "Manoj Kumar"],
  ["pfNumber", "PF Number", "designedbymanoj@gmail.com"],
  ["email", "Email", "designedbymanoj@gmail.com"],
  ["password", "Password", "Manoj Kumar"],
];

const makeDetails = (employee) => Object.fromEntries(
  fields.map(([key, , fallback]) => [key, employee?.[key] ?? fallback]),
);

export const WorkDetails = ({ employee }) => {
  const [details, setDetails] = useState(() => makeDetails(employee));
  const [draft, setDraft] = useState(details);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const nextDetails = makeDetails(employee);
    setDetails(nextDetails);
    setDraft(nextDetails);
  }, [employee]);

  const openEditor = () => {
    setDraft(details);
    setEditing(true);
  };

  const saveDetails = (event) => {
    event.preventDefault();
    setDetails(draft);
    setEditing(false);
  };

  const items = (keys) => keys.map((key) => {
    const field = fields.find(([fieldKey]) => fieldKey === key);
    return { label: field[1], value: details[key] || "-" };
  });

  return (
    <Wrapper>
      <HeaderRow>
        <LeftHead>
          <IconWrap>
            <Icon src={DocIcon} alt="user" />
          </IconWrap>
          <Title>Work Details</Title>
        </LeftHead>
        <EditBtn type="button" onClick={openEditor}>
          <img src={EditIcon} alt="edit" width="16" height="16" />
          Edit details
        </EditBtn>
      </HeaderRow>
      <CardDetails
        title="Basic Information"
        columns={3}
        items={items(["designation", "team", "department", "dateOfJoining", "experienceType", "workExperience", "shift", "terminationDate", "exitDate", "reportingPerson", "reference", "contractAgent"])}
      />
      <CardDetails
        title="Experience Details"
        columns={3}
        items={items(["totalExperience", "lastCompanyName", "lastCompanyExperience", "relievedDate", "location"])}
      />
      <CardDetails
        title="Shift & Attendance Details"
        columns={3}
        items={items(["shift", "attendancePermission"])}
      />
      <CardDetails
        title="Bank Details"
        columns={3}
        items={items(["accountHolderName", "bank", "accountNumber", "ifscCode", "branch"])}
      />
      <CardDetails
        title="ESI & PF Details"
        columns={3}
        items={items(["esiNumber", "pfNumber"])}
      />
      <CardDetails
        title="Login Details"
        columns={3}
        items={items(["email", "password"])}
      />
      {editing && (
        <Backdrop onMouseDown={() => setEditing(false)}>
          <Dialog role="dialog" aria-modal="true" aria-labelledby="work-details-title" onMouseDown={(event) => event.stopPropagation()}>
            <DialogHeader><DialogTitle id="work-details-title">Edit Work Details</DialogTitle><CloseButton type="button" onClick={() => setEditing(false)} aria-label="Close">×</CloseButton></DialogHeader>
            <Form onSubmit={saveDetails}>
              <FormGrid>{fields.map(([key, label]) => <Field key={key}><label htmlFor={`work-${key}`}>{label}</label><input id={`work-${key}`} value={draft[key] ?? ""} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} /></Field>)}</FormGrid>
              <Actions><CancelButton type="button" onClick={() => setEditing(false)}>Cancel</CancelButton><SaveButton type="submit">Save changes</SaveButton></Actions>
            </Form>
          </Dialog>
        </Backdrop>
      )}
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

const Backdrop = styled.div`position:fixed;inset:0;z-index:1000;background:rgba(12,36,39,.45);display:grid;place-items:center;padding:24px;`;
const Dialog = styled.div`width:min(900px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:12px;box-shadow:0 24px 60px rgba(12,36,39,.2);padding:20px;`;
const DialogHeader = styled.div`display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;`;
const DialogTitle = styled.h2`margin:0;color:${theme.colors.textColor};font:600 18px/1.6 "Inter-SemiBold",sans-serif;`;
const CloseButton = styled.button`border:0;background:transparent;color:${theme.colors.secondaryTextColor};font-size:28px;line-height:1;cursor:pointer;`;
const Form = styled.form`display:flex;flex-direction:column;gap:24px;`;
const FormGrid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;@media(max-width:800px){grid-template-columns:repeat(2,minmax(0,1fr));}@media(max-width:520px){grid-template-columns:1fr;}`;
const Field = styled.div`display:flex;flex-direction:column;gap:6px;label{color:${theme.colors.secondaryTextColor};font:500 12px/1.6 "Inter-Medium",sans-serif;}input{width:100%;height:40px;border:1px solid ${theme.colors.border};border-radius:7px;padding:0 12px;color:${theme.colors.textColor};font:500 14px "Inter-Medium",sans-serif;outline:none;&:focus{border-color:${theme.colors.primary};box-shadow:0 0 0 3px rgba(6,108,120,.1);}}`;
const Actions = styled.div`display:flex;justify-content:flex-end;gap:12px;position:sticky;bottom:-20px;background:#fff;padding:14px 0 0;`;
const CancelButton = styled.button`height:40px;padding:0 18px;border:1px solid ${theme.colors.border};border-radius:8px;background:#fff;color:${theme.colors.textColor};font:600 13px "Inter-SemiBold",sans-serif;cursor:pointer;`;
const SaveButton = styled.button`height:40px;padding:0 18px;border:0;border-radius:8px;background:${theme.colors.primary};color:#fff;font:600 13px "Inter-SemiBold",sans-serif;cursor:pointer;`;
