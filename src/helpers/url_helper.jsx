// Login
export const LOGIN = "/auth/admin-login";

// Dashboard
export const DASHBOARD = "/dashboard/stats";

// Customers
export const CUSTOMERS = "/users";
export const CUSTOMERS_ORDER_HISTORY = "/orders/history";
export const INDIVIDUAL_CUSTOMERS_ORDER_HISTORY = "/orders/history/:id";
export const ORDERS = "/orders/:id";
export const CREATE_ORDERS = "/orders";
export const GET_ALL_EMPLOYEE = "/users?role=employee";
export const ADD_EMPLOYEE = "/users";
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