import { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import DocIcon from "../../../assets/images/employee/document.svg";
import EditIcon from "../../../assets/images/employee/editIcon.svg";
import CardDetails from "../../../components/CardDetails";
import { get, patch } from "../../../helpers/api_helper";
import { DEPARTMENTS, GET_ALL_EMPLOYEES, GET_SHIFTS, TEAMS } from "../../../helpers/url_helper";
import { toast } from "react-toastify";

const fields = [
  ["designation", "Designation"], ["team", "Team"], ["department", "Department"],
  ["dateOfJoining", "Date Of Joining"], ["experienceType", "Experience Type"], ["workExperience", "Work Experience"],
  ["shift", "Shift"], ["terminationDate", "Termination Date"], ["exitDate", "Exit Date"],
  ["reportingPerson", "Reporting Person"], ["reference", "Reference"], ["contractAgent", "Contract Agent"],
  ["totalExperience", "Total Years of Experience"], ["lastCompanyName", "Last Company Name"],
  ["lastCompanyExperience", "Last Company Experience"], ["relievedDate", "Relieved Date"],
  ["location", "Location"], ["attendancePermission", "Attendance Permission"],
  ["accountHolderName", "Acc Holder Name"], ["bank", "Bank"], ["accountNumber", "Acc Number"],
  ["ifscCode", "IFSC Code"], ["branch", "Branch"], ["esiNumber", "ESI Number"],
  ["pfNumber", "PF Number"], ["email", "Email"], ["password", "Password"],
];

const staticDropdownOptions = {
  designation: [
    { value: "manager", label: "Manager" },
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
  ],
  experienceType: [
    { value: "fresher", label: "Fresher" },
    { value: "experienced", label: "Experienced" },
  ],
  contractAgent: [
    { value: "agent_1", label: "Agent 1" },
    { value: "agent_2", label: "Agent 2" },
  ],
  attendancePermission: [
    { value: "bio_metric", label: "Bio Metric" },
    { value: "manual", label: "Manual" },
  ],
};

const listFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.users)) return response.users;
  return [];
};

const valueOf = (value, keys = []) => {
  if (value === undefined || value === null || value === "") return "N/A";
  if (typeof value !== "object") return value;
  return keys.map((key) => value?.[key]).find((item) => item !== undefined && item !== null && item !== "") ?? "N/A";
};
const dateOf = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-GB");
};
const makeDetails = (employee) => {
  const work = employee?.workInformation || {};
  const bank = employee?.bankDetails?.[0] || work.bankDetails?.[0] || {};
  const esiAndPf = bank.esiAndPf || {};
  return {
    designation: valueOf(work.designation || employee?.designation, ["name", "designationName"]),
    team: valueOf(work.team || employee?.team, ["teamName", "name"]),
    department: valueOf(work.department || employee?.department, ["departmentName", "name"]),
    dateOfJoining: dateOf(work.joinedDate || work.dateOfJoining || employee?.dateOfJoining),
    experienceType: valueOf(work.experienceType), workExperience: valueOf(work.workExperience),
    shift: valueOf(work.shift || work.shiftId || employee?.shift, ["shiftName", "name"]),
    terminationDate: dateOf(work.terminationDate || employee?.terminationDate), exitDate: dateOf(work.exitDate || employee?.exitDate),
    reportingPerson: valueOf(work.reportingPerson, ["name", "employeeName"]), reference: valueOf(work.reference, ["name", "employeeName"]),
    contractAgent: valueOf(work.contractAgent, ["name"]), totalExperience: valueOf(work.totalExperience),
    lastCompanyName: valueOf(work.lastCompanyName), lastCompanyExperience: valueOf(work.lastCompanyExperience),
    relievedDate: dateOf(work.relievedDate), location: valueOf(work.location || work.branch, ["branchName", "name", "city"]),
    attendancePermission: valueOf(work.attendancePermission || work.AttendanceType), accountHolderName: valueOf(bank.accountHolderName),
    bank: valueOf(bank.bankName || bank.bank), accountNumber: valueOf(bank.accountNumber), ifscCode: valueOf(bank.ifscCode),
    branch: valueOf(bank.branch), esiNumber: valueOf(esiAndPf.esiNumber), pfNumber: valueOf(esiAndPf.pfNumber),
    email: valueOf(employee?.email), password: "N/A",
  };
};

