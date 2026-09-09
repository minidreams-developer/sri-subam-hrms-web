import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import deleteIcon from "../../assets/contractor/SVG.svg";
import editIcon from "../../assets/contractor/SVG (1).svg";

const WorkJobDetails = () => {
  const navigate = useNavigate();

  const [hqJobItems, setHqJobItems] = useState([
    {
      id: 1,
      jobItem: "Wall Painting",
      split: 2,
      priceUnit: 10.00
    }
  ]);

  const [hqHistory, setHqHistory] = useState([
    {
      id: 1,
      jobItem: "Wall Painting",
      unit: "Piece",
      quantity: 2,
      priceUnit: 12.00,
      date: "01 Dec 2025"
    }
  ]);

  const [northJobItems, setNorthJobItems] = useState([
    {
      id: 1,
      jobItem: "Floor Tiles",
      split: "",
      priceUnit: ""
    }
  ]);

  const addHqJobItem = () => {
    const newItem = {
      id: Date.now(),
      jobItem: "",
      split: "",
      priceUnit: ""
    };
    setHqJobItems([...hqJobItems, newItem]);
  };

  const addNorthJobItem = () => {
    const newItem = {
      id: Date.now(),
      jobItem: "",
      split: "",
      priceUnit: ""
    };
    setNorthJobItems([...northJobItems, newItem]);
  };

  return (
    <Container>
      <PageHeader>
        <Breadcrumb>
          <Crumb>Contractors</Crumb>
          <CrumbSeparator>›</CrumbSeparator>
          <Crumb active>Work & Job details</Crumb>
        </Breadcrumb>
        <SearchInput placeholder="Global Search" />
      </PageHeader>

      <ContentWrapper>
        {/* Work Information Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>Work Information</SectionTitle>
            <Description>Please check and update the following details for the contractor.</Description>
          </SectionHeader>

          <FormGrid>
            <FormGroup>
              <Label>Company Name</Label>
              <Input type="text" placeholder="Company Name" />
            </FormGroup>
            <FormGroup>
              <Label>Address</Label>
              <Input type="text" placeholder="Company Address, Location" />
            </FormGroup>
            <FormGroup>
              <Label>Specialization</Label>
              <Input type="text" />
            </FormGroup>
            <FormGroup>
              <Label>License No</Label>
              <Input type="text" placeholder="License Registration No" />
            </FormGroup>
            <FormGroup>
              <Label>Date of Joining</Label>
              <Input type="text" placeholder="Select the date" />
            </FormGroup>
            <FormGroup>
              <Label>Branch</Label>
              <Select>
                <option>Select Branch</option>
                <option>Headquarters</option>
                <option>North Region</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Reporting Person</Label>
              <Select>
                <option>Select Reporting Person</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </Section>

        {/* Job Items - Headquarters */}
        <Section>
          <SectionHeaderRow>
            <SectionTitle>Job Items - Headquarters</SectionTitle>
            <AddJobButton onClick={addHqJobItem}>
              + Add New Job Item
            </AddJobButton>
          </SectionHeaderRow>

          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <Th>Job Item</Th>
                  <Th>unit</Th>
                  <Th>Price/Unit</Th>
                  <Th>Action</Th>
                </TableRow>
              </TableHead>
              <TableBody>
                {hqJobItems.map((item) => (
                  <TableRow key={item.id}>
                    <Td>
                      <CellInput
                        type="text"
                        value={item.jobItem}
                        placeholder="Job Item"
                      />
                    </Td>
                    <Td>
                      <CellInput
                        type="number"
                        value={item.split}
                      />
                    </Td>
                    <Td>
                      <CellInput
                        type="number"
                        value={item.priceUnit}
                        step="0.01"
                      />
                    </Td>
                    <Td>
                      <ActionButtons>
                        <IconButton><img src={editIcon} alt="edit" width="16" height="16" /></IconButton>
                        <IconButton><img src={deleteIcon} alt="delete" width="16" height="16" /></IconButton>
                      </ActionButtons>
                    </Td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>

          {/* Update History */}
          <HistorySection>
            <HistoryTitle>Update History</HistoryTitle>
            <HistoryTableWrapper>
              <HistoryTable>
                <HistoryTableHead>
                  <HistoryTableRow>
                    <HistoryTh>Job Item</HistoryTh>
                    <HistoryTh>Unit</HistoryTh>
                    <HistoryTh>Qty</HistoryTh>
                    <HistoryTh>Price/Unit</HistoryTh>
                    <HistoryTh>Date</HistoryTh>
                    <HistoryTh></HistoryTh>
                  </HistoryTableRow>
                </HistoryTableHead>
                <HistoryTableBody>
                  {hqHistory.map((item) => (
                    <HistoryTableRow key={item.id}>
                      <HistoryTd>{item.jobItem}</HistoryTd>
                      <HistoryTd>{item.unit}</HistoryTd>
                      <HistoryTd>{item.quantity}</HistoryTd>
                      <HistoryTd>{item.priceUnit.toFixed(2)}</HistoryTd>
                      <HistoryTd>{item.date}</HistoryTd>
                      <HistoryTd>
                        <UndoButton>Undo</UndoButton>
                      </HistoryTd>
                    </HistoryTableRow>
                  ))}
                </HistoryTableBody>
              </HistoryTable>
            </HistoryTableWrapper>
          </HistorySection>
        </Section>

        {/* Job Items - North Region */}
        <Section>
          <SectionHeaderRow>
            <SectionTitle>Job Items - North Region</SectionTitle>
            <AddJobButton onClick={addNorthJobItem}>
              + Add New Job Item
            </AddJobButton>
          </SectionHeaderRow>

          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <Th>Job Item</Th>
                  <Th>unit</Th>
                  <Th>Price/Unit</Th>
                  <Th>Action</Th>
                </TableRow>
              </TableHead>
              <TableBody>
                {northJobItems.map((item) => (
                  <TableRow key={item.id}>
                    <Td>
                      <CellInput
                        type="text"
                        value={item.jobItem}
                        placeholder="Job Item"
                      />
                    </Td>
                    <Td>
                      <CellInput
                        type="number"
                        value={item.split}
                      />
                    </Td>
                    <Td>
                      <CellInput
                        type="number"
                        value={item.priceUnit}
                        step="0.01"
                      />
                    </Td>
                    <Td>
                      <ActionButtons>
                        <IconButton><img src={editIcon} alt="edit" width="16" height="16" /></IconButton>
                        <IconButton><img src={deleteIcon} alt="delete" width="16" height="16" /></IconButton>
                      </ActionButtons>
                    </Td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>

        {/* Buttons */}
        <Footer>
          <BackButton onClick={() => navigate("/admin/contractors/add")}>
            Back
          </BackButton>
          <SaveButton onClick={() => navigate("/admin/contractors/contractors")}>
            Save
          </SaveButton>
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
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

const SearchInput = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  color: ${theme.colors.textColor};
  background: ${theme.colors.white};
  width: 220px;

  &::placeholder {
    color: ${theme.colors.secondaryText};
  }
`;

const ContentWrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const Description = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin: 0.5rem 0 0 0;
  font-family: "Inter", sans-serif;
`;

const AddJobButton = styled.button`
  padding: 0.5rem 1rem;
  background: #0047AB;
  color: white;
  border: none;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #003A8C;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

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
    border-color: #066C78;
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
    border-color: #066C78;
  }
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

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HistorySection = styled.div`
  margin-top: 1rem;
`;

const HistoryTitle = styled.h4`
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  margin: 0 0 0.75rem 0;
  font-family: "Inter", sans-serif;
`;

const HistoryTableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const HistoryTableHead = styled.thead`
  background: #F5F5F5;
`;

const HistoryTableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};
`;

const HistoryTh = styled.th`
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-family: "Inter", sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  color: #666;
`;

const HistoryTableBody = styled.tbody``;

const HistoryTd = styled.td`
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  font-family: "Inter", sans-serif;
  color: #333;
`;

const UndoButton = styled.button`
  padding: 0.25rem 0.75rem;
  background: white;
  color: #666;
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #F5F5F5;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
`;

const BackButton = styled.button`
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
  background: #0047AB;
  color: white;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #003A8C;
  }
`;

export default WorkJobDetails;
