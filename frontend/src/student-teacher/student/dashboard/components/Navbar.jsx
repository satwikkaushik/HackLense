// src/components/Navbar.jsx
import { useState } from 'react';
import './Navbar.css';

const Navbar = ({ notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-icon">🏆</span>
        <h1>AssessRank</h1>
      </div>
      
      <div className="nav-links">
        {/* <a href="#" className="active"><h1>Student Dashboard</h1></a> */}
        {/* <a href="#">Courses</a>
        <a href="#">Resources</a>
        <a href="#">Messages</a> */}
      </div>
      
      <div className="nav-actions">
        <div className="notification-bell">
          <button onClick={() => setShowNotifications(!showNotifications)}>
            <span className="icon">🔔</span>
            {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <h3>Notifications</h3>
              {notifications.length ? (
                <ul>
                  {notifications.map(notification => (
                    <li key={notification.id} className={`notification-item ${notification.type}`}>
                      {notification.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-notifications">No new notifications</p>
              )}
            </div>
          )}
        </div>
        
        <div className="user-profile">
          <div className="avatar">
            <span>JS</span>
          </div>
          <span className="username">John Student</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
