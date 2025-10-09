import React, { useState, useEffect } from 'react';
import { premiumService } from '../services/premiumService';
import { useAuth } from '../context/AuthProvider.jsx';
import UserLevelBadge from '../components/common/UserLevelBadge';

const PremiumPackagesPage = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [userPackageStatus, setUserPackageStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesResponse, statusResponse] = await Promise.all([
          premiumService.getAllPackages(),
          premiumService.getUserPackageStatus()
        ]);
        
        console.log('Packages response:', packagesResponse);
        console.log('Status response:', statusResponse);
        
        setPackages(packagesResponse.data.data || []);
        setUserPackageStatus(statusResponse.data.data || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleUpgrade = async (level) => {
    if (upgrading) return;
    
    // Check if user has enough coins
    const selectedPackage = packages.find(pkg => pkg.level === level);
    if (selectedPackage && userPackageStatus?.user.coins < selectedPackage.price) {
      alert(`Bạn cần ${selectedPackage.price.toLocaleString('vi-VN')} xu để nâng cấp gói này. Hiện tại bạn có ${userPackageStatus.user.coins} xu.`);
      return;
    }
    
    // Confirm upgrade
    if (!confirm(`Bạn có chắc chắn muốn nâng cấp lên Level ${level}?`)) {
      return;
    }
    
    setUpgrading(true);
    try {
      await premiumService.upgradePackage(level, 'coins');
      alert('Nâng cấp gói thành công! Trang sẽ được tải lại để cập nhật thông tin.');
      // Refresh data
      const statusResponse = await premiumService.getUserPackageStatus();
      setUserPackageStatus(statusResponse.data.data);
      // Also refresh packages to get updated info
      const packagesResponse = await premiumService.getAllPackages();
      setPackages(packagesResponse.data.data || []);
    } catch (error) {
      console.error('Error upgrading package:', error);
      alert('Có lỗi xảy ra khi nâng cấp gói: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpgrading(false);
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return '#6c757d';
      case 2:
        return '#4CAF50';
      case 3:
        return '#2E7D32';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="premium-packages-page">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="premium-packages-page">
      <div className="container">
        <h1 className="page-title">Gói Premium</h1>
        
        <div className="current-status">
          <h2>Trạng thái hiện tại</h2>
          <UserLevelBadge userPackageStatus={userPackageStatus} />
        </div>
        
        <div className="packages-grid">
          {packages && packages.length > 0 ? packages.map((pkg) => (
            <div 
              key={pkg._id} 
              className={`package-card ${userPackageStatus?.user.level === pkg.level ? 'current' : ''}`}
              style={{ borderColor: getLevelColor(pkg.level) }}
            >
              <div className="package-header">
                <div 
                  className="level-badge"
                  style={{ backgroundColor: getLevelColor(pkg.level) }}
                >
                  Level {pkg.level}
                </div>
                <h3 className="package-name">{pkg.name}</h3>
                <div className="package-price">{formatPrice(pkg.price)}</div>
                {pkg.price > 0 && <div className="billing-period">/tháng</div>}
              </div>
              
              <div className="package-description">
                {pkg.description}
              </div>
              
              <div className="package-features">
                <h4>Tính năng:</h4>
                <ul>
                  {pkg.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="package-limits">
                <div className="limit-item">
                  <strong>Nguyên liệu:</strong> 
                  {pkg.ingredientLimit ? ` ${pkg.ingredientLimit} nguyên liệu` : ' Không giới hạn'}
                </div>
                <div className="limit-item">
                  <strong>Chat AI:</strong> 
                  {pkg.aiChatLimit === 0 ? ' Không hỗ trợ' : pkg.aiChatLimit ? ` ${pkg.aiChatLimit} lượt/tháng` : ' Không giới hạn'}
                </div>
                <div className="limit-item">
                  <strong>Chat chuyên gia:</strong> 
                  {pkg.expertChatLimit === 0 ? ' Không hỗ trợ' : pkg.expertChatLimit ? ` ${pkg.expertChatLimit} lượt/tháng` : ' Không giới hạn'}
                </div>
                <div className="limit-item">
                  <strong>Sử dụng xu:</strong> 
                  {pkg.canUseCoins ? ' Có' : ' Không'}
                </div>
                <div className="limit-item">
                  <strong>Gợi ý món ăn:</strong> 
                  {pkg.canSuggestDishes ? ' Có' : ' Không'}
                </div>
              </div>
              
              <div className="package-actions">
                {userPackageStatus?.user.level === pkg.level ? (
                  <button className="current-package-btn" disabled>
                    Gói hiện tại
                  </button>
                ) : userPackageStatus?.user.level > pkg.level ? (
                  <button className="downgrade-btn" disabled>
                    Đã có gói cao hơn
                  </button>
                ) : (
                  <button 
                    className="upgrade-btn"
                    onClick={() => handleUpgrade(pkg.level)}
                    disabled={upgrading}
                    style={{ backgroundColor: getLevelColor(pkg.level) }}
                  >
                    {upgrading ? 'Đang xử lý...' : 'Nâng cấp'}
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="no-packages">
              <p>Không có gói premium nào khả dụng.</p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .premium-packages-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
          padding: 20px 0;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .page-title {
          text-align: center;
          color: white;
          font-size: 2.5rem;
          margin-bottom: 2rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .current-status {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }
        
        .current-status h2 {
          color: white;
          margin-bottom: 1rem;
        }
        
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .package-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border: 3px solid transparent;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .package-card.current {
          border-color: #4CAF50;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .package-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .level-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 1rem;
        }
        
        .package-name {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .package-price {
          font-size: 2rem;
          font-weight: bold;
          color: #4CAF50;
          margin-bottom: 0.25rem;
        }
        
        .billing-period {
          color: #666;
          font-size: 0.9rem;
        }
        
        .package-description {
          color: #666;
          margin-bottom: 1.5rem;
          text-align: center;
          font-style: italic;
        }
        
        .package-features h4 {
          color: #333;
          margin-bottom: 1rem;
        }
        
        .package-features ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1.5rem;
        }
        
        .package-features li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
          position: relative;
          padding-left: 1.5rem;
        }
        
        .package-features li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4CAF50;
          font-weight: bold;
        }
        
        .package-limits {
          background: #E8F5E9;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid #C8E6C9;
        }
        
        .limit-item {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .package-actions {
          text-align: center;
        }
        
        .upgrade-btn, .current-package-btn, .downgrade-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          color: white;
        }
        
        .upgrade-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .upgrade-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .current-package-btn {
          background: #4CAF50;
        }
        
        .downgrade-btn {
          background: #6c757d;
        }
        
        .loading {
          text-align: center;
          color: white;
          font-size: 1.2rem;
          padding: 2rem;
        }
        
        .no-packages {
          text-align: center;
          color: white;
          font-size: 1.2rem;
          padding: 2rem;
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
};

export default PremiumPackagesPage;
