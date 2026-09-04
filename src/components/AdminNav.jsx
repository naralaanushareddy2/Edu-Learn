import React from "react";
import { Link } from "react-router-dom";

const AdminNav = () => {
  return (
    <nav className="admin-nav">

      <Link to="/Admin Dashboard">
        Dashboard
      </Link>

      <Link to="/Admin Learning">
        Student Learning
      </Link>

    </nav>
  );
};

export default AdminNav;