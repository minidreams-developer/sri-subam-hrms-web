import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import InputComponent from "../../components/InputComponent";
import Button from "../../components/Button";
import UploadIconSvg from "../../assets/images/Common/upload.svg";
import { toast } from "react-toastify";
import { createOrganization, updateOrganization } from "../../services/apiServices";
import { uploadMedia } from "../../helpers/uploadMedia";

const OrganizationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const organization = location.state?.organization;
  const organizationId = organization?.id;
  const [formData, setFormData] = useState({
    companyName: "",
    gst: "",
    pan: "",
    tan: "",
    email: "",
    mobileNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    if (!organization) return;
    setFormData({
      companyName: organization.companyName || "",
      gst: organization.gst || "",
      pan: organization.pan || "",
      tan: organization.tan || "",
      email: organization.email || "",
      mobileNumber: organization.mobileNumber || "",
      address1: organization.address1 || "",
      address2: organization.address2 || "",
      city: organization.city || "",
      state: organization.state || "",
      pinCode: organization.zipCode || "",
      country: organization.country || "",
    });
    setLogoUrl(organization.organizationLogo || "");
  }, [organization]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";

    if (!file) return;

    setLogoFile(file);
    setLogoUploading(true);

    try {
      const uploadedFile = await uploadMedia(file);
      setLogoUrl(uploadedFile.url);
      toast.success("Organization logo uploaded successfully");
    } catch (error) {
      setLogoFile(null);
      setLogoUrl("");
      toast.error(error.response?.data?.message || error.message || "Failed to upload organization logo");
      console.error("Organization logo upload error:", error);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Prepare payload according to API specs
      const payload = {
        companyName: formData.companyName,
        organizationLogo: logoUrl,
        gst: formData.gst,
        pan: formData.pan,
        tan: formData.tan,
        email: formData.email,
        phone: formData.mobileNumber,
        address: {
          addressLine1: formData.address1,
          addressLine2: formData.address2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pinCode,
          country: formData.country,
        },
      };

      const response = organizationId
        ? await updateOrganization(organizationId, payload)
        : await createOrganization(payload);
      toast.success("Organization details saved successfully!");
      console.log("API response:", response);
      navigate("/admin/settings/generalSettings");
    } catch (error) {
      console.error("Error saving organization details:", error);
      toast.error(
        error.response?.data?.message || "Failed to save organization details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Section>
        {/* Company Details */}
        <SubSection>
          <SectionTitle>Company Details</SectionTitle>
          
          <FormContent>
            {/* Organization Logo Upload */}
            <FullWidthField>
              <Label>Organization Logo</Label>
              <UploadArea onClick={() => document.getElementById("logoUpload").click()}>
                {logoUrl ? (
                  <LogoPreview src={logoUrl} alt="Organization logo" />
                ) : (
                  <img src={UploadIconSvg} alt="upload" width="32" height="32" />
                )}
                <UploadText>{logoUploading ? "Uploading..." : logoUrl ? "Change Image" : "Upload Image"}</UploadText>
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleLogoUpload}
                />
              </UploadArea>
              {logoFile && <FileName>{logoFile.name}</FileName>}
            </FullWidthField>

            {/* Company Name and GST */}
            <Row>
              <Col>
                <InputComponent
                  label="Company Name"
                  placeholder="Enter Company Name"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
              <Col>
                <InputComponent
                  label="GST"
                  placeholder="Enter GST"
                  value={formData.gst}
                  onChange={(e) => handleChange("gst", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
            </Row>

            {/* PAN and TAN */}
            <Row>
              <Col>
                <InputComponent
                  label="PAN"
                  placeholder="Enter PAN"
                  value={formData.pan}
                  onChange={(e) => handleChange("pan", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
              <Col>
                <InputComponent
                  label="TAN"
                  placeholder="Enter TAN"
                  value={formData.tan}
                  onChange={(e) => handleChange("tan", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
            </Row>

            {/* Email and Mobile Number */}
            <Row>
              <Col>
                <InputComponent
                  label="Email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
              <Col>
                <InputComponent
                  label="Mobile Number"
                  placeholder="Enter Mobile Number"
                  value={formData.mobileNumber}
                  onChange={(e) => handleChange("mobileNumber", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                  prefix="+91"
                />
              </Col>
            </Row>
          </FormContent>
        </SubSection>

        {/* Address */}
        <SubSection>
          <SectionTitle>Address</SectionTitle>
          
          <FormContent>
            {/* Address 1 and Address 2 */}
            <Row>
              <Col>
                <InputComponent
                  label="Address 1"
                  placeholder="Address 1"
                  value={formData.address1}
                  onChange={(e) => handleChange("address1", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
              <Col>
                <InputComponent
                  label="Address 2"
                  placeholder="Address 2"
                  value={formData.address2}
                  onChange={(e) => handleChange("address2", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
            </Row>

            {/* City and State */}
            <Row>
              <Col>
                <InputComponent
                  label="City"
                  placeholder="Enter City"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
              <Col>
                <InputComponent
                  label="State"
                  placeholder="Enter State"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
            </Row>

            {/* Pin code and Country */}
            <Row>
              <Col>
                <InputComponent
                  label="Pin code"
                  placeholder="Enter Pin code"
                  value={formData.pinCode}
                  onChange={(e) => handleChange("pinCode", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
              <Col>
                <InputComponent
                  label="Country"
                  placeholder="Enter Country"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
            </Row>
          </FormContent>
        </SubSection>

        {/* Action Buttons */}
        <ButtonRow>
          <Button
            text="Cancel"
            bg="transparent"
            color={theme.colors.primary}
            border={`1px solid ${theme.colors.primary}`}
            width="150px"
            radius="0.5rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleCancel}
                  disabled={loading || logoUploading}
          />
          <Button
            text={loading ? "Saving..." : "Save"}
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="150px"
            radius="0.5rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleSave}
            disabled={loading || logoUploading}
          />
        </ButtonRow>
      </Section>
    </Container>
  );
};

export default OrganizationDetails;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SubSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FullWidthField = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const UploadArea = styled.div`
  width: 100%;
  height: 100px;
  border: 2px dashed ${theme.colors.primary};
  border-radius: 0.5rem;
  background: #066C781A;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #066C7833;
  }
`;

const UploadText = styled.span`
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.primary};
`;

const LogoPreview = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 0.375rem;
`;

const FileName = styled.span`
  font-size: 0.75rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.secondaryTextColor};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div`
  width: 100%;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${theme.colors.border};
`;
