import api from "../helpers/api_helper";

export const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

const data = (request) => request.then((response) => response.data);
const list = (url, params, config = {}) =>
  data(api.get(url, { ...config, params: cleanParams(params) }));

// Authentication and permissions
export const login = (payload) => data(api.post("/v1/auth/login", payload));

export const getRoles = (params, config) => list("/v1/roles", params, config);

export const createRole = (payload) => data(api.post("/v1/roles", payload));

export const updateRole = (id, payload) =>
  data(api.patch(`/v1/roles/${id}`, payload));

export const deleteRole = (id) => data(api.delete(`/v1/roles/${id}`));

// Users, employees, staff, and agents
export const getUsers = (params, config) => list("/v1/users", params, config);

export const getUser = (id, config) => data(api.get(`/v1/users/${id}`, config));

export const getEmployeeByEmployeeId = (employeeId, config) =>
  data(api.get(`/v1/users/employee/${encodeURIComponent(employeeId)}`, config));

export const getUserCount = (params, config) =>
  list("/v1/users/count", params, config);

export const createEmployee = (payload) =>
  data(api.post("/v1/users/employee-registration", payload));

export const updateUser = (id, payload, config) =>
  data(api.patch(`/v1/users/${id}`, payload, config));

export const updateUserFormData = (id, payload, config = {}, onProgress) =>
  data(
    api.patch(`/v1/users/${id}`, payload, {
      ...config,
      headers: { "Content-Type": "multipart/form-data", ...config.headers },
      onUploadProgress: (event) =>
        event.total &&
        onProgress?.(Math.round((event.loaded * 100) / event.total)),
    }),
  );
export const deleteUser = (id) => data(api.delete(`/v1/users/${id}`));
export const generateEmployeeId = (config) =>
  data(api.get("/v1/users/generate-employeeId", config));

export const generateStaffId = (config) =>
  data(api.get("/v1/users/generate-staffId", config));

export const generateAgentId = (config) =>
  data(api.get("/v1/users/generate-agentId", config));

export const getAgentMembers = (agentId, params, config) =>
  list(`/v1/users/agent/${agentId}/members`, params, config);

// Branches
export const getBranches = (params, config) =>
  list("/v1/branches", params, config);

export const getBranchDropdown = (config) =>
  data(api.get("/v1/branches/dropdown", config));

export const generateBranchId = () => data(api.get("/v1/branches/generate-id"));

export const createBranch = (payload) =>
  data(api.post("/v1/branches", payload));

export const updateBranch = (id, payload) =>
  data(api.patch(`/v1/branches/${id}`, payload));

export const deleteBranch = (id) => data(api.delete(`/v1/branches/${id}`));

// Departments
export const getDepartments = (params, config) =>
  list("/v1/departments", params, config);

export const getDepartment = (id) => data(api.get(`/v1/departments/${id}`));
export const generateDepartmentId = () =>
  data(api.get("/v1/departments/generate-id"));

export const createDepartment = (payload) =>
  data(api.post("/v1/departments", payload));

export const updateDepartment = (id, payload) =>
  data(api.patch(`/v1/departments/${id}`, payload));

export const deleteDepartment = (id) =>
  data(api.delete(`/v1/departments/${id}`));

// Teams
export const getTeams = (params, config) => list("/v1/teams", params, config);

export const getTeam = (id) => data(api.get(`/v1/teams/${id}`));

export const generateTeamId = () => data(api.get("/v1/teams/generate-id"));

export const createTeam = (payload) => data(api.post("/v1/teams", payload));

export const updateTeam = (id, payload) =>
  data(api.patch(`/v1/teams/${id}`, payload));

export const deleteTeam = (id) => data(api.delete(`/v1/teams/${id}`));

// Shifts
export const getShifts = (params, config) => list("/v1/shifts", params, config);

export const getShift = (id) => data(api.get(`/v1/shifts/${id}`));

export const generateShiftId = () => data(api.get("/v1/shifts/generate-id"));

export const createShift = (payload) => data(api.post("/v1/shifts", payload));

export const updateShift = (id, payload) =>
  data(api.patch(`/v1/shifts/${id}`, payload));

export const deleteShift = (id) => data(api.delete(`/v1/shifts/${id}`));

// Attendance, leave, overtime, holidays, and rosters
export const getAttendance = (params) => list("/v1/attendance", params);

export const createAttendance = (payload) =>
  data(api.post("/v1/attendance", payload));

export const getLeaveRequests = (params) => list("/v1/leave-requests", params);

export const createLeaveRequest = (payload) =>
  data(api.post("/v1/leave-requests", payload));

export const updateLeaveRequest = (id, payload) =>
  data(api.patch(`/v1/leave-requests/${id}`, payload));

export const deleteLeaveRequest = (id) =>
  data(api.delete(`/v1/leave-requests/${id}`));
export const getOvertimeRecords = (params) => list("/v1/overtime", params);

