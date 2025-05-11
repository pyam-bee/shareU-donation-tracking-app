import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Subscribe to notification service
    const unsubscribe = notificationService.subscribe((notifications, unreadCount) => {
      setNotifications(notifications);
      setUnreadCount(unreadCount);
    });

    // Clean up on unmount
    return () => unsubscribe();
  }, []);

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    notificationService.markAsRead(notification.id);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'campaign_created':
        return '📝';
      case 'campaign_approved':
        return '✅';
      case 'campaign_rejected':
        return '❌';
      case 'donation_received':
        return '💰';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const seconds = Math.floor((now - timestamp) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  return (
    <div className="notification-system">
      <button 
        className="notification-bell" 
        onClick={toggleNotifications}
      >
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      
      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="mark-all-read">
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">No notifications yet</p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .notification-system {
          position: relative;
        }
        
        .notification-bell {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          position: relative;
        }
        
        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #ff4757;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        
        .notification-panel {
          position: absolute;
          right: 0;
          top: 40px;
          width: 320px;
          max-height: 400px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          z-index: 1000;
        }
        
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #eee;
        }
        
        .notification-header h3 {
          margin: 0;
        }
        
        .mark-all-read {
          border: none;
          background: none;
          color: #3498db;
          cursor: pointer;
          font-size: 14px;
        }
        
        .notification-list {
          max-height: 340px;
          overflow-y: auto;
        }
        
        .notification-item {
          display: flex;
          padding: 12px 16px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
        }
        
        .notification-item:hover {
          background-color: #f9f9f9;
        }
        
        .notification-item.unread {
          background-color: #f0f8ff;
        }
        
        .notification-icon {
          margin-right: 12px;
          font-size: 20px;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
        }
        
        .notification-content p {
          margin: 0 0 6px 0;
          font-size: 13px;
          color: #555;
          line-height: 1.4;
        }
        
        .notification-time {
          font-size: 12px;
          color: #999;
        }
        
        .no-notifications {
          padding: 16px;
          text-align: center;
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default NotificationSystem;