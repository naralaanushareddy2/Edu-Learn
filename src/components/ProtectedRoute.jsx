import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ adminOnly = false }) => {

  const user = useSelector(
    (state) => state.auth.user
  );

  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );


  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user || !isAuthenticated) {

    return (
      <Navigate
        to="/Login"
        replace
      />
    );

  }


  // =====================================================
  // ADMIN ONLY
  // =====================================================

  if (
    adminOnly &&
    user.role !== "admin"
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  return <Outlet />;

};

export default ProtectedRoute;