export const createOvertime = (payload) =>
  data(api.post("/v1/overtime", payload));

export const updateOvertime = (id, payload) =>
  data(api.patch(`/v1/overtime/${id}`, payload));

export const getHolidays = (params) => list("/v1/holidays", params);

export const createHoliday = (payload) =>
  data(api.post("/v1/holidays", payload));

export const updateHoliday = (id, payload) =>
  data(api.patch(`/v1/holidays/${id}`, payload));

export const deleteHoliday = (id) => data(api.delete(`/v1/holidays/${id}`));

export const getRosters = (params) => list("/v1/rosters", params);

export const createRoster = (payload) => data(api.post("/v1/rosters", payload));

export const updateRoster = (id, payload) =>
  data(api.patch(`/v1/rosters/${id}`, payload));

export const deleteRoster = (id) => data(api.delete(`/v1/rosters/${id}`));

// Payroll, paysheets, and adjustments
export const getPayroll = (params) => list("/v1/payroll", params);

export const createPayroll = (payload) =>
  data(api.post("/v1/payroll", payload));

export const getStoppedPayroll = (params) =>
  list("/v1/payroll/stopped", params);

export const stopPayroll = (employeeId, payload) =>
  data(api.post(`/v1/payroll/${employeeId}/stop`, payload));

export const getPaysheetQuickStats = (params) =>
  list("/v1/paysheets/quick-stats", params);

export const getPaysheetOverview = (params) =>
  list("/v1/paysheets/payroll-overview", params);

export const getPaysheetBreakdown = (params) =>
  list("/v1/paysheets/payroll-breakdown", params);

export const getPaysheets = (params) => list("/v1/paysheets/list", params);

export const getAdjustments = (params) => list("/v1/adjustments", params);

export const getPendingAdjustments = (params) =>
  list("/v1/adjustments/pending", params);

export const getAdjustmentStats = (params) =>
  list("/v1/adjustments/quick-stats", params);

export const createAdjustment = (payload) =>
  data(api.post("/v1/adjustments", payload));

// Offboarding, leaderboard, dashboard, and settings
export const getOffboards = (params) => list("/v1/off-board", params);

export const getOffboard = (id) => data(api.get(`/v1/off-board/${id}`));

export const createOffboard = (payload) =>
  data(api.post("/v1/off-board", payload));

export const deleteOffboard = (id) => data(api.delete(`/v1/off-board/${id}`));

export const getLeaderboard = (params) => list("/v1/leaderboard", params);

export const getDashboard = () => data(api.get("/v1/dashboard"));

export const getOrganizations = (params) => list("/v1/organizations", params);

export const createOrganization = (payload) =>
  data(api.post("/v1/organizations", payload));

export const getDaySettings = (params) => list("/v1/day-settings", params);

export const createDaySettings = (payload) =>
  data(api.post("/v1/day-settings", payload));

export const updateDaySettings = (id, payload) =>
  data(api.patch(`/v1/day-settings/${id}`, payload));

export const getSeriesConfigurations = (params) =>
  list("/v1/seriesConfiguration", params);

export const createSeriesConfiguration = (payload) =>
  data(api.post("/v1/seriesConfiguration", payload));

// Assets, announcements, and contractors
export const getEmployeeAssets = (employeeId, params) =>
  list(`/v1/assets/employee/${employeeId}`, params);

export const createAsset = (payload) => data(api.post("/v1/assets", payload));
export const updateAsset = (id, payload) =>
  data(api.patch(`/v1/assets/${id}`, payload));

export const assignAsset = (assetId, employeeId, payload) =>
  data(api.patch(`/v1/assets/${assetId}/assign/${employeeId}`, payload));

export const getAnnouncements = (params) => list("/v1/announcements", params);

export const createAnnouncement = (payload) =>
  data(api.post("/v1/announcements", payload));

export const updateAnnouncement = (id, payload) =>
  data(api.patch(`/v1/announcements/${id}`, payload));

export const deleteAnnouncement = (id) =>
  data(api.delete(`/v1/announcements/${id}`));

export const getContractors = (params) => list("/v1/contractors", params);

export const generateContractorId = () =>
  data(api.get("/v1/contractors/generate-id"));

export const getContractor = (id) => data(api.get(`/v1/contractors/${id}`));

export const createContractor = (payload) =>
  data(api.post("/v1/contractors/register", payload));

export const updateContractor = (id, payload) =>
  data(api.patch(`/v1/contractors/${id}`, payload));

export const deleteContractor = (id) =>
  data(api.delete(`/v1/contractors/${id}`));

export const createWorkEntry = (payload) =>
  data(api.post("/v1/log-work", payload));

export const searchCart = (query) => list("/v1/cart", { search: query });

export const uploadMediaFile = (formData, onProgress) =>
  data(
    api.post("/v1/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) =>
        event.total &&
        onProgress?.(Math.round((event.loaded * 100) / event.total)),
    }),
  );
