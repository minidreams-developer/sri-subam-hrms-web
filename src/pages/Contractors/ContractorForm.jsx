import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import deleteIcon from "../../assets/contractor/SVG.svg";
import editIcon from "../../assets/contractor/SVG (1).svg";
import axios from "axios";
import { toast } from "react-toastify";

const ContractorForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Personal Information
  const [formData, setFormData] = useState({
    profilePhoto: null,
    profilePhotoName: "",
    contractorId: "",
    contractorName: "",
    password: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    phoneNumber: "",
    emailAddress: "",
    workAddress: "",
    motherTongue: "",
    religion: "",
    identificationMark: "",
    address: "",
    city: "",
    country: "India",
    state: "",
    pinCode: "",
    country2: "",
    aadharNumber: "",
    aadharFile: null,
    aadharFileName: "",
    bankCardNumber: "",
    panFile: null,
    panFileName: "",
    emergencyContacts: [
      {
        id: 1,
        name: "",
        phone: "",
        relation: "",
        address: "",
        city: "",
        country: "India",
        state: "",
        pinCode: "",
      },
    ],
  });

  // Step 2: Work & Job Details
  const [workData, setWorkData] = useState({
    companyName: "",
    companyAddress: "",
    specialization: "",
    licenseNo: "",
    dateOfJoining: "",
    branch: "Headquarters",
    reportingPerson: "",
  });

  const [hqJobItems, setHqJobItems] = useState([
    {
      id: 1,
      jobItem: "",
      split: "",
      priceUnit: ""
    }
  ]);

  const [northJobItems, setNorthJobItems] = useState([
    {
      id: 1,
      jobItem: "",
      split: "",
      priceUnit: ""
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleWorkDataChange = (e) => {
    const { name, value } = e.target;
    setWorkData({ ...workData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePhoto: file,
        profilePhotoName: file.name,
      });
    }
  };

  const handleAadharUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        aadharFile: file,
        aadharFileName: file.name,
      });
    }
  };

  const handlePanUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        panFile: file,
        panFileName: file.name,
      });
    }
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index][field] = value;
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const handleAddMoreContact = () => {
    const newContact = {
      id: formData.emergencyContacts.length + 1,
      name: "",
      phone: "",
      relation: "",
      address: "",
      city: "",
      country: "",
      state: "",
      pinCode: "",
    };
    setFormData({
      ...formData,
      emergencyContacts: [...formData.emergencyContacts, newContact],
    });
  };

  const handleRemoveContact = (index) => {
    const newContacts = formData.emergencyContacts.filter((_, i) => i !== index);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const handleHqJobItemChange = (index, field, value) => {
    const newItems = [...hqJobItems];
    newItems[index][field] = value;
    setHqJobItems(newItems);
  };

  const handleNorthJobItemChange = (index, field, value) => {
    const newItems = [...northJobItems];
    newItems[index][field] = value;
    setNorthJobItems(newItems);
  };

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

  const removeHqJobItem = (index) => {
    if (hqJobItems.length > 1) {
      setHqJobItems(hqJobItems.filter((_, i) => i !== index));
    }
  };

  const removeNorthJobItem = (index) => {
    if (northJobItems.length > 1) {
      setNorthJobItems(northJobItems.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.contractorName?.trim()) {
      toast.error("Contractor Name is required");
      return;
    }
    if (!formData.emailAddress?.trim()) {
      toast.error("Email Address is required");
      return;
    }
    if (!formData.phoneNumber?.trim()) {
      toast.error("Phone Number is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build payload according to API spec
      const payload = {
        name: formData.contractorName?.trim() || "",
        email: formData.emailAddress?.trim() || "",
        password: formData.password?.trim() || "defaultPassword123",
        phone: parseInt(formData.phoneNumber?.replace(/\D/g, "") || "0", 10),
        gender: (formData.gender || "male").toLowerCase(),
        dateOfBirth: formData.dateOfBirth || "",
        age: parseInt(formData.age || 0, 10),
        motherTongue: formData.motherTongue?.trim() || "",
        religion: formData.religion?.trim() || "",
        identificationMark: formData.identificationMark?.trim() || "",
        documentNo: {
          aadharNo: parseInt(formData.aadharNumber || "0", 10),
          panNo: formData.bankCardNumber?.trim() || ""
        },
        address: {
          addressLine1: formData.address?.trim() || "",
          district: formData.state?.trim() || "",
          city: formData.city?.trim() || "",
          state: formData.state?.trim() || "",
          pincode: parseInt(formData.pinCode || "0", 10),
          country: formData.country?.trim() || "India"
        },
        emergencyContacts: formData.emergencyContacts
          .filter(contact => contact.name?.trim() && contact.phone?.trim())
          .map(contact => ({
            contactName: contact.name?.trim() || "",
            phone: parseInt(contact.phone?.replace(/\D/g, "") || "0", 10),
            relationship: contact.relation?.trim() || "",
            address: {
              addressLine1: contact.address?.trim() || "",
              district: contact.state?.trim() || "",
              city: contact.city?.trim() || "",
              state: contact.state?.trim() || "",
              pincode: parseInt(contact.pinCode || "0", 10),
              country: contact.country?.trim() || "India"
            }
          })),
        workInformation: {
          companyName: workData.companyName?.trim() || "",
          specialty: workData.specialization?.trim() || "",
          LicenseNo: workData.licenseNo?.trim() || "",
          dateOfJoining: workData.dateOfJoining || "",
          branch: workData.branch || "",
          reportingPerson: workData.reportingPerson || ""
        },
        jobItems: [
          ...hqJobItems
            .filter(item => item.jobItem?.trim() && item.priceUnit)
            .map(item => ({
              jobItems: item.jobItem?.trim() || "",
              unit: item.split?.trim() || "Piece",
              price: parseFloat(item.priceUnit) || 0,
              region: "headquarters"
            })),
          ...northJobItems
            .filter(item => item.jobItem?.trim() && item.priceUnit)
            .map(item => ({
              jobItems: item.jobItem?.trim() || "",
              unit: item.split?.trim() || "Piece",
              price: parseFloat(item.priceUnit) || 0,
              region: "north"
            }))
        ]
      };

      console.log("📤 Submitting payload:", JSON.stringify(payload, null, 2));
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/contractors/register`;
      console.log("🔗 API URL:", apiUrl);

      const response = await axios.post(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("✅ Contractor registered successfully:", response.data);
      toast.success("Contractor registered successfully!");
      
      // Navigate to contractors list page
      setTimeout(() => {
        navigate("/admin/contractors/contractors");
      }, 1000);
      
    } catch (error) {
      console.error("❌ Error registering contractor:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to register contractor";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/contractors/contractors");
  };

  return (
    <Container>
      <PageHeader>
        <Title>Add New Contractor</Title>
        <Subtitle>Fill in the details to add a new contractor to the database</Subtitle>
      </PageHeader>

      <StepsIndicator>
        <StepItem $active={currentStep === 1} onClick={() => setCurrentStep(1)}>
          <StepNumber $active={currentStep === 1}>1</StepNumber>
          <StepLabel>Personal Info</StepLabel>
        </StepItem>
        <StepConnector $completed={currentStep > 1} />
        <StepItem $active={currentStep === 2} onClick={() => setCurrentStep(2)}>
          <StepNumber $active={currentStep === 2}>2</StepNumber>
          <StepLabel>Work & Job Details</StepLabel>
        </StepItem>
      </StepsIndicator>

      <FormContainer onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <>
            {/* STEP 1: PERSONAL INFORMATION */}
            <FormSection>
              <SectionHeader>
                <SectionTitle>Personal Information</SectionTitle>
              </SectionHeader>

              <PhotoUploadArea>
                <PhotoPlaceholder>
                  {formData.profilePhotoName ? "✓" : "📷"}
                </PhotoPlaceholder>
                <PhotoInfo>
                  <UploadText>Upload Photo</UploadText>
                  <UploadSubtext>
                    {formData.profilePhotoName
                      ? `Selected: ${formData.profilePhotoName}`
                      : "Recommended size 200 x 200px (Min 100 x 100px)"}
                  </UploadSubtext>
                  <FileInput
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    hidden
                    id="photo-upload"
                  />
                  <UploadLabel htmlFor="photo-upload">
                    {formData.profilePhotoName ? "Change Photo" : "Choose File"}
                  </UploadLabel>
                </PhotoInfo>
              </PhotoUploadArea>

              <FormGrid>
                <FormGroup>
                  <Label>Contractor ID</Label>
                  <Input
                    type="text"
                    name="contractorId"
                    placeholder="C12-0001"
                    value={formData.contractorId}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Contractor Name</Label>
                  <Input
                    type="text"
                    name="contractorName"
                    placeholder="Enter full name"
                    value={formData.contractorName}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    name="emailAddress"
                    placeholder="contractor@email.com"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Gender</Label>
                  <Select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    name="age"
                    placeholder="Auto-calculated"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Mother Tongue</Label>
                  <Input
                    type="text"
                    name="motherTongue"
                    placeholder="e.g., Tamil, Hindi"
                    value={formData.motherTongue}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Religion</Label>
                  <Input
                    type="text"
                    name="religion"
                    placeholder="e.g., Hindu, Christian"
                    value={formData.religion}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Identification Mark</Label>
                  <Input
                    type="text"
                    name="identificationMark"
                    placeholder="e.g., Mole on right hand"
                    value={formData.identificationMark}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Identification Mark</Label>
                  <Input
                    type="text"
                    name="identificationMark"
                    placeholder="e.g., Mole on right hand"
                    value={formData.identificationMark}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup fullWidth>
                  <Label>Work Address</Label>
                  <Input
                    type="text"
                    name="workAddress"
                    placeholder="Paste your work address"
                    value={formData.workAddress}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormGrid>
            </FormSection>

            {/* Address Details Section */}
            <FormSection>
              <SectionTitle>Address Details</SectionTitle>
              <hr />

              <FormGrid>
                <FormGroup fullWidth>
                  <Label>Address</Label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Street address, PO box, etc."
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>City</Label>
                  <Input
                    type="text"
                    name="city"
                    placeholder="City name"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Country</Label>
                  <Input
                    type="text"
                    name="country"
                    placeholder="India"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>State</Label>
                  <Input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Pin Code</Label>
                  <Input
                    type="text"
                    name="pinCode"
                    placeholder="Postal code"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Country 2</Label>
                  <Select name="country2" value={formData.country2} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="India">India</option>
                  </Select>
                </FormGroup>
              </FormGrid>
            </FormSection>

            {/* Emergency Contacts */}
            {formData.emergencyContacts.map((contact, index) => (
              <EmergencySection key={contact.id}>
                <EmergencySectionHeader>
                  <SectionTitle>
                    Emergency Contact Information {formData.emergencyContacts.length > 1 && `#${index + 1}`}
                  </SectionTitle>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {formData.emergencyContacts.length > 1 && (
                      <RemoveButton
                        type="button"
                        onClick={() => handleRemoveContact(index)}
                      >
                        🗑 Remove
                      </RemoveButton>
                    )}
                    {index === formData.emergencyContacts.length - 1 && (
                      <AddMoreButton
                        type="button"
                        onClick={handleAddMoreContact}
                      >
                        + Add More Contact
                      </AddMoreButton>
                    )}
                  </div>
                </EmergencySectionHeader>

                <FormGrid>
                  <FormGroup>
                    <Label>Contact Name</Label>
                    <Input
                      type="text"
                      placeholder="Contact name"
                      value={contact.name}
                      onChange={(e) =>
                        handleEmergencyContactChange(index, "name", e.target.value)
                      }
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={contact.phone}
                      onChange={(e) =>
                        handleEmergencyContactChange(index, "phone", e.target.value)
                      }
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Relation</Label>
                    <Input
                      type="text"
                      placeholder="eg. Brother, Sister"
                      value={contact.relation}
                      onChange={(e) =>
                        handleEmergencyContactChange(index, "relation", e.target.value)
                      }
                    />
                  </FormGroup>

                  <FormGroup fullWidth>
                    <Label>Address</Label>
                    <Input
                      type="text"
                      placeholder="Contact address"
                      value={contact.address}
                      onChange={(e) =>
                        handleEmergencyContactChange(index, "address", e.target.value)
                      }
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>City</Label>
                    <Input
                      type="text"
                      placeholder="City name"
                      value={contact.city}
                      onChange={(e) =>
                        handleEmergencyContactChange(index, "city", e.target.value)
                      }
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Country</Label>
                    <Select
                      value={contact.country}
                      onChange={(e) =>
                        handleEmergencyContactChange(index, "country", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="India">India</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>State</Label>
                    <Input
                      type="text"
                      placeholder="State"
                      value={contact.state}
                      onChange={(e) =>
                        handleEmergencyContactChange(index, "state", e.target.value)
                      }
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Pin Code</Label>
                    <Input
                      type="text"
                      placeholder="Postal code"
                      value={contact.pinCode}
                      onChange={(e) =>
                        handleEmergencyContactChange(index, "pinCode", e.target.value)
                      }
                    />
                  </FormGroup>
                </FormGrid>
              </EmergencySection>
            ))}

            {/* Documents Section */}
            <FormSection>
              <SectionTitle>Documents</SectionTitle>
              <hr /><br />

              <DocumentsGrid>
                <FormGroup>
                  <Label>Aadhar Card Number</Label>
                  <Input
                    type="text"
                    name="aadharNumber"
                    placeholder="Enter 12 digit number"
                    value={formData.aadharNumber}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Aadhar File</Label>
                  <FileInput
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleAadharUpload}
                    hidden
                    id="aadhar-upload"
                  />
                  <CompactUploadButton as="label" htmlFor="aadhar-upload">
                    {formData.aadharFileName ? `✓` : "Upload"}
                  </CompactUploadButton>
                  {formData.aadharFileName && (
                    <CompactFileNameDisplay>{formData.aadharFileName}</CompactFileNameDisplay>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>PAN Card Number</Label>
                  <Input
                    type="text"
                    name="bankCardNumber"
                    placeholder="Enter PAN number"
                    value={formData.bankCardNumber}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>PAN File</Label>
                  <FileInput
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handlePanUpload}
                    hidden
                    id="pan-upload"
                  />
                  <CompactUploadButton as="label" htmlFor="pan-upload">
                    {formData.panFileName ? `✓` : "Upload"}
                  </CompactUploadButton>
                  {formData.panFileName && (
                    <CompactFileNameDisplay>{formData.panFileName}</CompactFileNameDisplay>
                  )}
                </FormGroup>
              </DocumentsGrid>
            </FormSection>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* STEP 2: WORK & JOB DETAILS */}
            <FormSection>
              <SectionHeader>
                <SectionTitle>Work Information</SectionTitle>
                <Description>Please check and update the following details for the contractor.</Description>
              </SectionHeader>

              <FormGrid>
                <FormGroup>
                  <Label>Company Name</Label>
                  <Input type="text" name="companyName" placeholder="Company Name" value={workData.companyName} onChange={handleWorkDataChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Address</Label>
                  <Input type="text" name="companyAddress" placeholder="Company Address, Location" value={workData.companyAddress} onChange={handleWorkDataChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Specialization</Label>
                  <Input type="text" name="specialization" value={workData.specialization} onChange={handleWorkDataChange} />
                </FormGroup>
                <FormGroup>
                  <Label>License No</Label>
                  <Input type="text" name="licenseNo" placeholder="License Registration No" value={workData.licenseNo} onChange={handleWorkDataChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Date of Joining</Label>
                  <Input type="text" name="dateOfJoining" placeholder="Select the date" value={workData.dateOfJoining} onChange={handleWorkDataChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Branch</Label>
                  <Select name="branch" value={workData.branch} onChange={handleWorkDataChange}>
                    <option>Select Branch</option>
                    <option>Headquarters</option>
                    <option>North Region</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Reporting Person</Label>
                  <Select name="reportingPerson" value={workData.reportingPerson} onChange={handleWorkDataChange}>
                    <option>Select Reporting Person</option>
                  </Select>
                </FormGroup>
              </FormGrid>
            </FormSection>

            {/* Job Items - Headquarters */}
            <FormSection>
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
                            onChange={(e) => handleHqJobItemChange(hqJobItems.indexOf(item), "jobItem", e.target.value)}
                          />
                        </Td>
                        <Td>
                          <CellInput
                            type="number"
                            value={item.split}
                            onChange={(e) => handleHqJobItemChange(hqJobItems.indexOf(item), "split", e.target.value)}
                          />
                        </Td>
                        <Td>
                          <CellInput
                            type="number"
                            value={item.priceUnit}
                            step="0.01"
                            onChange={(e) => handleHqJobItemChange(hqJobItems.indexOf(item), "priceUnit", e.target.value)}
                          />
                        </Td>
                        <Td>
                          <ActionButtons>
                            <IconButton><img src={editIcon} alt="edit" width="16" height="16" /></IconButton>
                            <IconButton onClick={() => removeHqJobItem(hqJobItems.indexOf(item))}><img src={deleteIcon} alt="delete" width="16" height="16" /></IconButton>
                          </ActionButtons>
                        </Td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableWrapper>
            </FormSection>

            {/* Job Items - North Region */}
            <FormSection>
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
                            onChange={(e) => handleNorthJobItemChange(northJobItems.indexOf(item), "jobItem", e.target.value)}
                          />
                        </Td>
                        <Td>
                          <CellInput
                            type="number"
                            value={item.split}
                            onChange={(e) => handleNorthJobItemChange(northJobItems.indexOf(item), "split", e.target.value)}
                          />
                        </Td>
                        <Td>
                          <CellInput
                            type="number"
                            value={item.priceUnit}
                            step="0.01"
                            onChange={(e) => handleNorthJobItemChange(northJobItems.indexOf(item), "priceUnit", e.target.value)}
                          />
                        </Td>
                        <Td>
                          <ActionButtons>
                            <IconButton><img src={editIcon} alt="edit" width="16" height="16" /></IconButton>
                            <IconButton onClick={() => removeNorthJobItem(northJobItems.indexOf(item))}><img src={deleteIcon} alt="delete" width="16" height="16" /></IconButton>
                          </ActionButtons>
                        </Td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableWrapper>
            </FormSection>
          </>
        )}

        {/* Action Buttons - Only at the end of Step 2 */}
        {currentStep === 2 && (
          <FormActions>
            <CancelButton onClick={handleCancel} disabled={isSubmitting}>Cancel</CancelButton>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </SubmitButton>
          </FormActions>
        )}

        {/* Navigation between steps */}
        {currentStep === 1 && (
          <FormActions>
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
            <NextButton type="button" onClick={() => setCurrentStep(2)}>Next →</NextButton>
          </FormActions>
        )}
      </FormContainer>
    </Container>
  );
};


// Styled Components - Step Indicator
const Container = styled.div`
  width: 100%;
  padding: 2rem;
  background: #F5F7FA;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
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
  margin: 0.5rem 0 0 0;
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const StepsIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  opacity: ${props => props.$active ? 1 : 0.5};
  transition: all 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.$active ? '#0047AB' : '#E5E7EB'};
  color: ${props => props.$active ? 'white' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: "Inter", sans-serif;
`;

const StepLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  color: #222;
`;

const StepConnector = styled.div`
  width: 100px;
  height: 2px;
  background: ${props => props.$completed ? '#0047AB' : '#E5E7EB'};
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

const EmergencySection = styled(FormSection)`
  border: 1px solid #DC2626;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
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

const EmergencySectionHeader = styled(SectionHeader)``;

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PhotoUploadArea = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #F9F9F9;
  border-radius: 8px;
  border: 1px dashed #D1D5DB;
`;

const PhotoPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: #E0E7FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`;

const PhotoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UploadText = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
  margin: 0;
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
  padding: 0.5rem 1rem;
  background: white;
  color: #0047AB;
  border: 2px solid #0047AB;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  width: fit-content;
  transition: all 0.2s;

  &:hover {
    background: #F0F5FF;
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
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0047AB;
    box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.1);
  }

  option {
    padding: 0.5rem;
  }
`;

const AddMoreButton = styled.button`
  padding: 0.6rem 1rem;
  background: #DC2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #B91C1C;
  }
`;

const RemoveButton = styled.button`
  padding: 0.6rem 1rem;
  background: #DC2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: #B91C1C;
  }
`;

const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CompactUploadButton = styled.label`
  padding: 0.6rem 0.8rem;
  background: white;
  color: #0047AB;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;

  &:hover {
    background: #F0F5FF;
    border-color: #0047AB;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CompactFileNameDisplay = styled.p`
  font-size: 0.65rem;
  color: #16A34A;
  margin: 0.3rem 0 0 0;
  padding: 0.3rem 0.4rem;
  background: #ECFDF5;
  border-radius: 4px;
  border-left: 2px solid #16A34A;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 0.75rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #F9FAFB;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #E5E7EB;
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
  border: 1px solid #D1D5DB;
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

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
`;

const CancelButton = styled.button`
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

  &:hover:not(:disabled) {
    background: #F5F7FA;
    border-color: #999;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const NextButton = styled.button`
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

export default ContractorForm;
