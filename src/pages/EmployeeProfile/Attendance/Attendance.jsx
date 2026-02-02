import React, { useState } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import TopIcon from "../../../assets/images/employee/calendar.svg";
import EditIcon from "../../../assets/images/employee/editIcon.svg";
import CardDetails from "../../../components/CardDetails";
import PlusIcon from "../../../assets/images/Dashboard Images/plus-large_svgrepo.com.svg";
import TabSwitcher from "../../../components/TabSwitcher";
import AttendanceCalendar from "../../../components/AttendanceCalendar";
import { Spinner } from "reactstrap";

export const Attendance = () => {
  const [activeTab, setActiveTab] = useState("List View");
  const [calendarLoading, setCalendarLoading] = useState(false);

  const handleTabChange = (val) => {
    setActiveTab(val);
    if (val === "Calendar View") {
      setCalendarLoading(true);
    } else {
      setCalendarLoading(false);
    }
  };
  return (
    <Wrapper>
      <HeaderRow>
        <LeftHead>
          <IconWrap>
            <Icon src={TopIcon} alt="user" />
          </IconWrap>
          <Title>Attendance</Title>
        </LeftHead>
        <EditBtn>
          <img src={EditIcon} alt="edit" width="16" height="16" />
          Edit details
        </EditBtn>
      </HeaderRow>
      <CardDetails
        title="Shift Details"
        columns={3}
        items={[
          {
            label: "Shift",
            value: "General",
          },
          { label: "Week Off", value: "Thursday" },
          {
            label: "Fixed days",
            value: "Mon, Tue, Wed, Fri, Sat, Sun",
          },
          {
            label: "Working on holiday",
            value: "Yes",
          },
          {
            label: "Comp-off",
            value: "No",
          },
        ]}
      />
      <CardDetails
        title="Current Month"
        columns={3}
        showEdit={true}
        editIcon={EditIcon}
        editText="Edit Day"
        onEdit={() => {}}
        showAdd={true}
        uploadIcon={PlusIcon}
        addText="Add Leaves"
        items={[
          {
            label: "Total Working Day",
            value: "31",
          },
          {
            label: "Full Days",
            value: "31",
          },
          {
            label: "Half Days",
            value: "2",
          },
          {
            label: "Absent",
            value: "1",
          },
          {
            label: "Over Time",
            value: "4",
          },
          {
            label: "Day Off",
            value: "2",
          },
          {
            label: "Holidays",
            value: "0",
          },
        ]}
      />
      <TabSwitcher
        tabs={[
          { label: "List View", value: "List View" },
          { label: "Calendar View", value: "Calendar View" },
        ]}
        active={activeTab}
        onChange={handleTabChange}
      />
      {activeTab === "Calendar View" && calendarLoading && (
        <SpinnerWrap>
          <Spinner style={{ color: theme.colors.primary }} />
        </SpinnerWrap>
      )}
      {activeTab === "List View" ? (
        <Section>List View content</Section>
      ) : (
        <AttendanceCalendar onReady={() => setCalendarLoading(false)} />
      )}
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

const SpinnerWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
`;

const Section = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
`;
