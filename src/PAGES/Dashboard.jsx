import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-primary">
            <i className="fas fa-box"></i>
          </div>
          <div className="stat-info">
            <h3>245</h3>
            <p>Total Products</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-success">
            <i className="fas fa-tags"></i>
          </div>
          <div className="stat-info">
            <h3>32</h3>
            <p>Brands</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-info">
            <i className="fas fa-list"></i>
          </div>
          <div className="stat-info">
            <h3>18</h3>
            <p>Categories</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-warning">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>5</h3>
            <p>Active Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Add this to your CSS file
const dashboardStyles = `
  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .dashboard-title {
    color: #2c3e50;
    margin-bottom: 2rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .stat-card {
    background: #fff;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 0 15px rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    transition: transform 0.3s;
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.5rem;
    color: white;
    font-size: 1.5rem;
  }
  
  .bg-primary {
    background: #3498db;
  }
  
  .bg-success {
    background: #2ecc71;
  }
  
  .bg-info {
    background: #1abc9c;
  }
  
  .bg-warning {
    background: #f39c12;
  }
  
  .stat-info h3 {
    margin: 0;
    font-size: 1.8rem;
    color: #2c3e50;
  }
  
  .stat-info p {
    margin: 0.5rem 0 0;
    color: #7f8c8d;
    font-size: 0.9rem;
  }
`;

document.head.appendChild(document.createElement('style')).textContent = dashboardStyles;