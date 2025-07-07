import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/themeProfile.css";
import baseAxios from "../../api/axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Button,
  Grid,
} from "@mui/material";
const EditProfilePage = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    gender: "",
    dob: "",
    age: 0,
    activity: "",
    height: 0,
    weight: 0,
  });
  const [physicalData, setPhysicalData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await baseAxios.get("/users/find-by-email", {});
        const user = response.data;

        const calculatedAge = user.dob ? calculateAge(user.dob) : 0;

        setUserData({
          ...user,
          age: calculatedAge,
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Có lỗi khi lấy dữ liệu người dùng"
        );
      }
    };

    const fetchPhysicalData = async () => {
      try {
        const response = await baseAxios.get(`/customers/calculate/newest`, {});
        setPhysicalData(response.data);
        setUserData((prev) => ({
          ...prev,
          gender: response.data.gender || prev.gender,
          height: response.data.height || prev.height,
          weight: response.data.weight || prev.weight,
          activity: response.data.activity || prev.activity,
          age: response.data.age || prev.age,
        }));
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu thể chất:", err);
      }
    };

    fetchUserData();
    fetchPhysicalData();
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]:
        name === "height" || name === "weight" || name === "age"
          ? Number(value)
          : value,
    });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleDateChange = (e) => {
    const dob = e.target.value;
    const age = calculateAge(dob);

    setUserData({
      ...userData,
      dob: dob,
      age: age,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (userData.age < 10) {
      alert("Người dùng phải ít nhất 10 tuổi.");
      setSaving(false);
      return;
    }
    try {
      // 1. Update User info
      const updateUserRes = await baseAxios.put("/users/update", userData);

      if (updateUserRes.status !== 200) {
        throw new Error("Cập nhật thông tin người dùng thất bại");
      }

      // 2. Gọi API để tạo Calculate mới
      const calculatePayload = {
        userId: userData._id, // hoặc userData._id nếu có sẵn
        gender: userData.gender,
        age: userData.age,
        height: userData.height,
        weight: userData.weight,
        activity: userData.activity,
      };

      const calcRes = await baseAxios.post(
        "/customers/calculate",
        calculatePayload
      );

      if (calcRes.status !== 200) {
        throw new Error("Tính toán lại chỉ số thất bại");
      }

      setSaving(false);
      alert("Cập nhật thành công!");
      navigate("/my-profile");
    } catch (err) {
      console.error("Lỗi khi submit:", err);
      setError(err.message || "Lỗi không xác định");
      setSaving(false);
    }
  };

  if (loading) return <div className="container p-4">Loading...</div>;
  if (error) return <div className="container p-4">Error: {error}</div>;

  return (
    <div className="container p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-main-green">Chỉnh sửa hồ sơ</h1>
        <p className="text-gray-600 mt-1">
          Cập nhật thông tin cá nhân và chỉ số sức khỏe của bạn
        </p>
      </div>

      <div className="my-card">
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  value={userData?.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={userData?.email}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gender">
                  Giới tính
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="form-select"
                  value={userData?.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dateOfBirth">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  className="form-control"
                  value={
                    userData.dob
                      ? new Date(userData?.dob).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleDateChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="height">
                  Chiều cao (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  className="form-control"
                  value={userData?.height}
                  onChange={handleChange}
                  min="100"
                  max="250"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="weight">
                  Cân nặng (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  className="form-control"
                  value={userData?.weight}
                  onChange={handleChange}
                  min="1"
                  max="300"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="activity">
                  Cường độ vận động
                </label>
                <select
                  id="activity"
                  name="activity"
                  className="form-select"
                  value={userData?.activity}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn cường độ vận động</option>
                  <option value="ít">Vận động ít (Vận động cơ bản)</option>
                  <option value="nhẹ">
                    Vận động nhẹ (Tập luyện 1-3 buổi/tuần)
                  </option>
                  <option value="vừa">
                    Vận động vừa (Tập luyện 4-5 buổi/tuần)
                  </option>
                  <option value="nhiều">
                    Vận động nhiều (Tập luyện 6-7 buổi/tuần)
                  </option>
                  <option value="cực_nhiều">
                    Vận động cực nhiều (Cấp độ vận động viên)
                  </option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="my-btn my-btn-primary"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                className="my-btn my-btn-outline"
                onClick={() => navigate("/my-profile")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
