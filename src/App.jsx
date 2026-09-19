import React from "react";
import { Routes, Route } from "react-router-dom";
import GlobalStyles from "./theme/GlobalStyles";
import { publicRoutes, privateRoutes } from "./route";
import AdminLayout from "./components/AdminLayout";
import Authmiddleware from "./components/Authmiddleware";
import GlobalApiLoader from "./components/GlobalApiLoader";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";

const permissionForPath = (path = "") => {
  if (path.includes("dashboard")) return "dashboard";
  if (path.includes("announcement")) return "announcement";
  if (path.includes("contractors")) return path.includes("payments") || path.includes("payment") || path.includes("pay/") ? "contractorPayments" : path.includes("overview") ? "contractorOverview" : "contractorContractors";
  if (path.includes("people/agents")) return "agents";
  if (path.includes("peopleHub/employees")) return path.includes("create") ? "onboarding" : "employees";
  if (path.includes("peopleHub/teams")) return "teams";
  if (path.includes("peopleHub/branch")) return "branch";
  if (path.includes("peopleHub/hierarchy")) return "hierarchy";
  if (path.includes("off-boarding")) return "offBoarding";
  if (path.includes("time-hub/attendance")) return "attendance";
  if (path.includes("time-hub/timesheet")) return "timesheet";
  if (path.includes("leaveAttendance")) return "leaveAttendance";
  if (path.includes("shiftManagement")) return "shiftManagement";
  if (path.includes("overTime")) return "overtimeManagement";
  if (path.includes("leaderboard")) return "leaderboard";
  if (path.includes("dayOffHolidays")) return "dayOffHolidays";
  if (path.includes("pay-hub/payroll") || path.includes("payslip")) return "payroll";
  if (path.includes("pay-hub/paysheet")) return "paysheet";
  if (path.includes("stopPayroll")) return "stopPayroll";
  if (path.includes("additionDeductions")) return "additionDeductions";
  if (path.includes("settings/generalSettings")) return "generalSettings";
  if (path.includes("organizationDetails")) return "organizationDetails";
  if (path.includes("settings/departments")) return "departments";
  if (path.includes("settings/roles")) return "roles";
  if (path.includes("daySettings")) return "daySettings";
  if (path.includes("seriesConfiguration")) return "seriesConfiguration";
  if (path.includes("help")) return "help";
  return undefined;
};
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <GlobalStyles />
      <GlobalApiLoader />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map((route, idx) => (
          <Route path={route.path} element={route.component} key={idx} />
        ))}

        {/* Protected Routes */}
        {privateRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <Authmiddleware>
                {route.element}
              </Authmiddleware>
            }
          >
            {route.children?.map((child, childIdx) => (
              <Route
                key={`${idx}-${childIdx}`}
                path={child.path}
                element={
                  <Authmiddleware>
                    <ProtectedRoute moduleKey={permissionForPath(child.path)} component={() => child.element} />
                  </Authmiddleware>
                }
              />
            ))} 
          </Route>
        ))}
      </Routes>
    </>
  );
}

export default App;
