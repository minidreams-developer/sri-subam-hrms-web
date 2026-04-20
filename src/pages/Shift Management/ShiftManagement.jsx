import { useState } from "react";
import TableToolbar from "../../components/TableToolbar";
import { staffLeavesData } from "../../utils/data";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import actionDot from "../../assets/images/Overtime/actionDot.svg";
import ReusableTable from "../../components/ReusableTable";
import DetailsSidebar from "../../components/DetailsSidebar";
import CardDetails from "../../components/CardDetails";
import EditIcon from "../../assets/images/employee/editIcon.svg";
import styled from "styled-components";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";

const ShiftManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All Types");
  const [selectedShift, setSelectedShift] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const columns = [
    { header: "Shift Code", accessor: "shiftCode" },
    { header: "Shift Name", accessor: "shiftName" },
    { header: "Start Time", accessor: "startTime" },
    { header: "End Time", accessor: "endTime" },
    { header: "Working Hours", accessor: "workingHours" },
    { header: "Shift Type", accessor: "shifttype" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
  ];

  const filtered = staffLeavesData.filter((row) => {
    const m1 =
      leaveType === "All Types" ||
      String(row.type).toLowerCase() === String(leaveType).toLowerCase();
    const m2 =
      !search ||
      String(row.name).toLowerCase().includes(search.toLowerCase()) ||
      String(row.staffId).toLowerCase().includes(search.toLowerCase()) ||
      String(row.department).toLowerCase().includes(search.toLowerCase());
    return m1 && m2;
  });

  const handleRowClick = (row) => {
    setSelectedShift(row);
    setIsSidebarOpen(true);
  };

  return (
    <>
      <TableToolbar
        title={`All Shifts`}
        searchPosition="right"
        searchPlaceholder="Search Employee"
        searchValue={search}
        onSearchChange={setSearch}
        select1Options={false}
        select1Value={leaveType}
        onSelect1Change={setLeaveType}
        showFilter={false}
        actionText="Add Shifts"
        actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
        showDotIcon={true}
        dotIcon={actionDot}
        onActionClick={() => navigate("addNewShift")}
      />
      <ReusableTable
        columns={columns}
        data={filtered}
        rowsPerPage={5}
        totalResults={filtered.length}
        alwaysShowPagination
        actionType="default"
        onRowClick={handleRowClick}
      />
      <DetailsSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title="Shift Details"
      >
        <Section>
          <CardDetails
            title="Basic Details"
            columns={2}
            items={[
              { label: "Name", value: selectedShift?.shiftName || "General" },
              { label: "Shift Code", value: selectedShift?.shiftCode || "#GEN-01" },
              {
                label: "Status",
                value: (
                  <StatusText $status={selectedShift?.status || "Active"}>
                    {selectedShift?.status || "Active"}
                  </StatusText>
                ),
              },
            ]}
          />
        </Section>

        <Section>
          <CardDetails
            title="Shift Timing Information"
            columns={2}
            items={[
              {
                label: "Shift Type",
                value: selectedShift?.shifttype || "Rotational",
              },
              { label: "Start Time", value: selectedShift?.startTime || "10:30 AM" },
              { label: "End Time", value: selectedShift?.endTime || "07:30 PM" },
              {
                label: "Total Shift Duration",
                value: selectedShift?.workingHours || "9.00 Hrs",
              },
              { label: "Minimum working hours", value: "5.00 Hrs" },
              { label: "Grace Period (Early check-in)", value: "20 Min" },
              { label: "Grace Period (Late check-in)", value: "15 Min" },
              { label: "Grace Period (Early check-out)", value: "10 Min" },
            ]}
          />
        </Section>

        <Section>
          <CardWrapper>
            <CardHead>
              <CardTitle>Break Management</CardTitle>
            </CardHead>
            <CardPanel>
              <CardGrid $cols={2}>
                <InfoItem>
                  <Label>Break Type</Label>
                  <Value>Flexible</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Total Break duration</Label>
                  <Value>1.30 Hrs</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Multiple breaks support</Label>
                  <Value>Yes</Value>
                </InfoItem>
              </CardGrid>
              <BreakTitle>Break 1</BreakTitle>
              <CardGrid $cols={2}>
                <InfoItem>
                  <Label>Name</Label>
                  <Value>Morning Tea Break</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Break duration</Label>
                  <Value>15 min</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Start Time</Label>
                  <Value>12:30 AM</Value>
                </InfoItem>
                <InfoItem>
                  <Label>End Time</Label>
                  <Value>12:45PM</Value>
                </InfoItem>
              </CardGrid>
            </CardPanel>
          </CardWrapper>
        </Section>

        <Section>
          <CardDetails
            title="Attendance Rules Linked to Shift"
            columns={2}
            items={[
              { label: "Late mark after", value: "20 Min" },
              {
                label: "Auto half-day after X mins late",
                value: "1.30 Hrs",
              },
              {
                label: "Auto absent if working hours < X",
                value: "4 Hrs",
              },
              { label: "Overtime eligibility", value: "Yes" },
            ]}
          />
        </Section>

        <Section>
          <CardWrapper>
            <CardHead>
              <CardTitle>Weekly Pattern & Working Days</CardTitle>
            </CardHead>
            <CardPanel>
              <CardGrid $cols={1}>
                <InfoItem>
                  <Label>Fixed days</Label>
                  <Value>Mon, Tue, Wed, Fri, Sat, Sun</Value>
                </InfoItem>
              </CardGrid>
              <Spacer />
              <CardGrid $cols={2}>
                <InfoItem>
                  <Label>Fixed days</Label>
                  <Value>Mon, Tue, Wed, Fri, Sat, Sun</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Week Off</Label>
                  <Value>Thursday</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Working on holiday</Label>
                  <Value>Yes</Value>
                </InfoItem>
                <InfoItem>
                  <Label>Comp-off</Label>
                  <Value>No</Value>
                </InfoItem>
              </CardGrid>
            </CardPanel>
          </CardWrapper>
        </Section>

        <Footer>
          <EditButton>
            <img src={EditIcon} alt="edit" width="16" height="16" />
            Edit details
          </EditButton>
        </Footer>
      </DetailsSidebar>
    </>
  );
};

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusText = styled.span`
  color: ${({ $status }) => {
    const s = String($status).toLowerCase();
    if (s === "active") return "#16a34a";
    if (s === "inactive") return "#dc2626";
    return theme.colors.textColor;
  }};
  font-weight: 600;
`;

const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0 0 0.5rem 0;
`;

const CardTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const CardPanel = styled.div`
  width: 100%;
  background: #edf6f966;
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  padding: 1rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols || 3}, minmax(150px, 1fr));
  gap: 1rem 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  line-height: 160%;
  color: ${theme.colors.secondaryTextColor};
`;

const Value = styled.span`
  font-size: 1rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  line-height: 160%;
  color: ${theme.colors.textColor};
`;

const BreakTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin: 1.5rem 0 1rem 0;
  font-family: "Inter-SemiBold", sans-serif;
`;

const Spacer = styled.div`
  height: 1rem;
`;

const Footer = styled.div`
  padding: 1rem 0;
  display: flex;
  justify-content: center;
`;

const EditButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.primary};
  border-radius: 8px;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;

  &:hover {
    background: ${theme.colors.secondaryWhite};
  }
`;

export default ShiftManagement;
