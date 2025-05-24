import { useEffect, useState } from "react";
import { getUserInfo } from "../API/api.js";

const Profile = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await getUserInfo();
      setLoggedUser(response.loggedUser);
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">User Profile</h2>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : loggedUser ? (
          <div className="profile-info">
            <div className="profile-avatar">
              <div className="avatar-initials">
                {loggedUser.name ? loggedUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{loggedUser.name || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{loggedUser.email || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Role:</span>
                <span className="detail-value">{loggedUser.role || 'Admin'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-danger">Failed to load user information</div>
        )}
      </div>
    </div>
  );
};

export default Profile;

// Add this to your CSS file
const profileStyles = `
  .profile-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .profile-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    padding: 2rem;
  }
  
  .profile-title {
    color: #2c3e50;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .profile-info {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  .profile-avatar {
    flex-shrink: 0;
  }
  
  .avatar-initials {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #3498db;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: bold;
  }
  
  .profile-details {
    flex-grow: 1;
  }
  
  .detail-item {
    margin-bottom: 1rem;
    display: flex;
  }
  
  .detail-label {
    font-weight: 600;
    color: #2c3e50;
    min-width: 100px;
  }
  
  .detail-value {
    color: #7f8c8d;
  }
  
  @media (max-width: 768px) {
    .profile-info {
      flex-direction: column;
      text-align: center;
    }
    
    .detail-item {
      justify-content: center;
    }
  }
`;

document.head.appendChild(document.createElement('style')).textContent = profileStyles;