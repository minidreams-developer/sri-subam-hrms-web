import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const WorkJobDetails = () => {
  const navigate = useNavigate();
  const [branch, setBranch] = useState("Headquarters");
  const [entryDate, setEntryDate] = useState("2026-04-24");
  const [workDate, setWorkDate] = useState("2026-04-24");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [jobItems, setJobItems] = useState([
    { id: 1, jobItem: "AC Installation", quantity: 2, unit: "Piece", priceUnit: 120.00, total: 240.00, remarks: "Building A, F1.3" },
    { id: 2, jobItem: "", quantity: 2, unit: "-", priceUnit: 120.00, total: 0.00, remarks: "Add remarks..." }
  ]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const addJobItem = () => {
    const newId = jobItems.length + 1;
    setJobItems([...jobItems, { id: newId, jobItem: "", quantity: 0, unit: "-", priceUnit: 0.00, total: 0.00, remarks: "Add remarks..." }]);
  };

  const deleteJobItem = (id) => {
    setJobItems(jobItems.filter(item => item.id !== id));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles([...selectedFiles, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Container>
      <PageHeader>
        <Breadcrumb>
          <Crumb>Contractors</Crumb>
          <Crumb>›</Crumb>
          <Crumb active>Log Work Entry</Crumb>
        </Breadcrumb>
        <Title>Add Work Entry For Manoj</Title>
      </PageHeader>

      <FormContent>
        {/* Branch & Dates Section */}
        <Section>
          <FormRow>
            <FieldGroup full>
              <Label>Branch</Label>
              <Select value={branch} onChange={(e) => setBranch(e.target.value)}>
                <option>Headquarters</option>
                <option>North Region</option>
                <option>South Region</option>
              </Select>
            </FieldGroup>
          </FormRow>
          <FormRow>
            <FieldGroup>
              <Label>Entry Date</Label>
              <DateInput 
                type="date" 
                value={entryDate} 
                onChange={(e) => setEntryDate(e.target.value)} 
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Work Done Date</Label>
              <DateInput 
                type="date" 
                value={workDate} 
                onChange={(e) => setWorkDate(e.target.value)} 
              />
            </FieldGroup>
          </FormRow>
        </Section>

        {/* Job Items Section */}
        <Section>
          <SectionTitle>Job Items</SectionTitle>
          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <Th>S. No</Th>
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
                    <Td><CellInput type="text" placeholder="Select Job Item" value={item.jobItem} /></Td>
                    <Td><CellInput type="number" value={item.quantity} /></Td>
                    <Td><CellInput type="text" value={item.unit} /></Td>
                    <Td><CellInput type="text" value={`$${item.priceUnit.toFixed(2)}`} /></Td>
                    <Td><CellInput type="text" value={`$${item.total.toFixed(2)}`} disabled /></Td>
                    <Td><CellInput type="text" placeholder="Add remarks..." value={item.remarks} /></Td>
                    <Td><DeleteButton onClick={() => deleteJobItem(item.id)}>🗑️</DeleteButton></Td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
          <AddJobButton onClick={addJobItem}>+ Add Next Job Item</AddJobButton>
        </Section>

        {/* Attachments Section */}
        <Section>
          <SectionTitle>Attachments (Optional)</SectionTitle>
          <Dropzone 
            onClick={() => document.getElementById('file-upload').click()} 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input 
              id="file-upload" 
              type="file" 
              style={{ display: 'none' }} 
              multiple 
              onChange={handleFileChange}
            />
            <UploadIcon>⬆️</UploadIcon>
            <DropText>Click to upload or drag and drop</DropText>
            <DropSubtext>SVG, PNG, JPG, PDF or DOC (max. 50MB)</DropSubtext>
          </Dropzone>
          {selectedFiles.length > 0 && (
            <FileList>
              {selectedFiles.map((file, idx) => (
                <FileItem key={idx}>
                  {file.name}
                </FileItem>
              ))}
            </FileList>
          )}
        </Section>
      </FormContent>

      <Footer>
        <CancelButton onClick={() => navigate(-1)}>Cancel</CancelButton>
        <SaveButton>💾 Save Entry</SaveButton>
      </Footer>
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
  margin-bottom: 1.5rem;
`;

const Breadcrumb = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #666;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const Crumb = styled.span`
  color: ${props => props.active ? "#0047AB" : "#666"};
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #E7E7E7;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 1rem 0;
  font-family: "Inter", sans-serif;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const FieldGroup = styled.div`
  flex: ${props => props.full ? "1" : "1"};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  font-family: "Inter", sans-serif;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #E7E7E7;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  background: #F5F5F5;
`;

const DateInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #E7E7E7;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  background: white;
  width: 100%;
  cursor: pointer;

  &::-webkit-calendar-picker-indicator {
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 1;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #F5F5F5;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #E7E7E7;
`;

const Th = styled.th`
  padding: 0.75rem 0.5rem;
  text-align: left;
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
`;

const TableBody = styled.tbody``;

const Td = styled.td`
  padding: 0.75rem 0.5rem;
`;

const CellInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #E7E7E7;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  background: ${props => props.disabled ? "#F5F5F5" : "white"};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
`;

const AddJobButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: 1px dashed #0047AB;
  border-radius: 6px;
  background: white;
  color: #0047AB;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #F0F5FF;
  }
`;

const Dropzone = styled.div`
  border: 2px dashed #CCCCCC;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #0047AB;
    background: #F0F5FF;
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const DropText = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #0047AB;
  margin: 0 0 0.25rem 0;
`;

const DropSubtext = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  color: #888;
  margin: 0;
`;

const FileList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  padding: 0.75rem;
  background: #F5F5F5;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  color: #333;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem 0;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  background: white;
  color: #333;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #FACC15;
  color: #222;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
`;

export default WorkJobDetails;
