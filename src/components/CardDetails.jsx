import React from "react";
import styled from "styled-components";
import theme from "../theme/theme";

const CardDetails = ({ title, items = [], columns = 3 }) => {
  return (
    <Wrapper>
      {title && <TitleLine>{title}</TitleLine>}
      <Panel>
        <Grid $cols={columns}>
          {items
            .filter((it) => it && (it.label || it.value))
            .map((it, idx) => (
              <InfoItem key={idx}>
                <Label>{it.label}</Label>
                <Value>{it.value}</Value>
              </InfoItem>
            ))}
        </Grid>
      </Panel>
    </Wrapper>
  );
};

export default CardDetails;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TitleLine = styled.p`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0 0 0.5rem 0;
`;

const Panel = styled.div`
  width: 100%;
  background: #edf6f966;
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  padding: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols || 3}, minmax(220px, 1fr));
  gap: 1rem 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
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
