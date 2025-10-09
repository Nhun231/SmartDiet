import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import baseAxios from "../../api/axios";
import "../../styles/themeProfile.css";

// Import icons from MUI
import PersonIcon from "@mui/icons-material/Person";
import StraightenIcon from "@mui/icons-material/Straighten";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import SpeedIcon from "@mui/icons-material/Speed";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StarIcon from "@mui/icons-material/Star";
import { premiumService } from "../../services/premiumService";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [physicalData, setPhysicalData] = useState(null);
  const [premiumData, setPremiumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateAge = (dob) =>
    new Date().getFullYear() -
    new Date(dob).getFullYear() -
    (new Date() < new Date(new Date(dob).setFullYear(new Date().getFullYear()))
      ? 1
      : 0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await baseAxios.get("/users/find-by-email", {});
        setUserData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Có lỗi khi lấy dữ liệu người dùng"
        );
      }
    };

    const fetchPhysicalData = async () => {
      try {
        const response = await baseAxios.get(`/customer/calculate/newest`, {});
        setPhysicalData(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu thể chất:", err);
      }
    };

    const fetchPremiumData = async () => {
      try {
        const response = await premiumService.getUserPackageStatus();
        setPremiumData(response.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu premium:", err);
      }
    };

    fetchUserData();
    fetchPhysicalData();
    fetchPremiumData();
    setLoading(false);
  }, []);

  const getBMICategory = (bmi) => {
    const value = Number.parseFloat(bmi);
    if (!value) return "Chưa có dữ liệu";
    if (value < 18.5) return "Thiếu cân";
    if (value < 25) return "Bình thường";
    if (value < 30) return "Thừa cân";
    return "Béo phì";
  };

  const getBMIColor = (bmi) => {
    const bmiValue = Number.parseFloat(bmi);
    if (bmiValue < 18.5) return "text-blue-600";
    if (bmiValue < 25) return "text-green";
    if (bmiValue < 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getBMIBadgeClass = (category) => {
    switch (category) {
      case "Bình thường":
        return "my-badge badge-green";
      case "Thiếu cân":
        return "my-badge badge-blue";
      case "Thừa cân":
        return "my-badge badge-yellow";
      case "Béo phì":
        return "my-badge badge-red";
      default:
        return "my-badge";
    }
  };

  const getLevelName = (level) => {
    switch (level) {
      case 1:
        return "Cơ bản";
      case 2:
        return "Chuyên sâu";
      case 3:
        return "Nâng cao";
      default:
        return "Cơ bản";
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return "#6c757d";
      case 2:
        return "#4CAF50";
      case 3:
        return "#2E7D32";
      default:
        return "#6c757d";
    }
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return "Không giới hạn";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading || !userData)
    return <div className="container p-4">Loading...</div>;
  if (error) return <div className="container p-4">Error: {error}</div>;

  return (
    <div className="container p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin cá nhân và các chỉ số sức khỏe
          </p>
        </div>
        <div>
          <Link to="/edit-profile" className="my-btn my-btn-primary">
            Chỉnh sửa hồ sơ
          </Link>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="my-card border-left-green mb-6">
        <div className="card-content">
          <div className="flex flex-col flex-md-row items-center gap-6">
            <div className="avatar">
              {userData.username
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{userData.username}</h2>
              <p className="text-gray-600 mb-2">{userData.email}</p>
              <div className="flex gap-2">
                <span className="my-badge badge-green text-green-700">
                  {physicalData?.gender ? physicalData.gender : "Giới tính: --"}
                </span>
                <span className="my-badge badge-green text-green-700">
                  {calculateAge(userData.dob)} Tuổi
                </span>
                <span className="my-badge badge-green text-green-700">
                  {physicalData?.activity
                    ? "Cường độ vận động: " + physicalData.activity
                    : "Cường độ vận động: --"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 grid-cols-2 gap-6 mb-6">
        {/* Personal Information */}
        <div className="my-card">
          <div className="my-card-header">
            <div className="my-card-title">
              <PersonIcon style={{ marginRight: 6 }} />
              Thông tin cá nhân
            </div>
          </div>
          <div className="card-content">
            <div className="p-3 rounded-lg bg-gray-50 mb-4">
              <p className="text-sm text-gray-500">Họ và tên</p>
              <p className="font-medium">{userData.username}</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 mb-4">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 mb-4">
              <p className="text-sm text-gray-500">Giới tính</p>
              <p className="font-medium">
                {physicalData?.gender ? physicalData.gender : "--"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500">Ngày sinh</p>
              <p className="font-medium">
                {userData.dob
                  ? new Date(userData.dob).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "--/--/----"}
              </p>
            </div>
          </div>
        </div>

        {/* Physical Metrics */}
        <div className="my-card">
          <div className="my-card-header">
            <div className="my-card-title">
              <StraightenIcon style={{ marginRight: 6 }} />
              Chỉ số cơ thể
            </div>
          </div>
          <div className="card-content">
            <div className="p-3 rounded-lg bg-gray-50 mb-4">
              <p className="text-sm text-gray-500">Chiều cao</p>
              <p className="font-medium">
                {physicalData?.height ? physicalData.height : "--"} (cm)
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 mb-4">
              <p className="text-sm text-gray-500">Cân nặng</p>
              <p className="font-medium">
                {physicalData?.weight ? physicalData.weight : "--"} (kg)
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 mb-4">
              <p className="text-sm text-gray-500">Lượng nước cần uống</p>
              <p className="font-medium">
                {physicalData?.waterIntake ?? "--"}
                (lít/ngày)
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500">Cường độ vận động</p>
              <p className="font-medium">
                {physicalData?.activity ? physicalData.activity : "--"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="my-card mb-6">
        <div className="my-card-header">
          <div className="my-card-title">
            <ShowChartIcon style={{ marginRight: 6 }} />
            Chỉ số sức khỏe
          </div>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 grid-cols-3 gap-6">
            {/* BMR */}
            <div className="metric-card">
              <LocalFireDepartmentIcon
                style={{ fontSize: 32, color: "green" }}
              />
              <h3 className="font-semibold text-green mb-1">
                Tỷ lệ trao đổi chất cơ bản (BMR)
              </h3>
              <p className="text-2xl font-bold text-green">
                {physicalData?.bmr ? physicalData?.bmr : "--"} cal/day
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Lượng calo tiêu thụ khi nghỉ ngơi
              </p>
            </div>

            {/* TDEE */}
            <div className="metric-card">
              <TrackChangesIcon style={{ fontSize: 32, color: "green" }} />
              <h3 className="font-semibold text-green mb-1">
                Tổng năng lượng tiêu hao mỗi ngày (TDEE)
              </h3>
              <p className="text-2xl font-bold text-green">
                {physicalData?.tdee ? physicalData?.tdee : "--"} cal/day
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Tổng lượng calo cần thiết mỗi ngày
              </p>
            </div>

            {/* BMI */}
            <div className="metric-card">
              <SportsScoreIcon style={{ fontSize: 32, color: "green" }} />
              <h3 className="font-semibold text-green mb-1">Chỉ số BMI</h3>
              <p
                className={`text-2xl font-bold ${
                  physicalData?.bmi
                    ? getBMIColor(physicalData.bmi)
                    : "text-green"
                }`}
              >
                {physicalData?.bmi ?? "--"}
              </p>
              <span
                className={`${getBMIBadgeClass(
                  getBMICategory(physicalData?.bmi)
                )}`}
              >
                Đánh giá: {getBMICategory(physicalData?.bmi)}
              </span>
              <p className="text-sm text-gray-600 mt-1">
                Chỉ số khối cơ thể đánh giá tình trạng cân nặng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Account Section */}
      {premiumData && (
        <div className="my-card mb-6">
          <div className="my-card-header">
            <div className="my-card-title">
              <StarIcon style={{ marginRight: 6, color: getLevelColor(premiumData.user?.level || 1) }} />
              Tài khoản Premium
            </div>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 grid-cols-3 gap-6">
              {/* Coins */}
              <div className="metric-card">
                <AccountBalanceWalletIcon
                  style={{ fontSize: 32, color: "#FFD700" }}
                />
                <h3 className="font-semibold text-green mb-1">
                  Số xu hiện tại
                </h3>
                <p className="text-2xl font-bold text-green">
                  {premiumData.user?.coins || 0} 🪙
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Sử dụng xu để nâng cấp gói
                </p>
              </div>

              {/* Level */}
              <div className="metric-card">
                <StarIcon
                  style={{ fontSize: 32, color: getLevelColor(premiumData.user?.level || 1) }}
                />
                <h3 className="font-semibold text-green mb-1">
                  Cấp độ hiện tại
                </h3>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: getLevelColor(premiumData.user?.level || 1) }}
                >
                  Level {premiumData.user?.level || 1}
                </p>
                <span 
                  className="my-badge"
                  style={{ 
                    backgroundColor: getLevelColor(premiumData.user?.level || 1),
                    color: 'white'
                  }}
                >
                  {getLevelName(premiumData.user?.level || 1)}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {premiumData.package?.name || "Gói cơ bản"}
                </p>
              </div>

              {/* Expiry */}
              <div className="metric-card">
                <TrackChangesIcon
                  style={{ fontSize: 32, color: "green" }}
                />
                <h3 className="font-semibold text-green mb-1">
                  Hết hạn gói
                </h3>
                <p className="text-2xl font-bold text-green">
                  {formatExpiryDate(premiumData.user?.premiumExpiry)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {premiumData.user?.premiumExpiry ? "Ngày hết hạn gói premium" : "Gói miễn phí"}
                </p>
              </div>
            </div>

            {/* Usage Stats */}
            {premiumData.user?.level > 1 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Thống kê sử dụng tháng này</h4>
                <div className="grid grid-cols-1 grid-cols-2 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chat AI đã sử dụng:</span>
                    <span className="font-medium">
                      {premiumData.user?.aiChatUsed || 0}
                      {premiumData.package?.aiChatLimit ? `/${premiumData.package.aiChatLimit}` : '/∞'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chat chuyên gia đã sử dụng:</span>
                    <span className="font-medium">
                      {premiumData.user?.expertChatUsed || 0}
                      {premiumData.package?.expertChatLimit ? `/${premiumData.package.expertChatLimit}` : '/∞'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Upgrade Button */}
            <div className="mt-4 text-center">
              <Link 
                to="/premium-packages" 
                className="my-btn my-btn-primary"
                style={{ backgroundColor: getLevelColor(premiumData.user?.level || 1) }}
              >
                {premiumData.user?.level === 1 ? 'Nâng cấp gói' : 'Quản lý gói'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="my-card">
        <div className="my-card-header">
          <div className="my-card-title">Thao tác nhanh</div>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 grid-cols-4 gap-4">
            <Link to="/water-infor" className="btn btn-outline p-4 text-center">
              <FitnessCenterIcon
                style={{ fontSize: 32, marginBottom: 8, color: "green" }}
              />
              <br />
              <span>Xem thông tin uống nước</span>
            </Link>
            <Link
              to="/edit-profile"
              className="btn btn-outline p-4 text-center"
            >
              <SpeedIcon
                style={{ fontSize: 32, marginBottom: 8, color: "green" }}
              />
              <br />
              <span>Thay đổi cường độ vận động</span>
            </Link>
            <Link
              to="/edit-profile"
              className="btn btn-outline p-4 text-center"
            >
              <TrackChangesIcon
                style={{ fontSize: 32, marginBottom: 8, color: "green" }}
              />
              <br />
              <span>Thiết lập mục tiêu mới</span>
            </Link>
            <Link
              to="/premium-packages"
              className="btn btn-outline p-4 text-center"
            >
              <StarIcon
                style={{ fontSize: 32, marginBottom: 8, color: "green" }}
              />
              <br />
              <span>Quản lý gói Premium</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
