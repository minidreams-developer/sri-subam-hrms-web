import styled from "styled-components";
import theme from "../theme/theme";
import { useState } from "react";
import EditIcon from "../assets/images/employee/editIcon.svg";
import CardDetails from "./CardDetails";
import PayrollIcon from "./Frame 1000009178 - Copy.svg";

const PayrollComponent = () => {
  const [expandedYear, setExpandedYear] = useState("2026");
  const [expandedMonth, setExpandedMonth] = useState("February 2026");

  const toggleYear = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  const toggleMonth = (month) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  return (
    <Wrapper>
      
      <PayrollDetailsHeader>
        <PayrollHeaderIcon src={PayrollIcon} alt="payroll" />
        <PayrollDetailsTitle>Payroll details</PayrollDetailsTitle>
      </PayrollDetailsHeader>
      <CardDetails
        title="Basic Details"
        columns={3}
        showEdit={true}
        editIcon={EditIcon}
        editText="Edit details"
        onEdit={() => {}}
        items={[
          {
            label: "CTC (Annual)",
            value: "4,00,000",
          },
          {
            label: "Monthly CTC",
            value: "33,333",
          },
          {
            label: "Effective From",
            value: "Every Month 1 day",
          },
          {
            label: "Basic Salary",
            value: "20,000",
          },
          {
            label: "HRA (House Rent Allowance)",
            value: "5,000",
          },
          {
            label: "Conveyance Allowance",
            value: "5,000",
          },
          {
            label: "Special Allowance",
            value: "1,500",
          },
          {
            label: "Other Fixed Allowances",
            value: "2,000",
          },
        ]}
      />

      <CardDetails
        title="Current Month"
        columns={3}
        showEdit={true}
        editIcon={EditIcon}
        editText="Edit Salary"
        onEdit={() => {}}
        items={[
          {
            label: "Total Salary",
            value: "4,00,000",
          },
          {
            label: "Overtime Payment",
            value: "5000",
          },
          {
            label: "Addition Payment",
            value: "2500",
          },
          {
            label: "Deductions",
            value: "0",
          },
          {
            label: "Total Payable Amount",
            value: "2,08,000",
          },
        ]}
      />

      <Section>
        <SectionHeader>
          <SectionTitleWithIcon>
            <SectionIcon src={PayrollIcon} alt="payroll" />
            <SectionTitle>Salary History</SectionTitle>
          </SectionTitleWithIcon>
        </SectionHeader>

        {/* Year 2026 */}
        <YearSection>
          <YearHeader onClick={() => toggleYear("2026")}>
            <YearTitle>2026</YearTitle>
            <ChevronIcon expanded={expandedYear === "2026"}>▼</ChevronIcon>
          </YearHeader>

          {expandedYear === "2026" && (
            <MonthsContainer>
              {/* February 2026 */}
              <MonthSection>
                <MonthHeader onClick={() => toggleMonth("February 2026")}>
                  <MonthTitle>February 2026</MonthTitle>
                  <MonthActions>
                    <DownloadLink>Download</DownloadLink>
                    <ChevronIcon expanded={expandedMonth === "February 2026"}>
                      ▼
                    </ChevronIcon>
                  </MonthActions>
                </MonthHeader>

                {expandedMonth === "February 2026" && (
                  <MonthDetails>
                    <DetailsGrid>
                      <DetailItem>
                        <DetailLabel>Total Salary</DetailLabel>
                        <DetailValue>4,00,000</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Overtime Payment</DetailLabel>
                        <DetailValue>5000</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Addition Payment</DetailLabel>
                        <DetailValue>2500</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Deductions</DetailLabel>
                        <DetailValue>0</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Total Payable Amount</DetailLabel>
                        <DetailValue>28</DetailValue>
                      </DetailItem>
                    </DetailsGrid>
                  </MonthDetails>
                )}
              </MonthSection>

              {/* January 2026 */}
              <MonthSection>
                <MonthHeader onClick={() => toggleMonth("January 2026")}>
                  <MonthTitle>January 2026</MonthTitle>
                  <MonthActions>
                    <DownloadLink>Download</DownloadLink>
                    <ChevronIcon expanded={expandedMonth === "January 2026"}>
                      ▼
                    </ChevronIcon>
                  </MonthActions>
                </MonthHeader>
              </MonthSection>
            </MonthsContainer>
          )}
        </YearSection>

        {/* Year 2025 */}
        <YearSection>
          <YearHeader onClick={() => toggleYear("2025")}>
            <YearTitle>2025</YearTitle>
            <ChevronIcon expanded={expandedYear === "2025"}>▼</ChevronIcon>
          </YearHeader>
        </YearSection>

        {/* Year 2024 */}
        <YearSection>
          <YearHeader onClick={() => toggleYear("2024")}>
            <YearTitle>2024</YearTitle>
            <ChevronIcon expanded={expandedYear === "2024"}>▼</ChevronIcon>
          </YearHeader>
        </YearSection>
      </Section>
    </Wrapper>
  );
};

export default PayrollComponent;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border-radius: 12px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  padding: 1rem;
`;

const PayrollDetailsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const PayrollHeaderIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const PayrollDetailsTitle = styled.h5`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  line-height: 160%;
  margin: 0;
`;

const SectionTitleWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const YearSection = styled.div`
  margin-bottom: 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.625rem;
  overflow: hidden;
  background: ${theme.colors.white};
`;

const YearHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${theme.colors.bgColor};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.bgColor}dd;
  }
`;

const YearTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const MonthsContainer = styled.div`
  background: ${theme.colors.white};
`;

const MonthSection = styled.div`
  border-top: 1px solid ${theme.colors.border};

  &:first-child {
    border-top: none;
  }
`;

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.bgColor}40;
  }
`;

const MonthTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const MonthActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DownloadLink = styled.a`
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.primary}dd;
  }
`;

const ChevronIcon = styled.span`
  color: ${theme.colors.secondaryText};
  font-size: 0.75rem;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.expanded ? "rotate(0deg)" : "rotate(-90deg)")};
`;

const MonthDetails = styled.div`
  padding: 1rem;
  background: ${theme.colors.bgColor};
  border-top: 1px solid ${theme.colors.border};
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.secondaryText};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
`;
