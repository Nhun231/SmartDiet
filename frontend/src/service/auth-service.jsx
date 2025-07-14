import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const loginService = async (emailOrName, password) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/login`,
            { emailOrName, password },
            {
                withCredentials: true, // for the refreshToken cookie
            }
        );
        const accessToken = response.data.accessToken;
        localStorage.removeItem('userId');
        localStorage.setItem('userId', response.data.userId);
        console.log('Đăng nhập thành công');
        return { accessToken };
    } catch (error) {
        // Optional: rethrow a custom error
        throw error
    }
};
const logoutService =  async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/auth/logout`,
            {
                withCredentials: true, // for the refreshToken cookie
            }
        );
        const accessToken = response.data.accessToken;
        console.log('Đăng xuất thành công');
        return { accessToken };
    } catch (error) {
        // Optional: rethrow a custom error
        throw error
    }
}
export default loginService;
