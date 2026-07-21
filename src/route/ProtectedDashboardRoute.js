// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedDashboardRoute = ({ children }) => {
//   const { number, isLoggedIn, user, data } = useSelector((state) => state.auth);
//   const ALLOWED_USER_IDS = ["0004086", "0003595"];
//   const serviceNo = String(
//     user?.ServiceNo || data?.[0]?.ServiceNo || number || "",
//   ).trim();
//   const canAccessDashboard = ALLOWED_USER_IDS.includes(serviceNo);
 
//   if (!isLoggedIn) {
//     return <Navigate to="/signin" replace />;
//   }
 
//   if (!canAccessDashboard) {
//     return <Navigate to="/home" replace />;
//   }

//   return children;
// };

// export default ProtectedDashboardRoute;








import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedDashboardRoute = ({ children }) => {
  const { number, isLoggedIn, user, data } = useSelector((state) => state.auth);
  const { headComponent } = useSelector((state) => state.headComponent);
  
  const serviceNo = String(
    user?.ServiceNo || data?.[0]?.ServiceNo || number || "",
  ).trim();
  
  // Check if user has access to Attendance Dashboard component (EMOBCI0013)
  const hasDashboardAccess = headComponent?.some(
    (component) => component.ComponentId === "EMOBCI0013"
  );

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  // If logged in but user doesn't have dashboard access, redirect to home
  if (!hasDashboardAccess) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedDashboardRoute;