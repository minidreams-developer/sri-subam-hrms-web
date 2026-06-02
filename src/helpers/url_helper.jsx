// Login
export const LOGIN = "/v1/auth/login";

// Dashboard
export const DASHBOARD = "/dashboard/stats";

// Branches
export const BRANCHES = "/v1/branches";
export const CREATE_BRANCH = "/v1/branches";
export const GENERATE_BRANCH_ID = "/v1/branches/generate-id";

// Teams
export const TEAMS = "/v1/teams";
export const GENERATE_TEAM_ID = "/v1/teams/generate-id";
export const CREATE_TEAM = "/v1/teams";

// Customers
export const CUSTOMERS = "/users";
export const CUSTOMERS_ORDER_HISTORY = "/orders/history";
export const INDIVIDUAL_CUSTOMERS_ORDER_HISTORY = "/orders/history/:id";
export const ORDERS = "/orders/:id";
export const CREATE_ORDERS = "/orders";
export const GET_ALL_EMPLOYEE = "/users?role=employee";
export const GET_ALL_EMPLOYEES = "/v1/users";
export const ADD_EMPLOYEE = "/users";
export const CREATE_EMPLOYEE = "/v1/users";
export const CREATE_EMPLOYEE_NEW = "/v1/employees";
export const EMPLOYEE_REGISTRATION = "/v1/users/employee-registration";
export const GENERATE_EMPLOYEE_ID = "/v1/users/generate-employeeId";

// Departments
export const DEPARTMENTS = "/v1/departments";
export const GENERATE_DEPARTMENT_ID = "/v1/departments/generate-id";
export const CREATE_DEPARTMENT = "/v1/departments";
export const GET_DEPARTMENT = "/v1/departments/:departmentId";
export const UPDATE_DEPARTMENT = "/v1/departments/:departmentId";
export const DELETE_DEPARTMENT = "/v1/departments/:departmentId";
export const PRODUCTS = "/products";
export const PLACES = '/places';
export const PLACES_STATS ='/places/stats';
export const PAYMENTS ='/payments';
export const PENDING_PAYMENTS ='/payments/pending/users';
export const ANALYTICS_TOTAL = '/dashboard/revenue/total';
export const ANALYTICS_MONTHLY = '/dashboard/revenue/monthly';
export const ANALYTICS_PRODUCT = '/dashboard/revenue/top-products';
export const GET_DELIVERIES = '/deliveries';
export const FILTER_VALUES = '/deliveries/available';
export const DELIVERY_STATUS = '/deliveries/stats';

// shift management oda api 

export const GENERATE_SHIFT_ID = "/v1/shifts/generate-id";
export const CREATE_SHIFT = "/v1/shifts";
export const GET_SHIFTS = "/v1/shifts";
export const GET_SHIFT_DETAILS = "/v1/shifts/:shiftId";

// OffBoarding API
export const OFFBOARD = "/v1/off-board";
export const CREATE_OFFBOARD = "/v1/off-board";
export const GET_OFFBOARDS = "/v1/off-board";
export const GET_OFFBOARD_BY_ID = "/v1/off-board/:offBoardId";
export const GET_OFFBOARD_BY_USER = "/v1/off-board/user/:userId";
export const UPDATE_OFFBOARD = "/v1/off-board/:offBoardId";
export const DELETE_OFFBOARD = "/v1/off-board/:offBoardId";
export const SEND_OTP = "/v1/off-board/:offBoardId/send-otp";
export const VERIFY_OTP = "/v1/off-board/:offBoardId/verify-otp";

// Leave Requests API
export const LEAVE_REQUESTS = "/v1/leave-requests";
export const CREATE_LEAVE_REQUEST = "/v1/leave-requests";
export const GET_LEAVE_REQUESTS = "/v1/leave-requests";
export const GET_LEAVE_REQUEST_BY_ID = "/v1/leave-requests/:leaveRequestId";
export const GET_LEAVE_REQUESTS_BY_EMPLOYEE = "/v1/leave-requests/employee/:employeeId";
export const UPDATE_LEAVE_REQUEST = "/v1/leave-requests/:leaveRequestId";
export const UPDATE_LEAVE_REQUEST_STATUS = "/v1/leave-requests/:leaveRequestId/status";
export const DELETE_LEAVE_REQUEST = "/v1/leave-requests/:leaveRequestId";

// Holidays API
export const HOLIDAYS = "/v1/holidays";
export const CREATE_HOLIDAY = "/v1/holidays";
export const GET_HOLIDAYS = "/v1/holidays";
export const GET_HOLIDAY_BY_ID = "/v1/holidays/:holidayId";
export const UPDATE_HOLIDAY = "/v1/holidays/:holidayId";
export const DELETE_HOLIDAY = "/v1/holidays/:holidayId";
export const ADD_PERSON_TO_HOLIDAY = "/v1/holidays/:holidayId/people";
export const REMOVE_PERSON_FROM_HOLIDAY = "/v1/holidays/:holidayId/people";

// Leaderboard API
export const LEADERBOARD = "/v1/leaderboard";
export const CREATE_LEADERBOARD = "/v1/leaderboard";
export const GET_LEADERBOARD = "/v1/leaderboard";
export const GET_LEADERBOARD_BY_ID = "/v1/leaderboard/:leaderboardId";
export const GET_LEADERBOARD_BY_USER = "/v1/leaderboard/user/:userId";
export const UPDATE_LEADERBOARD = "/v1/leaderboard/:leaderboardId";
export const DELETE_LEADERBOARD = "/v1/leaderboard/:leaderboardId";

// Attendance API
export const ATTENDANCE_RECORDS = "/v1/attendance";
export const CREATE_ATTENDANCE = "/v1/attendance";
export const GET_ATTENDANCE_RECORDS = "/v1/attendance";
export const GET_ATTENDANCE_BY_ID = "/v1/attendance/:attendanceId";
export const GET_ATTENDANCE_BY_EMPLOYEE = "/v1/attendance/employee/:employeeId";
export const UPDATE_ATTENDANCE = "/v1/attendance/:attendanceId";
export const DELETE_ATTENDANCE = "/v1/attendance/:attendanceId";
export const GET_ATTENDANCE_STATS = "/v1/attendance/stats";

// Overtime API
export const OVERTIME_RECORDS = "/v1/overtime";
export const CREATE_OVERTIME = "/v1/overtime";
export const GET_OVERTIME_RECORDS = "/v1/overtime";
export const GET_OVERTIME_BY_ID = "/v1/overtime/:overtimeId";
export const GET_OVERTIME_BY_EMPLOYEE = "/v1/overtime/employee/:employeeId";
export const UPDATE_OVERTIME = "/v1/overtime/:overtimeId";
export const DELETE_OVERTIME = "/v1/overtime/:overtimeId";
export const GET_OVERTIME_STATS = "/v1/overtime/stats";