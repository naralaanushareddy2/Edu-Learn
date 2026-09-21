import { Link, useLocation } from "react-router-dom";
import { FiUsers, FiBookOpen } from "react-icons/fi";

const AdminNav = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const isUsersTab = currentPath === "/admin" || currentPath === "/admin dashboard";
  const isLearningTab = currentPath === "/adminlearning" || currentPath === "/admin learning";

  return (
    <nav className="admin-nav-tabs" aria-label="Admin Navigation">
      <Link
        to="/admin"
        className={`admin-nav-tab ${isUsersTab ? "active" : ""}`}
      >
        <FiUsers className="admin-nav-tab-icon" />
        <span>User Management</span>
      </Link>

      <Link
        to="/AdminLearning"
        className={`admin-nav-tab ${isLearningTab ? "active" : ""}`}
      >
        <FiBookOpen className="admin-nav-tab-icon" />
        <span>Student Learning Monitor</span>
      </Link>
    </nav>
  );
};

export default AdminNav;