import { useState, forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import UploadComponent from "../../../components/UploadComponent";
import FileUploadComponent from "../../../components/FileUploadComponent";
import AddNewFieldModal from "../../../components/AddNewFieldModal";
import MinusIcon from "../../../assets/images/employee/minus.svg";

const Documents = forwardRef(({ }, ref) => {
  const [documents, setDocuments] = useState([
    { id: 1, label: "Select Document", file: null, keepOriginal: false },
  ]);

  const [personalDocuments, setPersonalDocuments] = useState([
    { id: 1, label: "Select Document", file: null, keepOriginal: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "government" or "personal"

  // Expose documents data via ref
  useImperativeHandle(ref, () => ({
    formData: {
      governmentDocuments: documents,
      personalDocuments: personalDocuments,
    },
  }));

  const handleFileSelect = (id, file, keepOriginal) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, file, keepOriginal } : doc
      )
    );
  };

  const handleFileRemove = (id) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, file: null, keepOriginal: false } : doc
      )
    );
  };

  const handleAddMore = () => {
    setModalType("government");
    setIsModalOpen(true);
  };

  const handleRemove = (id) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  const handleLabelChange = (id, newLabel) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, label: newLabel } : doc))
    );
  };

  // Personal Documents handlers
  const handlePersonalFileSelect = (id, file, keepOriginal) => {
    setPersonalDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, file, keepOriginal } : doc
      )
    );
  };

  const handlePersonalFileRemove = (id) => {
    setPersonalDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, file: null, keepOriginal: false } : doc
      )
    );
  };

  const handlePersonalAddMore = () => {
    setModalType("personal");
    setIsModalOpen(true);
  };

  const handlePersonalRemove = (id) => {
    if (personalDocuments.length > 1) {
      setPersonalDocuments(personalDocuments.filter((doc) => doc.id !== id));
    }
  };

  const handlePersonalLabelChange = (id, newLabel) => {
    setPersonalDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, label: newLabel } : doc))
    );
  };

  const handleModalSubmit = (documentName) => {
    if (modalType === "government") {
      const newId = Math.max(...documents.map((d) => d.id)) + 1;
      setDocuments([
        ...documents,
        { id: newId, label: documentName, file: null, keepOriginal: false },
      ]);
    } else if (modalType === "personal") {
      const newId = Math.max(...personalDocuments.map((d) => d.id)) + 1;
      setPersonalDocuments([
        ...personalDocuments,
        { id: newId, label: documentName, file: null, keepOriginal: false },
      ]);
    }
  };

  return (
    <Container>
      <AddNewFieldModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
      
      <Section>
        <SectionTitle>Government Documents</SectionTitle>
        <Row>
          {documents.map((doc, index) => (
            <Col key={doc.id}>
              <DocumentWrapper>
                {index >= 1 && (
                  <RemoveIcon
                    src={MinusIcon}
                    alt="remove"
                    onClick={() => handleRemove(doc.id)}
                  />
                )}
                {doc.file ? (
                  <FileUploadComponent
                    inputId={`government-${doc.id}`}
                    label={doc.label}
                    fileName={doc.file.name}
                    showEye={false}
                    showCross={true}
                    showKeepOriginal={true}
                    keepOriginal={doc.keepOriginal}
                    onRemove={() => handleFileRemove(doc.id)}
                    onKeepOriginalChange={(checked) => {
                      setDocuments((prev) =>
                        prev.map((d) =>
                          d.id === doc.id ? { ...d, keepOriginal: checked } : d
                        )
                      );
                    }}
                  />
                ) : (
                  <UploadComponent
                    inputId={`government-${doc.id}`}
                    label={doc.label}
                    isEditable={index >= 2}
                    onLabelChange={(newLabel) => handleLabelChange(doc.id, newLabel)}
                    onFileSelect={(file, keepOriginal) =>
                      handleFileSelect(doc.id, file, keepOriginal)
                    }
                  />
                )}
              </DocumentWrapper>
            </Col>
          ))}
        </Row>
        <ButtonWrapper>
          <AddMoreButton onClick={handleAddMore}>
            <span>+</span> Add More
          </AddMoreButton>
        </ButtonWrapper>
     
      </Section>

      <Section>
        <SectionTitle>Personal Documents</SectionTitle>
        <Row>
          {personalDocuments.map((doc, index) => (
            <Col key={doc.id}>
              <DocumentWrapper>
                {index >= 1 && (
                  <RemoveIcon
                    src={MinusIcon}
                    alt="remove"
                    onClick={() => handlePersonalRemove(doc.id)}
                  />
                )}
                {doc.file ? (
                  <FileUploadComponent
                    inputId={`personal-${doc.id}`}
                    label={doc.label}
                    fileName={doc.file.name}
                    showEye={false}
                    showCross={true}
                    showKeepOriginal={true}
                    keepOriginal={doc.keepOriginal}
                    onRemove={() => handlePersonalFileRemove(doc.id)}
                    onKeepOriginalChange={(checked) => {
                      setPersonalDocuments((prev) =>
                        prev.map((d) =>
                          d.id === doc.id ? { ...d, keepOriginal: checked } : d
                        )
                      );
                    }}
                  />
                ) : (
                  <UploadComponent
                    inputId={`personal-${doc.id}`}
                    label={doc.label}
                    isEditable={index >= 2}
                    onLabelChange={(newLabel) => handlePersonalLabelChange(doc.id, newLabel)}
                    onFileSelect={(file, keepOriginal) =>
                      handlePersonalFileSelect(doc.id, file, keepOriginal)
                    }
                  />
                )}
              </DocumentWrapper>
            </Col>
          ))}
        </Row>
        <ButtonWrapper>
          <AddMoreButton onClick={handlePersonalAddMore}>
            <span>+</span> Add More
          </AddMoreButton>
        </ButtonWrapper>
      </Section>
    </Container>
  );
});

const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #E0E3E6;

  &:last-of-type {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin: 0 0 1.5rem 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div`
  width: 100%;
`;

const DocumentWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const RemoveIcon = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  z-index: 10;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2.5rem;
`;

const AddMoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid ${theme.colors.primary};
  border-radius: 0.5rem;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.secondaryWhite};
  }

  span {
    font-size: 1.2rem;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #E0E3E6;
  margin-top: 2rem;
`;

export default Documents;
