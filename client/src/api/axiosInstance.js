import axios from "axios";
const server_url = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
  baseURL: `${server_url}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
