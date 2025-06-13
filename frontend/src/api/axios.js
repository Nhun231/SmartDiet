import axios from 'axios';

const baseAxios = axios.create({
  baseURL: 'http://localhost:8080/smartdiet/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Intercept request để thêm accessToken
baseAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept response để xử lý 401 (token hết hạn)
baseAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 và request chưa được retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.get('http://localhost:8080/smartdiet/auth/refresh', {
          withCredentials: true // cần gửi cookie chứa refresh token
        });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Cập nhật header Authorization rồi gửi lại request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return baseAxios(originalRequest);

      } catch (refreshError) {
        console.error("Không thể làm mới access token:", refreshError);
        // Có thể redirect về login hoặc xóa token cũ
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // hoặc dùng navigate()
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default baseAxios;
