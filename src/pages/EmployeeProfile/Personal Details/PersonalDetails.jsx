import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import UserIcon from "../../../assets/images/employee/uprofileIcon.svg";
import EditIcon from "../../../assets/images/employee/editIcon.svg";
import EditIconLight from "../../../assets/images/employee/edit-05_svgrepo.com.svg";
import UploadIcon from "../../../assets/images/employee/upload.svg";
import DocumentIcon from "../../../assets/images/employee/document.svg";
import EyeIcon from "../../../assets/images/employee/eye.svg";
import SampleProfile from "../../../assets/images/employee/sampleProfile.jpg";
import { addUserDocuments, deleteUserDocument, updateUser, updateUserDocument } from "../../../services/apiServices";
import { uploadMedia } from "../../../helpers/uploadMedia";
import DocumentUploadForm from "../../Create Employee/Documents/Documents";
import { toast } from "react-toastify";
import Select from "react-select";
import { customSelectStyles } from "../../../theme/reactSelectStyles";

const languageOptions = [
  { value: "tamil", label: "Tamil" }, { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" }, { value: "telugu", label: "Telugu" },
  { value: "kannada", label: "Kannada" }, { value: "malayalam", label: "Malayalam" },
];

const NOT_AVAILABLE = "N/A";

const read = (employee, keys, defaultValue = NOT_AVAILABLE) => {
  for (const key of keys) {
    const value = employee?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return defaultValue;
};

const display = (value) =>
  value === undefined || value === null || value === "" ? NOT_AVAILABLE : value;
const getEmployeeStatus = (employee) => {
  if (["Active", "In-Active", "Relieved"].includes(employee?.isActive))
    return employee.isActive;
  if (["Active", "In-Active", "Relieved"].includes(employee?.status))
    return employee.status;
  return employee?.isActive === false ? "In-Active" : "Active";
};
const formatDate = (value) => {
  if (!value) return NOT_AVAILABLE;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? NOT_AVAILABLE
    : date.toLocaleDateString("en-GB");
};

export const PersonalDetails = ({
  employee,
  onEmployeeUpdated,
  onRefresh,
  entity = "employee",
}) => {
  const isAgent = entity === "agent";
  const entityLabel = isAgent ? "Agent" : "Employee";
  const documentFormRef = useRef(null);
  const pictureInputRef = useRef(null);
  const changeDocumentInputRef = useRef(null);
  const [employeeStatus, setEmployeeStatus] = useState(
    getEmployeeStatus(employee),
  );
  const [statusSaving, setStatusSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentUploadOpen, setDocumentUploadOpen] = useState(false);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [documentToChange, setDocumentToChange] = useState(null);
  const [documentSaving, setDocumentSaving] = useState(false);
  const [form, setForm] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const primaryAddress =
    employee?.address?.[0] || employee?.addresses?.[0] || {};
  const emergencyContacts =
    employee?.emergencyContact || employee?.emergencyContacts || [];
  const documents = [
    ...(employee?.userDocuments || employee?.documents || employee?.documentImage || []),
    ...uploadedDocuments,
  ];
  const details = {
    fullName: read(employee, ["name", "employeeName", "fullName"]),
    employeeId: read(employee, ["employeeId", "employee_id"]),
    employeeType: read(employee, ["employeeType", "employmentType"]),
    gender: read(employee, ["gender"]),
    dob: formatDate(read(employee, ["dateOfBirth", "dob"], null)),
    age:
      employee?.age === 0 || employee?.age
        ? `${employee.age} Years`
        : NOT_AVAILABLE,
    contact: read(employee, ["phone", "contact", "mobileNumber"]),
    email: read(employee, ["email"]),
    maritalStatus: read(employee, ["maritalStatus", "martialStatus"]),
    motherTongue: read(employee, ["motherTongue"]),
    identificationMark: read(employee, ["identificationMark"]),
    address1: display(
      primaryAddress.addressLine1 ||
        employee?.address1 ||
        employee?.addressLine1,
    ),
    address2: display(
      primaryAddress.addressLine2 ||
        employee?.address2 ||
        employee?.addressLine2,
    ),
    city: display(primaryAddress.city || employee?.city),
    state: display(primaryAddress.state || employee?.state),
    zipCode: display(
      primaryAddress.pincode || employee?.zipCode || employee?.pincode,
    ),
    profilePic: read(
      employee,
      ["profilePic", "profileImage", "avatar"],
      SampleProfile,
    ),
  };
  useEffect(() => {
    setEmployeeStatus(getEmployeeStatus(employee));
  }, [employee?.status, employee?.isActive]);

  const employeeId = () => employee?.id || employee?._id;
  const openEditor = () => {
    setForm({
      name: details.fullName,
      employeeId: details.employeeId,
      employeeType: String(details.employeeType)
        .toLowerCase()
        .replace(/\s+/g, "_"),
      gender: String(details.gender).toLowerCase(),
      dateOfBirth: String(employee?.dateOfBirth || employee?.dob || "").slice(
        0,
        10,
      ),
      phone: details.contact,
      email: details.email,
      maritalStatus: String(details.maritalStatus).toLowerCase(),
      motherTongue: details.motherTongue,
      identificationMark: details.identificationMark,
      address1: details.address1,
      address2: details.address2,
      city: details.city,
      state: details.state,
      zipCode: details.zipCode,
      emergencyContacts: (emergencyContacts.length
        ? emergencyContacts
        : [{}]
      ).map((contact) => ({
        ...contact,
        contactName: contact.contactName || contact.name || "",
        relationship: contact.relationship || contact.relattionship || "",
        phone: contact.phone || contact.mobileNumber || "",
      })),
    });
    setEditing(true);
  };
  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const changeEmergencyContact = (index, field, value) => {
    setForm((current) => ({
      ...current,
      emergencyContacts: current.emergencyContacts.map(
        (contact, contactIndex) =>
          contactIndex === index ? { ...contact, [field]: value } : contact,
      ),
    }));
  };
  const addEmergencyContact = () => {
    setForm((current) => ({
      ...current,
      emergencyContacts: [
        ...current.emergencyContacts,
        { contactName: "", relationship: "", phone: "" },
      ],
    }));
  };
  const removeEmergencyContact = (index) => {
    setForm((current) => ({
      ...current,
      emergencyContacts: current.emergencyContacts.filter(
        (_, contactIndex) => contactIndex !== index,
      ),
    }));
  };
  const save = async (event) => {
    event.preventDefault();
    if (!/^\d{10}$/.test(String(form.phone || "")))
      return toast.error("Contact must be exactly 10 digits");
    if (!employee?.id && !employee?._id)
      return toast.error(`${entityLabel} ID is missing`);
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        employeeId: form.employeeId,
        employeeType: form.employeeType,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        phone: form.phone,
        email: form.email,
        martialStatus: form.maritalStatus,
        motherTongue: form.motherTongue,
        identificationMark: form.identificationMark,
        addresses: [
          {
            ...primaryAddress,
            addressLine1: form.address1,
            addressLine2: form.address2,
            city: form.city,
            state: form.state,
            pincode: form.zipCode,
          },
        ],
        emergencyContacts: form.emergencyContacts.map((contact) => ({
          ...(contact.id && { id: contact.id }),
          ...(contact._id && { _id: contact._id }),
          contactName: contact.contactName,
          relationship: contact.relationship,
          phone: contact.phone ? Number(contact.phone) : null,
          mobileNumber: contact.phone ? Number(contact.phone) : null,
        })),
      };
      const response = await updateUser(employeeId(), payload);
      const updated = response?.data || response?.user || response;
      onEmployeeUpdated?.({
        ...employee,
        ...form,
        ...payload,
        ...(updated || {}),
      });
      setEditing(false);
      toast.success(`${entityLabel} details updated successfully`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update personal details",
      );
    } finally {
      setSaving(false);
    }
  };
  const editPicture = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("Please select an image file");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Profile picture must be 5 MB or smaller");
    try {
      const uploadedFile = await uploadMedia(file);
      const profilePic = uploadedFile.url;
      const response = await updateUser(employeeId(), { profilePic });
      const updated = response?.data || response?.user || response;
      onEmployeeUpdated?.({ ...employee, profilePic, ...(updated || {}) });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile picture",
      );
    }
  };
  const toggleStatus = async () => {
    const previousStatus = employeeStatus;
    const nextStatus = employeeStatus === "Active" ? "In-Active" : "Active";
    setEmployeeStatus(nextStatus);
    setStatusSaving(true);
    try {
      const response = await updateUser(employeeId(), { status: nextStatus });
      const updated = response?.data || response?.user || response;
      onEmployeeUpdated?.({
        ...employee,
        status: nextStatus,
        ...(updated || {}),
      });
      toast.success(`Employee status changed to ${nextStatus}`);
    } catch (error) {
      setEmployeeStatus(previousStatus);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setStatusSaving(false);
    }
  };
  const info = [
    ["Full Name", details.fullName],
    [`${entityLabel} ID`, details.employeeId],
    // [isAgent ? "Employment Type" : "Employee Type", details.employeeType],
    ["Gender", details.gender],
    ["DOB", details.dob],
    ["Age", details.age],
    ["Contact", details.contact],
    ["Email", details.email],
    ["Marital Status", details.maritalStatus],
    ["Mother Tongue", details.motherTongue],
    ["Identification Mark", details.identificationMark],
  ];
  const upload = async () => {
    if (!employee?.id && !employee?._id)
      return toast.error(`${entityLabel} ID is missing`);
    const documentsData = documentFormRef.current?.formData || {};
    const selectedDocuments = [
      ...(documentsData.governmentDocuments || []).map((document) => ({
        ...document,
        documentType: "government",
      })),
      ...(documentsData.personalDocuments || []).map((document) => ({
        ...document,
        documentType: "personal",
      })),
    ].filter((document) => document.file?.url);
    if (!selectedDocuments.length)
      return toast.error("Please select at least one document");
    if (
      selectedDocuments.some(
        (document) => document.file.size > 5 * 1024 * 1024,
      )
    ) {
      return toast.error("Each document must be 5 MB or smaller");
    }

    setUploading(true);
    try {
      const newDocuments = selectedDocuments.map((document) => ({
        documentName:
          document.label && document.label !== "Select Document"
            ? document.label
            : document.file.name,
        documentType: document.documentType,
        fileName: document.file.name,
        fileUrl: document.file.url,
        publicId: document.file.publicId,
        mimeType: document.file.mimeType || document.file.type,
        keepOriginal: Boolean(document.keepOriginal),
      }));
      await addUserDocuments(employeeId(), newDocuments);
      setUploadedDocuments([]);
      await onRefresh?.();
      setDocumentUploadOpen(false);
      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };
  const previewDocument = (document, name) => {
    const rawUrl =
      typeof document === "string"
        ? document
        : document.fileUrl ||
          document.fileURL ||
          document.documentUrl ||
          document.url ||
          document.path;
    if (!rawUrl)
      return toast.error("Preview is not available for this document");
    const url = /^(https?:|data:|blob:)/i.test(rawUrl)
      ? rawUrl
      : `${import.meta.env.VITE_API_BASE_URL || ""}/${String(rawUrl).replace(/^\/+/, "")}`;
    const extension = String(name || rawUrl)
      .split("?")[0]
      .split(".")
      .pop()
      ?.toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
      extension,
    );

    // Cloudinary PDFs/documents may refuse iframe embedding. Opening the
    // original URL directly lets the browser's PDF viewer render the file.
    if (!isImage) {
      const openedWindow = window.open(url, "_blank");
      if (openedWindow) openedWindow.opener = null;
      if (!openedWindow) {
        setDocumentPreview({ name, url, isImage: false, openOnly: true });
      }
      return;
    }
    setDocumentPreview({
      name,
      url,
      isImage,
    });
  };
  const documentKey = (document, index) =>
    document?.id ||
    document?._id ||
    `${document?.fileName || document?.name || document?.documentName || document}-${index}`;
  const removeDocument = async (document, index) => {
    if (!window.confirm("Remove this document?")) return;
    const id = employee?.id || employee?._id;
    if (!id) return toast.error(`${entityLabel} ID is missing`);
    const documentId = document?.id || document?._id;
    if (!documentId)
      return toast.error("Document ID is missing; the document cannot be removed");
    const remaining = documents.filter(
      (_, documentIndex) => documentIndex !== index,
    );
    setDocumentSaving(true);
    try {
      await deleteUserDocument(id, documentId);
      setUploadedDocuments([]);
      onEmployeeUpdated?.({
        ...employee,
        documentImage: remaining,
      });
      await onRefresh?.();
      if (
        documentPreview &&
        documentPreview.name ===
          (document?.fileName || document?.name || document?.documentName)
      )
        setDocumentPreview(null);
      toast.success("Document removed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove document");
    } finally {
      setDocumentSaving(false);
    }
  };
  const chooseReplacement = (document, index) => {
    setDocumentToChange({ document, index });
    changeDocumentInputRef.current?.click();
  };
  const changeDocument = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !documentToChange) return;
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Document must be 5 MB or smaller");
    setDocumentSaving(true);
    try {
      const oldDocument = documentToChange.document;
      const documentType =
        oldDocument?.documentType || oldDocument?.type || "personal";
      const uploadedFile = await uploadMedia(file);
      const replacement = {
        ...oldDocument,
        fileName: file.name,
        name: file.name,
        fileUrl: uploadedFile.url,
        publicId: uploadedFile.publicId,
        mimeType: uploadedFile.mimeType,
        documentType,
      };
      const documentId = oldDocument?.id || oldDocument?._id;
      if (!documentId) {
        toast.error("Document ID is missing; the document cannot be changed");
        return;
      }
      await updateUserDocument(employeeId(), documentId, {
        documentName: replacement.documentName || replacement.name || replacement.fileName,
        documentType: replacement.documentType,
        fileName: replacement.fileName,
        fileUrl: replacement.fileUrl,
        publicId: replacement.publicId,
        mimeType: replacement.mimeType,
        keepOriginal: Boolean(replacement.keepOriginal),
      });
      setUploadedDocuments([]);
      await onRefresh?.();
      toast.success("Document changed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change document");
    } finally {
      setDocumentSaving(false);
      setDocumentToChange(null);
    }
  };

  return (
    <Wrapper>
      <HeaderRow>
        <Heading>
          <IconBox>
            <img src={UserIcon} alt="" />
          </IconBox>
          <strong>Personal Details</strong>
        </Heading>
        <HeaderActions>
          <Status>
            {employeeStatus}
            <Switch
              type="button"
              $active={employeeStatus === "Active"}
              onClick={toggleStatus}
              disabled={statusSaving}
              aria-label={`Mark employee ${employeeStatus === "Active" ? "In-Active" : "Active"}`}
            >
              <span />
            </Switch>
          </Status>
          <EditButton type="button" onClick={openEditor}>
            <img src={EditIcon} alt="" />
            Edit details
          </EditButton>
        </HeaderActions>
      </HeaderRow>

      <SectionTitle>Personal Information</SectionTitle>
      <PersonalCard>
        <ProfileColumn>
          <ProfileImage src={details.profilePic} alt={details.fullName} />
          <PictureButton
            type="button"
            onClick={() => pictureInputRef.current?.click()}
          >
            <img src={EditIconLight} alt="" />
            Edit Picture
          </PictureButton>
          <input
            ref={pictureInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={editPicture}
          />
        </ProfileColumn>
        <InfoGrid>
          {info.map(([label, value]) => (
            <Info key={label}>
              <Label>{label}</Label>
              <Value>{value}</Value>
            </Info>
          ))}
        </InfoGrid>
      </PersonalCard>

      <Section
        title="Address Information"
        items={[
          ["Address 1", details.address1],
          ["Address 2", details.address2],
          ["City", details.city],
          ["State", details.state],
          ["ZIP Code", details.zipCode],
        ]}
      />
      <Section
        title="Emergency Contact"
        items={[
          [
            "Emergency Contact Name",
            display(
              emergencyContacts[0]?.contactName || emergencyContacts[0]?.name,
            ),
          ],
          [
            "Relationship",
            display(
              emergencyContacts[0]?.relationship ||
                emergencyContacts[0]?.relattionship,
            ),
          ],
          [
            "Mobile Number",
            display(
              emergencyContacts[0]?.phone || emergencyContacts[0]?.mobileNumber,
            ),
          ],
        ]}
      />
      {emergencyContacts.slice(1).map((contact, index) => (
        <Section
          key={contact.id || contact._id || index}
          title=""
          items={[
            [
              "Emergency Contact Name",
              display(contact.contactName || contact.name),
            ],
            [
              "Relationship",
              display(contact.relationship || contact.relattionship),
            ],
            ["Mobile Number", display(contact.phone || contact.mobileNumber)],
          ]}
        />
      ))}

      <DocumentsHeader>
        <SectionTitle>Documents</SectionTitle>
        <UploadButton
          type="button"
          disabled={uploading}
          onClick={() => setDocumentUploadOpen(true)}
        >
          <img src={UploadIcon} alt="" />
          {uploading ? "Uploading..." : "Upload"}
        </UploadButton>
      </DocumentsHeader>
      <DocumentsPanel>
        {documents.length ? (
          documents.map((document, index) => {
            const name =
              typeof document === "string"
                ? document.split("/").pop()
                : document.documentName ||
                  document.fileName ||
                  document.name ||
                  NOT_AVAILABLE;
            return (
              <Document key={documentKey(document, index)}>
                <DocLabel>
                  {display(
                    document.documentType || document.type || "Document",
                  )}
                </DocLabel>
                <FileBox>
                  <FileIdentity>
                    <img src={DocumentIcon} alt="" />
                    {name}
                  </FileIdentity>
                  <DocumentActions>
                    <ViewButton
                      type="button"
                      onClick={() => previewDocument(document, name)}
                      aria-label={`View ${name}`}
                    >
                      <img src={EyeIcon} alt="" />
                    </ViewButton>
                    <ChangeButton
                      type="button"
                      disabled={documentSaving}
                      onClick={() => chooseReplacement(document, index)}
                    >
                      Change
                    </ChangeButton>
                    <RemoveDocumentButton
                      type="button"
                      disabled={documentSaving}
                      onClick={() => removeDocument(document, index)}
                    >
                      Remove
                    </RemoveDocumentButton>
                  </DocumentActions>
                </FileBox>
              </Document>
            );
          })
        ) : (
          <Document>
            <DocLabel>Documents</DocLabel>
            <FileBox>
              <span>{NOT_AVAILABLE}</span>
            </FileBox>
          </Document>
        )}
      </DocumentsPanel>
      <input
        ref={changeDocumentInputRef}
        type="file"
        hidden
        onChange={changeDocument}
      />
      {documentPreview && (
        <ModalBackdrop
          onMouseDown={(event) =>
            event.target === event.currentTarget && setDocumentPreview(null)
          }
        >
          <PreviewModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="document-preview-title"
          >
            <PreviewHeader>
              <ModalTitle id="document-preview-title">
                {documentPreview.name}
              </ModalTitle>
              <CloseButton
                type="button"
                onClick={() => setDocumentPreview(null)}
                aria-label="Close preview"
              >
                ×
              </CloseButton>
            </PreviewHeader>
            <PreviewBody>
              {documentPreview.isImage ? (
                <PreviewImage
                  src={documentPreview.url}
                  alt={documentPreview.name}
                />
              ) : (
                <PreviewMessage>
                  Preview cannot be embedded. Open the file in a new tab.
                </PreviewMessage>
              )}
            </PreviewBody>
            <PreviewActions>
              <OpenLink
                href={documentPreview.url}
                target="_blank"
                rel="noreferrer"
              >
                Open in new tab
              </OpenLink>
            </PreviewActions>
          </PreviewModal>
        </ModalBackdrop>
      )}
      {documentUploadOpen && (
        <ModalBackdrop
          onMouseDown={(event) =>
            event.target === event.currentTarget &&
            !uploading &&
            setDocumentUploadOpen(false)
          }
        >
          <UploadModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-documents-title"
          >
            <ModalTitle id="upload-documents-title">
              Upload Documents
            </ModalTitle>
            <UploadFormBody>
              <DocumentUploadForm ref={documentFormRef} />
            </UploadFormBody>
            <UploadModalActions>
              <CancelButton
                type="button"
                disabled={uploading}
                onClick={() => setDocumentUploadOpen(false)}
              >
                Cancel
              </CancelButton>
              <SaveButton type="button" disabled={uploading} onClick={upload}>
                {uploading ? "Uploading..." : "Upload Documents"}
              </SaveButton>
            </UploadModalActions>
          </UploadModal>
        </ModalBackdrop>
      )}
      {editing && (
        <ModalBackdrop
          onMouseDown={(e) => e.target === e.currentTarget && setEditing(false)}
        >
          <Modal
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-personal-title"
          >
            <ModalTitle id="edit-personal-title">
              Edit Personal Details
            </ModalTitle>
            <EditForm onSubmit={save}>
              <Field>
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={change}
                  required
                />
              </Field>
              <Field>
                <label>{entityLabel} ID</label>
                <input
                  name="employeeId"
                  value={form.employeeId || ""}
                  onChange={change}
                />
              </Field>
              {/* <Field>
                <label>{isAgent ? "Employment Type" : "Employee Type"}</label>
                <select
                  name="employeeType"
                  value={form.employeeType || ""}
                  onChange={change}
                >
                  <option value="">Select</option>
                  {isAgent && <option value="agent">Agent</option>}
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </Field> */}
              <Field>
                <label>Gender</label>
                <select
                  name="gender"
                  value={(form.gender || "").toLowerCase()}
                  onChange={change}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field>
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth || ""}
                  onChange={change}
                />
              </Field>
              <Field>
                <label>Contact</label>
                <input
                  name="phone"
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={form.phone || ""}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value.replace(/\D/g, "").slice(0, 10) }))}
                  required
                />
              </Field>
              <Field>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email || ""}
                  onChange={change}
                  required
                />
              </Field>
              <Field>
                <label>Marital Status</label>
                <select
                  name="maritalStatus"
                  value={(form.maritalStatus || "").toLowerCase()}
                  onChange={change}
                >
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                </select>
              </Field>
              <Field>
                <label>Mother Tongue</label>
                <Select options={languageOptions} styles={customSelectStyles}
                  value={languageOptions.find((option) => option.value === String(form.motherTongue || "").toLowerCase()) || null}
                  onChange={(option) => setForm((current) => ({ ...current, motherTongue: option?.value || "" }))}
                  placeholder="Select mother tongue" />
              </Field>
              <Field>
                <label>Identification Mark</label>
                <input
                  name="identificationMark"
                  value={form.identificationMark || ""}
                  onChange={change}
                />
              </Field>
              <Field>
                <label>Address 1</label>
                <input
                  name="address1"
                  value={form.address1 || ""}
                  onChange={change}
                />
              </Field>
              <Field>
                <label>Address 2</label>
                <input
                  name="address2"
                  value={form.address2 || ""}
                  onChange={change}
                />
              </Field>
              <Field>
                <label>City</label>
                <input name="city" value={form.city || ""} onChange={change} />
              </Field>
              <Field>
                <label>State</label>
                <input
                  name="state"
                  value={form.state || ""}
                  onChange={change}
                />
              </Field>
              <Field>
                <label>ZIP Code</label>
                <input
                  name="zipCode"
                  value={form.zipCode || ""}
                  onChange={change}
                />
              </Field>
              <EmergencyHeading>
                <span>Emergency Contacts</span>
                <AddContactButton type="button" onClick={addEmergencyContact}>
                  + Add contact
                </AddContactButton>
              </EmergencyHeading>
              {form.emergencyContacts?.map((contact, index) => (
                <EmergencyFields key={contact.id || contact._id || index}>
                  <Field>
                    <label>Contact Name</label>
                    <input
                      value={contact.contactName || ""}
                      onChange={(event) =>
                        changeEmergencyContact(
                          index,
                          "contactName",
                          event.target.value,
                        )
                      }
                    />
                  </Field>
                  <Field>
                    <label>Relationship</label>
                    <select
                      value={contact.relationship || ""}
                      onChange={(event) =>
                        changeEmergencyContact(
                          index,
                          "relationship",
                          event.target.value,
                        )
                      }
                    >
                      <option value="">Select</option>
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="spouse">Spouse</option>
                      <option value="sibling">Sibling</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                  <Field>
                    <label>Mobile Number</label>
                    <input
                      type="tel"
                      value={contact.phone || ""}
                      onChange={(event) =>
                        changeEmergencyContact(
                          index,
                          "phone",
                          event.target.value.replace(/\D/g, ""),
                        )
                      }
                    />
                  </Field>
                  {form.emergencyContacts.length > 1 && (
                    <RemoveContactButton
                      type="button"
                      onClick={() => removeEmergencyContact(index)}
                    >
                      Remove
                    </RemoveContactButton>
                  )}
                </EmergencyFields>
              ))}
              <ModalActions>
                <CancelButton type="button" onClick={() => setEditing(false)}>
                  Cancel
                </CancelButton>
                <SaveButton type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </SaveButton>
              </ModalActions>
            </EditForm>
          </Modal>
        </ModalBackdrop>
      )}
    </Wrapper>
  );
};

