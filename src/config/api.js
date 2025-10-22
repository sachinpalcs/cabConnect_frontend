// import axios from 'axios';
// import { setAccessToken, logout } from '../redux/AuthSlice';

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api',
//   withCredentials: true,
// });


// export const setupInterceptors = (store) => {

//   api.interceptors.request.use(
//     (config) => {
//       const token = store.getState().auth.accessToken;
//       if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;

//       if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
//         try {
//           const { data } = await api.post('/auth/refresh');
//           const newAccessToken = data.accessToken;

//           store.dispatch(setAccessToken(newAccessToken));

//           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//           return api(originalRequest);
//         } catch (refreshError) {
//           store.dispatch(logout());
//           window.location.href = '/login';
//           return Promise.reject(refreshError);
//         }
//       }
//       return Promise.reject(error);
//     }
//   );
// };

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

export const setupInterceptors = (store, { setAccessToken, logout, clearAuth }) => {
  api.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const excludedUrls = ['/auth/logout'];
      if (
        error.response && 
        error.response.status === 401 &&
        (!originalRequest._retry) &&
        !excludedUrls.includes(originalRequest.url)
      ) {
        originalRequest._retry = true;
        try {
          const { data } = await api.post('/auth/refresh');
          const newAccessToken = data.accessToken;

          store.dispatch(setAccessToken(newAccessToken));

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(logout());
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      if (originalRequest.url === '/auth/logout' && error.response.status === 401) {
        // console.log("Logout failed with 401, user is already logged out. Cleaning up.");
        store.dispatch(clearAuth());
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

export default api;