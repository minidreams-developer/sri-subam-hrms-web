import React, { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import DaySettingsComponent from "../../../components/daysettings";
import ReusableTable from "../../../components/ReusableTable";
import { toast } from "react-toastify";
import { post, patch, get } from "../../../helpers/api_helper";
import { DAY_SETTINGS, UPDATE_DAY_SETTINGS } from "../../../helpers/url_helper";

const DaySettings = () => {
  const [daySettings, setDaySettings] = useState({
    id: null,
    dayStart: null,
    dayEnd: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  // Fetch day settings data on component mount
  useEffect(() => {
    fetchDaySettingsData();
  }, []);

  const fetchDaySettingsData = async () => {
    try {
      setIsLoadingTable(true);
      const response = await get(DAY_SETTINGS);
      
      // Extract results array from paginated response
      let data = [];
      if (response?.results) {
        data = response.results;
      } else if (Array.isArray(response)) {
        data = response;
      } else if (response && typeof response === 'object') {
        data = [response];
      }
      
      // Format the data for display
      const formattedData = data.map(item => ({
        ...item,
        startTime: item.startTime ? formatTime(item.startTime) : item.startTime,
        endTime: item.endTime ? formatTime(item.endTime) : item.endTime,
        date: item.date ? formatDate(item.date) : null,
      }));
      
      setTableData(formattedData);
      console.log("Day Settings Data:", formattedData);
    } catch (error) {
      console.error("Error fetching day settings:", error);
      toast.error("Failed to load day settings");
    } finally {
      setIsLoadingTable(false);
    }
  };

  // Helper function to format time from ISO string or HH:MM format
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // If it's an ISO datetime string
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    
    // If it's already HH:MM format
    return timeString;
  };

  // Helper function to format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleSave = async (data) => {
    try {
      setIsLoading(true);
      console.log("Day Settings Saved:", data);
      
      const payload = {
        startTime: data.dayStart,
        endTime: data.dayEnd,
      };

      // If editing for one day, add the date to payload
      if (data.selectedDateForOneDay) {
        payload.date = data.selectedDateForOneDay;
      }

      let response;
      
      // If we have an ID and a date (editing for one day), use PATCH
      if (daySettings.id && data.selectedDateForOneDay) {
        const updateUrl = UPDATE_DAY_SETTINGS.replace(":id", daySettings.id);
        response = await patch(updateUrl, payload);
        toast.success("Day settings updated successfully for the selected date!");
      } else {
        // Otherwise use POST for initial creation
        response = await post(DAY_SETTINGS, payload);
        // Store the ID from response for future edits
        if (response?.id) {
          setDaySettings((prev) => ({ ...prev, id: response.id }));
        }
        toast.success("Day settings saved successfully!");
      }
      
      console.log("API Response:", response);
      setDaySettings((prev) => ({
        ...prev,
        dayStart: data.dayStart,
        dayEnd: data.dayEnd,
      }));
      
      // Refresh table data
      await fetchDaySettingsData();
    } catch (error) {
      console.error("Error saving day settings:", error);
      toast.error(
        error.response?.data?.message || "Failed to save day settings"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Day Settings Cancelled");
    toast.info("Changes cancelled");
  };

  return (
    <Container>
      <PageTitle>Day Settings</PageTitle>
      <DaySettingsComponent
        onSave={handleSave}
        onCancel={handleCancel}
        initialData={daySettings}
        isLoading={isLoading}
      />
      
      <TableSection>
        <TableTitle>Day Settings History</TableTitle>
        {isLoadingTable ? (
          <LoadingText>Loading day settings...</LoadingText>
        ) : tableData.length > 0 ? (
          <ReusableTable
            columns={tableColumns}
            data={tableData}
          />
        ) : (
          <NoDataText>No day settings found</NoDataText>
        )}
      </TableSection>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: "Inter-Bold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const TableSection = styled.div`
  width: 100%;
  background: ${theme.colors.white};
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TableTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const LoadingText = styled.p`
  text-align: center;
  color: ${theme.colors.textGray};
  font-size: 0.875rem;
  margin: 2rem 0;
`;

const NoDataText = styled.p`
  text-align: center;
  color: ${theme.colors.textGray};
  font-size: 0.875rem;
  margin: 2rem 0;
`;

// Table columns configuration
const tableColumns = [
  {
    key: "date",
    label: "Date",
    width: "25%",
    renderer: (value) => value || "General Settings",
  },
  {
    key: "startTime",
    label: "Start Time",
    width: "25%",
  },
  {
    key: "endTime",
    label: "End Time",
    width: "25%",
  },
  {
    key: "type",
    label: "Type",
    width: "25%",
    renderer: (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : "Default",
  },
];

export default DaySettings;
