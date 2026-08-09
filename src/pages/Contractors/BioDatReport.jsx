import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FiDownload, FiX } from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BioDatReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reportData, setReportData] = useState({
    reportType: "Bio Data Report",
    period: "May 2026",
    contractorName: "",
  });

  useEffect(() => {
    if (location.state?.reportData) {
      setReportData(location.state.reportData);
    }
  }, [location]);

  // Sample contractor bio data
  const contractorBioData = {
    "Manraj": {
      photo: "👤",
      contractorId: "CTR-4091",
      name: "Manraj",
      status: "Active",
      designation: "Senior Contractor",
      specialization: "HVAC",
      
      personalInfo: {
        dateOfBirth: "15-05-1985",
        age: "38 Years",
        gender: "Male",
        phoneNumber: "+91 98765 43210",
        emailAddress: "manraj@email.com",
      },

      address: {
        workAddress: "123 Main Street, Office Complex",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        postalCode: "110001",
      },

      workDetails: {
        companyName: "Ace Workforce",
        workExperience: "12 Years",
        specialty: "HVAC Systems",
        licenseNumber: "LIC-4091-2024",
        dateOfJoining: "10-01-2014",
        branch: "Headquarters",
        reportingPerson: "Manager 1",
      },

      emergencyContact: {
        contactName: "Priya Manraj",
        relationship: "Spouse",
        phoneNumber: "+91 98765 43211",
        address: "123 Main Street, Delhi",
      },

      documents: {
        aadharNumber: "XXXX-XXXX-1234",
        panNumber: "ABCDE1234F",
      },
    },

    "Ramesh": {
      photo: "👤",
      contractorId: "CTR-4092",
      name: "Ramesh",
      status: "Active",
      designation: "Carpenter",
      specialization: "Carpentry",
      
      personalInfo: {
        dateOfBirth: "22-08-1990",
        age: "33 Years",
        gender: "Male",
        phoneNumber: "+91 97654 32109",
        emailAddress: "ramesh@email.com",
      },

      address: {
        workAddress: "456 Builder Road, Industrial Area",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        postalCode: "560001",
      },

      workDetails: {
        companyName: "Ace Workforce",
        workExperience: "8 Years",
        specialty: "Carpentry & Joinery",
        licenseNumber: "LIC-4092-2024",
        dateOfJoining: "15-03-2016",
        branch: "South Region",
        reportingPerson: "Manager 2",
      },

      emergencyContact: {
        contactName: "Ramesh Father",
        relationship: "Father",
        phoneNumber: "+91 97654 32110",
        address: "456 Builder Road, Bangalore",
      },

      documents: {
        aadharNumber: "XXXX-XXXX-5678",
        panNumber: "FGHIJ5678K",
      },
    },

    "Kumar": {
      photo: "👤",
      contractorId: "CTR-4093",
      name: "Kumar",
      status: "Active",
      designation: "Electrician",
      specialization: "Electrical Work",
      
      personalInfo: {
        dateOfBirth: "03-12-1988",
        age: "35 Years",
        gender: "Male",
        phoneNumber: "+91 96543 21098",
        emailAddress: "kumar@email.com",
      },

      address: {
        workAddress: "789 Electric Lane, Tech Park",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        postalCode: "500001",
      },

      workDetails: {
        companyName: "Ace Workforce",
        workExperience: "10 Years",
        specialty: "Electrical Systems",
        licenseNumber: "LIC-4093-2024",
        dateOfJoining: "20-06-2015",
        branch: "South Region",
        reportingPerson: "Manager 2",
      },

      emergencyContact: {
        contactName: "Kumar Sister",
        relationship: "Sister",
        phoneNumber: "+91 96543 21099",
        address: "789 Electric Lane, Hyderabad",
      },

      documents: {
        aadharNumber: "XXXX-XXXX-9101",
        panNumber: "KLMNO9101P",
      },
    },
  };

  const bioData = contractorBioData[reportData.contractorName] || contractorBioData["Manraj"];

  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-content");
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(`Contractor_BioData_${bioData.name}.pdf`);
  };

  const handleBack = () => {
    navigate("/admin/contractors/contractors");
  };

  return (
    <ReportWrapper>
      <ReportHeader>
        <HeaderLeft>
          <ReportTitle>Contractor Bio Data Report</ReportTitle>
          <ReportSubtitle>{bioData.name}</ReportSubtitle>
        </HeaderLeft>
        <HeaderRight>
          <DownloadButton onClick={handleDownloadPDF}>
            <FiDownload size={18} />
            Download Report
          </DownloadButton>
          <CloseButton onClick={handleBack}>
            <FiX size={20} />
          </CloseButton>
        </HeaderRight>
      </ReportHeader>

      <ReportContent id="report-content">
        {/* Centered PDF Header */}
        <CenteredHeader>
          <CompanyLogo>▲</CompanyLogo>
          <ReportTitlePDF>CONTRACTOR BIO DATA</ReportTitlePDF>
          <GeneratedDate>Generated on {new Date().toLocaleDateString()}</GeneratedDate>
        </CenteredHeader>

        {/* Photo & 2-Column Info Section */}
        <PhotoInfoSection>
          <PhotoColumn>
            <Photo>{bioData.photo}</Photo>
          </PhotoColumn>
          
          <InfoColumn>
            <InfoGrid2Col>
              <InfoPair>
                <InfoLabel>NAME</InfoLabel>
                <InfoValue>{bioData.name}</InfoValue>
              </InfoPair>
              <InfoPair>
                <InfoLabel>CONTRACTOR ID</InfoLabel>
                <InfoValue>{bioData.contractorId}</InfoValue>
              </InfoPair>

              <InfoPair>
                <InfoLabel>SPECIALTY</InfoLabel>
                <InfoValue>{bioData.specialization}</InfoValue>
              </InfoPair>
              <InfoPair>
                <InfoLabel>COMPANY</InfoLabel>
                <InfoValue>{bioData.workDetails.companyName}</InfoValue>
              </InfoPair>

              <InfoPair>
                <InfoLabel>AGE</InfoLabel>
                <InfoValue>{bioData.personalInfo.age}</InfoValue>
              </InfoPair>
              <InfoPair>
                <InfoLabel>LICENSE NO</InfoLabel>
                <InfoValue>{bioData.workDetails.licenseNumber}</InfoValue>
              </InfoPair>

              <InfoPairFull>
                <InfoLabel>BRANCH</InfoLabel>
                <InfoValue>{bioData.workDetails.branch}</InfoValue>
              </InfoPairFull>
            </InfoGrid2Col>
          </InfoColumn>
        </PhotoInfoSection>

        {/* Address Information */}
        <Section>
          <SectionTitle>Address Information</SectionTitle>
          <SectionContent>
            <FieldFull>
              <FieldLabel>STREET ADDRESS</FieldLabel>
              <FieldValue>{bioData.address.workAddress}</FieldValue>
            </FieldFull>
            
            <FieldGrid2Col>
              <Field>
                <FieldLabel>CITY</FieldLabel>
                <FieldValue>{bioData.address.city}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>DISTRICT</FieldLabel>
                <FieldValue>{bioData.address.city}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>STATE</FieldLabel>
                <FieldValue>{bioData.address.state}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>PIN CODE</FieldLabel>
                <FieldValue>{bioData.address.postalCode}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>COUNTRY</FieldLabel>
                <FieldValue>{bioData.address.country}</FieldValue>
              </Field>
            </FieldGrid2Col>
          </SectionContent>
        </Section>

        {/* Emergency Contact */}
        <Section>
          <SectionTitle>Emergency Contact Information</SectionTitle>
          <SectionContent>
            <FieldGrid2Col>
              <Field>
                <FieldLabel>CONTACT NAME</FieldLabel>
                <FieldValue>{bioData.emergencyContact.contactName}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>RELATIONSHIP</FieldLabel>
                <FieldValue>{bioData.emergencyContact.relationship}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>PHONE NUMBER</FieldLabel>
                <FieldValue>{bioData.emergencyContact.phoneNumber}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>ALTERNATE PHONE</FieldLabel>
                <FieldValue>{bioData.emergencyContact.phoneNumber}</FieldValue>
              </Field>
            </FieldGrid2Col>
          </SectionContent>
        </Section>

        {/* Documents */}
        <Section>
          <SectionTitle>Documents</SectionTitle>
          <SectionContent>
            <FieldGrid2Col>
              <Field>
                <FieldLabel>AADHAR NUMBER</FieldLabel>
                <FieldValue>{bioData.documents.aadharNumber}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>PAN NUMBER</FieldLabel>
                <FieldValue>{bioData.documents.panNumber}</FieldValue>
              </Field>
            </FieldGrid2Col>
          </SectionContent>
        </Section>

        {/* Work */}
        <Section>
          <SectionTitle>Work</SectionTitle>
          <SectionContent>
            <FieldGrid2Col>
              <Field>
                <FieldLabel>DATE OF JOINING</FieldLabel>
                <FieldValue>{bioData.workDetails.dateOfJoining}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>BRANCH</FieldLabel>
                <FieldValue>{bioData.workDetails.branch}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>REPORTING PERSON</FieldLabel>
                <FieldValue>{bioData.workDetails.reportingPerson}</FieldValue>
              </Field>
            </FieldGrid2Col>
          </SectionContent>
        </Section>

        {/* Signature Section */}
        <SignatureSection>
          <SignatureBox>
            <SignatureLine />
            <SignatureLabel>Prepared By</SignatureLabel>
          </SignatureBox>
          <SignatureBox>
            <SignatureLine />
            <SignatureLabel>Checked By</SignatureLabel>
          </SignatureBox>
          <SignatureBox>
            <SignatureLine />
            <SignatureLabel>Authorised Signatory</SignatureLabel>
          </SignatureBox>
        </SignatureSection>
      </ReportContent>
    </ReportWrapper>
  );
};

