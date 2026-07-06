import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import theme from "../../theme/theme";
import deleteIcon from "../../assets/contractor/SVG.svg";

const AddWorkEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contractor = location.state?.contractor;

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    branch: "",
    entryDate: getTodayDate(),
    workDueDate: "",
    reference: ""
  });

  const [jobItems, setJobItems] = useState([
    {
      id: 1,
      jobItem: "",
      quantity: "",
      priceUnit: "",
      remarks: ""
    }
  ]);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/branches`;
        console.log("🔗 Fetching branches from:", apiUrl);
        
        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        console.log("✅ Branches fetched successfully:", response.data);
        
        const branchResults = response.data?.results || [];
        setBranches(Array.isArray(branchResults) ? branchResults : []);
        
        // Set first branch as default if available
        if (branchResults.length > 0) {
          setFormData(prev => ({
            ...prev,
            branch: branchResults[0]._id || branchResults[0].id || ""
          }));
        }
      } catch (error) {
        console.error("❌ Error fetching branches:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        toast.error("Failed to load branches");
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleJobItemChange = (index, field, value) => {
    const newItems = [...jobItems];
    newItems[index][field] = value;
    setJobItems(newItems);
  };

  const addJobItem = () => {
    const newItem = {
      id: Date.now(),
      jobItem: "",
      quantity: "",
      priceUnit: "",
      remarks: ""
    };
    setJobItems([...jobItems, newItem]);
  };

  const removeJobItem = (index) => {
    if (jobItems.length > 1) {
      setJobItems(jobItems.filter((_, i) => i !== index));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    navigate("/admin/contractors/contractors");
  };

  const handleSave = async () => {
    // Validate form
    if (!formData.entryDate?.trim()) {
      toast.error("Entry Date is required");
      return;
    }
    if (!formData.workDueDate?.trim()) {
      toast.error("Work Done Date is required");
      return;
    }
    if (jobItems.some(item => !item.jobItem?.trim())) {
      toast.error("All job items must have a description");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get branch ObjectId from contractor's workInformation or use formData.branch as fallback
      const branchId = contractor?._originalData?.workInformation?.branch || formData.branch;
      const contractorId = contractor?.contractorId || contractor?._originalData?.employeeId || contractor?.id || "";

      // Build payload according to API spec
      const payload = {
        contractorId: contractorId,
        branch: branchId,
        workDoneDate: formData.workDueDate,
        reference: formData.reference || "",
        jobItems: jobItems
          .filter(item => item.jobItem?.trim())
          .map(item => ({
            contractorJobItem: item.jobItem?.trim() || "",
            quantity: parseFloat(item.quantity) || 0,
            pricePerUnit: parseFloat(item.priceUnit) || 0,
            remarks: item.remarks?.trim() || ""
          }))
      };

      console.log("📤 Submitting work entry payload:", JSON.stringify(payload, null, 2));
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/log-work`;
      console.log("🔗 API URL:", apiUrl);

      const response = await axios.post(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("✅ Work entry logged successfully:", response.data);
      toast.success("Work entry saved successfully!");
      
      // Navigate back to contractors list after 1 second
      setTimeout(() => {
        navigate("/admin/contractors/contractors");
      }, 1000);
      
    } catch (error) {
      console.error("❌ Error saving work entry:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to save work entry";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!contractor) {
    return (
      <Container>
        <ErrorMessage>No contractor selected. Please go back and try again.</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader>
        <Breadcrumb>
          <Crumb>Contractors</Crumb>
          <CrumbSeparator>›</CrumbSeparator>
          <Crumb>Log Work Entry</Crumb>
          <CrumbSeparator>›</CrumbSeparator>
          <Crumb active>{contractor.name}</Crumb>
        </Breadcrumb>
      </PageHeader>

      <ContentWrapper>
        <FormHeader>
          <FormTitle>Add Work Entry For {contractor.name}</FormTitle>
        </FormHeader>

        {/* Work Information Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>Work Information</SectionTitle>
          </SectionHeader>

          <FormGrid>
            <FormGroup>
              <Label>Branch</Label>
              <Select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                disabled={branchesLoading}
              >
                <option value="">
                  {branchesLoading ? "Loading branches..." : "Select a branch"}
                </option>
                {branches.map((branch) => (
                  <option key={branch._id || branch.id} value={branch._id || branch.id}>
                    {branch.branchName || branch.name || "Unknown"}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Entry Date</Label>
              <Input
                type="date"
                name="entryDate"
                value={formData.entryDate}
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label>Work Done Date</Label>
              <Input
                type="date"
                name="workDueDate"
                value={formData.workDueDate}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup fullWidth>
              <Label>Reference / Work Description</Label>
              <TextArea
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                placeholder="Why Something"
                rows="3"
              />
            </FormGroup>
          </FormGrid>
        </Section>

        {/* Job Items Section */}
        <Section>
          <SectionHeaderRow>
            <SectionTitle>Job Items</SectionTitle>
            <AddJobButton onClick={addJobItem}>
              + Add Next Job Item
            </AddJobButton>
          </SectionHeaderRow>

          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <Th>S. No</Th>
                  <Th>Job Item</Th>
                  <Th>Quantity</Th>
                  <Th>Price/Unit</Th>
                  <Th>Remarks</Th>
                  <Th>Action</Th>
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
                        placeholder="Select Job Item"
                        onChange={(e) =>
                          handleJobItemChange(index, "jobItem", e.target.value)
                        }
                      />
                    </Td>
                    <Td>
                      <CellInput
                        type="number"
                        value={item.quantity}
                        placeholder="0"
                        onChange={(e) =>
                          handleJobItemChange(index, "quantity", e.target.value)
                        }
                      />
                    </Td>
                    <Td>
                      <CellInput
                        type="number"
                        value={item.priceUnit}
                        placeholder="₹0.00"
                        onChange={(e) =>
                          handleJobItemChange(index, "priceUnit", e.target.value)
                        }
                      />
                    </Td>
                    <Td>
                      <CellInput
                        type="text"
                        value={item.remarks}
                        placeholder="Add remarks..."
                        onChange={(e) =>
                          handleJobItemChange(index, "remarks", e.target.value)
                        }
                      />
                    </Td>
                    <Td>
                      <DeleteButton
                        onClick={() => removeJobItem(index)}
                        disabled={jobItems.length === 1}
                      >
                        <img src={deleteIcon} alt="delete" width="16" height="16" />
                      </DeleteButton>
                    </Td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Section>

        {/* Attachments Section */}
        <Section>
          <SectionTitle>Attachments (Optional)</SectionTitle>
          <hr />

          <AttachmentArea
            $isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadIcon>☁️</UploadIcon>
            <UploadText>Click to upload or drag and drop</UploadText>
            <UploadSubtext>SVG, PNG, JPG, PDF or DOC (Max: 10 MB)</UploadSubtext>
            <FileInput
              type="file"
              multiple
              onChange={handleFileUpload}
              id="file-upload"
              hidden
            />
            <UploadLabel htmlFor="file-upload">
              Choose Files
            </UploadLabel>
          </AttachmentArea>

          {uploadedFiles.length > 0 && (
            <FilesList>
              {uploadedFiles.map((file, index) => (
                <FileItem key={index}>
                  <FileName>{file.name}</FileName>
                  <FileSize>({(file.size / 1024 / 1024).toFixed(2)} MB)</FileSize>
                  <RemoveFileButton onClick={() => removeFile(index)}>
                    ✕
                  </RemoveFileButton>
                </FileItem>
              ))}
            </FilesList>
          )}
        </Section>

        {/* Action Buttons */}
        <Footer>
          <CancelButton onClick={handleCancel} disabled={isSubmitting}>Cancel</CancelButton>
          <SaveButton onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Entry"}
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
  background: #F5F7FA;
  padding: 1.5rem;
`;

const ErrorMessage = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  color: #dc2626;
  font-family: "Inter", sans-serif;
  font-weight: 600;
`;

const PageHeader = styled.div`
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

const FormHeader = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid #E5E7EB;
  padding-bottom: 1rem;
`;

const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
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
  grid-column: ${(props) => (props.fullWidth ? "1 / -1" : "auto")};
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

  &:disabled {
    background: #f5f5f5;
    color: #666;
    cursor: not-allowed;
    border-color: #d1d5db;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  background: white;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;

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
    background: #003580;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  margin-bottom: 1rem;
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

  &:hover {
    background: #f9fafb;
  }
`;

const Th = styled.th`
  padding: 0.75rem;
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

  &:focus {
    outline: none;
    border-color: #0047AB;
  }
`;

const CellDisplay = styled.div`
  padding: 0.5rem 0.75rem;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #222;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 1;
    transform: scale(1.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`;

const AttachmentArea = styled.div`
  border: 2px dashed ${props => props.$isDragging ? "#0047AB" : "#D1D5DB"};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.$isDragging ? "#F0F5FF" : "white"};
  transition: all 0.2s;
  cursor: pointer;
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const UploadText = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
  margin: 0.5rem 0;
  font-family: "Inter", sans-serif;
`;

const UploadSubtext = styled.p`
  font-size: 0.8rem;
  color: #888;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const FileInput = styled.input``;

const UploadLabel = styled.label`
  display: inline-block;
  padding: 0.6rem 1.25rem;
  background: #0047AB;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  margin-top: 1rem;
  transition: all 0.2s;

  &:hover {
    background: #003580;
  }
`;

const FilesList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #F9FAFB;
  border-radius: 6px;
  border-left: 3px solid #16A34A;
`;

const FileName = styled.span`
  flex: 1;
  font-size: 0.85rem;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  color: #222;
`;

const FileSize = styled.span`
  font-size: 0.75rem;
  color: #888;
  font-family: "Inter", sans-serif;
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  line-height: 1;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E7EB;
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

  &:hover:not(:disabled) {
    background: #F5F5F5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  &:hover:not(:disabled) {
    background: #003580;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default AddWorkEntry;
