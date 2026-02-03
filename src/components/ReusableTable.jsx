import React, { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import CustomButton from "./Button";

// ---------------- Reusable Table Component ----------------
const ReusableTable = ({
  columns = [],
  data = [],
  rowsPerPage = 5,
  emptyStateImage,
  emptyStateText,
  isLoading = false,
  actionBtnClicked,
  onRowClick,
  enableSelection = false,
  onSelectionChange,
  stickyPagination = false,
  paginationBorder = false,
  server = false,
  totalResults = 0,
  totalPages: serverTotalPages = 1,
  currentPage: serverPage = 1,
  onPageChange,
  alwaysShowPagination = false,
  actionType = "default",
  onApprove,
  onReject,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  // Use server or local pagination values
  const page = server ? serverPage : currentPage;
  const total = server
    ? serverTotalPages
    : Math.ceil(data?.length / rowsPerPage);
  const currentRows = server
    ? data
    : data?.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handlePageChange = (newPage) => {
    if (server) {
      if (onPageChange) {
        onPageChange(newPage);
      }
    } else {
      setCurrentPage(newPage);
    }
  };

  const getPageNumbers = (currentPage, totalPages) => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  if (isLoading) {
    return (
      <LoadingWrapper>
        <LoadingSpinner />
        <LoadingText>Loading data...</LoadingText>
      </LoadingWrapper>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyStateWrapper>
        {emptyStateImage && (
          <EmptyStateImage src={emptyStateImage} alt="empty" />
        )}
        <EmptyStateText>{emptyStateText || "No data available"}</EmptyStateText>
      </EmptyStateWrapper>
    );
  }

  return (
    <TableWrapper $sticky={stickyPagination}>
      <TableScrollContainer>
        <StyledTable>
          <TableHead>
            <tr>
              {columns?.map((col, i) => (
                <TableHeader key={i} noWrap={col?.noWrap}>
                  <div>
                    <p
                      style={{
                        borderRight:
                          i === columns.length - 1
                            ? "none"
                            : `1px solid #B4B4B4`,
                        color: "#5C5C5C",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        alignSelf: "flex-start",
                        textAlign: "left",
                        margin: "0",
                      }}
                    >
                      {col?.label || col?.header}
                    </p>
                  </div>
                </TableHeader>
              ))}
            </tr>
          </TableHead>
          <tbody>
            {currentRows?.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  cursor: onRowClick ? "pointer" : "default",
                }}
              >
                {columns.map((col, colIndex) => {
                  const value = row[col.key] || row[col.accessor];

                  if (col.render) {
                    return (
                      <TableCell key={colIndex}>{col.render(row)}</TableCell>
                    );
                  }

                  if (
                    col?.key === "actions" ||
                    col?.header === "Actions" ||
                    col?.header === "Action"
                  ) {
                    if (actionType === "buttons") {
                      return (
                        <TableCell key={colIndex}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <CustomButton
                              text="Reject"
                              bg="#fee2e2"
                              color="#dc2626"
                              onClick={(e) => {
                                e.stopPropagation();
                                onReject && onReject(row);
                              }}
                              width="auto"
                              radius="0.375rem"
                              fontSize="0.625rem"
                              fontWeight="600"
                              fontFamily="Inter-SemiBold"
                              border="none"
                            />
                            <CustomButton
                              text="Approve"
                              bg={theme.colors.primary}
                              color={theme.colors.white}
                              onClick={(e) => {
                                e.stopPropagation();
                                onApprove && onApprove(row);
                              }}
                              width="auto"
                              radius="0.375rem"
                              fontSize="0.625rem"
                              fontWeight="600"
                              fontFamily="Inter-SemiBold"
                              border="none"
                            />
                          </div>
                        </TableCell>
                      );
                    }
                    return (
                      <ActionCell
                        key={colIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          actionBtnClicked && actionBtnClicked(row);
                        }}
                      >
                        {value}
                      </ActionCell>
                    );
                  } else if (
                    col?.key === "status" ||
                    col?.header === "Status"
                  ) {
                    return (
                      <TableCell key={colIndex}>
                        <StatusBadge $status={value}>
                          <StatusBadgeText $status={value}>
                            {value}
                          </StatusBadgeText>
                        </StatusBadge>
                      </TableCell>
                    );
                  }

                  return <TableCell key={colIndex}>{value || "-/-"}</TableCell>;
                })}
              </TableRow>
            ))}
          </tbody>
        </StyledTable>
      </TableScrollContainer>

      {/* Pagination */}
      {(total > 1 || alwaysShowPagination) && (
        <PaginationWrapper
          $sticky={stickyPagination}
          $border={paginationBorder}
        >
          <Button
            onClick={() => handlePageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
          >
            <Arrow>&lt;</Arrow>
          </Button>

          {getPageNumbers(page, total).map((pageNum, index) => (
            <PageNumber
              key={index}
              $isActive={page === pageNum}
              onClick={() => pageNum !== "..." && handlePageChange(pageNum)}
              $isDots={pageNum === "..."}
            >
              {pageNum}
            </PageNumber>
          ))}

          <Button
            onClick={() => handlePageChange(Math.min(page + 1, total))}
            disabled={page === total}
          >
            <Arrow>&gt;</Arrow>
          </Button>
        </PaginationWrapper>
      )}
    </TableWrapper>
  );
};