// Styled Components
const ReportWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ReportHeader = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const ReportTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const ReportSubtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const DownloadButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #b91c1c;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #222;
  }
`;

const ReportContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;

    &:hover {
      background: #555;
    }
  }
`;

const CenteredHeader = styled.div`
  background: white;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CompanyLogo = styled.div`
  font-size: 2.5rem;
  color: #066C78;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const ReportTitlePDF = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin: 0.5rem 0 0.25rem 0;
  letter-spacing: 0.5px;
  font-family: "Inter", sans-serif;
`;

const GeneratedDate = styled.p`
  font-size: 0.8rem;
  color: #999;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const PhotoInfoSection = styled.div`
  background: white;
  padding: 2rem;
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PhotoColumn = styled.div`
  display: flex;
  justify-content: center;
`;

const Photo = styled.div`
  width: 140px;
  height: 140px;
  background: #e0e7ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const InfoColumn = styled.div`
  display: flex;
  align-items: flex-start;
`;

const InfoGrid2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 2rem;
  width: 100%;
`;

const InfoPair = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const InfoPairFull = styled(InfoPair)`
  grid-column: 1 / -1;
`;

const InfoLabel = styled.label`
  font-size: 0.7rem;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-family: "Inter", sans-serif;
`;

const InfoValue = styled.p`
  font-size: 0.95rem;
  color: #222;
  margin: 0;
  font-weight: 600;
  font-family: "Inter", sans-serif;
`;

const Section = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media print {
    box-shadow: none;
    page-break-inside: avoid;
  }
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
  font-family: "Inter", sans-serif;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FieldFull = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const FieldGrid2Col = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FieldLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-family: "Inter", sans-serif;
`;

const FieldValue = styled.p`
  font-size: 0.9rem;
  color: #333;
  margin: 0;
  font-weight: 500;
  font-family: "Inter", sans-serif;
`;

const SignatureSection = styled.div`
  background: white;
  padding: 2rem;
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media print {
    box-shadow: none;
    page-break-after: avoid;
  }
`;

const SignatureBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
`;

const SignatureLine = styled.div`
  height: 2px;
  background: #d1d5db;
  flex: 1;
`;

const SignatureLabel = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

export default BioDatReport;
