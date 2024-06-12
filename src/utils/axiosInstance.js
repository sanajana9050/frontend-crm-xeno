// src/utils/axiosInstance.js
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from './firebaseConfig';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
});

axiosInstance.interceptors.request.use(async (config) => {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;
  
  if (user) {
    const idToken = await user.getIdToken();
    config.headers.Authorization = `Bearer ${idToken}`;
  }

  return config;
}, (error) => {
  // if 401 or 403, redirect to login
  if (error.response.status === 401 || error.response.status === 403) {
    window.location.href = '/';
    localStorage.removeItem('user');
  }
});


export default axiosInstance;