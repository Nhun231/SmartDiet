import axios from 'axios';

const baseAxios = axios.create({
  baseURL: 'https://smartdiet-np8j.onrender.com/smartdiet/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});
export default baseAxios;
