import React, { useRef } from "react";
import styled from "styled-components";
import theme from "../theme/theme";

const CardDetails = ({
  title,
  items = [],
  columns = 3,
  showEdit = false,
  editText = "Edit",
  editIcon,
  onEdit,
  showAdd = false,
  addText = "Add",
  uploadIcon,
}) => {

  return (
    <Wrapper>
      {(title || showEdit || showAdd) && (
        <Head>
          {title && <TitleLine>{title}</TitleLine>}
          <ButtonsRight>
            {showEdit && (
              <EditBtn onClick={onEdit}>
                {editIcon && (
                  <img src={editIcon} alt="edit" width="16" height="16" />
                )}
                {editText}
              </EditBtn>
            )}
            {showAdd && (
              <AddButton>
                {uploadIcon && (
                  <img src={uploadIcon} alt="add" width="16" height="16" />
                )}
                {addText}
              </AddButton>
            )}
          </ButtonsRight>
        </Head>
      )}
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

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0 0 0.5rem 0;
`;

const TitleLine = styled.p`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const ButtonsRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 11.88px;
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

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 40px;
  padding: 0 0.875rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
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
