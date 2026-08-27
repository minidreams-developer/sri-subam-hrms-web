import React from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import UserIcon from "../../../assets/images/employee/uprofileIcon.svg";
import EditIcon from "../../../assets/images/employee/editIcon.svg";
import EditIconLight from "../../../assets/images/employee/edit-05_svgrepo.com.svg";
import SampleProfile from "../../../assets/images/employee/sampleProfile.jpg";
import CardDetails from "../../../components/CardDetails";
import CardDetailsAlt from "../../../components/CardDetailsAlt";
import FileUploadComponent from "../../../components/FileUploadComponent";
import Button from "../../../components/Button";
import { patch } from "../../../helpers/api_helper";
import { toast } from "react-toastify";

export const PersonalDetails = ({ agent, onAgentUpdated }) => {
  const fallback = agent || {};
  const address = fallback.address?.[0] || fallback.addresses?.[0] || {};
  const details = {
    fullName: fallback.name || fallback.fullName || "N/A",
    agentId: fallback.employeeId || fallback.agentId || "N/A",
    employmentType: fallback.employeeType || fallback.employmentType || "Agent",
    gender: fallback.gender || "N/A",
    dob: fallback.dateOfBirth ? new Date(fallback.dateOfBirth).toLocaleDateString("en-GB") : "N/A",
    age: fallback.age === 0 || fallback.age ? `${fallback.age} Years` : "N/A",
    contact: fallback.phone || fallback.contact || "N/A",
    email: fallback.email || "N/A",
    maritalStatus: fallback.maritalStatus || fallback.martialStatus || "N/A",
    motherTongue: fallback.motherTongue || "N/A",
    identificationMark: fallback.identificationMark || "N/A",
  };
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({});
  const openEditor = () => {
    setForm({
      name: fallback.name || "", employeeId: fallback.employeeId || fallback.agentId || "",
      gender: fallback.gender || "", dateOfBirth: String(fallback.dateOfBirth || "").slice(0, 10),
      age: fallback.age ?? "", phone: fallback.phone || "", email: fallback.email || "",
      maritalStatus: fallback.maritalStatus || fallback.martialStatus || "",
      motherTongue: fallback.motherTongue || "", identificationMark: fallback.identificationMark || "",
      address1: address.addressLine1 || "", address2: address.addressLine2 || "",
      city: address.city || "", state: address.state || "", zipCode: address.pincode || "",
    });
    setEditing(true);
  };
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = async (event) => {
    event.preventDefault();
    const id = fallback.id || fallback._id;
    if (!id) return toast.error("Agent ID is missing");
    setSaving(true);
    try {
      const payload = {
        name: form.name, employeeId: form.employeeId, gender: form.gender,
        dateOfBirth: form.dateOfBirth, age: form.age === "" ? null : Number(form.age),
        phone: form.phone, email: form.email, martialStatus: form.maritalStatus,
        motherTongue: form.motherTongue, identificationMark: form.identificationMark,
        address: [{ ...address, addressLine1: form.address1, addressLine2: form.address2,
          city: form.city, state: form.state, pincode: form.zipCode }],
      };
      const response = await patch(`/v1/users/${id}`, payload);
      const updated = response?.data?.user || response?.data || response?.user || response;
      onAgentUpdated?.({ ...fallback, ...payload, ...(updated || {}) });
      setEditing(false);
      toast.success("Agent details updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update agent details");
    } finally { setSaving(false); }
  };

  const [docFiles, setDocFiles] = React.useState([
    { label: "PDF", fileName: "Aadhar.pdf" },
    { label: "Image", fileName: "PAN.jpg" },
    { label: "PDF", fileName: "Address_Proof.pdf" },
  ]);

  return (
    <Wrapper>
      <HeaderRow>
        <LeftHead>
          <IconWrap>
            <Icon src={UserIcon} alt="user" />
          </IconWrap>
          <Title>Personal Details</Title>
        </LeftHead>
        <EditBtn type="button" onClick={openEditor}>
          <img src={EditIcon} alt="edit" width="16" height="16" />
          Edit details
        </EditBtn>
      </HeaderRow>

      <SectionTitle>Personal Information</SectionTitle>

      <Card>
        <ProfileCol>
          <ProfileImage src={SampleProfile} alt="profile" />
          <EditPictureBtn>
            <img src={EditIconLight} alt="edit" width="16" height="16" />
            Edit Picture
          </EditPictureBtn>
        </ProfileCol>

        <InfoGrid>
          <InfoItem>
            <Label>Full Name</Label>
            <Value>{details.fullName}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Agent ID</Label>
            <Value>{details.agentId}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Employment Type</Label>
            <Value>{details.employmentType}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Gender</Label>
            <Value>{details.gender}</Value>
          </InfoItem>
          <InfoItem>
            <Label>DOB</Label>
            <Value>{details.dob}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Age</Label>
            <Value>{details.age}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Contact</Label>
            <Value>{details.contact}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Email</Label>
            <Value>{details.email}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Marital Status</Label>
            <Value>{details.maritalStatus}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Mother Tongue</Label>
            <Value>{details.motherTongue}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Identification Mark</Label>
            <Value>{details.identificationMark}</Value>
          </InfoItem>
        </InfoGrid>
      </Card>

      <CardDetails
        title="Address Information"
        columns={3}
        items={[
          { label: "Address 1", value: address.addressLine1 || "N/A" },
          { label: "Address 2", value: address.addressLine2 || "N/A" },
          { label: "City", value: address.city || "N/A" },
          { label: "State", value: address.state || "N/A" },
          { label: "ZIP Code", value: address.pincode || "N/A" },
        ]}
      />
      <CardDetails
        title="Emergency Contact"
        columns={3}
        items={[
          { label: "Emergency Contact Name", value: "Deepak Kumar" },
          { label: "Relationship", value: "Brother" },
          { label: "Mobile Number", value: "+91 8987676756" },
          { label: "Emergency Contact Name", value: "Manoj Kumar" },
          { label: "Relationship", value: "Brother" },
          { label: "Mobile Number", value: "+91 7896543210" },
        ]}
      />
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
      {editing && <ModalBackdrop onMouseDown={(event) => event.target === event.currentTarget && !saving && setEditing(false)}>
        <Modal role="dialog" aria-modal="true" aria-labelledby="edit-agent-title">
          <ModalTitle id="edit-agent-title">Edit Agent Details</ModalTitle>
          <EditForm onSubmit={save}>
            <Field><label>Full Name</label><input name="name" value={form.name || ""} onChange={change} required /></Field>
            <Field><label>Agent ID</label><input name="employeeId" value={form.employeeId || ""} onChange={change} /></Field>
            <Field><label>Gender</label><select name="gender" value={form.gender || ""} onChange={change}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></Field>
            <Field><label>Date of Birth</label><input type="date" name="dateOfBirth" value={form.dateOfBirth || ""} onChange={change} /></Field>
            <Field><label>Age</label><input type="number" min="0" name="age" value={form.age ?? ""} onChange={change} /></Field>
            <Field><label>Contact</label><input name="phone" value={form.phone || ""} onChange={change} /></Field>
            <Field><label>Email</label><input type="email" name="email" value={form.email || ""} onChange={change} required /></Field>
            <Field><label>Marital Status</label><select name="maritalStatus" value={form.maritalStatus || ""} onChange={change}><option value="">Select</option><option value="single">Single</option><option value="married">Married</option><option value="divorced">Divorced</option></select></Field>
            <Field><label>Mother Tongue</label><input name="motherTongue" value={form.motherTongue || ""} onChange={change} /></Field>
            <Field><label>Identification Mark</label><input name="identificationMark" value={form.identificationMark || ""} onChange={change} /></Field>
            <Field><label>Address 1</label><input name="address1" value={form.address1 || ""} onChange={change} /></Field>
            <Field><label>Address 2</label><input name="address2" value={form.address2 || ""} onChange={change} /></Field>
            <Field><label>City</label><input name="city" value={form.city || ""} onChange={change} /></Field>
            <Field><label>State</label><input name="state" value={form.state || ""} onChange={change} /></Field>
            <Field><label>ZIP Code</label><input name="zipCode" value={form.zipCode || ""} onChange={change} /></Field>
            <ModalActions><CancelBtn type="button" disabled={saving} onClick={() => setEditing(false)}>Cancel</CancelBtn><SaveBtn type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</SaveBtn></ModalActions>
          </EditForm>
        </Modal>
      </ModalBackdrop>}
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

const SectionTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0 0 0 0;
`;

const Card = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  border-radius: 12px;
  background: #edf6f966;
  border: 1px solid ${theme.colors.border};
  padding: 0.875rem;
`;

const ProfileCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.063rem;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 194px;
  border-radius: 12px;
  object-fit: cover;
  box-sizing: border-box;
`;

const EditPictureBtn = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 0.5rem;
  background: ${theme.colors.primary};
  color: #edf6f9;
  font-size: 12px;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 1.5rem 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  line-height: 160%;
  color: ${theme.colors.secondaryTextColor};
`;

const Value = styled.span`
  font-size: 1rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  line-height: 160%;
  color: ${theme.colors.textColor};
`;

const ModalBackdrop = styled.div`position:fixed;inset:0;z-index:1000;background:#0c242780;display:grid;place-items:center;padding:24px;`;
const Modal = styled.div`width:min(760px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 20px 60px #0003;`;
const ModalTitle = styled.h2`margin:0 0 20px;color:${theme.colors.textColor};font:600 20px "Inter-SemiBold",sans-serif;`;
const EditForm = styled.form`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;@media(max-width:650px){grid-template-columns:1fr;}`;
const Field = styled.div`display:flex;flex-direction:column;gap:6px;label{color:${theme.colors.secondaryTextColor};font:500 12px "Inter-Medium",sans-serif;}input,select{height:42px;border:1px solid ${theme.colors.border};border-radius:7px;padding:0 11px;background:#fff;color:${theme.colors.textColor};font:500 13px "Inter-Medium",sans-serif;outline:none;}input:focus,select:focus{border-color:${theme.colors.primary};}`;
const ModalActions = styled.div`grid-column:1/-1;display:flex;justify-content:flex-end;gap:12px;margin-top:8px;`;
const CancelBtn = styled.button`height:40px;padding:0 22px;border:1px solid ${theme.colors.primary};border-radius:7px;background:#fff;color:${theme.colors.primary};cursor:pointer;font-weight:600;`;
const SaveBtn = styled.button`height:40px;padding:0 22px;border:0;border-radius:7px;background:${theme.colors.primary};color:#fff;cursor:pointer;font-weight:600;&:disabled{opacity:.65;cursor:not-allowed;}`;