const Section = ({ title, items }) => (
  <SectionBlock>
    {title && <SectionTitle>{title}</SectionTitle>}
    <Panel>
      <DetailsGrid>
        {items.map(([label, value]) => (
          <Info key={label}>
            <Label>{label}</Label>
            <Value>{value}</Value>
          </Info>
        ))}
      </DetailsGrid>
    </Panel>
  </SectionBlock>
);

const Wrapper = styled.section`
  width: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 16px 14px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #0c2427;
`;
const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
`;
const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font:
    600 16px/1.6 "Inter-SemiBold",
    sans-serif;
`;
const IconBox = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: #edf6f9;
  display: grid;
  place-items: center;
  img {
    width: 20px;
    height: 20px;
  }
`;
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
`;
const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font:
    500 14px/1.6 "Inter-Medium",
    sans-serif;
`;
const Switch = styled.button`
  width: 40px;
  height: 22px;
  border: 0;
  border-radius: 100px;
  padding: 2px;
  background: ${(p) => (p.$active ? "#066c78" : "#b1b1b1")};
  cursor: pointer;
  span {
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 4px #2727271a;
    transform: translateX(${(p) => (p.$active ? "18px" : "0")});
    transition: 0.2s;
  }
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
const EditButton = styled.button`
  width: 140px;
  height: 40px;
  border: 0;
  border-radius: 8px;
  background: #edf6f9;
  color: #066c78;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font:
    600 12px "Inter-SemiBold",
    sans-serif;
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
`;
const SectionTitle = styled.h3`
  margin: 0;
  color: #066c78;
  font:
    600 14px/1.6 "Inter-SemiBold",
    sans-serif;
`;
const PersonalCard = styled.div`
  display: grid;
  grid-template-columns: 158px 1fr;
  gap: 18px;
  padding: 12px;
  border: 1px solid #e0e3e6;
  border-radius: 10px;
  background: #edf6f966;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const ProfileColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ProfileImage = styled.img`
  width: 158px;
  height: 138px;
  object-fit: cover;
  border-radius: 7px;
