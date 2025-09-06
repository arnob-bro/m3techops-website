import axios from "axios";
import useUserStore from "../stores/userStore";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // 👈 send cookies
});

// Attach access token
// let accessToken = null;
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach access token
api.interceptors.request.use((config) => {
  const accessToken = useUserStore.getState().accessToken; // get latest token
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized & not retrying yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          "http://localhost:5000/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        useUserStore.getState().setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useUserStore.getState().logout(); // force logout
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);




//porer

// export const setAccessToken = (token) => {
//   accessToken = token;
// };

// api.interceptors.request.use((config) => {
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

export default api;
