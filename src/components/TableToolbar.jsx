import React from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import SearchInputComponent from "./SearchInputComponent";
import Button from "./Button";
import FilterIcon from "../assets/images/Dashboard Images/filtericon.svg";

const TableToolbar = ({
  searchPlaceholder = "Search",
  searchValue = "",
  onSearchChange,
  select1Options = [],
  select1Value = "",
  onSelect1Change,
  select2Options = [],
  select2Value = "",
  onSelect2Change,
  showFilter = true,
  filterText = "Filter",
  onFilterClick,
  actionText = "",
  onActionClick,
  actionIcon,
  widths = { search: "24rem", select: "12rem" },
  title,
  searchPosition = "left",
  showDotIcon = false,
  dotIcon,
}) => {
  return (
    <Bar>
      <Left>
        {title ? (
          <Title>{title}</Title>
        ) : (
          searchPosition === "left" && (
            <SearchWrap $w={widths.search}>
              <SearchInputComponent
                placeholder={searchPlaceholder}
                value={searchValue}
                onSearchChange={onSearchChange}
                width="100%"
                height="40px"
              />
            </SearchWrap>
          )
        )}
      </Left>
      <Right>
        {select1Options?.length > 0 && (
          <SelectWrap $w={widths.select}>
            <select
              className="form-select"
              value={select1Value}
              onChange={(e) =>
                onSelect1Change && onSelect1Change(e.target.value)
              }
            >
              {select1Options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </SelectWrap>
        )}
        {select2Options?.length > 0 && (
          <SelectWrap $w={widths.select}>
            <select
              className="form-select"
              value={select2Value}
              onChange={(e) =>
                onSelect2Change && onSelect2Change(e.target.value)
              }
            >
              {select2Options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </SelectWrap>
        )}
        {searchPosition === "right" && (
          <SearchWrap $w={widths.search}>
            <SearchInputComponent
              placeholder={searchPlaceholder}
              value={searchValue}
              onSearchChange={onSearchChange}
              width="100%"
              height="40px"
            />
          </SearchWrap>
        )}
        {showFilter && (
          <FilterBtn
            onClick={onFilterClick}
            bg={theme.colors.white}
            color={theme.colors.textColor}
            border={`1px solid ${theme.colors.border}`}
            icon={<img src={FilterIcon} alt="filter" width="16" height="16" />}
            text={filterText}
          />
        )}
        {actionText && (
          <Button
            text={actionText}
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="10rem"
            radius="0.625rem"
            icon={actionIcon}
            onClick={onActionClick}
          />
        )}
        {showDotIcon && <DotIcon src={dotIcon} />}
      </Right>
    </Bar>
  );
};

export default TableToolbar;

const Title = styled.h2`
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const Bar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0 0 0.75rem 0;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
`;

const SearchWrap = styled.div`
  flex: 1 1 22rem;
  min-width: 14rem;
  max-width: 40rem;

  @media (max-width: 1200px) {
    flex-basis: 20rem;
  }
  @media (max-width: 992px) {
    flex-basis: 18rem;
  }
  @media (max-width: 768px) {
    flex-basis: 100%;
    max-width: 100%;
  }
`;

const SelectWrap = styled.div`
  width: ${(p) => p.$w || "12rem"};

  .form-select {
    height: 40px;
    border: 1px solid ${theme.colors.border};
    border-radius: 8px;
    color: ${theme.colors.textColor};
    font-size: 0.875rem;
  }

  @media (max-width: 992px) {
    width: 10rem;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterBtn = styled(Button)`
  width: 7rem;
`;

const DotIcon = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;