`;
const PictureButton = styled.button`
  height: 36px;
  border: 0;
  border-radius: 7px;
  background: #087d88;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font:
    600 10px "Inter-SemiBold",
    sans-serif;
  img {
    width: 16px;
    height: 16px;
  }
`;
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px 28px;
  padding: 2px 0;
  align-content: start;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;
const Label = styled.span`
  color: #7a7a7a;
  font:
    500 12px/1.6 "Inter-Medium",
    sans-serif;
`;
const Value = styled.span`
  color: #0c2427;
  font:
    500 14px/1.6 "Inter-Medium",
    sans-serif;
  overflow-wrap: anywhere;
`;
const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Panel = styled.div`
  padding: 12px 14px;
  border: 1px solid #e0e3e6;
  border-radius: 10px;
  background: #edf6f966;
`;
const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px 64px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
const DocumentsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: -8px;
`;
const UploadButton = styled.button`
  width: 140px;
  height: 36px;
  border: 0;
  border-radius: 7px;
  background: #087d88;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font:
    600 12px "Inter-SemiBold",
    sans-serif;
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
const DocumentsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px 56px;
  padding: 12px 14px;
  border: 1px solid #e0e3e6;
  border-radius: 10px;
  background: #edf6f966;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
const Document = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const DocLabel = styled.span`
  font:
    500 12px/1.6 "Inter-Medium",
    sans-serif;
