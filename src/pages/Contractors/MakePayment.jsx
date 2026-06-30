import React, { useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

const MakePayment = () => {
  const { contractorName } = useParams();
  const navigate = useNavigate();
  const [taxType, setTaxType] = useState("tcs"); // "tcs" or "gst"
  const [selectedJobs, setSelectedJobs] = useState([]);

  // Sample work details data
  const workDetails = [
    {
      region: "Headquarters",
      jobs: [
        {
          date: "10/Apr/2026",
          job: "Job Detail",
          quantity: "Quantity",
          price: "$20.00",
          remarks: "",
          total: "$20.00",
        },
        {
          date: "10/Apr/2026",
          job: "AC Installation",
          quantity: "2 Piece",
          price: "$10.00",
          remarks: "Add remarks",
          total: "$20.00",
        },
        {
          date: "10/Apr/2026",
          job: "Duct Cleaning",
          quantity: "500 Sq. Ft.",
          price: "$0.50",
          remarks: "Add remarks",
          total: "$150.00",
        },
      ],
    },
    {
      region: "North Region",
      jobs: [
        {
          date: "10/Apr/2026",
          job: "Job Detail",
          quantity: "Quantity",
          price: "$10.00",
          remarks: "",
          total: "$10.00",
        },
        {
          date: "10/Apr/2026",
          job: "Routine Maintenance",
          quantity: "10 hour",
          price: "$45.00",
          remarks: "Add remarks",
          total: "$450.00",
        },
      ],
    },
  ];

  return (
    <Container>
      <PageHeader>
        <HeaderLeft>
          <Breadcrumb>
            <Crumb>Contractors</Crumb>
            <Crumb>›</Crumb>
            <Crumb>Pay {contractorName}</Crumb>
          </Breadcrumb>
          <Title>Pay {contractorName}</Title>
          <Subtitle>Payment processing for outstanding work logs.</Subtitle>
        </HeaderLeft>
      </PageHeader>

      <PaymentForm>
        <FormSection>
          <SectionTitle>Payment Details</SectionTitle>
          <FieldsRow>
            <Field>
              <Label>Payment Date</Label>
              <DateInput type="date" defaultValue="2023-10-24" />
            </Field>
            <Field>
              <Label>Payment Via</Label>
              <Select>
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>Cheque</option>
              </Select>
            </Field>
            <Field>
              <Label>Payment Reference</Label>
              <Input placeholder="e.g. UTR Number or Transaction ID" />
            </Field>
          </FieldsRow>
          <TextArea placeholder="Add any relevant details or notes about this payment..." />
        </FormSection>

        {workDetails.map((section, sectionIdx) => (
          <WorkSection key={sectionIdx}>
            <WorkHeader>
              <SectionTitle>Work Details - {section.region}</SectionTitle>
            </WorkHeader>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <ThCheckbox>
                      <Checkbox type="checkbox" />
                    </ThCheckbox>
                    <Th>Sl. No.</Th>
                    <Th>Job Detail</Th>
                    <Th>Quantity</Th>
                    <Th>Price/Unit</Th>
                    <Th>Remarks</Th>
                    <Th>Total Amount</Th>
                  </tr>
                </thead>
                <tbody>
                  {section.jobs.map((job, jobIdx) => (
                    <tr key={jobIdx}>
                      <TdCheckbox>
                        <Checkbox type="checkbox" />
                      </TdCheckbox>
                      <Td>
                        <DateTag>{job.date}</DateTag>
                      </Td>
                      <Td>{job.job}</Td>
                      <Td>{job.quantity}</Td>
                      <Td>{job.price}</Td>
                      <Td>
                        <SmallInput placeholder={job.remarks || "Add remarks"} value={job.remarks} />
                      </Td>
                      <Td>{job.total}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </WorkSection>
        ))}

        <TotalsSection>
          <TotalsCard>
            <TotalItem>
              <TotalLabel>Total Amount</TotalLabel>
              <TotalValue>$1,240.00</TotalValue>
            </TotalItem>
            <Divider />
            <TaxToggle>
              <ToggleOption
                $active={taxType === "tcs"}
                onClick={() => setTaxType("tcs")}
              >
                TCS (1%)
              </ToggleOption>
              <ToggleOption
                $active={taxType === "gst"}
                onClick={() => setTaxType("gst")}
              >
                GST (18%)
              </ToggleOption>
            </TaxToggle>
            <TotalItem $small>
              <TotalLabel $small>{taxType === "tcs" ? "TCS (1%)" : "GST (18%)"}</TotalLabel>
              <TotalValue $small>{taxType === "tcs" ? "$12.40" : "$223.20"}</TotalValue>
            </TotalItem>
            <Divider />
            <TotalItem $bold>
              <TotalLabel $bold>Net Payable</TotalLabel>
              <TotalValue $bold>
                ${taxType === "tcs" ? "1,252.40" : "1,463.20"}
              </TotalValue>
            </TotalItem>
          </TotalsCard>
        </TotalsSection>

        <Footer>
          <TotalAmountDisplay>${taxType === "tcs" ? "1,252.40" : "1,463.20"}</TotalAmountDisplay>
          <SendButton onClick={() => navigate(`/admin/contractors/payment-receipt/${contractorName}`)}>₹ Send Payment</SendButton>
        </Footer>
      </PaymentForm>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1rem;
  background: #F5F7FA;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Breadcrumb = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #666;
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const Crumb = styled.span`
  color: ${(props) => (props.$active ? "#222" : "#666")};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #888;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const PaymentForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormSection = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #E7E7E7;
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 1rem 0;
  font-family: "Inter", sans-serif;
`;

const FieldsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #444;
  font-family: "Inter", sans-serif;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #E7E7E7;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #0047AB;
  }
`;

const DateInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #E7E7E7;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #0047AB;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #E7E7E7;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #0047AB;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #E7E7E7;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  resize: vertical;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #0047AB;
  }
`;

const WorkSection = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #E7E7E7;
`;

const WorkHeader = styled.div`
  margin-bottom: 1rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const ThCheckbox = styled.th`
  text-align: left;
  font-family: "Inter", sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #E7E7E7;
  background: #F8FAFC;
  width: 40px;
`;

const Th = styled.th`
  text-align: left;
  font-family: "Inter", sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #E7E7E7;
  background: #F8FAFC;
`;

const TdCheckbox = styled.td`
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #E7E7E7;
  width: 40px;
`;

const Td = styled.td`
  padding: 0.75rem 0.5rem;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: #222;
  border-bottom: 1px solid #E7E7E7;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const DateTag = styled.span`
  padding: 0.3rem 0.6rem;
  background: #E0E7FF;
  color: #0047AB;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
`;

const SmallInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #E7E7E7;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.8rem;
  width: 100%;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #0047AB;
  }
`;

const TotalsSection = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const TotalsCard = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #E7E7E7;
  width: 350px;
`;

const TotalItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: ${(props) => (props.$bold ? "0" : "0.75rem")};
`;

const TotalLabel = styled.span`
  font-family: "Inter", sans-serif;
  font-size: ${(props) => (props.$small ? "0.85rem" : props.$bold ? "1rem" : "0.9rem")};
  font-weight: ${(props) => (props.$bold ? 700 : 500)};
  color: ${(props) => (props.$bold ? "#222" : "#555")};
`;

const TotalValue = styled.span`
  font-family: "Inter", sans-serif;
  font-size: ${(props) => (props.$small ? "0.85rem" : props.$bold ? "1.2rem" : "1rem")};
  font-weight: ${(props) => (props.$bold ? 700 : 600)};
  color: ${(props) => (props.$bold ? "#222" : "#444")};
`;

const Divider = styled.div`
  height: 1px;
  background: #E7E7E7;
  margin: 0.75rem 0;
`;

const TaxToggle = styled.div`
  display: flex;
  padding: 0.25rem;
  background: #F0F5FF;
  border-radius: 8px;
  margin-bottom: 0.75rem;
`;

const ToggleOption = styled.button`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${(props) => (props.$active ? "#0047AB" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#666")};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #E7E7E7;
`;

const TotalAmountDisplay = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
`;

const SendButton = styled.button`
  padding: 0.8rem 1.75rem;
  background: #FACC15;
  color: #222;
  border: none;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #EAB308;
  }
`;

export default MakePayment;
