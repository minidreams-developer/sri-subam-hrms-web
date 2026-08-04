import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import UserIcon from "../../../assets/images/employee/uprofileIcon.svg";
import EditIcon from "../../../assets/images/employee/editIcon.svg";
import EditIconLight from "../../../assets/images/employee/edit-05_svgrepo.com.svg";
import UploadIcon from "../../../assets/images/employee/upload.svg";
import DocumentIcon from "../../../assets/images/employee/document.svg";
import EyeIcon from "../../../assets/images/employee/eye.svg";
import SampleProfile from "../../../assets/images/employee/sampleProfile.jpg";
import { patch } from "../../../helpers/api_helper";
import { toast } from "react-toastify";

const fallback = {
  fullName: "Manoj Kumar", employeeId: "", employeeType: "Full Time",
  gender: "Male", dob: "20-09-1999", age: "31 Years",
  contact: "+91 9500827645", email: "designedbymanoj@gmail.com",
  maritalStatus: "Married", motherTongue: "Tamil",
  identificationMark: "Small mole on right cheek", address1: "8/569",
  address2: "Andal Building, Gandhinagar 2nd street", city: "Tirupur",
  state: "Tamil Nadu", zipCode: "641666", profilePic: SampleProfile,
};

const read = (employee, keys, defaultValue) => {
  for (const key of keys) if (employee?.[key]) return employee[key];
  return defaultValue;
};

