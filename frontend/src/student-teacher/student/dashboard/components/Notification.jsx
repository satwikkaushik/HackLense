import { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({ notification }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Animation timing
    setTimeout(() => {
      setVisible(true);
    }, 10);
    
    return () => {
      setVisible(false);
    };
  }, [notification]);
  
  return (
    <div className={`notification ${notification.type} ${visible ? 'visible' : ''}`}>
      <div className="notification-content">
        {notification.type === 'success' && <span className="icon">✅</span>}
        {notification.type === 'warning' && <span className="icon">⚠️</span>}
        {notification.type === 'error' && <span className="icon">❌</span>}
        {notification.type === 'info' && <span className="icon">ℹ️</span>}
        <p>{notification.message}</p>
      </div>
    </div>
  );
};

export default Notification;