`;
const FileBox = styled.div`
  min-height: 42px;
  border: 1px solid #e0e3e6;
  border-radius: 5px;
  background: #edf6f966;
  padding: 5px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font:
    600 11px "Inter-SemiBold",
    sans-serif;
  img {
    width: 16px;
    height: 16px;
  }
`;
const FileIdentity = styled.span`
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const DocumentActions = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 0 0 auto;
`;
const ViewButton = styled.button`
  width: 30px;
  height: 30px;
  border: 0;
  background: transparent;
  border-radius: 5px;
  display: grid;
  place-items: center;
  cursor: pointer;
  &:hover {
    background: #dceff2;
  }
  &:focus-visible {
    outline: 2px solid #087d88;
    outline-offset: 1px;
  }
  img {
    width: 16px;
    height: 16px;
  }
`;
const ChangeButton = styled.button`
  height: 28px;
  padding: 0 7px;
  border: 1px solid #087d88;
  border-radius: 5px;
  background: #fff;
  color: #087d88;
  font:
    600 10px "Inter-SemiBold",
    sans-serif;
  cursor: pointer;
  &:disabled {
    opacity: 0.55;
  }
`;
const RemoveDocumentButton = styled(ChangeButton)`
  border-color: #c94b4b;
  color: #c94b4b;