export const PersonalDetails = ({ employee, onEmployeeUpdated }) => {
  const inputRef = useRef(null);
  const pictureInputRef = useRef(null);
  const [active, setActive] = useState(employee?.isActive !== false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [documents, setDocuments] = useState(Array(5).fill("File Name"));
  const dobValue = read(employee, ["dateOfBirth", "dob"], fallback.dob);
  const primaryAddress = employee?.addresses?.[0] || {};
  const details = {
    fullName: read(employee, ["name", "employeeName", "fullName"], fallback.fullName),
    employeeId: read(employee, ["employeeId", "employee_id"], fallback.employeeId),
    employeeType: read(employee, ["employeeType", "employmentType"], fallback.employeeType),
    gender: read(employee, ["gender"], fallback.gender),
    dob: dobValue instanceof Date ? dobValue.toLocaleDateString("en-GB") : String(dobValue).slice(0, 10).split("-").reverse().join("-"),
    age: employee?.age ? `${employee.age} Years` : fallback.age,
    contact: read(employee, ["phone", "contact", "mobileNumber"], fallback.contact),
    email: read(employee, ["email"], fallback.email),
    maritalStatus: read(employee, ["maritalStatus", "martialStatus"], fallback.maritalStatus),
    motherTongue: read(employee, ["motherTongue"], fallback.motherTongue),
    identificationMark: read(employee, ["identificationMark"], fallback.identificationMark),
    address1: read(employee, ["address1", "addressLine1"], primaryAddress.addressLine1 || fallback.address1),
    address2: read(employee, ["address2", "addressLine2"], primaryAddress.addressLine2 || fallback.address2),
    city: read(employee, ["city"], primaryAddress.city || fallback.city),
    state: read(employee, ["state"], primaryAddress.state || fallback.state),
    zipCode: read(employee, ["zipCode", "pincode"], primaryAddress.pincode || fallback.zipCode),
    profilePic: read(employee, ["profilePic", "profileImage", "avatar"], fallback.profilePic),
  };
  useEffect(() => setActive(employee?.isActive !== false), [employee?.isActive]);

  const employeeUrl = () => `/v1/users/${employee?.id || employee?._id}`;
  const openEditor = () => {
    setForm({
      name: details.fullName, employeeId: details.employeeId,
      employeeType: String(details.employeeType).toLowerCase().replace(/\s+/g, "_"),
      gender: String(details.gender).toLowerCase(),
      dateOfBirth: String(employee?.dateOfBirth || employee?.dob || "").slice(0, 10),
      phone: details.contact, email: details.email,
      maritalStatus: String(details.maritalStatus).toLowerCase(),
      motherTongue: details.motherTongue, identificationMark: details.identificationMark,
      address1: details.address1, address2: details.address2, city: details.city,
      state: details.state, zipCode: details.zipCode,
    });
    setEditing(true);
  };
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = async (event) => {
    event.preventDefault();
    if (!employee?.id && !employee?._id) return toast.error("Employee ID is missing");
    setSaving(true);
    try {
      const payload = {
        name: form.name, employeeId: form.employeeId, employeeType: form.employeeType,
        gender: form.gender, dateOfBirth: form.dateOfBirth, phone: form.phone,
        email: form.email, martialStatus: form.maritalStatus,
        motherTongue: form.motherTongue, identificationMark: form.identificationMark,
        addresses: [{
          ...primaryAddress, addressLine1: form.address1, addressLine2: form.address2,
          city: form.city, state: form.state, pincode: form.zipCode,
        }],
      };
      const response = await patch(employeeUrl(), payload);
      const updated = response?.data || response?.user || response;
      onEmployeeUpdated?.({ ...employee, ...form, ...payload, ...(updated || {}) });
      setEditing(false);
      toast.success("Personal details updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update personal details");
    } finally { setSaving(false); }
  };
  const editPicture = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > 2 * 1024 * 1024) return toast.error("Profile picture must be smaller than 2 MB");
    try {
      const profilePic = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read the selected image"));
        reader.readAsDataURL(file);
      });
      const response = await patch(employeeUrl(), { profilePic });
      const updated = response?.data || response?.user || response;
      onEmployeeUpdated?.({ ...employee, profilePic, ...(updated || {}) });
      toast.success("Profile picture updated successfully");
    } catch (error) { toast.error(error.response?.data?.message || "Failed to update profile picture"); }
  };
  const toggleStatus = async () => {
    const next = !active;
    try {
      await patch(employeeUrl(), { isActive: next });
      setActive(next);
      onEmployeeUpdated?.({ ...employee, isActive: next });
      toast.success(`Employee marked ${next ? "active" : "inactive"}`);
    } catch (error) { toast.error(error.response?.data?.message || "Failed to update status"); }
  };
  const info = [
    ["Full Name", details.fullName], ["Employee ID", details.employeeId], ["Employee Type", details.employeeType],
    ["Gender", details.gender], ["DOB", details.dob], ["Age", details.age],
    ["Contact", details.contact], ["Email", details.email], ["Marital Status", details.maritalStatus],
    ["Mother Tongue", details.motherTongue], ["Identification Mark", details.identificationMark],
  ];
  const upload = (event) => {
    const file = event.target.files?.[0];
    if (file) setDocuments((items) => [...items, file.name]);
    event.target.value = "";
  };

  return (
    <Wrapper>
      <HeaderRow>
        <Heading><IconBox><img src={UserIcon} alt="" /></IconBox><strong>Personal Details</strong></Heading>
        <HeaderActions><Status>{active ? "Active" : "Inactive"} <Switch type="button" $active={active} onClick={toggleStatus} aria-label="Toggle employee status"><span /></Switch></Status><EditButton type="button" onClick={openEditor}><img src={EditIcon} alt="" />Edit details</EditButton></HeaderActions>
      </HeaderRow>

      <SectionTitle>Personal Information</SectionTitle>
      <PersonalCard>
        <ProfileColumn><ProfileImage src={details.profilePic} alt={details.fullName} /><PictureButton type="button" onClick={() => pictureInputRef.current?.click()}><img src={EditIconLight} alt="" />Edit Picture</PictureButton><input ref={pictureInputRef} type="file" accept="image/*" hidden onChange={editPicture} /></ProfileColumn>
        <InfoGrid>{info.map(([label, value]) => <Info key={label}><Label>{label}</Label><Value>{value}</Value></Info>)}</InfoGrid>
      </PersonalCard>

      <Section title="Address Information" items={[["Address 1", details.address1], ["Address 2", details.address2], ["City", details.city], ["State", details.state], ["ZIP Code", details.zipCode]]} />
      <Section title="Emergency Contact" items={[["Emergency Contact Name", "Deepak Kumar"], ["Relationship", "Brother"], ["Mobile Number", "+91 9756778265"]]} />
      <Section title="" items={[["Emergency Contact Name", "Manoj Kumar"], ["Relationship", "Brother"], ["Mobile Number", "+91 4569856325"]]} />

      <DocumentsHeader><SectionTitle>Documents</SectionTitle><UploadButton onClick={() => inputRef.current?.click()}><img src={UploadIcon} alt="" />Upload</UploadButton><input ref={inputRef} type="file" hidden onChange={upload} /></DocumentsHeader>
      <DocumentsPanel>{documents.map((name, index) => <Document key={`${name}-${index}`}><DocLabel>Aadhaar</DocLabel><FileBox><span><img src={DocumentIcon} alt="" />{name}</span><img src={EyeIcon} alt="View" /></FileBox></Document>)}</DocumentsPanel>
      {editing && <ModalBackdrop onMouseDown={(e) => e.target === e.currentTarget && setEditing(false)}><Modal role="dialog" aria-modal="true" aria-labelledby="edit-personal-title"><ModalTitle id="edit-personal-title">Edit Personal Details</ModalTitle><EditForm onSubmit={save}>
        <Field><label>Full Name</label><input name="name" value={form.name || ""} onChange={change} required /></Field>
        <Field><label>Employee ID</label><input name="employeeId" value={form.employeeId || ""} onChange={change} /></Field>
        <Field><label>Employee Type</label><select name="employeeType" value={form.employeeType || ""} onChange={change}><option value="">Select</option><option value="full_time">Full Time</option><option value="part_time">Part Time</option><option value="contract">Contract</option></select></Field>
        <Field><label>Gender</label><select name="gender" value={(form.gender || "").toLowerCase()} onChange={change}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></Field>
        <Field><label>Date of Birth</label><input type="date" name="dateOfBirth" value={form.dateOfBirth || ""} onChange={change} /></Field>
        <Field><label>Contact</label><input name="phone" value={form.phone || ""} onChange={change} /></Field>
        <Field><label>Email</label><input type="email" name="email" value={form.email || ""} onChange={change} required /></Field>
        <Field><label>Marital Status</label><select name="maritalStatus" value={(form.maritalStatus || "").toLowerCase()} onChange={change}><option value="">Select</option><option value="single">Single</option><option value="married">Married</option><option value="divorced">Divorced</option></select></Field>
        <Field><label>Mother Tongue</label><input name="motherTongue" value={form.motherTongue || ""} onChange={change} /></Field>
        <Field><label>Identification Mark</label><input name="identificationMark" value={form.identificationMark || ""} onChange={change} /></Field>
        <Field><label>Address 1</label><input name="address1" value={form.address1 || ""} onChange={change} /></Field>
        <Field><label>Address 2</label><input name="address2" value={form.address2 || ""} onChange={change} /></Field>
        <Field><label>City</label><input name="city" value={form.city || ""} onChange={change} /></Field>
        <Field><label>State</label><input name="state" value={form.state || ""} onChange={change} /></Field>
        <Field><label>ZIP Code</label><input name="zipCode" value={form.zipCode || ""} onChange={change} /></Field>
        <ModalActions><CancelButton type="button" onClick={() => setEditing(false)}>Cancel</CancelButton><SaveButton type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</SaveButton></ModalActions>
      </EditForm></Modal></ModalBackdrop>}
    </Wrapper>
  );
};

