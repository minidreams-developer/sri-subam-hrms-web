// Login
export const LOGIN = "/v1/auth/login";

// Dashboard
export const DASHBOARD = "/dashboard/stats";

// Branches
export const BRANCHES = "/v1/branches";
export const CREATE_BRANCH = "/v1/branches";

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