`;
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #0c242780;
  display: grid;
  place-items: center;
  padding: 24px;
`;
const Modal = styled.div`
  width: min(760px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 60px #0003;
`;
const PreviewModal = styled(Modal)`
  width: min(960px, 100%);
  height: min(86vh, 760px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const PreviewHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  h2 {
    margin-bottom: 16px;
    overflow-wrap: anywhere;
  }
`;
const CloseButton = styled.button`
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 50%;
  background: #edf6f9;
  color: #0c2427;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
`;
const PreviewBody = styled.div`
  flex: 1;
  min-height: 0;
  border: 1px solid #e0e3e6;
  border-radius: 8px;
  overflow: auto;
  background: #f5f7f8;
  display: grid;
  place-items: center;
`;
const PreviewImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;
const PreviewMessage = styled.p`
  margin: 0;
  padding: 32px;
  color: #4b6265;
  font: 500 14px "Inter-Medium", sans-serif;
`;
const PreviewActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 14px;
`;
const OpenLink = styled.a`
  height: 38px;
  padding: 0 18px;
  border-radius: 7px;
  background: #087d88;
  color: #fff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font:
    600 12px "Inter-SemiBold",
    sans-serif;
`;
const UploadModal = styled(Modal)`
  width: min(900px, 100%);
