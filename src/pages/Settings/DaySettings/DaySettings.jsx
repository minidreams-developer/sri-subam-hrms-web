import React, { useState } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import DaySettingsComponent from "../../../components/daysettings";
import { toast } from "react-toastify";

const DaySettings = () => {
  const [daySettings, setDaySettings] = useState({
    dayStart: null,
    dayEnd: null,
  });

  const handleSave = (data) => {
    console.log("Day Settings Saved:", data);
    setDaySettings(data);
    toast.success("Day settings saved successfully!");
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
      />
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

export default DaySettings;