export default ReusableTable;

// ---------------- Styled Components ----------------
const TableWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  display: ${(props) => (props.$sticky ? "flex" : "block")};
  flex-direction: ${(props) => (props.$sticky ? "column" : "initial")};
  min-height: ${(props) => (props.$sticky ? "60vh" : "auto")};
`;

const TableScrollContainer = styled.div`
  width: 100%;
  flex: 1;
  overflow-x: auto;
  margin-bottom: 0.5rem;
`;

const StyledTable = styled.table`
  width: 100%;
  background-color: ${theme.colors.white};
  border-collapse: separate;
  border-spacing: 0;
  border-bottom: 1px solid ${theme.colors.white};
  font-family: "Inter", sans-serif;
  font-weight: 400;
`;

const TableHead = styled.thead`
  border-top: 1px solid ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.border};
  background: #ffffff;
  overflow: hidden;
`;

const TableRow = styled.tr`
  &:hover {
    background: ${theme.colors.secondaryWhite};
  }
`;

const TableHeader = styled.th`
  padding: 0.938rem 0.625rem;
  /* width: ${100 / 7}%; Removed fixed width to allow dynamic sizing */
  min-width: 100px;
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 0.625rem;
  color: ${theme.colors.textColor};
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  white-space: ${(props) => (props.noWrap ? "nowrap" : "normal")};
  /* width: ${100 / 7}%; Removed fixed width */
  min-width: 100px;
`;

const PaginationWrapper = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.625rem;
  // margin-top: ${(props) => (props.$sticky ? "auto" : "0")};
  position: ${(props) => (props.$sticky ? "sticky" : "static")};
  bottom: ${(props) => (props.$sticky ? "0" : "auto")};
  border-top: ${(props) => (props.$border ? "1px solid #EAECF0" : "none")};
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 0;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Arrow = styled.span`
  font-size: 1rem;
  line-height: 1rem;
  color: ${theme.colors.textColor};
  user-select: none;
`;

const ActionCell = styled.td`
  padding: 0.75rem 1.25rem;
  color: ${theme.colors.textColor};
  cursor: pointer;
  text-align: left;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  min-width: 100px;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const StatusBadge = styled.div`
  width: 5.875rem;
  height: 2rem;
  gap: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;

const StatusBadgeText = styled.p`
  text-transform: capitalize;
  font-size: 0.75rem;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  margin: 0;
  color: ${({ $status }) => {
    const s = String($status || "").toLowerCase();
    if (s === "active") return "#16a34a";
    if (s === "relieved") return "#dc2626";
    if (s === "inactive" || s === "in-active" || s === "in active")
      return "#f59e0b";
    if (s === "approved") return "#22AA4E";
    if (s === "rejected") return "#FA0000";
    return theme.colors.textColor;
  }};
`;

const PageNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  border-radius: 4px;
  cursor: ${(props) => (props.$isDots ? "default" : "pointer")};
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  background-color: ${(props) =>
    props.$isActive ? theme.colors.primary : "transparent"};
  color: ${(props) =>
    props.$isActive ? theme.colors.white : theme.colors.textColor};
  padding: 0 0.5rem;

  &:hover {
    background-color: ${(props) =>
      props.$isDots
        ? "transparent"
        : props.$isActive
          ? theme.colors.primary
          : theme.colors.secondaryWhite};
  }
`;

const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${theme.colors.white};
  min-height: 60vh;
`;

const EmptyStateImage = styled.img`
  min-width: 15rem;
  height: auto;
  margin-bottom: 1.5rem;
  object-fit: contain;
`;

const EmptyStateText = styled.p`
  max-width: 18rem;
  text-align: center;
  line-height: 160%;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 1rem;
  color: ${theme.colors.textColor};
`;

const LoadingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${theme.colors.white};
  border-radius: 4px;
  min-height: 200px;
`;

const LoadingSpinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid #e0e0e0;
  border-top: 3px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 1rem;
  color: ${theme.colors.textColor};
`;
