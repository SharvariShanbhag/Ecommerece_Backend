import React from 'react';
import Sidebar from '../ProtectedRoute/SideBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

// Add this to your CSS file
const styles = `
  .app-container {
    display: flex;
    min-height: 100vh;
    background-color: #f8f9fa;
  }
  
  .main-content {
    flex: 1;
    padding: 2rem;
    background-color: #fff;
    margin-left: 250px;
    min-height: 100vh;
    transition: margin-left 0.3s;
  }
  
  @media (max-width: 992px) {
    .main-content {
      margin-left: 0;
    }
  }
`;

document.head.appendChild(document.createElement('style')).textContent = styles;