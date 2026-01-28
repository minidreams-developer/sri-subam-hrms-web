import React from "react";
import styled from "styled-components";
import theme from "../theme/theme";

const TabSwitcher = ({ tabs = [], active = "", onChange }) => {
  return (
    <TabsBar>
      {tabs.map((t) => (
        <TabButton
          key={t.value || t.label}
          $active={(t.value || t.label) === active}
          onClick={() => onChange && onChange(t.value || t.label)}
        >
          {t.label}
        </TabButton>
      ))}
    </TabsBar>
  );
};

export default TabSwitcher;

const TabsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 0 0 1.5rem 0;
  border-bottom: 1px solid #e0e3e6;
`;

const TabButton = styled.button`
  background: transparent;
  border: none;
  color: ${(prop) =>
    prop.$active ? theme.colors.primary : theme.colors.textColor};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  line-height: 160%;
  padding: 0.5rem 0;
  cursor: pointer;
  border-bottom: 4px solid
    ${(props) => (props.$active ? theme.colors.primary : "transparent")};
`;
