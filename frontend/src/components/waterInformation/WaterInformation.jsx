import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "../../styles/themeProfile.css";
import "../../styles/water-tracking.css";

const WaterTrackingPage = () => {
  const [waterData, setWaterData] = useState(null);
  const [newIntake, setNewIntake] = useState("");
  const quickAddOptions = [100, 200, 300, 500];

  // Lấy dữ liệu từ backend
  useEffect(() => {
    const fetchWaterData = async () => {
      try {
        const response = await axios.get("/water/water-data", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setWaterData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWaterData();
  }, []);

  // Thêm lượng nước
  const handleAddWater = async (e) => {
    e.preventDefault();
    if (!newIntake || isNaN(newIntake) || Number(newIntake) <= 0) return;

    try {
      const response = await axios.post(
        "/water/add-water",
        { amount: Number(newIntake) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setWaterData(response.data);
      setNewIntake("");
    } catch (err) {
      console.error(err);
    }
  };

  // Quick add button
  const handleQuickAdd = async (amount) => {
    try {
      const response = await axios.post(
        "/water/add-water",
        { amount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setWaterData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Cập nhật target
  const handleTargetChange = async (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      try {
        const response = await axios.put(
          "/water/update-target",
          { target: value },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setWaterData(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!waterData) {
    return <p>Loading water tracking data...</p>;
  }

  // Tính % hoàn thành và lượng nước còn lại
  const progressPercentage = Math.min(
    Math.round((waterData.consumed / waterData.target) * 100),
    100
  );
  const remainingWater = Math.max(waterData.target - waterData.consumed, 0);
  if (!waterData) {
    return <p>Loading water tracking data...</p>;
  }

  return (
    <div className="container p-4">
      {/* Header */}
      <div className="flex flex-col mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Water Tracking</h1>
          <p className="text-gray-600 mt-1">
            Monitor your daily water intake and stay hydrated
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Water Progress Card */}
          <div className="my-card">
            <div className="my-card-header">
              <h3 className="my-card-title">
                <span className="icon">💧</span> Daily Water Intake
              </h3>
            </div>
            <div className="card-content">
              <div className="water-progress-container">
                <div className="water-level-container">
                  <div
                    className="water-level"
                    style={{ height: `${progressPercentage}%` }}
                  >
                    <div className="water-waves"></div>
                  </div>
                </div>
                <div className="water-stats">
                  <div className="water-percentage">{progressPercentage}%</div>
                  <div className="water-amounts">
                    <span className="consumed">
                      {waterData.consumed} {waterData.unit}
                    </span>
                    <span className="separator">/</span>
                    <span className="target">
                      {waterData.target} {waterData.unit}
                    </span>
                  </div>
                  <div className="water-remaining">
                    {remainingWater > 0 ? (
                      <span>
                        Remaining: {remainingWater} {waterData.unit}
                      </span>
                    ) : (
                      <span className="target-reached">Target reached! 🎉</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Water Intake Card */}
          <div className="my-card">
            <div className="my-card-header">
              <h3 className="my-card-title">
                <span className="icon">➕</span> Add Water Intake
              </h3>
            </div>
            <div className="card-content">
              <form onSubmit={handleAddWater} className="water-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="waterAmount">
                    Amount ({waterData.unit})
                  </label>
                  <div className="water-input-group">
                    <input
                      type="number"
                      id="waterAmount"
                      className="form-control"
                      value={newIntake}
                      onChange={(e) => setNewIntake(e.target.value)}
                      placeholder="Enter amount"
                      min="1"
                    />
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                  </div>
                </div>

                <div className="quick-add-section">
                  <p className="text-sm text-gray-600 mb-2">Quick Add:</p>
                  <div className="quick-add-buttons">
                    {quickAddOptions.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className="quick-add-btn"
                        onClick={() => handleQuickAdd(amount)}
                      >
                        +{amount} {waterData.unit}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Target Settings Card */}
          <div className="my-card">
            <div className="my-card-header">
              <h3 className="my-card-title">
                <span className="icon">🎯</span> Target Settings
              </h3>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label className="form-label" htmlFor="waterTarget">
                  Daily Target ({waterData.unit})
                </label>
                <input
                  type="number"
                  id="waterTarget"
                  className="form-control"
                  value={waterData.target}
                  onChange={handleTargetChange}
                  min="500"
                  step="100"
                />
              </div>
            </div>
          </div>

          {/* Water Intake History Card */}
          <div className="my-card">
            <div className="my-card-header">
              <h3 className="my-card-title">
                <span className="icon">📝</span> Today's Intake History
              </h3>
            </div>
            <div className="card-content">
              {waterData?.history?.length > 0 ? (
                <div className="water-history">
                  {waterData.history.map((entry, index) => (
                    <div key={index} className="history-item">
                      <div className="history-time">{entry.time}</div>
                      <div className="history-amount">
                        <span className="droplet-icon">💧</span> {entry.amount}{" "}
                        {waterData.unit}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No intake recorded today
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTrackingPage;
