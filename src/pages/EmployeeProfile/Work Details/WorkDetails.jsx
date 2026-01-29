import styled from "styled-components";
import theme from "../../../theme/theme";
import DocIcon from "../../../assets/images/employee/document.svg";
import EditIcon from "../../../assets/images/employee/editIcon.svg";
import CardDetails from "../../../components/CardDetails";

export const WorkDetails = () => {
  return (
    <Wrapper>
      <HeaderRow>
        <LeftHead>
          <IconWrap>
            <Icon src={DocIcon} alt="user" />
          </IconWrap>
          <Title>Work Details</Title>
        </LeftHead>
        <EditBtn>
          <img src={EditIcon} alt="edit" width="16" height="16" />
          Edit details
        </EditBtn>
      </HeaderRow>
      <CardDetails
        title="Basic Information"
        columns={3}
        items={[
          { label: "Designation", value: "Senior UI/UX Designer" },
          { label: "Team", value: "Core UI / Design Systems" },
          { label: "Department", value: "IT Department" },
          { label: "Date Of Joining", value: "20-09-2025" },
          { label: "Experience Type", value: "Fresher" },
          { label: "Work Experience", value: "8 Months" },
          { label: "Shift", value: "Morning" },
          { label: "Termination Date", value: "-" },
          { label: "Exit Date", value: "-" },
          { label: "Reporting Person", value: "Arun Kumar" },
          { label: "Reference", value: "Ruban Kumar" },
          { label: "Contract Agent", value: "Deepak Kumar" },
        ]}
      />
      <CardDetails
        title="Experience Details"
        columns={3}
        items={[
          {
            label: "Total Years of Experience",
            value: "Senior UI/UX Designer",
          },
          { label: "Last Company Name", value: "Core UI / Design Systems" },
          { label: "Last Company Experience", value: "IT Department" },
          { label: "Relieved Date", value: "20-09-2025" },
          { label: "Location", value: "Tirupur" },
        ]}
      />
      <CardDetails
        title="Shift & Attendance Details"
        columns={3}
        items={[
          {
            label: "Shift",
            value: "Morning",
          },
          { label: "Attendance Permission", value: "Auto" },
        ]}
      />
      <CardDetails
        title="Bank Details"
        columns={3}
        items={[
          {
            label: "Acc Holder Name",
            value: "Manoj Kumar ",
          },
          { label: "Bank", value: "State bank of india" },
          { label: "Acc Number", value: "1234 5678 9012 3456" },
          { label: "IFSC Code", value: "SBI15669" },
          { label: "Branch", value: "Tirupur" },
        ]}
      />
      <CardDetails
        title="ESI & PF Details"
        columns={3}
        items={[
          { label: "ESI Number", value: "Manoj Kumar" },
          { label: "PF Number", value: "designedbymanoj@gmail.com" },
        ]}
      />
      <CardDetails
        title="Login Details"
        columns={3}
        items={[
          { label: "Email", value: "designedbymanoj@gmail.com" },
          { label: "Password", value: "Manoj Kumar" },
        ]}
      />
    </Wrapper>
  );
};

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

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftHead = styled.div`
  display: flex;
  align-items: center;
  gap: 1.125rem;
`;

const IconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem;
  border-radius: 6px;
  background: ${theme.colors.secondaryPrimary};
`;

const Icon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  line-height: 160%;
  margin: 0;
`;

const EditBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  height: 40px;
  padding: 0 0.875rem;
  background: ${theme.colors.secondaryPrimary};
  border: none;
  border-radius: 0.5rem;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
`;
