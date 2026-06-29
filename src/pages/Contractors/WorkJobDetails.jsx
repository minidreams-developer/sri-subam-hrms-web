import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const WorkJobDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Work Information
    companyName: "",
    address: "",
    specialty: "",
    licensingNo: "",
    dateOfJoining: "",
    branch: "",
    reportingPerson: "",
    // Job Items
    jobItems: [
      {
        id: 1,
        jobName: "Roof Painting",
        unit: "Sq. Ft.",
        chargedRate: "15,890",
      },
    ],
    // Update History
    updateHistory: [
      {
        id: 1,
        previousUpdate: "15 Sep 2025",
        jobTitle: "Roof Painting",
        unit: "Sq. Ft.",
        previousRate: "14.00",
        lastModified: "05 Oct 2025",
        modifiedBy: "Mirza Murnite",
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleJobItemChange = (index, field, value) => {
    const newJobItems = [...formData.jobItems];
    newJobItems[index][field] = value;
    setFormData({ ...formData, jobItems: newJobItems });
  };

  const addJobItem = () => {
    setFormData({
      ...formData,
      jobItems: [
        ...formData.jobItems,
        {
          id: formData.jobItems.length + 1,
          jobName: "",
          unit: "",
          chargedRate: "",
        },
      ],
    });
  };

  const deleteJobItem = (index) => {
    const newJobItems = formData.jobItems.filter((_, i) => i !== index);
    setFormData({ ...formData, jobItems: newJobItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call here, then navigate to next page
    navigate("/admin/contractors/contractors");
  };

  const handleCancel = () => {
    navigate("/admin/contractors/add");
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Container>
      <PageHeader>
        
        <HeaderContent>
          <HeaderLeft>
            <Title>Work & Job Details</Title>
            <Subtitle>Provide work information and staffing job details for the contractor</Subtitle>
          </HeaderLeft>
        </HeaderContent>
      </PageHeader>

      <FormContainer onSubmit={handleSubmit}>
        {/* Work Information Section */}
        <FormSection>
          <SectionTitle>Work Information</SectionTitle>

          <FormGrid>
            <FormGroup>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                placeholder="Company address, Location"
                value={formData.address}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Specialty</Label>
              <Select name="specialty" value={formData.specialty} onChange={handleInputChange}>
                <option value="">Select Specialty</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="Painting">Painting</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>License No</Label>
              <Input
                type="text"
                name="licensingNo"
                placeholder="License or Organization No"
                value={formData.licensingNo}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Date of Joining</Label>
              <Input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Branch</Label>
              <Select name="branch" value={formData.branch} onChange={handleInputChange}>
                <option value="">Select Branch</option>
                <option value="North">North Region</option>
                <option value="South">South Region</option>
                <option value="East">East Region</option>
                <option value="West">West Region</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Reporting Person</Label>
              <Select name="reportingPerson" value={formData.reportingPerson} onChange={handleInputChange}>
                <option value="">Select Reporting Person</option>
                <option value="Manager 1">Manager 1</option>
                <option value="Manager 2">Manager 2</option>
                <option value="Manager 3">Manager 3</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Job Items - Headquarters */}
        <FormSection>
          <SectionHeaderWithButton>
            <SectionTitle>Job Items - Headquarters</SectionTitle>
            <AddButton onClick={addJobItem}>+ Create Job Item</AddButton>
          </SectionHeaderWithButton>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>S.No.</TableHeader>
                  <TableHeader>Job Name</TableHeader>
                  <TableHeader>Unit</TableHeader>
                  <TableHeader>Charged Job</TableHeader>
                  <TableHeader>Action</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.jobItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <CellInput
                        type="text"
                        placeholder="Job name"
                        value={item.jobName}
                        onChange={(e) => handleJobItemChange(index, "jobName", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <CellInput
                        type="text"
                        placeholder="e.g. Sq. Ft."
                        value={item.unit}
                        onChange={(e) => handleJobItemChange(index, "unit", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <CellInput
                        type="text"
                        placeholder="15,890"
                        value={item.chargedRate}
                        onChange={(e) => handleJobItemChange(index, "chargedRate", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <ActionIcons>
                        <IconButton
                          type="button"
                          onClick={() => deleteJobItem(index)}
                          title="Delete"
                        >
                          🗑
                        </IconButton>
                      </ActionIcons>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <UpdateHistoryHeader>Update History</UpdateHistoryHeader>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Previous Update</TableHeader>
                  <TableHeader>Job Title</TableHeader>
                  <TableHeader>Unit</TableHeader>
                  <TableHeader>Previous Rate</TableHeader>
                  <TableHeader>Last Modified</TableHeader>
                  <TableHeader>Updated by</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.updateHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.previousUpdate}</TableCell>
                    <TableCell>{item.jobTitle}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.previousRate}</TableCell>
                    <TableCell>{item.lastModified}</TableCell>
                    <TableCell>{item.modifiedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FormSection>

        {/* Action Buttons */}
        <FormActions>
          <BackButton onClick={handleBack}>Back</BackButton>
          <SubmitButton type="submit">Done</SubmitButton>
        </FormActions>
      </FormContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 2rem;
  background: #F5F7FA;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
`;

const BreadcrumbItem = styled.span`
  color: ${(props) => (props.active ? "#0047AB" : "#666")};
  font-weight: ${(props) => (props.active ? "600" : "500")};
  font-family: "Inter", sans-serif;
`;

const BreadcrumbSeparator = styled.span`
  color: #ccc;
  margin: 0 0.3rem;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const SectionHeaderWithButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AddButton = styled.button`
  padding: 0.7rem 1.5rem;
  background: #0047AB;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.25s ease;

  &:hover {
    background: #003580;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
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
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #0047AB;
    box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #0047AB;
    box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.1);
  }

  option {
    padding: 0.5rem;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1.5rem;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Inter", sans-serif;
`;

const TableHead = styled.thead`
  background: #F3F4F6;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #E5E7EB;

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  white-space: nowrap;
`;

const TableBody = styled.tbody`
  background: white;
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.9rem;
  color: #333;
  vertical-align: middle;
`;

const CellInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: "Inter", sans-serif;

  &:focus {
    outline: none;
    border-color: #0047AB;
  }

  &::placeholder {
    color: #999;
  }
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const UpdateHistoryHeader = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
  margin: 2rem 0 1rem 0;
  font-family: "Inter", sans-serif;
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
`;

const BackButton = styled.button`
  padding: 0.8rem 2rem;
  background: white;
  color: #222;
  border: 2px solid #D1D5DB;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #F5F7FA;
    border-color: #999;
  }
`;

const SubmitButton = styled.button`
  padding: 0.8rem 2rem;
  background: #0047AB;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #003580;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default WorkJobDetails;
