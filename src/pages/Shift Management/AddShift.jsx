import { Label } from "reactstrap";
import theme from "../../theme/theme";
import styled from "styled-components";
import InputComponent from "../../components/InputComponent";
import Select from "react-select";
import { useState, useEffect } from "react";
import { customSelectStyles } from "../../theme/reactSelectStyles";
import TimeInputComponent from "../../components/TimeInputComponent";
import Button from "../../components/Button";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import deleteIcon from "../../assets/images/shift/delete.svg";
import Switch from "react-switch";
import CalenderInput from "../../components/CalenderInput";
import { createShift, generateShiftId as requestShiftId, getShift, updateShift } from "../../services/apiServices";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

const AddShift = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shiftIdFromUrl = searchParams.get("id");
  const [shiftId, setShiftId] = useState(null);
  const isEditMode = !!shiftId;

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
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);

  // Basic Details
  const [shiftCode, setShiftCode] = useState("");
  const [shiftName, setShiftName] = useState("");

  // Generate shift code on component mount or fetch shift details if editing
  useEffect(() => {
    if (shiftIdFromUrl) {
      setShiftId(shiftIdFromUrl);
    }
  }, [shiftIdFromUrl]);

  // Generate shift code on component mount or fetch shift details if editing
  useEffect(() => {
    if (isEditMode) {
      fetchShiftDetails();
    } else {
      generateShiftId();
    }
  }, [isEditMode, shiftId]);

  // GET /v1/shifts/generate-id - Fetch unique shift code
  const generateShiftId = async () => {
    setIsGeneratingId(true);
    try {
      console.log("Fetching shift code from GET /v1/shifts/generate-id");
      const response = await requestShiftId();
      console.log("Shift code generated:", response);

      if (response?.shiftCode) {
        setShiftCode(response.shiftCode);
        console.log("Shift code set to:", response.shiftCode);
      } else {
        toast.error("No shift code received from server");
      }
    } catch (error) {
      console.error("Error generating shift ID:", error);
      toast.error("Failed to generate shift ID");
    } finally {
      setIsGeneratingId(false);
    }
  };

  // Fetch shift details when editing
  const fetchShiftDetails = async () => {
    setIsGeneratingId(true);
    try {
      const response = await getShift(shiftId);
      console.log("Shift details fetched:", response);

      // Populate form with shift data
      if (response) {
        // Basic Details
        setShiftCode(response.shiftCode || "");
        setShiftName(response.shiftName || "");

        // Shift Type
        if (response.shiftType) {
          const normalizedShiftType = response.shiftType.toLowerCase();
          setShiftType({
            value: normalizedShiftType,
            label: normalizedShiftType.charAt(0).toUpperCase() + normalizedShiftType.slice(1),
          });
        }

        // Same timing for all days
        if (response.sameTimingForAllDays !== undefined) {
          setSameTiming({ value: response.sameTimingForAllDays ? "yes" : "no", label: response.sameTimingForAllDays ? "Yes" : "No" });
        }

        // Shift Timing
        if (response.timings && response.timings.length > 0) {
          const firstWorkingTiming = response.timings.find((timing) => !timing.off);
          if (firstWorkingTiming) {
            setStartTime(firstWorkingTiming.startTime || "");
            setEndTime(firstWorkingTiming.endTime || "");
          }
        }

        setTotalShiftDuration(response.totalShiftDuration || "");
        setMinimumWorkingHours(response.minWorkingHours || "");
        setHalfDayWorkingHours(response.halfDayWorkingHours || "");
        setOvertimeAfterHours(response.overtimeAfterHours?.toString() || "8");

        // Grace Periods
        if (response.gracePeriod) {
          setGracePeriodEarlyCheckin(response.gracePeriod.earlyCheckIn?.toString() || "");
          setGracePeriodLateCheckin(response.gracePeriod.lateCheckIn?.toString() || "");
          setGracePeriodEarlyCheckout(response.gracePeriod.earlyCheckOut?.toString() || "");
          setGracePeriodLateCheckout(response.gracePeriod.lateCheckOut?.toString() || "");
        }

        // Break Management
        if (response.breakManagement) {
          setBreakManagementEnabled(response.breakManagement.enabled || false);
          setMultipleBreaks(
            response.breakManagement.multipleBreaksSupport
              ? { value: "yes", label: "Yes" }
              : { value: "no", label: "No" }
          );

          // Populate break details
          if (response.breakManagement.breaks && response.breakManagement.breaks.length > 0) {
            const breaksArray = response.breakManagement.breaks.map((b, index) => ({
              id: index + 1,
            }));
            setBreaks(breaksArray);

            const breakDetailsMap = {};
            response.breakManagement.breaks.forEach((b, index) => {
              breakDetailsMap[index + 1] = {
                name: b.name || "",
                duration: b.duration || "",
                startTime: b.startTime || "",
                endTime: b.endTime || "",
              };
            });
            setBreakDetails(breakDetailsMap);
          }
        }

        // Attendance Rules
        if (response.attendanceRules) {
          setLateMarkAfter(response.attendanceRules.lateMarkAfter?.toString() || "");
          setAutoHalfDayAfter(response.attendanceRules.autoHalfDayAfterLate?.toString() || "");
          setAutoAbsentIfWorkingHours(response.attendanceRules.autoAbsentIfWorkingHours?.toString() || "");
          setOvertimeEligibility(
            response.attendanceRules.overtimeEligibility
              ? { value: "yes", label: "Yes" }
              : { value: "no", label: "No" }
          );
        }

        // Weekly Pattern
        if (response.weekOff) {
          const offDays = response.weekOff.map((day) => ({ value: day, label: day }));
          setFixedDays(offDays.length > 0 ? offDays : null);
        }

        if (response.compOff && response.compOff.length > 0) {
          setCompOff({ value: response.compOff[0], label: response.compOff[0] === "yes" ? "Yes" : "No" });
        }

        // Set effective start date if available
        if (response.effectiveStartDate) {
          setEffectiveStartDate(new Date(response.effectiveStartDate));
        }

        // Handle selected shifts for rotational shifts
        if (response.shiftType === "rotational" && response.selectedShifts) {
          const shiftsArray = response.selectedShifts.map(shift => ({
            value: shift.toLowerCase(),
            label: shift.charAt(0).toUpperCase() + shift.slice(1),
          }));
          setSelectedShifts(shiftsArray);
        }
      }
    } catch (error) {
      console.error("Error fetching shift details:", error);
      toast.error("Failed to load shift details");
    } finally {
      setIsGeneratingId(false);
    }
  };

  // Break Management
  const [breakType, setBreakType] = useState(null);
  const [breakDuration, setBreakDuration] = useState("");
  const [multipleBreaks, setMultipleBreaks] = useState(null);

  // Shift Timing
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalShiftDuration, setTotalShiftDuration] = useState("");
  const [minimumWorkingHours, setMinimumWorkingHours] = useState("");
  const [halfDayWorkingHours, setHalfDayWorkingHours] = useState("");

  // Grace Periods
  const [gracePeriodEarlyCheckin, setGracePeriodEarlyCheckin] = useState("");
  const [gracePeriodLateCheckin, setGracePeriodLateCheckin] = useState("");
  const [gracePeriodEarlyCheckout, setGracePeriodEarlyCheckout] = useState("");
  const [gracePeriodLateCheckout, setGracePeriodLateCheckout] = useState("");

  // Break Details
  const [breakDetails, setBreakDetails] = useState({});

  // Attendance Rules
  const [lateMarkAfter, setLateMarkAfter] = useState("");
  const [autoHalfDayAfter, setAutoHalfDayAfter] = useState("");
  const [autoAbsentIfWorkingHours, setAutoAbsentIfWorkingHours] = useState("");
  const [overtimeEligibility, setOvertimeEligibility] = useState(null);
  const [overtimeAfterHours, setOvertimeAfterHours] = useState("8");

  // Weekly Pattern
  const [fixedDays, setFixedDays] = useState(null);
  const [workingOnHoliday, setWorkingOnHoliday] = useState(null);
  const [compOff, setCompOff] = useState(null);

  const normalizeWorkingHours = (value) => {
    const input = String(value ?? "").trim().toLowerCase();
    if (!input) return "";
    const clockMatch = input.match(/^(\d{1,2})(?::(\d{1,2}))?$/);
    if (clockMatch) {
      const hours = Number(clockMatch[1]);
      const minutes = Number(clockMatch[2] || 0);
      if (minutes <= 59 && hours <= 24 && (hours < 24 || minutes === 0)) {
        return `${Number((hours + minutes / 60).toFixed(2))}h`;
      }
    }
    const hoursMatch = input.match(/^(\d+(?:\.\d+)?)\s*(?:h|hrs?|hours?)?$/);
    if (hoursMatch && Number(hoursMatch[1]) <= 24) return `${Number(hoursMatch[1])}h`;
    return null;
  };

  const formatTimeForPayload = (value) => {
    if (!value) return "";
    if (typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return value;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // Keep the duration in sync with the selected shift times. Only the time
  // portion is used because the time picker assigns today's date to both values.
  useEffect(() => {
    if (!startTime || !endTime) return;

    const start = startTime instanceof Date ? startTime : new Date(startTime);
    const end = endTime instanceof Date ? endTime : new Date(endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;

    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const durationMinutes = endMinutes > startMinutes
      ? endMinutes - startMinutes
      : endMinutes + 24 * 60 - startMinutes;
    const durationHours = durationMinutes / 60;

    setTotalShiftDuration(`${durationHours.toFixed(2)} Hrs`);
  }, [startTime, endTime]);

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

  const handleSaveShift = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!shiftCode.trim()) {
        toast.error("Shift Code is required");
        setIsLoading(false);
        return;
      }
      if (!shiftName.trim()) {
        toast.error("Shift Name is required");
        setIsLoading(false);
        return;
      }

      // Validate shift type specific requirements
      if (shiftType?.value === "fixed" && sameTiming?.value === "yes") {
        if (!startTime || !endTime) {
          toast.error("Start Time and End Time are required");
          setIsLoading(false);
          return;
        }
      }

      // Build timings array for fixed shifts
      let timingsArray = [];
      if (shiftType?.value === "fixed") {
        if (sameTiming?.value === "yes") {
          // Same timing for all days
          timingsArray = weekDays.map((day) => {
            const isWeekOff = fixedDays?.some((fixedDay) => fixedDay.value === day);
            return {
              day,
              startTime: isWeekOff ? "" : formatTimeForPayload(startTime),
              endTime: isWeekOff ? "" : formatTimeForPayload(endTime),
              off: isWeekOff,
            };
          });
        } else {
          // Different timing per day - use the same start/end for now
          timingsArray = weekDays.map((day) => {
            const isWeekOff = fixedDays?.some((fixedDay) => fixedDay.value === day);
            return {
              day,
              startTime: isWeekOff ? "" : formatTimeForPayload(startTime),
              endTime: isWeekOff ? "" : formatTimeForPayload(endTime),
              off: isWeekOff,
            };
          });
        }
      }

      // Build the payload matching API structure
      const normalizedMinimumWorkingHours = normalizeWorkingHours(minimumWorkingHours);
      const normalizedHalfDayWorkingHours = normalizeWorkingHours(halfDayWorkingHours || "0");
      if (!normalizedMinimumWorkingHours || !normalizedHalfDayWorkingHours) {
        toast.error("Working hours must be between 0 and 24 hours (for example, 7.5h or 3:30)");
        setIsLoading(false);
        return;
      }

      const payload = {
        shiftCode,
        shiftName,
        shiftType: shiftType?.label || "Fixed",
        sameTimingForAllDays: sameTiming?.value === "yes",
        totalShiftDuration: normalizeWorkingHours(totalShiftDuration) || "0h",
        minWorkingHours: normalizedMinimumWorkingHours,
        halfDayWorkingHours: normalizedHalfDayWorkingHours,
        overtimeAfterHours: Number(overtimeAfterHours) || 0,
        timings: timingsArray,
        breakManagement: {
          enabled: breakManagementEnabled,
          multipleBreaksSupport: multipleBreaks?.value === "yes",
          breaks: breakManagementEnabled
            ? breaks.map((b) => ({
                name: breakDetails[b.id]?.name || "",
                duration: breakDetails[b.id]?.duration || "0",
                startTime: breakDetails[b.id]?.startTime || "",
                endTime: breakDetails[b.id]?.endTime || "",
              }))
            : [],
        },
        gracePeriod: {
          earlyCheckIn: parseInt(gracePeriodEarlyCheckin) || 0,
          lateCheckIn: parseInt(gracePeriodLateCheckin) || 0,
          earlyCheckOut: parseInt(gracePeriodEarlyCheckout) || 0,
          lateCheckOut: parseInt(gracePeriodLateCheckout) || 0,
        },
        attendanceRules: {
          lateMarkAfter: parseInt(lateMarkAfter) || 0,
          autoHalfDayAfterLate: parseInt(autoHalfDayAfter) || 0,
        },
        weekOff: fixedDays
          ? fixedDays.map((d) => d.value)
          : [],
        compOff: [compOff?.value || "no"],
        isShiftActive: true,
      };

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      let response;
      if (isEditMode && shiftId) {
        // Use PATCH for update
        console.log("Updating shift:", shiftId);
        console.log("Shift ID:", shiftId);
        response = await updateShift(shiftId, payload);
        console.log("Shift update response:", response);
        toast.success("Shift updated successfully!");
      } else {
        // Use POST for create
        console.log("Creating new shift...");
        response = await createShift(payload);
        console.log("Shift creation response:", response);
        toast.success("Shift created successfully!");
      }

      if (response) {
        // Navigate immediately to ShiftManagement page
        navigate("/admin/time-hub/shiftManagement");
      }
    } catch (error) {
      console.error("Error saving shift:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save shift";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            <CodeInputWrapper>
              <InputComponent
                label="Shift Code"
                placeholder="Auto-generated"
                labelMargin="0 0 0.625rem 0"
                height="45px"
                value={shiftCode}
                onChange={(e) => setShiftCode(e.target.value)}
                disabled
              />
              <RegenerateButton
                onClick={generateShiftId}
                disabled={isGeneratingId}
                title="Fetch a new shift code"
              >
                {isGeneratingId ? "..." : "↻"}
              </RegenerateButton>
            </CodeInputWrapper>
          </Col>
          <Col>
            <InputComponent
              label="Shift Name"
              placeholder="Enter Name"
              labelMargin="0 0 0.625rem 0"
              height="45px"
              value={shiftName}
              onChange={(e) => setShiftName(e.target.value)}
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
                      onTimeSelect={(time) => setStartTime(time)}
                      initialTime={startTime}
                    />
                  </Col>
                  <Col>
                    <TimeInputComponent
                      label="End Time"
                      placeholder="End Time"
                      onTimeSelect={(time) => setEndTime(time)}
                      initialTime={endTime}
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
                    onTimeSelect={(time) => setStartTime(time)}
                    initialTime={startTime}
                  />
                </Col>
                <Col>
                  <TimeInputComponent
                    label="End Time"
                    placeholder="End Time"
                    onTimeSelect={(time) => setEndTime(time)}
                    initialTime={endTime}
                  />
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <InputComponent
                  label="Total Shift Duration "
                  placeholder="Select start and end time"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  value={totalShiftDuration}
                  readOnly
                />
              </Col>
              <Col>
                <InputComponent
                  label="Minimum working hours"
                  placeholder="Enter Minimum working hours"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  value={minimumWorkingHours}
                  onChange={(e) => setMinimumWorkingHours(e.target.value)}
                />
              </Col>
              <Col>
                <InputComponent
                  label="Half-day working hours"
                  placeholder="e.g. 3.5h or 3:30 (max 24h)"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  value={halfDayWorkingHours}
                  onChange={(e) => setHalfDayWorkingHours(e.target.value)}
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
                  value={gracePeriodEarlyCheckin}
                  onChange={(e) => setGracePeriodEarlyCheckin(e.target.value)}
                />
              </Col>
              <Col>
                <InputComponent
                  label="Grace Period (Late check-in)"
                  placeholder="In min"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  suffix="Min"
                  value={gracePeriodLateCheckin}
                  onChange={(e) => setGracePeriodLateCheckin(e.target.value)}
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
                  value={gracePeriodEarlyCheckout}
                  onChange={(e) => setGracePeriodEarlyCheckout(e.target.value)}
                />
              </Col>
              <Col>
                <InputComponent
                  label="Grace Period (Late check-out)"
                  placeholder="In min"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  suffix="Min"
                  value={gracePeriodLateCheckout}
                  onChange={(e) => setGracePeriodLateCheckout(e.target.value)}
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
            <Row>
              <Col>
                <Label
                  htmlFor="breakType"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "Inter, sans-serif",
                    color: theme.colors.primaryGreen,
                    marginBottom: "0.625rem",
                  }}
                >
                  Break Type
                </Label>
                <Select
                  id="breakType"
                  options={[
                    { value: "paid", label: "Paid" },
                    { value: "unpaid", label: "Unpaid" },
                  ]}
                  value={breakType}
                  onChange={setBreakType}
                  placeholder="Select Type"
                  styles={customSelectStyles}
                  isSearchable
                />
              </Col>
              <Col>
                <InputComponent
                  label="Break duration"
                  placeholder="In Min"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  suffix="Min"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Label
                  htmlFor="multipleBreaks"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "Inter, sans-serif",
                    color: theme.colors.primaryGreen,
                    marginBottom: "0.625rem",
                  }}
                >
                  Multiple breaks support (Lunch, Tea, etc.)
                </Label>
                <Select
                  id="multipleBreaks"
                  options={shiftOptions}
                  value={multipleBreaks}
                  onChange={setMultipleBreaks}
                  placeholder="Select Type"
                  styles={customSelectStyles}
                  isSearchable
                />
              </Col>
              <Col></Col>
            </Row>
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
                      value={breakDetails[breakItem.id]?.name || ""}
                      onChange={(e) =>
                        setBreakDetails({
                          ...breakDetails,
                          [breakItem.id]: {
                            ...breakDetails[breakItem.id],
                            name: e.target.value,
                          },
                        })
                      }
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
                      options={[
                        { value: "15", label: "15 mins" },
                        { value: "30", label: "30 mins" },
                        { value: "45", label: "45 mins" },
                        { value: "60", label: "60 mins" },
                      ]}
                      value={
                        breakDetails[breakItem.id]?.duration
                          ? {
                              value: breakDetails[breakItem.id]?.duration,
                              label: `${breakDetails[breakItem.id]?.duration} mins`,
                            }
                          : null
                      }
                      onChange={(option) =>
                        setBreakDetails({
                          ...breakDetails,
                          [breakItem.id]: {
                            ...breakDetails[breakItem.id],
                            duration: option?.value,
                          },
                        })
                      }
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
                      onTimeSelect={(time) =>
                        setBreakDetails({
                          ...breakDetails,
                          [breakItem.id]: {
                            ...breakDetails[breakItem.id],
                            startTime: time,
                          },
                        })
                      }
                      initialTime={breakDetails[breakItem.id]?.startTime || ""}
                    />
                  </Col>
                  <Col>
                    <TimeInputComponent
                      label="End Time"
                      placeholder="End Time"
                      onTimeSelect={(time) =>
                        setBreakDetails({
                          ...breakDetails,
                          [breakItem.id]: {
                            ...breakDetails[breakItem.id],
                            endTime: time,
                          },
                        })
                      }
                      initialTime={breakDetails[breakItem.id]?.endTime || ""}
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
                  value={lateMarkAfter}
                  onChange={(e) => setLateMarkAfter(e.target.value)}
                />
              </Col>
              <Col>
                <InputComponent
                  label="Auto half-day after X mins late"
                  placeholder="In Min"
                  labelMargin="0 0 0.625rem 0"
                  height="45px"
                  suffix="Min"
                  value={autoHalfDayAfter}
                  onChange={(e) => setAutoHalfDayAfter(e.target.value)}
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
                  value={autoAbsentIfWorkingHours}
                  onChange={(e) => setAutoAbsentIfWorkingHours(e.target.value)}
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
                  options={shiftOptions}
                  value={overtimeEligibility}
                  onChange={setOvertimeEligibility}
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
                  options={weekDays.map((day) => ({ value: day, label: day }))}
                  isMulti
                  value={fixedDays}
                  onChange={setFixedDays}
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
                  options={shiftOptions}
                  value={workingOnHoliday}
                  onChange={setWorkingOnHoliday}
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
                  options={shiftOptions}
                  value={compOff}
                  onChange={setCompOff}
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
              onClick={handleSaveShift}
              disabled={isLoading}
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
  width: 100%;
  color: #10272b;
`;

const Footer = styled.div`
  width: 100%;
  padding: 1.75rem 0 0;
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  z-index: 10;

  button {
    min-height: 42px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 1rem;
    align-items: stretch;

    > div {
      width: 100%;
      flex-direction: column;
    }

    button {
      width: 100% !important;
    }
  }
`;

const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1rem;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  margin: 0 0 1.25rem 0;
  color: ${theme.colors.primary};
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  width: 80%;
  margin-bottom: 0.75rem;
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
  min-width: 0;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e0e3e6;
  width: 100%;
  margin: 1.75rem 0 2rem;
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

const CodeInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
`;

const RegenerateButton = styled.button`
  padding: 0.75rem 1rem;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.625rem;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.2s;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 45px;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark || "#0a5f5f"};
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default AddShift;
