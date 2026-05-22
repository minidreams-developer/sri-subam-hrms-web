import { useState, useEffect } from "react";
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
import { get } from "../../helpers/api_helper";
import { GET_SHIFTS, GET_SHIFT_DETAILS } from "../../helpers/url_helper";

const ShiftManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All Types");
  const [selectedShift, setSelectedShift] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [shiftsData, setShiftsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [shiftDetails, setShiftDetails] = useState(null);

  // Fetch shifts data from API
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoading(true);
        const response = await get(GET_SHIFTS);
        console.log("Shifts fetched:", response);
        
        // Handle different response structures
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response?.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (response?.results && Array.isArray(response.results)) {
          data = response.results;
        } else if (typeof response === 'object' && response !== null) {
          // If response is an object but not an array, try to extract array from it
          data = Object.values(response).find(val => Array.isArray(val)) || [];
        }
        
        // Map API response to table format
        const mappedData = data.map(shift => ({
          id: shift.id || shift._id,
          shiftCode: shift.shiftCode,
          shiftName: shift.shiftName,
          startTime: shift.timings?.[0]?.startTime || shift.startTime || "-",
          endTime: shift.timings?.[0]?.endTime || shift.endTime || "-",
          workingHours: shift.totalShiftDuration || "-",
          shifttype: shift.shiftType || "-",
          status: shift.isShiftActive ? "Active" : "Inactive",
          type: shift.shiftType,
          // Store full object for sidebar
          ...shift
        }));
        
        setShiftsData(mappedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching shifts:", err);
        setError(err.message);
        // Fallback to mock data if API fails
        setShiftsData(staffLeavesData);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, []);

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

  const filtered = (Array.isArray(shiftsData) ? shiftsData : []).filter((row) => {
    const m1 =
      leaveType === "All Types" ||
      String(row.type).toLowerCase() === String(leaveType).toLowerCase();
    const m2 =
      !search ||
      String(row.shiftName).toLowerCase().includes(search.toLowerCase()) ||
      String(row.shiftCode).toLowerCase().includes(search.toLowerCase());
    return m1 && m2;
  });

  const handleRowClick = (row) => {
    setSelectedShift(row);
    setIsSidebarOpen(true);
    fetchShiftDetails(row.id);
  };

  // Fetch detailed shift information
  const fetchShiftDetails = async (shiftId) => {
    setSidebarLoading(true);
    try {
      const url = GET_SHIFT_DETAILS.replace(":shiftId", shiftId);
      const response = await get(url);
      console.log("Shift details fetched:", response);
      
      // Handle different response structures
      let details = response;
      if (response?.data) {
        details = response.data;
      }
      
      setShiftDetails(details);
    } catch (err) {
      console.error("Error fetching shift details:", err);
      // Use the row data as fallback
      setShiftDetails(row);
    } finally {
      setSidebarLoading(false);
    }
  };

  return (
    <>
      <TableToolbar
        title={`All Shifts`}
        searchPosition="right"
        searchPlaceholder="Search Shift"
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
      {loading ? (
        <LoadingMessage>Loading shifts...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>Error loading shifts: {error}</ErrorMessage>
      ) : (
        <ReusableTable
          columns={columns}
          data={filtered}
          rowsPerPage={5}
          totalResults={filtered.length}
          alwaysShowPagination
          actionType="default"
          onRowClick={handleRowClick}
        />
      )}
      <DetailsSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title="Shift Details"
      >
        {sidebarLoading ? (
          <LoadingMessage>Loading shift details...</LoadingMessage>
        ) : (
          <>
            <Section>
              <CardDetails
                title="Basic Details"
                columns={2}
                items={[
                  { label: "Name", value: shiftDetails?.shiftName || selectedShift?.shiftName || "General" },
                  { label: "Shift Code", value: shiftDetails?.shiftCode || selectedShift?.shiftCode || "#GEN-01" },
                  {
                    label: "Status",
                    value: (
                      <StatusText $status={shiftDetails?.isShiftActive ? "Active" : "Inactive"}>
                        {shiftDetails?.isShiftActive ? "Active" : "Inactive"}
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
                    value: shiftDetails?.shiftType || selectedShift?.shifttype || "Rotational",
                  },
                  { label: "Start Time", value: shiftDetails?.timings?.[0]?.startTime || selectedShift?.startTime || "10:30 AM" },
                  { label: "End Time", value: shiftDetails?.timings?.[0]?.endTime || selectedShift?.endTime || "07:30 PM" },
                  {
                    label: "Total Shift Duration",
                    value: shiftDetails?.totalShiftDuration || selectedShift?.workingHours || "9.00 Hrs",
                  },
                  { label: "Minimum working hours", value: shiftDetails?.minWorkingHours || "5.00 Hrs" },
                  { label: "Grace Period (Early check-in)", value: `${shiftDetails?.gracePeriod?.earlyCheckIn || 0} Min` },
                  { label: "Grace Period (Late check-in)", value: `${shiftDetails?.gracePeriod?.lateCheckIn || 0} Min` },
                  { label: "Grace Period (Early check-out)", value: `${shiftDetails?.gracePeriod?.earlyCheckOut || 0} Min` },
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
                      <Value>{shiftDetails?.breakManagement?.enabled ? "Enabled" : "Disabled"}</Value>
                    </InfoItem>
                    <InfoItem>
                      <Label>Multiple breaks support</Label>
                      <Value>{shiftDetails?.breakManagement?.multipleBreaksSupport ? "Yes" : "No"}</Value>
                    </InfoItem>
                  </CardGrid>
                  {shiftDetails?.breakManagement?.breaks && shiftDetails.breakManagement.breaks.length > 0 ? (
                    shiftDetails.breakManagement.breaks.map((breakItem, index) => (
                      <div key={index}>
                        <BreakTitle>Break {index + 1}</BreakTitle>
                        <CardGrid $cols={2}>
                          <InfoItem>
                            <Label>Name</Label>
                            <Value>{breakItem.name || "-"}</Value>
                          </InfoItem>
                          <InfoItem>
                            <Label>Break duration</Label>
                            <Value>{breakItem.duration || "-"}</Value>
                          </InfoItem>
                          <InfoItem>
                            <Label>Start Time</Label>
                            <Value>{breakItem.startTime || "-"}</Value>
                          </InfoItem>
                          <InfoItem>
                            <Label>End Time</Label>
                            <Value>{breakItem.endTime || "-"}</Value>
                          </InfoItem>
                        </CardGrid>
                      </div>
                    ))
                  ) : (
                    <InfoItem>
                      <Label>No breaks configured</Label>
                    </InfoItem>
                  )}
                </CardPanel>
              </CardWrapper>
            </Section>

            <Section>
              <CardDetails
                title="Attendance Rules Linked to Shift"
                columns={2}
                items={[
                  { label: "Late mark after", value: `${shiftDetails?.attendanceRules?.lateMarkAfter || 0} Min` },
                  {
                    label: "Auto half-day after X mins late",
                    value: `${shiftDetails?.attendanceRules?.autoHalfDayAfterLate || 0} Min`,
                  },
                  {
                    label: "Auto absent if working hours < X",
                    value: shiftDetails?.minWorkingHours || "4 Hrs",
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
                      <Label>Working Days</Label>
                      <Value>
                        {shiftDetails?.timings
                          ?.filter(t => !t.off)
                          .map(t => t.day)
                          .join(", ") || "Mon, Tue, Wed, Fri, Sat, Sun"}
                      </Value>
                    </InfoItem>
                  </CardGrid>
                  <Spacer />
                  <CardGrid $cols={2}>
                    <InfoItem>
                      <Label>Week Off</Label>
                      <Value>
                        {shiftDetails?.timings
                          ?.filter(t => t.off)
                          .map(t => t.day)
                          .join(", ") || "Sunday"}
                      </Value>
                    </InfoItem>
                    <InfoItem>
                      <Label>Working on holiday</Label>
                      <Value>{shiftDetails?.weekOff?.includes("holiday") ? "Yes" : "No"}</Value>
                    </InfoItem>
                    <InfoItem>
                      <Label>Comp-off</Label>
                      <Value>{shiftDetails?.compOff?.[0] === "yes" ? "Yes" : "No"}</Value>
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
          </>
        )}
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

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  font-size: 1rem;
  color: ${theme.colors.secondaryTextColor};
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  font-size: 1rem;
  color: #dc2626;
  background: #fee2e2;
  border-radius: 8px;
  border: 1px solid #fecaca;
`;

export default ShiftManagement;