`;
const UploadFormBody = styled.div`
  max-height: 65vh;
  overflow: auto;
  padding: 4px 2px 12px;
  & > div {
    width: 100%;
  }
`;
const UploadModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e0e3e6;
`;
const ModalTitle = styled.h2`
  margin: 0 0 20px;
  color: #0c2427;
  font:
    600 20px "Inter-SemiBold",
    sans-serif;
`;
const EditForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;
const EmergencyHeading = styled.div`
  grid-column: 1/-1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  font:
    600 15px "Inter-SemiBold",
    sans-serif;
  color: #066c78;
`;
const AddContactButton = styled.button`
  height: 34px;
  padding: 0 14px;
  border: 1px solid #087d88;
  border-radius: 7px;
  background: #fff;
  color: #087d88;
  cursor: pointer;
  font-weight: 600;
`;
const EmergencyFields = styled.div`
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  align-items: end;
  gap: 12px;
  padding: 14px;
  border: 1px solid #d8e0e2;
  border-radius: 8px;
  background: #f7fbfc;
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;
const RemoveContactButton = styled.button`
  height: 42px;
  padding: 0 12px;
  border: 1px solid #c94b4b;
  border-radius: 7px;
  background: #fff;
  color: #c94b4b;
  cursor: pointer;
  font-weight: 600;
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label {
    color: #4b6265;
    font:
      500 12px "Inter-Medium",
      sans-serif;
  }
  input,
  select {
    height: 42px;
    border: 1px solid #d8e0e2;
    border-radius: 7px;
    padding: 0 11px;
    background: #fff;
    color: #0c2427;
    font:
      500 13px "Inter-Medium",
      sans-serif;
    outline: none;
  }
  input:focus,
  select:focus {
    border-color: #087d88;
    box-shadow: 0 0 0 2px #087d8820;
  }
`;
const ModalActions = styled.div`
  grid-column: 1/-1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;
const CancelButton = styled.button`
  height: 40px;
  padding: 0 22px;
  border: 1px solid #087d88;
  border-radius: 7px;
  background: #fff;
  color: #087d88;
  cursor: pointer;
  font-weight: 600;
`;
const SaveButton = styled.button`
  height: 40px;
  padding: 0 22px;
  border: 0;
  border-radius: 7px;
  background: #087d88;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
