import React from "react";
import { Routes, Route } from "react-router-dom";
import GlobalStyles from "./theme/GlobalStyles";
import { publicRoutes, privateRoutes } from "./route";
import AdminLayout from "./components/AdminLayout";
import Authmiddleware from "./components/Authmiddleware";

function App() {
  return (
    <>
      <GlobalStyles />
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
                    {child.element}
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
