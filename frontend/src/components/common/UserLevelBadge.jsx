import React, { useState, useEffect } from 'react';
import { premiumService } from '../../services/premiumService';
import { useAuth } from '../../context/AuthProvider';

const UserLevelBadge = ({ userPackageStatus }) => {
  const { user } = useAuth();
  const [packageStatus, setPackageStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use passed data if available, otherwise fetch
    if (userPackageStatus) {
      setPackageStatus(userPackageStatus);
      setLoading(false);
    } else {
      const fetchPackageStatus = async () => {
        try {
          const response = await premiumService.getUserPackageStatus();
          console.log('UserLevelBadge - Package status response:', response);
          setPackageStatus(response.data);
        } catch (error) {
          console.error('Error fetching package status:', error);
        } finally {
          setLoading(false);
        }
      };

      if (user) {
        fetchPackageStatus();
      }
    }
  }, [user, userPackageStatus]);

  if (!user) {
    return <div className="user-level-badge loading">Please log in to view your status</div>;
  }

  if (loading || !packageStatus) {
    return <div className="user-level-badge loading">Loading...</div>;
  }

  // Safety check for packageStatus structure
  if (!packageStatus.user) {
    return <div className="user-level-badge loading">Loading user data...</div>;
  }

  const { user: userData, package: packageInfo } = packageStatus;

  // Safety check for userData properties
  if (!userData || typeof userData.level === 'undefined') {
    return <div className="user-level-badge loading">Loading user data...</div>;
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return '#6c757d'; // Gray
      case 2:
        return '#4CAF50'; // Green
      case 3:
        return '#2E7D32'; // Dark Green
      default:
        return '#6c757d';
    }
  };

  const getLevelName = (level) => {
    switch (level) {
      case 1:
        return 'Cơ bản';
      case 2:
        return 'Chuyên sâu';
      case 3:
        return 'Nâng cao';
      default:
        return 'Cơ bản';
    }
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return 'Không giới hạn';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="user-level-badge">
      <div className="level-info">
        <div 
          className="level-badge"
          style={{ backgroundColor: getLevelColor(userData.level) }}
        >
          Level {userData.level} - {getLevelName(userData.level)}
        </div>
        <div className="coins-info">
          <span className="coins-icon">🪙</span>
          <span className="coins-amount">{userData.coins}</span>
        </div>
      </div>
      
      {packageInfo && (
        <div className="package-details">
          <div className="package-name">{packageInfo.name}</div>
          <div className="package-features">
            {packageInfo.features.slice(0, 2).map((feature, index) => (
              <div key={index} className="feature-item">
                • {feature}
              </div>
            ))}
            {packageInfo.features.length > 2 && (
              <div className="feature-item">
                +{packageInfo.features.length - 2} tính năng khác
              </div>
            )}
          </div>
          
          {userData.premiumExpiry && (
            <div className="expiry-info">
              Hết hạn: {formatExpiryDate(userData.premiumExpiry)}
            </div>
          )}
          
          {userData.level > 1 && (
            <div className="usage-info">
              <div className="usage-item">
                AI Chat: {userData.aiChatUsed}
                {packageInfo.aiChatLimit ? `/${packageInfo.aiChatLimit}` : '/∞'}
              </div>
              <div className="usage-item">
                Chuyên gia: {userData.expertChatUsed}
                {packageInfo.expertChatLimit ? `/${packageInfo.expertChatLimit}` : '/∞'}
              </div>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        .user-level-badge {
          background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin: 8px 0;
          font-size: 14px;
        }
        
        .user-level-badge.loading {
          text-align: center;
          opacity: 0.7;
        }
        
        .level-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .level-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 12px;
          color: white;
        }
        
        .coins-info {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 8px;
          border-radius: 12px;
        }
        
        .coins-icon {
          font-size: 16px;
        }
        
        .coins-amount {
          font-weight: bold;
        }
        
        .package-details {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 8px;
        }
        
        .package-name {
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .package-features {
          font-size: 12px;
          opacity: 0.9;
          margin-bottom: 4px;
        }
        
        .feature-item {
          margin: 2px 0;
        }
        
        .expiry-info {
          font-size: 12px;
          opacity: 0.8;
          margin: 4px 0;
        }
        
        .usage-info {
          display: flex;
          gap: 12px;
          font-size: 12px;
          opacity: 0.8;
          margin-top: 4px;
        }
        
        .usage-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default UserLevelBadge;
