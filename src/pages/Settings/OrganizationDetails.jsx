import { useState } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import InputComponent from "../../components/InputComponent";
import Button from "../../components/Button";
import UploadIconSvg from "../../assets/images/Common/upload.svg";
import { toast } from "react-toastify";
import { post } from "../../helpers/api_helper";
import { CREATE_ORGANIZATION } from "../../helpers/url_helper";

const OrganizationDetails = () => {
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
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Prepare payload according to API specs
      const payload = {
        companyName: formData.companyName,
        email: formData.email,
        address: {
          addressLine1: formData.address1,
          addressLine2: formData.address2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pinCode,
          country: formData.country,
        },
      };

      // Remove any undefined values
      Object.keys(payload.address).forEach(
        (key) => !payload.address[key] && delete payload.address[key]
      );
      Object.keys(payload).forEach(
        (key) => !payload[key] && key !== "address" && delete payload[key]
      );

      const response = await post(CREATE_ORGANIZATION, payload);
      toast.success("Organization details saved successfully!");
      console.log("API response:", response);
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
                <img src={UploadIconSvg} alt="upload" width="32" height="32" />
                <UploadText>Upload Image</UploadText>
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
            disabled={loading}
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
            disabled={loading}
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
