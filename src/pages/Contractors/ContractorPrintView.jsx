import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const ContractorPrintView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [printType, setPrintType] = useState("all"); // all, hq, north

  // Sample contractor data - in real app, fetch from API or location state
  const contractor = {
    id: id || "1",
    name: "Manoj Kumar",
    contractorId: "CON-10024",
    specialty: "HVAC",
    companyName: "Ibboomi",
    getNumber: "29ABCDE1234F5Z",
    licenseNo: "LIC-99082-TN",
    photo: "👨‍💼",
  };

  const jobItemsHQ = [
    { sNo: 1, jobItems: "AC Installation", unit: "Piece", pricePerUnit: "$120.00" },
    { sNo: 2, jobItems: "Duct Cleaning", unit: "Sq. Ft.", pricePerUnit: "$2.50" },
    { sNo: 3, jobItems: "Routine Maintenance", unit: "Hour", pricePerUnit: "$65.00" },
  ];

  const jobItemsNorth = [
    { sNo: 1, jobItems: "Compressor Repair", unit: "Job", pricePerUnit: "$360.00" },
    { sNo: 2, jobItems: "Filter Replacement", unit: "Piece", pricePerUnit: "$15.00" },
    { sNo: 3, jobItems: "Thermostat Calibration", unit: "Unit", pricePerUnit: "$75.00" },
    { sNo: 4, jobItems: "Refrigerant Recharge", unit: "Lbs", pricePerUnit: "$25.00" },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <PrintContainer>
      <PrintToolbar>
        <ToolbarLeft>
          <PageSizeSelect value="A4" onChange={(e) => {}}>
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
          </PageSizeSelect>
          <OrientationButton>Orientation</OrientationButton>
          <PortraitButton>Portrait</PortraitButton>
        </ToolbarLeft>
        <ToolbarRight>
          <DownloadButton>⬇ Download List</DownloadButton>
          <PrintButton onClick={handlePrint}>🖨 Print</PrintButton>
        </ToolbarRight>
      </PrintToolbar>

      <PrintContent>
        {(printType === "all" || printType === "hq") && (
          <PrintPage>
            <PrintHeader>
              <PrintTitle>ASSIGNED JOB ITEMS LIST</PrintTitle>
            </PrintHeader>

            <ContractorInfoSection>
              <SectionTitle>Contractor Information</SectionTitle>
              <ContractorInfoGrid>
                <ContractorPhoto>{contractor.photo}</ContractorPhoto>
                <InfoColumnsGrid>
                  <InfoColumn>
                    <InfoLabel>CONTRACTOR ID</InfoLabel>
                    <InfoValue>{contractor.contractorId}</InfoValue>
                  </InfoColumn>
                  <InfoColumn>
                    <InfoLabel>CONTRACTOR NAME</InfoLabel>
                    <InfoValue>{contractor.name}</InfoValue>
                  </InfoColumn>
                  <InfoColumn>
                    <InfoLabel>SPECIALTY</InfoLabel>
                    <InfoValue>{contractor.specialty}</InfoValue>
                  </InfoColumn>
                  <InfoColumn>
                    <InfoLabel>COMPANY NAME</InfoLabel>
                    <InfoValue>{contractor.companyName}</InfoValue>
                  </InfoColumn>
                  <InfoColumn>
                    <InfoLabel>GET NUMBER</InfoLabel>
                    <InfoValue>{contractor.getNumber}</InfoValue>
                  </InfoColumn>
                  <InfoColumn>
                    <InfoLabel>LICENSE NO.</InfoLabel>
                    <InfoValue>{contractor.licenseNo}</InfoValue>
                  </InfoColumn>
                </InfoColumnsGrid>
              </ContractorInfoGrid>
            </ContractorInfoSection>

            <JobItemsSection>
              <SubsectionTitle>Job Items details</SubsectionTitle>
              <BranchTitle>Branch: Headquarters</BranchTitle>

              <PrintTable>
                <PrintTableHead>
                  <PrintTableRow>
                    <PrintTh>S.No</PrintTh>
                    <PrintTh>Job Items</PrintTh>
                    <PrintTh>Unit</PrintTh>
                    <PrintTh>Price/Unit</PrintTh>
                  </PrintTableRow>
                </PrintTableHead>
                <PrintTableBody>
                  {jobItemsHQ.map((item) => (
                    <PrintTableRow key={item.sNo}>
                      <PrintTd>{item.sNo}</PrintTd>
                      <PrintTd>{item.jobItems}</PrintTd>
                      <PrintTd>{item.unit}</PrintTd>
                      <PrintTd>{item.pricePerUnit}</PrintTd>
                    </PrintTableRow>
                  ))}
                </PrintTableBody>
              </PrintTable>
            </JobItemsSection>

            <PageBreak />
          </PrintPage>
        )}

        {(printType === "all" || printType === "north") && (
          <PrintPage>
            <PrintHeader>
              <PrintTitle>ASSIGNED JOB ITEMS LIST</PrintTitle>
            </PrintHeader>

            <ContractorInfoSection>
              <SectionTitle>Contractor Information</SectionTitle>
              <ContractorInfoGrid>
                <ContractorPhoto>{contractor.photo}</ContractorPhoto>
                <InfoColumnsGrid>
                  <InfoColumn>
                    <InfoLabel>CONTRACTOR ID</InfoLabel>
                    <InfoValue>{contractor.contractorId}</InfoValue>
                  </InfoColumn>
                  <InfoColumn>
                    <InfoLabel>CONTRACTOR NAME</InfoLabel>
                    <InfoValue>{contractor.name}</InfoValue>
                  </InfoColumn>
                  <InfoColumn>
                    <InfoLabel>SPECIALTY</InfoLabel>
                    <InfoValue>{contractor.specialty}</InfoValue>
                  </InfoColumn>
                  <InfoColumn>
                    <InfoLabel>COMPANY NAME</InfoLabel>
                    <InfoValue>{contractor.companyName}</InfoValue>
                  </InfoColumn>
                  <InfoColumn>
                    <InfoLabel>GET NUMBER</InfoLabel>
                    <InfoValue>{contractor.getNumber}</InfoValue>
                  </InfoColumn>
                  <InfoColumn>
                    <InfoLabel>LICENSE NO.</InfoLabel>
                    <InfoValue>{contractor.licenseNo}</InfoValue>
                  </InfoColumn>
                </InfoColumnsGrid>
              </ContractorInfoGrid>
            </ContractorInfoSection>

            <JobItemsSection>
              <SubsectionTitle>Job Items details</SubsectionTitle>
              <BranchTitle>Branch: North Region</BranchTitle>

              <PrintTable>
                <PrintTableHead>
                  <PrintTableRow>
                    <PrintTh>S.No</PrintTh>
                    <PrintTh>Job Items</PrintTh>
                    <PrintTh>Unit</PrintTh>
                    <PrintTh>Price/Unit</PrintTh>
                  </PrintTableRow>
                </PrintTableHead>
                <PrintTableBody>
                  {jobItemsNorth.map((item) => (
                    <PrintTableRow key={item.sNo}>
                      <PrintTd>{item.sNo}</PrintTd>
                      <PrintTd>{item.jobItems}</PrintTd>
                      <PrintTd>{item.unit}</PrintTd>
                      <PrintTd>{item.pricePerUnit}</PrintTd>
                    </PrintTableRow>
                  ))}
                </PrintTableBody>
              </PrintTable>
            </JobItemsSection>
          </PrintPage>
        )}
      </PrintContent>

      <BackButton onClick={handleBack}>← Back to Details</BackButton>

      <style>{`
        @media print {
          * {
            margin: 0;
            padding: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .print-toolbar {
            display: none;
          }
          .back-button {
            display: none;
          }
          .print-content {
            background: white;
            padding: 0;
          }
          .print-page {
            page-break-after: always;
            padding: 40px;
            margin: 0;
            box-shadow: none;
          }
          .print-page:last-child {
            page-break-after: avoid;
          }
        }
      `}</style>
    </PrintContainer>
  );
};