const Section = ({ title, items }) => <SectionBlock>{title && <SectionTitle>{title}</SectionTitle>}<Panel><DetailsGrid>{items.map(([label, value]) => <Info key={label}><Label>{label}</Label><Value>{value}</Value></Info>)}</DetailsGrid></Panel></SectionBlock>;

const Wrapper = styled.section`width:100%; background:#fff; border-radius:10px; padding:16px 14px 28px; display:flex; flex-direction:column; gap:20px; color:#0c2427;`;
const HeaderRow = styled.div`display:flex; align-items:center; justify-content:space-between; min-height:40px;`;
const Heading = styled.div`display:flex; align-items:center; gap:14px; font:600 16px/1.6 "Inter-SemiBold",sans-serif;`;
const IconBox = styled.span`width:36px;height:36px;border-radius:6px;background:#edf6f9;display:grid;place-items:center; img{width:20px;height:20px;}`;
const HeaderActions = styled.div`display:flex;align-items:center;gap:36px;`;
const Status = styled.div`display:flex;align-items:center;gap:10px;font:500 14px/1.6 "Inter-Medium",sans-serif;`;
const Switch = styled.button`width:40px;height:22px;border:0;border-radius:100px;padding:2px;background:${p=>p.$active?"#066c78":"#b1b1b1"};cursor:pointer; span{display:block;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 2px 4px #2727271a;transform:translateX(${p=>p.$active?"18px":"0"});transition:.2s;}`;
const EditButton = styled.button`width:140px;height:40px;border:0;border-radius:8px;background:#edf6f9;color:#066c78;display:flex;align-items:center;justify-content:center;gap:10px;font:600 12px "Inter-SemiBold",sans-serif;cursor:pointer;img{width:20px;height:20px;}`;
const SectionTitle = styled.h3`margin:0;color:#066c78;font:600 14px/1.6 "Inter-SemiBold",sans-serif;`;
const PersonalCard = styled.div`display:grid;grid-template-columns:158px 1fr;gap:18px;padding:12px;border:1px solid #e0e3e6;border-radius:10px;background:#edf6f966;@media(max-width:900px){grid-template-columns:1fr;}`;
const ProfileColumn = styled.div`display:flex;flex-direction:column;gap:10px;`;
const ProfileImage = styled.img`width:158px;height:138px;object-fit:cover;border-radius:7px;`;
const PictureButton = styled.button`height:36px;border:0;border-radius:7px;background:#087d88;color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;font:600 10px "Inter-SemiBold",sans-serif;img{width:16px;height:16px;}`;
const InfoGrid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 28px;padding:2px 0;align-content:start;@media(max-width:900px){grid-template-columns:repeat(2,minmax(0,1fr));}`;
const Info = styled.div`display:flex;flex-direction:column;min-width:0;`;
const Label = styled.span`color:#7a7a7a;font:500 12px/1.6 "Inter-Medium",sans-serif;`;
const Value = styled.span`color:#0c2427;font:500 14px/1.6 "Inter-Medium",sans-serif;overflow-wrap:anywhere;`;
const SectionBlock = styled.div`display:flex;flex-direction:column;gap:12px;`;
const Panel = styled.div`padding:12px 14px;border:1px solid #e0e3e6;border-radius:10px;background:#edf6f966;`;
const DetailsGrid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 64px;@media(max-width:900px){grid-template-columns:repeat(2,minmax(0,1fr));}`;
const DocumentsHeader = styled.div`display:flex;align-items:center;justify-content:space-between;margin-bottom:-8px;`;
const UploadButton = styled.button`width:140px;height:36px;border:0;border-radius:7px;background:#087d88;color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;font:600 12px "Inter-SemiBold",sans-serif;cursor:pointer;img{width:20px;height:20px;}`;
const DocumentsPanel = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 56px;padding:12px 14px;border:1px solid #e0e3e6;border-radius:10px;background:#edf6f966;@media(max-width:900px){grid-template-columns:repeat(2,minmax(0,1fr));}`;
const Document = styled.div`display:flex;flex-direction:column;gap:8px;`;
const DocLabel = styled.span`font:500 12px/1.6 "Inter-Medium",sans-serif;`;
const FileBox = styled.div`height:34px;border:1px solid #e0e3e6;border-radius:5px;background:#edf6f966;padding:0 10px;display:flex;align-items:center;justify-content:space-between;font:600 11px "Inter-SemiBold",sans-serif;span{display:flex;align-items:center;gap:9px;}img{width:16px;height:16px;}`;
const ModalBackdrop = styled.div`position:fixed;inset:0;z-index:1000;background:#0c242780;display:grid;place-items:center;padding:24px;`;
const Modal = styled.div`width:min(760px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 20px 60px #0003;`;
const ModalTitle = styled.h2`margin:0 0 20px;color:#0c2427;font:600 20px "Inter-SemiBold",sans-serif;`;
const EditForm = styled.form`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;@media(max-width:650px){grid-template-columns:1fr;}`;
const Field = styled.div`display:flex;flex-direction:column;gap:6px;label{color:#4b6265;font:500 12px "Inter-Medium",sans-serif;}input,select{height:42px;border:1px solid #d8e0e2;border-radius:7px;padding:0 11px;background:#fff;color:#0c2427;font:500 13px "Inter-Medium",sans-serif;outline:none;}input:focus,select:focus{border-color:#087d88;box-shadow:0 0 0 2px #087d8820;}`;
const ModalActions = styled.div`grid-column:1/-1;display:flex;justify-content:flex-end;gap:12px;margin-top:8px;`;
const CancelButton = styled.button`height:40px;padding:0 22px;border:1px solid #087d88;border-radius:7px;background:#fff;color:#087d88;cursor:pointer;font-weight:600;`;
const SaveButton = styled.button`height:40px;padding:0 22px;border:0;border-radius:7px;background:#087d88;color:#fff;cursor:pointer;font-weight:600;&:disabled{opacity:.65;cursor:not-allowed;}`;
