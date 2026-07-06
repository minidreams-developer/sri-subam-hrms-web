import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import theme from "../../theme/theme";
import deleteIcon from "../../assets/contractor/SVG.svg";

const LogWorkEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contractor = location.state?.contractor;

  const [formData, setFormData] = useState({
    branch: "Headquarters",
    entryDate: "24 Apr 2025",
    workDoneDate: "24 Apr 2025",
    reference: ""
  });

  const [jobItems, setJobItems] = useState([
    {
      id: 1,
      jobItem: "AC Installation",
      quantity: 2,
      unit: "Piece",
      priceUnit: 120.00,
      total: 240.00,
      remarks: "Building A, 1st Fl."
    },
    {
      id: 2,
      jobItem: "",
      quantity: 2,
      unit: "",
      priceUnit: 0.00,
      total: 0.00,
      remarks: ""
    }
  ]);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const addJobItem = () => {
    const newItem = {
      id: Date.now(),
      jobItem: "",
      quantity: "",
      unit: "",
      priceUnit: "",
      total: "",
      remarks: ""
    };
    setJobItems([...jobItems, newItem]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      type: file.type
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      type: file.type
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  };

  return (
    <Container>
      <PageHeader>
        <Breadcrumb>
          <Crumb>Contractors</Crumb>
          <CrumbSeparator>›</CrumbSeparator>
          <Crumb active>Log Work Entry</Crumb>
        </Breadcrumb>
      </PageHeader>

      <ContentWrapper>
        <Title>Add Work Entry For {contractor?.name || "Contractor"}</Title>

        {/* Form Sections */}
        <Section>
          <FormRow>
            <FormGroup>
              <Label>Branch</Label>
              <Select
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
              >
                <option value="Headquarters">Headquarters</option>
                <option value="North Region">North Region</option>
              </Select>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Entry Date</Label>
              <DateWrapper>
                <Input type="text" value={formData.entryDate} />
                <CalendarIcon>📅</CalendarIcon>
              </DateWrapper>
            </FormGroup>
            <FormGroup>
              <Label>Work Done Date</Label>
              <DateWrapper>
                <Input type="text" value={formData.workDoneDate} />
                <CalendarIcon>📅</CalendarIcon>
              </DateWrapper>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Reference</Label>
              <Input
                type="text"
                placeholder="Write something"
                value={formData.reference}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
              />
            </FormGroup>
          </FormRow>
        </Section>

        {/* Job Items Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>Job Items</SectionTitle>
          </SectionHeader>
          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <Th>S.No</Th>
                  <Th>Job Item</Th>
                  <Th>Quantity</Th>
                  <Th>Unit</Th>
                  <Th>Price/Unit</Th>
                  <Th>Total</Th>
                  <Th>Remarks</Th>
                  <Th></Th>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <Td>{index + 1}</Td>
                    <Td>
                      <CellInput
                        type="text"
                        value={item.jobItem}
                        placeholder="Select Job Items"
                      />
                    </Td>
                    <Td>
                      <CellInput
                        type="number"
                        value={item.quantity}
                      />
                    </Td>
                    <Td>
                      <CellSelect value={item.unit}>
                        <option value="">Select Unit</option>
                        <option value="Piece">Piece</option>
                        <option value="Hour">Hour</option>
                      </CellSelect>
                    </Td>
                    <Td>
                      <CellInput
                        type="number"
                        value={item.priceUnit}
                        step="0.01"
                      />
                    </Td>
                    <Td>
                      <CellInput
                        type="number"
                        value={item.total}
                        disabled
                      />
                    </Td>
                    <Td>
                      <CellInput
                        type="text"
                        value={item.remarks}
                        placeholder="Add remarks"
                      />
                    </Td>
                    <Td>
                      <DeleteButton>
                        <DeleteIcon src={deleteIcon} alt="delete" />
                      </DeleteButton>
                    </Td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>

          <AddRowButton onClick={addJobItem}>
            + Add Next Job Item
          </AddRowButton>
        </Section>

        {/* Attachments Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>Attachments (Optional)</SectionTitle>
          </SectionHeader>
          <DropZone
            onClick={() => document.getElementById('file-upload').click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            $isDragging={isDragging}
          >
            <input
              type="file"
              id="file-upload"
              hidden
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.svg"
              onChange={handleFileSelect}
            />
            <DropZoneText>
              <DropIcon>📎</DropIcon>
              Click to upload or drag and drop<br />
              SVG, PNG, JPG or PDF (max. 800 × 800px)
            </DropZoneText>
          </DropZone>

          {uploadedFiles.length > 0 && (
            <UploadedFilesList>
              {uploadedFiles.map(file => (
                <UploadedFile key={file.id}>
                  <FileName>{file.name}</FileName>
                  <RemoveButton onClick={() => removeFile(file.id)}>✕</RemoveButton>
                </UploadedFile>
              ))}
            </UploadedFilesList>
          )}
        </Section>

        {/* Buttons */}
        <Footer>
          <CancelButton onClick={() => navigate("/admin/contractors/contractors")}>
            Cancel
          </CancelButton>
          <SaveButton>
            💾 Save Entry
          </SaveButton>
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  padding: 1.5rem;
  background: #F5F7FA;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Breadcrumb = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.85rem;
  color: #666;
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const Crumb = styled.span`
  color: ${props => props.active ? "#222" : "#666"};
  font-family: "Inter", sans-serif;
`;

const CrumbSeparator = styled.span`
  color: #666;
`;

const ContentWrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 1.5rem 0;
  font-family: "Inter", sans-serif;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionHeader = styled.div`
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #222;
  font-family: "Inter", sans-serif;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  background: white;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0047AB;
  }

  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0047AB;
  }
`;

const DateWrapper = styled.div`
  position: relative;
`;

const CalendarIcon = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: #666;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  margin-bottom: 0.75rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${theme.colors.bgColor};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};
`;

const Th = styled.th`
  padding: 0.75rem 0.75rem;
  text-align: left;
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
`;

const TableBody = styled.tbody``;

const Td = styled.td`
  padding: 0.5rem 0.75rem;
`;

const CellInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  background: white;
  box-sizing: border-box;
`;

const CellSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  background: white;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DeleteIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const AddRowButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: 1px dashed #0047AB;
  border-radius: 6px;
  background: transparent;
  color: #0047AB;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #F0F5FF;
  }
`;

const DropZone = styled.div`
  border: 2px dashed ${(props) => props.$isDragging ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => props.$isDragging ? '#F0F5FF' : 'white'};

  &:hover {
    border-color: ${theme.colors.primary};
    background: #F0F5FF;
  }
`;

const DropZoneText = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  color: #666;
`;

const DropIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const UploadedFilesList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UploadedFile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${theme.colors.bgColor};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
`;

const FileName = styled.span`
  font-size: 0.85rem;
  color: ${theme.colors.textColor};
  font-family: "Inter", sans-serif;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #DC2626;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 2rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  background: white;
  color: #222;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #F5F5F5;
  }
`;

const SaveButton = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #FFB017 0%, #FFC700 100%);
  color: white;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export default LogWorkEntry;
