import theme from "./theme";

export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    height: "45px",
    borderRadius: "0.625rem",
    border: state.isFocused
      ? `1px solid ${theme.colors.primary}`
      : `1px solid ${theme.colors.border}`,
    boxShadow: "none",
    fontSize: "0.875rem",
    fontFamily: '"Inter", sans-serif',
    color: theme.colors.textColor,
    "&:hover": {
      border: state.isFocused
        ? `1px solid ${theme.colors.primary}`
        : `1px solid ${theme.colors.border}`,
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    fontFamily: '"Inter", sans-serif',
    color: theme.colors.textGray || "#9ca3af",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? theme.colors.primary
      : state.isFocused
        ? `${theme.colors.primary}10`
        : "white",
    color: state.isSelected ? "white" : theme.colors.textColor,
    fontFamily: '"Inter", sans-serif',
    fontSize: "0.875rem",
    cursor: "pointer",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontFamily: '"Inter", sans-serif',
    color: theme.colors.textColor,
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.625rem",
    zIndex: 9999,
  }),
};
