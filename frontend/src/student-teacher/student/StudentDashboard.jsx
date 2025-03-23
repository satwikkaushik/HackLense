import React, { useState } from 'react';
import Navbar from './dashboard/components/Navbar';
import Dashboard from './dashboard/components/Dashboard';
import SideCalendar from './dashboard/components/SideCalendar';
import Notification from './dashboard/components/Notification';
import './StudentDashboard.css';

function StudentDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationContent, setNotificationContent] = useState({});
  const [assignments, setAssignments] = useState([]);

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
    setNotificationContent(notification);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Function to update assignments that Dashboard (or teacher component) will call
  const updateAssignments = (newAssignments) => {
    setAssignments(newAssignments);
  };

  return (
    <div className="app">
      <Navbar notifications={notifications} />
      {/* The SideCalendar will be fixed (using its own CSS) */}
      <SideCalendar />
      <div className="main-content">
        <Dashboard 
          addNotification={addNotification} 
          updateAssignments={updateAssignments} 
        />
      </div>
      {showNotification && <Notification notification={notificationContent} />}
    </div>
  );
}

export default StudentDashboard;