import axios from 'axios';

const baseAxios = axios.create({
  baseURL: 'http://localhost:8080/smartdiet/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});
export default baseAxios;
