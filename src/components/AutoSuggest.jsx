import React, { useCallback, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import { get } from "../helpers/api_helper";
import { BY_CART } from "../helpers/url_helper";
import { debounce } from "lodash";
import { Spinner } from "reactstrap";

const AutoSuggest = ({
  label = "",
  placeholder = "Enter",
  width = "100%",
  onSelect,
  value = "",
  isSecondary = false,
  ...rest
}) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setInputValue(value);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value]);

  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const GetByCart = useCallback(async (query = "") => {
    if (!query.trim()) {
      setFilteredSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await get(`${BY_CART}=${query}`);
      console.log("API Response:", response);

      if (response?.data && Array.isArray(response?.data)) {
        setFilteredSuggestions(response?.data);
        setShowSuggestions(response.data?.length > 0);
      } else {
        setFilteredSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.log("Error fetching cart list:", error);
      setFilteredSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(debounce(GetByCart, 500), [GetByCart]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() !== "") {
      debouncedFetch(value); // Call API after debounce
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    setInputValue(item.cartNo);
    setShowSuggestions(false);
    if (onSelect) onSelect(item);
  };

  console.log(filteredSuggestions);

  return (
    <FieldWrapper ref={wrapperRef}>
      {label && <Label>{label}</Label>}
      <InputWrapper width={width}>
        <Input
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
          {...rest}
          onFocus={() => setShowSuggestions(true)}
        />
      </InputWrapper>

      {loading && <Spinner color={theme.colors.secondary} />}

      {showSuggestions && filteredSuggestions.length > 0 && (
        <SuggestionsBox>
          {filteredSuggestions.map((item, index) => (
            <SuggestionItem key={index} onClick={() => handleSelect(item)}>
              <Wrap>
                <h2>{isSecondary ? item.ownerName : item.cartNo}</h2>
                {isSecondary ? (
                  <Wrap className="details">
                    <p>{item.location}</p>
                  </Wrap>
                ) : (
                  <Wrap className="details">
                    <p>{item.ownerName}</p> &bull;
                    <p>{item.location}</p>
                  </Wrap>
                )}
              </Wrap>
            </SuggestionItem>
          ))}
        </SuggestionsBox>
      )}
    </FieldWrapper>
  );
};

const Label = styled.p`
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primary};
  margin: 1rem 0 0.625rem 0;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;

  &:focus-within ${Label} {
    color: ${theme.colors.primary};
  }
`;

const InputWrapper = styled.div`
  max-width: ${(props) => props.width};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.white};

  &:focus-within {
    border: 1px solid ${theme.colors.primaryGreen};
  }

  transition: border 0.3s ease;
`;

const Input = styled.input`
  width: 100%;
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 400;
  line-height: 160%;
  color: ${theme.colors.textColor};
  padding: 0.875rem;
  border: none;
  border-radius: 6px;
  outline: none;

  ::placeholder {
    font-family: "Inter_18pt-Medium", sans-serif;
    font-weight: 400;
    opacity: 1;
  }
`;

const SuggestionsBox = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-top: none;
  max-height: 16rem;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 10;
`;

const SuggestionItem = styled.li`
  padding: 1rem 0.875rem;
  cursor: pointer;
  color: ${theme.colors.textColor};
  border-bottom: 1px solid ${theme.colors.border};

  h2 {
    font-size: 1rem;
    font-weight: 600;
    line-height: 160%;
    font-family: "Inter_18pt-Medium", sans-serif;
    color: ${theme.colors.textColor};
    margin: 0 0 0.313rem 0;
  }

  p {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 160%;
    font-family: "Inter_18pt-Medium", sans-serif;
    color: #b4b4b4;
    margin: 0;
  }

  &:hover {
    background-color: ${theme.colors.border};
  }
`;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  .details {
    align-items: flex-start;
    flex-direction: row;
    justify-content: flex-start;
    gap: 1rem;
  }
`;

export default AutoSuggest;
