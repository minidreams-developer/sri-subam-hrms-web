import React from "react";
import styled from "styled-components";
import SearchIcon from "../assets/images/dashboard Images/search-alt_svgrepo.com.svg";
import theme from "../theme/theme";

const SearchInputComponent = ({
  placeholder = "Search",
  onSearchChange,
  value,
  width = "100%",
  height = "57px",
  showMic = false,
}) => {
  return (
    <SearchInputWrapper $width={width} $height={height} $hasMic={showMic}>
      <img src={SearchIcon} alt="search" />
      <SearchInput
        placeholder={placeholder}
        value={value}
        type="text"
        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
      />
    </SearchInputWrapper>
  );
};

export default SearchInputComponent;

const SearchInputWrapper = styled.div`
  width: ${(props) => props.$width || "100%"};
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  height: ${(props) => props.$height || "57px"};
  border-radius: 8px;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.white};

  img {
    width: 1rem;
    height: 1rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  font-size: 0.875rem;
  color: ${theme.colors.searchInputText};
  font-family: "Inter", sans-serif;
  font-weight: 500;
  border: none;
  outline: none;
  padding: 0 0.625rem;
  background: transparent;

  ::placeholder {
    color: ${theme.colors.placeholder};
    font-family: "Inter", sans-serif;
    font-weight: 400;
    opacity: 1;
  }
  &:focus {
    color: ${theme.colors.primary_text};
  }
`;

const MicImage = styled.img`
  width: 1rem;
  height: 1rem;
  opacity: 0.6;
  cursor: pointer;
`;