// Styled Components
const PrintContainer = styled.div`
  width: 100%;
  background: #f5f5f5;
  min-height: 100vh;
  padding: 1rem;
  font-family: "Inter", sans-serif;
`;

const PrintToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media print {
    display: none;
  }
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
`;

const PageSizeSelect = styled.select`
  padding: 0.5rem 0.75rem;
  background: #34495e;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;

  &:focus {
    outline: none;
    border-color: #066C78;
  }
`;

const OrientationButton = styled.button`
  padding: 0.5rem 1rem;
  background: #34495e;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-weight: 500;

  &:hover {
    background: #455a64;
  }
`;

const PortraitButton = styled.button`
  padding: 0.5rem 1rem;
  background: #34495e;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-weight: 500;

  &:hover {
    background: #455a64;
  }
`;

const DownloadButton = styled.button`
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: "Inter", sans-serif;

  &:hover {
    background: #c0392b;
  }
`;

const PrintButton = styled.button`
  padding: 0.5rem 1rem;
  background: #066C78;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: "Inter", sans-serif;

  &:hover {
    background: #055B65;
  }
`;

const PrintContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PrintPage = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media print {
    box-shadow: none;
    border-radius: 0;
    page-break-after: always;
    padding: 40px;
    margin: 0;
  }
`;

const PageBreak = styled.div`
  @media print {
    page-break-after: always;
  }
`;

const PrintHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #333;
  padding-bottom: 1rem;
`;

const PrintTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  letter-spacing: 1px;
`;

const ContractorInfoSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 0.95rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

const ContractorInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 2rem;
  align-items: flex-start;
`;

const ContractorPhoto = styled.div`
  width: 100px;
  height: 100px;
  background: #e8e8e8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  flex-shrink: 0;
`;

const InfoColumnsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 3rem;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const InfoLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  color: #666;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
`;

const JobItemsSection = styled.div`
  margin-bottom: 2rem;
`;

const SubsectionTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

const BranchTitle = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  margin: 0.5rem 0 1rem 0;
`;

const PrintTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const PrintTableHead = styled.thead`
  background: #f5f5f5;
`;

const PrintTableBody = styled.tbody``;

const PrintTableRow = styled.tr`
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: 1px solid #333;
  }

  @media print {
    page-break-inside: avoid;
  }
`;

const PrintTh = styled.th`
  padding: 0.75rem;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 700;
  color: #333;
  border-bottom: 1px solid #999;
`;

const PrintTd = styled.td`
  padding: 0.75rem;
  font-size: 0.85rem;
  color: #333;
`;

const BackButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;

  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }

  @media print {
    display: none;
  }
`;

export default ContractorPrintView;
