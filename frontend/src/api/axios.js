import axios from 'axios';

const baseAxios = axios.create({
  baseURL: 'http://localhost:8080/smartdiet/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default baseAxios;
