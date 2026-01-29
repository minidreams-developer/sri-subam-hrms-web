import React from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import UploadIcon from "../assets/images/employee/upload.svg";

const CardDetailsAlt = ({
  title,
  columns = 3,
  children,
  onUpload,
  uploadText = "Upload",
  showUpload = true,
}) => {
  return (
    <Wrapper>
      {(title || showUpload) && (
        <Head>
          {title && <TitleLine>{title}</TitleLine>}
          {showUpload && (
            <UploadBtn onClick={onUpload}>
              <img src={UploadIcon} alt="upload" width="16" height="16" />
              {uploadText}
            </UploadBtn>
          )}
        </Head>
      )}
      <Panel>
        <Grid $cols={columns}>
          {React.Children.map(children, (child, idx) => (
            <GridItem key={idx}>{child}</GridItem>
          ))}
        </Grid>
      </Panel>
    </Wrapper>
  );
};

export default CardDetailsAlt;

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
  margin: 0 0 0.75rem 0;
`;

const TitleLine = styled.p`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const Panel = styled.div`
  width: 100%;
  background: #edf6f966;
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  padding: 1rem;
`;

const UploadBtn = styled.button`
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

const GridItem = styled.div`
  display: flex;
  align-items: stretch;
`;
