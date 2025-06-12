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
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    age: 0,
    activityLevel: "",
    height: 0,
    weight: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await baseAxios.get("/users/find-by-id", {
          params: { userId: userId },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Có lỗi khi lấy dữ liệu người dùng"
        );
        setLoading(false);
      }
    };

    fetchUserData();
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
      dateOfBirth: dob,
      age: age,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("http://localhost:5000/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      //const updatedData = await response.json();
      setSaving(false);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="container p-4">Loading...</div>;
  if (error) return <div className="container p-4">Error: {error}</div>;

  return (
    <div className="container p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Chỉnh sửa hồ sơ</h1>
        <p className="text-gray-600 mt-1">
          Cập nhật thông tin cá nhân và chỉ số sức khỏe của bạn
        </p>
      </div>

      <div className="card">
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={userData.username}
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
                  value={userData.email}
                  onChange={handleChange}
                  required
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
                  value={userData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dateOfBirth">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className="form-control"
                  value={
                    userData.dob
                      ? new Date(userData.dob).toISOString().split("T")[0]
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
                  value={userData.height}
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
                  value={userData.weight}
                  onChange={handleChange}
                  min="30"
                  max="300"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="activityLevel">
                  Cường độ vận động
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  className="form-select"
                  value={userData.activityLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn cường độ vận động</option>
                  <option value="Sedentary">
                    Vận động ít (little or no exercise)
                  </option>
                  <option value="Lightly Active">
                    Lightly Active (light exercise 1-3 days/week)
                  </option>
                  <option value="Moderately Active">
                    Moderately Active (moderate exercise 3-5 days/week)
                  </option>
                  <option value="Very Active">
                    Very Active (hard exercise 6-7 days/week)
                  </option>
                  <option value="Extra Active">
                    Extra Active (very hard exercise & physical job)
                  </option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/")}
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
