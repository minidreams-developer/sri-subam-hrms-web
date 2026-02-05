import { Label } from "reactstrap";
import theme from "../../theme/theme";
import styled from "styled-components";
import InputComponent from "../../components/InputComponent";
import Select from "react-select";
import { useState } from "react";
import { customSelectStyles } from "../../theme/reactSelectStyles";
import TimeInputComponent from "../../components/TimeInputComponent";
import Button from "../../components/Button";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import deleteIcon from "../../assets/images/shift/delete.svg";
import Switch from "react-switch";
import CalenderInput from "../../components/CalenderInput";

const AddShift = () => {
  const [effectiveStartDate, setEffectiveStartDate] = useState(null);
  const [breaks, setBreaks] = useState([{ id: 1 }]);
  const [breakManagementEnabled, setBreakManagementEnabled] = useState(false);
  const [sameTiming, setSameTiming] = useState({ value: "yes", label: "Yes" });
  const [shiftType, setShiftType] = useState({
    value: "fixed",
    label: "Fixed",
  });
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [rotationOrder, setRotationOrder] = useState([]);

  const handleAddBreak = () => {
    setBreaks([...breaks, { id: Date.now() }]);
  };

  const handleRemoveBreak = (id) => {
    if (breaks.length > 1) {
      setBreaks(breaks.filter((item) => item.id !== id));
    }
  };

  const handleRemoveShift = (value) => {
    setSelectedShifts(selectedShifts.filter((item) => item.value !== value));
  };

  const handleRemoveRotationOrder = (value) => {
    setRotationOrder(rotationOrder.filter((item) => item.value !== value));
  };

  const options = [
    { value: "fixed", label: "Fixed" },
    { value: "rotational", label: "Rotational" },
  ];

  const shiftListOptions = [
    { value: "morning", label: "Morning" },
    { value: "afternoon", label: "Afternoon" },
    { value: "night", label: "Night" },
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const shiftOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  return (
    <>
      <Container>
        <Title>Basic Details</Title>
        <Row>
          <Col>
            <InputComponent
              label="Shift Code"
              placeholder="Enter Code"
              labelMargin="0 0 0.625rem 0"
              height="45px"
            />
          </Col>
          <Col>
            <InputComponent
              label="Shift Name"
              placeholder="Enter Name"
              labelMargin="0 0 0.625rem 0"
              height="45px"
            />
          </Col>
        </Row>
        <Divider />
        <Title>Shift Timing Information</Title>
        <Row>
          <Col>
            <Label
              htmlFor="shiftType"
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                fontFamily: "Inter, sans-serif",
                color: theme.colors.primaryGreen,
                marginBottom: "0.625rem",
              }}
            >
              Shift Type
            </Label>
            <Select
              id="shiftType"
              options={options}
              value={shiftType}
              onChange={setShiftType}
              placeholder="Select"
              styles={customSelectStyles}
              isSearchable
            />
          </Col>
          <Col>
            <Label
              htmlFor={
                shiftType.value === "rotational" ? "selectShifts" : "timingSame"
              }
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                fontFamily: "Inter, sans-serif",
                color: theme.colors.primaryGreen,
                marginBottom: "0.625rem",
              }}
            >
              {shiftType.value === "rotational"
                ? "Select Shifts"
                : "Same timing for all days"}
            </Label>
            {shiftType.value === "rotational" ? (
              <>
                <Select
                  id="selectShifts"
                  options={shiftListOptions}
                  isMulti
                  value={selectedShifts}
                  onChange={setSelectedShifts}
                  placeholder="Select Shift"
                  styles={{
                    ...customSelectStyles,
                    multiValue: () => ({ display: "none" }),
                  }}
                  isSearchable
                  controlShouldRenderValue={false}
                  hideSelectedOptions={false}
                />
              </>
            ) : (
              <Select
                id="timingSame"
                options={shiftOptions}
                value={sameTiming}
                onChange={setSameTiming}
                placeholder="Select"
                styles={customSelectStyles}
                isSearchable
              />
            )}
          </Col>
        </Row>
        {shiftType.value === "rotational" && selectedShifts.length > 0 && (
          <Row>
            <Col></Col>
            <Col>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {selectedShifts.map((shift) => (
                  <Tag key={shift.value}>
                    {shift.label}
                    <FaTimes
                      onClick={() => handleRemoveShift(shift.value)}
                      style={{ cursor: "pointer", marginLeft: "4px" }}
                      size={12}
                      color={theme.colors.secondaryTextColor}
                    />
                  </Tag>
                ))}
              </div>
            </Col>
          </Row>
        )}
        {shiftType.value === "rotational" ? (
          <>
            <Title className="mt-5">Rotation Cycle</Title>
            <Row>
              <Col>
                <Label
                  htmlFor="rotationType"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "Inter, sans-serif",
                    color: theme.colors.primaryGreen,
                    marginBottom: "0.625rem",
                  }}
                >
                  Rotation type
                </Label>
                <Select
                  id="rotationType"
                  options={[{ value: "weekly", label: "Weekly" }]}
                  placeholder="Select"
                  styles={customSelectStyles}
                  isSearchable
                />
              </Col>
              <Col>
                <Label
                  htmlFor="rotationOrder"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "Inter, sans-serif",
                    color: theme.colors.primaryGreen,
                    marginBottom: "0.625rem",
                  }}
                >
                  Rotation order
                </Label>
                <Select
                  id="rotationOrder"
                  options={shiftListOptions}
                  isMulti
                  value={rotationOrder}
                  onChange={setRotationOrder}
                  placeholder="Select Shift"
                  styles={{
                    ...customSelectStyles,
                    multiValue: () => ({ display: "none" }),
                  }}
                  isSearchable
                  controlShouldRenderValue={false}
                  hideSelectedOptions={false}
                />
              </Col>
            </Row>
            {rotationOrder.length > 0 && (
              <Row>
                <Col></Col>
                <Col>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {rotationOrder.map((shift) => (
                      <Tag key={shift.value}>
                        {shift.label}
                        <FaTimes
                          onClick={() => handleRemoveRotationOrder(shift.value)}
                          style={{ cursor: "pointer", marginLeft: "4px" }}
                          size={12}
                          color={theme.colors.secondaryTextColor}
                        />
                      </Tag>
                    ))}
                  </div>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <Label
                  htmlFor="rotationDuration"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "Inter, sans-serif",
                    color: theme.colors.primaryGreen,
                    marginBottom: "0.625rem",
                  }}
                >
                  Rotation duration
                </Label>
                <Select
                  id="rotationDuration"
                  options={[{ value: "7days", label: "7 days" }]}
                  placeholder="Select"
                  styles={customSelectStyles}
                  isSearchable
                />
              </Col>
              <Col>
                <CalenderInput
                  label="Effective start date"
                  onDateSelect={setEffectiveStartDate}
                  initialDate={effectiveStartDate}
                />
              </Col>
            </Row>
          </>
        ) : (
          <>
            {sameTiming?.value === "no" ? (
              weekDays.map((day) => (
                <Row key={day}>
                  <Col style={{ flex: 1.5 }}>
                    <InputComponent
                      label="Day"
                      value={day}
                      disabled
                      labelMargin="0 0 0.625rem 0"
                      height="45px"
                    />
                  </Col>
                  <Col>
                    <TimeInputComponent
                      label="Start Time"
                      placeholder="Start Time"
                      onTimeSelect={""}
                      initialTime={""}
                    />
                  </Col>
                  <Col>
                    <TimeInputComponent
                      label="End Time"
                      placeholder="End Time"
                      onTimeSelect={""}
                      initialTime={""}
                    />
                  </Col>
                </Row>
              ))
            ) : (
              <Row>
                <Col>
                  <TimeInputComponent
                    label="Start Time"
                    placeholder="Start Time"
                    onTimeSelect={""}
                    initialTime={""}
                  />
                </Col>
                <Col>
                  <TimeInputComponent
                    label="End Time"
                    placeholder="End Time"
                    onTimeSelect={""}
                    initialTime={""}
                  />
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <InputComponent
                  label="Total Shift Duration "
                  placeholder="Enter Total Shift Duration"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                />
              </Col>
              <Col>
                <InputComponent
                  label="Minimum working hours"
                  placeholder="Enter Minimum working hours"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                />
              </Col>
            </Row>
            <Title className="mt-5">Advanced Timing Rules</Title>
            <Row>
              <Col>
                <InputComponent
                  label="Grace Period (Early check-in)"
                  placeholder="In min"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  suffix="Min"
                />
              </Col>
              <Col>
                <InputComponent
                  label="Grace Period (Late check-in)"
                  placeholder="In min"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  suffix="Min"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputComponent
                  label="Grace Period (Early check-out)"
                  placeholder="In min"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  suffix="Min"
                />
              </Col>
              <Col>
                <InputComponent
                  label="Grace Period (Late check-out)"
                  placeholder="In min"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  suffix="Min"
                />
              </Col>
            </Row>
            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "80%",
                marginBottom: "1.5rem",
              }}
            >
              <Title style={{ margin: 0 }}>Break Management</Title>
              <Switch
                onChange={setBreakManagementEnabled}
                checked={breakManagementEnabled}
                onColor={theme.colors.primary}
                offColor="#E0E3E6"
                checkedIcon={false}
                uncheckedIcon={false}
                height={20}
                width={40}
              />
            </div>
            {breaks.map((breakItem, index) => (
              <div key={breakItem.id}>
                <SubHeader>
                  <span
                    style={{ fontWeight: "600", color: theme.colors.primary }}
                  >
                    Break {index + 1}
                  </span>
                  <FaMinus
                    style={{ color: theme.colors.primary, cursor: "pointer" }}
                    size={14}
                    onClick={() => handleRemoveBreak(breakItem.id)}
                  />
                </SubHeader>
                <Row>
                  <Col>
                    <InputComponent
                      label="Break Name"
                      placeholder="Enter Name"
                      labelMargin="0 0 0.625rem 0"
                      height="45px"
                    />
                  </Col>
                  <Col>
                    <Label
                      htmlFor={`breakDuration-${breakItem.id}`}
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        fontFamily: "Inter, sans-serif",
                        color: theme.colors.primaryGreen,
                        marginBottom: "0.625rem",
                      }}
                    >
                      Break duration
                    </Label>
                    <Select
                      id={`breakDuration-${breakItem.id}`}
                      options={""}
                      value={""}
                      placeholder="Select Type"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TimeInputComponent
                      label="Start Time"
                      placeholder="Start Time"
                      onTimeSelect={""}
                      initialTime={""}
                    />
                  </Col>
                  <Col>
                    <TimeInputComponent
                      label="End Time"
                      placeholder="End Time"
                      onTimeSelect={""}
                      initialTime={""}
                    />
                  </Col>
                </Row>
              </div>
            ))}
            <Row style={{ marginTop: "28px" }}>
              <Button
                text="Add More"
                icon={<FaPlus />}
                bg="transparent"
                color={theme.colors.primary}
                border={`1px solid ${theme.colors.primary}`}
                width="154px"
                radius="10px"
                fontWeight={600}
                fontSize="0.875rem"
                fontFamily='"Inter", sans-serif'
                onClick={handleAddBreak}
              />
            </Row>

            <Divider />
            <Title>Attendance Rules Linked to Shift</Title>
            <Row>
              <Col>
                <InputComponent
                  label="Late mark after X mins"
                  placeholder="In Min"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  suffix="Min"
                />
              </Col>
              <Col>
                <InputComponent
                  label="Auto half-day after X mins late"
                  placeholder="In Min"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  suffix="Min"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputComponent
                  label="Auto absent if working hours < X"
                  placeholder="In Min"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  suffix="Min"
                />
              </Col>
              <Col>
                <Label
                  htmlFor="overtimeEligibility"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "Inter, sans-serif",
                    color: theme.colors.primaryGreen,
                    marginBottom: "0.625rem",
                  }}
                >
                  Overtime eligibility
                </Label>
                <Select
                  id="overtimeEligibility"
                  options={""}
                  value={""}
                  placeholder="Select Type"
                  styles={customSelectStyles}
                  isSearchable
                />
              </Col>
            </Row>
            <Divider />
            <Title>Weekly Pattern & Working Days</Title>
            <Row>
              <Col>
                <Label
                  htmlFor="fixedDays"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "Inter, sans-serif",
                    color: theme.colors.primaryGreen,
                    marginBottom: "0.625rem",
                  }}
                >
                  Fixed days
                </Label>
                <Select
                  id="fixedDays"
                  options={""}
                  value={""}
                  placeholder="Select Days"
                  styles={customSelectStyles}
                  isSearchable
                />
              </Col>
              <Col>
                <Label
                  htmlFor="workingOnHoliday"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "Inter, sans-serif",
                    color: theme.colors.primaryGreen,
                    marginBottom: "0.625rem",
                  }}
                >
                  Working on holiday
                </Label>
                <Select
                  id="workingOnHoliday"
                  options={""}
                  value={""}
                  placeholder="Select Days"
                  styles={customSelectStyles}
                  isSearchable
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Label
                  htmlFor="compOff"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "Inter, sans-serif",
                    color: theme.colors.primaryGreen,
                    marginBottom: "0.625rem",
                  }}
                >
                  Comp-off
                </Label>
                <Select
                  id="compOff"
                  options={""}
                  value={""}
                  placeholder="Select"
                  styles={customSelectStyles}
                  isSearchable
                />
              </Col>
              <Col></Col>
            </Row>
          </>
        )}
        <Footer>
          <Button
            text="Delete"
            icon={
              <img
                src={deleteIcon}
                alt="delete"
                style={{ width: "20px", height: "20px" }}
              />
            }
            bg="transparent"
            color={theme.colors.primary}
            border={`1px solid ${theme.colors.primary}`}
            width="200px"
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button
              text="Cancel"
              bg="transparent"
              color={theme.colors.textColor}
              border={`1px solid ${theme.colors.primary}`}
              width="200px"
            />
            <Button
              text="Save"
              bg={theme.colors.primary}
              color="white"
              width="200px"
            />
          </div>
        </Footer>
      </Container>
    </>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 100px);
  position: relative;
`;

const Footer = styled.div`
  padding: 2rem 0 0 0;
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  z-index: 10;
`;

const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: ${theme.colors.primary};
`;

const Row = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 80%;
  margin-bottom: 0.5rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Col = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e0e3e6;
  width: 100%;
  margin: 2rem 0;
`;

const Tag = styled.div`
  background: white;
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: ${theme.colors.textColor};
  font-family: "Inter", sans-serif;
  font-weight: 600;
  gap: 8px;
`;

export default AddShift;
