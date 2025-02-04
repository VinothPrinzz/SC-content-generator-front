// Create a new file src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sc-content-generator-back.onrender.com' // Replace with your backend URL/port
});

export default api;
