import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaTasks, FaUser, FaHome, FaBox, FaTag, FaList } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { logoutAPI } from '../API/api.js';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async() => {
    await logoutAPI();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4>Admin Panel</h4>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <FaHome className="icon" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <FaUser className="icon" />
            <span>Profile</span>
          </NavLink>
        </li>
        <li className="menu-divider">Management</li>
        <li>
          <NavLink to="/dashboard/product" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <FaBox className="icon" />
            <span>Products</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/brand" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <FaTag className="icon" />
            <span>Brands</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/category" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <FaList className="icon" />
            <span>Categories</span>
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <RiLogoutCircleRLine className="icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

// Add this to your CSS file
const sidebarStyles = `
  .sidebar {
    width: 250px;
    background: #2c3e50;
    color: #ecf0f1;
    position: fixed;
    height: 100vh;
    transition: all 0.3s;
    z-index: 1000;
  }
  
  .sidebar-header {
    padding: 1.5rem;
    background: #1a252f;
    text-align: center;
  }
  
  .sidebar-header h4 {
    margin: 0;
    color: #fff;
    font-weight: 600;
  }
  
  .sidebar-menu {
    padding: 1rem 0;
    list-style: none;
  }
  
  .sidebar-menu li {
    margin-bottom: 0.5rem;
  }
  
  .sidebar-menu .nav-link {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: #bdc3c7;
    text-decoration: none;
    transition: all 0.3s;
  }
  
  .sidebar-menu .nav-link:hover {
    background: #34495e;
    color: #fff;
  }
  
  .sidebar-menu .nav-link.active {
    background: #3498db;
    color: #fff;
  }
  
  .sidebar-menu .icon {
    margin-right: 1rem;
    font-size: 1.1rem;
  }
  
  .sidebar-menu .menu-divider {
    padding: 0.5rem 1.5rem;
    color: #7f8c8d;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 1rem;
  }
  
  .sidebar-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 1rem;
    border-top: 1px solid #34495e;
  }
  
  .logout-btn {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: none;
    color: #bdc3c7;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .logout-btn:hover {
    background: #e74c3c;
    color: #fff;
  }
  
  @media (max-width: 992px) {
    .sidebar {
      margin-left: -250px;
    }
    
    .sidebar.active {
      margin-left: 0;
    }
  }
`;

document.head.appendChild(document.createElement('style')).textContent = sidebarStyles;