const apiValue = (value) => value === "N/A" ? "" : value;
const objectIdOrValue = (draftValue, original, displayKeys) => {
  if (!original || typeof original !== "object") return apiValue(draftValue);
  const originalDisplay = valueOf(original, displayKeys);
  return String(draftValue) === String(originalDisplay) ? original.id || original._id || draftValue : apiValue(draftValue);
};
const apiDate = (value) => {
  if (!value || value === "N/A") return "";
  const parts = String(value).split("/");
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value;
};
const dateFields = new Set(["dateOfJoining", "terminationDate", "exitDate", "relievedDate"]);
const dateInputValue = (value) => {
  if (!value || value === "N/A") return "";
  const parts = String(value).split("/");
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : String(value).slice(0, 10);
};

export const WorkDetails = ({ employee, onEmployeeUpdated }) => {
  const [details, setDetails] = useState(() => makeDetails(employee));
  const [draft, setDraft] = useState(details);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState({
    department: [], team: [], shift: [], reportingPerson: [],
  });

  useEffect(() => {
    const nextDetails = makeDetails(employee);
    setDetails(nextDetails);
    setDraft(nextDetails);
  }, [employee]);

  useEffect(() => {
    const loadDropdownOptions = async () => {
      try {
        const [departments, teams, shifts, users] = await Promise.all([
          get(`${DEPARTMENTS}?page=1&limit=100`),
          get(`${TEAMS}?page=1&limit=100`),
          get(`${GET_SHIFTS}?page=1&limit=100`),
          get(`${GET_ALL_EMPLOYEES}?page=1&limit=100`),
        ]);
        setDropdownOptions({
          department: listFromResponse(departments).map((item) => ({
            value: item.id || item._id,
            label: item.departmentName || item.name || "Unknown",
          })),
          team: listFromResponse(teams).map((item) => ({
            value: item.id || item._id,
            label: item.teamName || item.name || "Unknown",
          })),
          shift: listFromResponse(shifts).map((item) => ({
            value: item.id || item._id,
            label: item.shiftName || item.name || "Unknown",
          })),
          reportingPerson: listFromResponse(users).map((item) => ({
            value: item.id || item._id,
            label: item.name || [item.firstName, item.lastName].filter(Boolean).join(" ") || item.email || "Unknown",
          })),
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load work detail dropdowns");
      }
    };
    loadDropdownOptions();
  }, []);

  const optionsFor = (key) => staticDropdownOptions[key] || dropdownOptions[key];
  const selectedOptionValue = (key) => {
    const value = draft[key] ?? "";
    const match = optionsFor(key)?.find((option) =>
      String(option.value) === String(value) || String(option.label) === String(value),
    );
    return match?.value ?? value;
  };

  const openEditor = () => {
    setDraft(details);
    setEditing(true);
  };

  const saveDetails = async (event) => {
    event.preventDefault();
    const employeeId = employee?.id || employee?._id;
    if (!employeeId) return toast.error("Employee ID is missing");

    const work = employee?.workInformation || {};
    const { bankDetails: nestedBankDetails, ...workWithoutBankDetails } = work;
    const bankEntry = employee?.bankDetails?.[0] || nestedBankDetails?.[0];
    const currentBank = bankEntry && typeof bankEntry === "object" ? bankEntry : {};
    const esiAndPfEntry = currentBank.esiAndPf;
    const currentEsiAndPf = esiAndPfEntry && typeof esiAndPfEntry === "object" ? esiAndPfEntry : {};
    const workInformation = {
      ...workWithoutBankDetails,
      designation: apiValue(draft.designation),
      team: objectIdOrValue(draft.team, work.team || employee?.team, ["teamName", "name"]),
      department: objectIdOrValue(draft.department, work.department || employee?.department, ["departmentName", "name"]),
      joinedDate: apiDate(draft.dateOfJoining), experienceType: apiValue(draft.experienceType),
      workExperience: apiValue(draft.workExperience),
      shiftId: objectIdOrValue(draft.shift, work.shiftId || work.shift || employee?.shift, ["shiftName", "name"]),
      terminationDate: apiDate(draft.terminationDate), exitDate: apiDate(draft.exitDate),
      reportingPerson: objectIdOrValue(draft.reportingPerson, work.reportingPerson, ["name", "employeeName"]),
      reference: objectIdOrValue(draft.reference, work.reference, ["name", "employeeName"]),
      contractAgent: objectIdOrValue(draft.contractAgent, work.contractAgent, ["name"]),
      totalExperience: apiValue(draft.totalExperience), lastCompanyName: apiValue(draft.lastCompanyName),
      lastCompanyExperience: apiValue(draft.lastCompanyExperience), relievedDate: apiDate(draft.relievedDate),
      location: apiValue(draft.location), AttendanceType: apiValue(draft.attendancePermission),
    };
    const bankDetails = [{
      ...currentBank,
      ...(currentBank._id || currentBank.id
        ? { _id: currentBank._id || currentBank.id }
        : {}),
      accountHolderName: apiValue(draft.accountHolderName),
      bankName: apiValue(draft.bank),
      accountNumber: apiValue(draft.accountNumber),
      ifscCode: apiValue(draft.ifscCode),
      branch: apiValue(draft.branch),
      esiAndPf: {
        ...currentEsiAndPf,
        esiNumber: apiValue(draft.esiNumber),
        pfNumber: apiValue(draft.pfNumber),
      },
    }];
    const payload = { workInformation, bankDetails, email: apiValue(draft.email) };

    setSaving(true);
    try {
      const response = await patch(`/v1/users/${employeeId}`, payload);
      const responseEmployee = response?.data || response?.user || response;
      const updatedEmployee = { ...employee, ...payload, ...(responseEmployee || {}) };
      setDetails(makeDetails(updatedEmployee));
      onEmployeeUpdated?.(updatedEmployee);
      setEditing(false);
      toast.success("Work details updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to update work details");
    } finally {
      setSaving(false);
    }
  };

  const items = (keys) => keys.map((key) => {
    const field = fields.find(([fieldKey]) => fieldKey === key);
    return { label: field[1], value: details[key] || "N/A" };
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
              <FormGrid>{fields.map(([key, label]) => {
                const options = optionsFor(key);
                return <Field key={key}><label htmlFor={`work-${key}`}>{label}</label>{options ? <select id={`work-${key}`} value={selectedOptionValue(key)} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))}><option value="">Select {label}</option>{!options.some((option) => String(option.value) === String(selectedOptionValue(key))) && draft[key] && draft[key] !== "N/A" && <option value={draft[key]}>{draft[key]}</option>}{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input id={`work-${key}`} type={dateFields.has(key) ? "date" : "text"} value={dateFields.has(key) ? dateInputValue(draft[key]) : draft[key] ?? ""} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} />}</Field>;
              })}</FormGrid>
              <Actions><CancelButton type="button" onClick={() => setEditing(false)} disabled={saving}>Cancel</CancelButton><SaveButton type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</SaveButton></Actions>
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
const Field = styled.div`display:flex;flex-direction:column;gap:6px;label{color:${theme.colors.secondaryTextColor};font:500 12px/1.6 "Inter-Medium",sans-serif;}input,select{width:100%;height:40px;border:1px solid ${theme.colors.border};border-radius:7px;padding:0 12px;background:#fff;color:${theme.colors.textColor};font:500 14px "Inter-Medium",sans-serif;outline:none;&:focus{border-color:${theme.colors.primary};box-shadow:0 0 0 3px rgba(6,108,120,.1);}}select{cursor:pointer;}`;
const Actions = styled.div`display:flex;justify-content:flex-end;gap:12px;position:sticky;bottom:-20px;background:#fff;padding:14px 0 0;`;
const CancelButton = styled.button`height:40px;padding:0 18px;border:1px solid ${theme.colors.border};border-radius:8px;background:#fff;color:${theme.colors.textColor};font:600 13px "Inter-SemiBold",sans-serif;cursor:pointer;`;
const SaveButton = styled.button`height:40px;padding:0 18px;border:0;border-radius:8px;background:${theme.colors.primary};color:#fff;font:600 13px "Inter-SemiBold",sans-serif;cursor:pointer;`;
