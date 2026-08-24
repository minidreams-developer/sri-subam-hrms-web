// Builds a multipart registration request while keeping the API's existing
// top-level payload shape. Objects/arrays are JSON strings and actual File
// instances are appended as binary multipart parts.
export const buildRegistrationFormData = (payload, documentsData = {}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  const documentMetadata = [];
  const documentGroups = [
    ["governmentDocuments", documentsData.governmentDocuments || []],
    ["personalDocuments", documentsData.personalDocuments || []],
  ];

  documentGroups.forEach(([fieldName, documents]) => {
    documents.forEach((document) => {
      if (!(document.file instanceof File)) return;

      formData.append(fieldName, document.file, document.file.name);
      documentMetadata.push({
        documentName: document.label,
        documentType: fieldName === "governmentDocuments" ? "government" : "personal",
        fieldName,
        fileName: document.file.name,
        mimeType: document.file.type,
        keepOriginal: Boolean(document.keepOriginal),
      });
    });
  });

  formData.append("documents", JSON.stringify(documentMetadata));
  return formData;
};

export const buildDocumentFormData = (documentsData = {}) => {
  const formData = new FormData();
  const metadata = [];
  const groups = [
    ["governmentDocuments", "government", documentsData.governmentDocuments || []],
    ["personalDocuments", "personal", documentsData.personalDocuments || []],
  ];

  groups.forEach(([fieldName, documentType, documents]) => {
    documents.forEach((document) => {
      if (!(document.file instanceof File)) return;
      formData.append(fieldName, document.file, document.file.name);
      metadata.push({
        documentName: document.label || document.file.name,
        documentType,
        fileName: document.file.name,
        mimeType: document.file.type,
        keepOriginal: Boolean(document.keepOriginal),
      });
    });
  });

  formData.append("documents", JSON.stringify(metadata));
  return formData;
};
