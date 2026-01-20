import React from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import CrossIcon from "../assets/images/Dashboard Images/crosssymbol.svg";
import { priceListConfig } from "../data/PriceList.js";

const PriceListCard = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Price List</Title>
          <CloseButton onClick={onClose}>
            <img src={CrossIcon} alt="close" />
          </CloseButton>
        </Header>
        <Body>
          <CustomTable>
            <thead>
              <tr>
                {priceListConfig.tableHeaders.map((header) => (
                  <th key={header.key}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {priceListConfig.tableRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {priceListConfig.tableHeaders.map((header) => (
                    <td key={header.key}>{row[header.key] || ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                {priceListConfig.tableHeaders.map((header) => (
                  <td key={header.key}>
                    {priceListConfig.footerRow[header.key] || ""}
                  </td>
                ))}
              </tr>
            </tfoot>
          </CustomTable>
        </Body>
      </Card>
    </Overlay>
  );
};

export default PriceListCard;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Card = styled.div`
  background: ${theme.colors.white};
  width: 90%;
  max-width: 800px;
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 16px 20px;
  background-color: #eef5e6;
  border-bottom: 1px solid #dce7cf;
`;

const Title = styled.h2`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.6; /* 160% */
  letter-spacing: 0;
  text-align: center;
  color: #000000;
  margin: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const CustomTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  /* ---------- HEADER (NO CHANGE) ---------- */
  thead th {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 700;
    border-bottom: 1px solid #e0e0e0;
    background-color: #fff;
    font-family: "Inter", sans-serif;
  }

  /* ---------- BODY DATA ITEMS (UPDATED) ---------- */
  tbody td {
    padding: 16px 12px;
    font-family: "Inter", sans-serif;
    font-size: 16px;
    font-weight: 500; /* Medium */
    line-height: 160%;
    letter-spacing: 0;
    color: #000000;
  }

  /* ---------- FIRST COLUMN ---------- */
  thead th:first-child,
  tbody td:first-child,
  tfoot td:first-child {
    text-align: left;
  }

  /* ---------- LAST COLUMN ---------- */
  tbody td:last-child,
  tfoot td:last-child {
    padding-left: 16px;
  }

  /* ---------- FOOTER (UNCHANGED) ---------- */
  tfoot td {
    border-top: 2px solid #e0e0e0;
    padding: 16px 12px;
    font-size: 16px;
    font-weight: 500;
    line-height: 160%;
    font-family: "Inter", sans-serif;
  }

  /* ---------- VERTICAL DIVIDER ---------- */
  thead th:nth-last-child(2),
  tbody td:nth-last-child(2) {
    border-right: 1px solid #e0e0e0;
  }
`;
