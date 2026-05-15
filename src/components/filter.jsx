import { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import { IoClose, IoSearch } from "react-icons/io5";

const Filter = ({ onClose, onApply }) => {
  const [filters, setFilters] = useState({
    department: [],
    designations: [],
    dateRange: { start: "", end: "" },
    status: [],
    shift: [],
    sortBy: "",
  });

  const [searchDept, setSearchDept] = useState("");
  const [expandedSection, setExpandedSection] = useState("department");

  const departments = [
    "Design Department",
    "Accounts Department",
    "Project Development Department",
    "Packaging Department",
  ];

  const designations = [
    "Senior Developer",
    "Junior Developer",
    "UI/UX Designer",
    "Product Manager",
    "QA Engineer",
  ];

  const statuses = ["Active", "Inactive", "On Leave", "Terminated"];
  const shifts = ["Morning", "Afternoon", "Evening", "Night"];
  const sortOptions = ["Name (A-Z)", "Name (Z-A)", "Date Added", "Salary"];

  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(searchDept.toLowerCase())
  );

  const handleDepartmentChange = (dept) => {
    setFilters((prev) => ({
      ...prev,
      department: prev.department.includes(dept)
        ? prev.department.filter((d) => d !== dept)
        : [...prev.department, dept],
    }));
  };

  const handleDesignationChange = (designation) => {
    setFilters((prev) => ({
      ...prev,
      designations: prev.designations.includes(designation)
        ? prev.designations.filter((d) => d !== designation)
        : [...prev.designations, designation],
    }));
  };

  const handleStatusChange = (status) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleShiftChange = (shift) => {
    setFilters((prev) => ({
      ...prev,
      shift: prev.shift.includes(shift)
        ? prev.shift.filter((s) => s !== shift)
        : [...prev.shift, shift],
    }));
  };

  const handleClearAll = () => {
    setFilters({
      department: [],
      designations: [],
      dateRange: { start: "", end: "" },
      status: [],
      shift: [],
      sortBy: "",
    });
    setSearchDept("");
  };

  const handleApply = () => {
    if (onApply) {
      onApply(filters);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <FilterContainer onClick={(e) => e.stopPropagation()}>
        <FilterHeader>
          <FilterTitle>Filter</FilterTitle>
          <CloseButton onClick={onClose}>
            <IoClose size={24} />
          </CloseButton>
        </FilterHeader>

        <FilterContent>
          <LeftPanel>
            <FilterOption
              active={expandedSection === "department"}
              onClick={() => setExpandedSection("department")}
            >
              Department
            </FilterOption>
            <FilterOption
              active={expandedSection === "designations"}
              onClick={() => setExpandedSection("designations")}
            >
              Designations
            </FilterOption>
            <FilterOption
              active={expandedSection === "dateRange"}
              onClick={() => setExpandedSection("dateRange")}
            >
              Date Range
            </FilterOption>
            <FilterOption
              active={expandedSection === "status"}
              onClick={() => setExpandedSection("status")}
            >
              Status
            </FilterOption>
            <FilterOption
              active={expandedSection === "shift"}
              onClick={() => setExpandedSection("shift")}
            >
              Shift
            </FilterOption>
            <FilterOption
              active={expandedSection === "sortBy"}
              onClick={() => setExpandedSection("sortBy")}
            >
              Sort By
            </FilterOption>
          </LeftPanel>

          <RightPanel>
            {expandedSection === "department" && (
              <FilterSection>
                <SectionTitle>Select Department</SectionTitle>
                <SearchBox>
                  <IoSearch size={18} color={theme.colors.primary} />
                  <SearchInput
                    type="text"
                    placeholder="Search"
                    value={searchDept}
                    onChange={(e) => setSearchDept(e.target.value)}
                  />
                </SearchBox>
                <OptionsList>
                  {filteredDepartments.map((dept) => (
                    <OptionItem key={dept}>
                      <Checkbox
                        type="checkbox"
                        checked={filters.department.includes(dept)}
                        onChange={() => handleDepartmentChange(dept)}
                      />
                      <OptionLabel>{dept}</OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsList>
              </FilterSection>
            )}

            {expandedSection === "designations" && (
              <FilterSection>
                <SectionTitle>Select Designation</SectionTitle>
                <OptionsList>
                  {designations.map((designation) => (
                    <OptionItem key={designation}>
                      <Checkbox
                        type="checkbox"
                        checked={filters.designations.includes(designation)}
                        onChange={() => handleDesignationChange(designation)}
                      />
                      <OptionLabel>{designation}</OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsList>
              </FilterSection>
            )}

            {expandedSection === "dateRange" && (
              <FilterSection>
                <SectionTitle>Select Date Range</SectionTitle>
                <DateInputGroup>
                  <DateInput
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value },
                      }))
                    }
                    placeholder="Start Date"
                  />
                  <DateInput
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value },
                      }))
                    }
                    placeholder="End Date"
                  />
                </DateInputGroup>
              </FilterSection>
            )}

            {expandedSection === "status" && (
              <FilterSection>
                <SectionTitle>Select Status</SectionTitle>
                <OptionsList>
                  {statuses.map((status) => (
                    <OptionItem key={status}>
                      <Checkbox
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={() => handleStatusChange(status)}
                      />
                      <OptionLabel>{status}</OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsList>
              </FilterSection>
            )}

            {expandedSection === "shift" && (
              <FilterSection>
                <SectionTitle>Select Shift</SectionTitle>
                <OptionsList>
                  {shifts.map((shift) => (
                    <OptionItem key={shift}>
                      <Checkbox
                        type="checkbox"
                        checked={filters.shift.includes(shift)}
                        onChange={() => handleShiftChange(shift)}
                      />
                      <OptionLabel>{shift}</OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsList>
              </FilterSection>
            )}

            {expandedSection === "sortBy" && (
              <FilterSection>
                <SectionTitle>Sort By</SectionTitle>
                <OptionsList>
                  {sortOptions.map((option) => (
                    <OptionItem key={option}>
                      <RadioButton
                        type="radio"
                        name="sortBy"
                        value={option}
                        checked={filters.sortBy === option}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            sortBy: e.target.value,
                          }))
                        }
                      />
                      <OptionLabel>{option}</OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsList>
              </FilterSection>
            )}
          </RightPanel>
        </FilterContent>

        <FilterFooter>
          <ClearButton onClick={handleClearAll}>Clear All</ClearButton>
          <ApplyButton onClick={handleApply}>Apply</ApplyButton>
        </FilterFooter>
      </FilterContainer>
    </Overlay>
  );
};

export default Filter;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FilterContainer = styled.div`
  background: ${theme.colors.white};
  width: 620px;
  height: 527px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    width: 95%;
    height: auto;
    max-height: 95vh;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const FilterTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.secondaryText};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const FilterContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  width: 25%;
  background-color: ${theme.colors.bgColor};
  border-right: 1px solid ${theme.colors.border};
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid ${theme.colors.border};
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
  }
`;

const FilterOption = styled.button`
  padding: 1rem 1.5rem;
  background: ${(props) =>
    props.active ? theme.colors.white : theme.colors.bgColor};
  border: none;
  border-left: 3px solid
    ${(props) => (props.active ? theme.colors.primary : "transparent")};
  color: ${(props) =>
    props.active ? theme.colors.primary : theme.colors.secondaryText};
  font-size: 0.875rem;
  font-weight: ${(props) => (props.active ? 600 : 500)};
  font-family: "Inter-Medium", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  white-space: nowrap;

  &:hover {
    background-color: ${theme.colors.white};
    color: ${theme.colors.primary};
  }

  @media (max-width: 768px) {
    border-left: none;
    border-bottom: 3px solid
      ${(props) => (props.active ? theme.colors.primary : "transparent")};
    padding: 1rem;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: ${theme.colors.bgColor};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  outline: none;

  &::placeholder {
    color: ${theme.colors.secondaryText};
  }
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OptionItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 0.5rem;

  &:hover {
    background-color: ${theme.colors.bgColor};
  }
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: ${theme.colors.primary};
`;

const RadioButton = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: ${theme.colors.primary};
`;

const OptionLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
`;

const DateInputGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  background-color: ${theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }

  &::placeholder {
    color: ${theme.colors.secondaryText};
  }
`;

const FilterFooter = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid ${theme.colors.border};
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const ClearButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: ${theme.colors.primary};
  border: 2px solid ${theme.colors.primary};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.primary}10;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ApplyButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
