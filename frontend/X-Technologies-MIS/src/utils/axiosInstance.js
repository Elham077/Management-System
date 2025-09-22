import axios from "axios";
import { BASE_URL } from "./apiPaths";

//? Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: BASE_URL, //? Base URL for all API requests
  timeout: 10000, //? Request timeout set to 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//* ============================> ========================
//* ============================> || Request Interceptor||
//* ============================> ========================
axiosInstance.interceptors.request.use(
  (config) => {
    //? Get token from local storage (if exists)
    const accessToken = localStorage.getItem("token");

    //? Attach Authorization header if token is available
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config; //? Return modified config
  },
  (error) => {
    //? Handle error before sending request
    return Promise.reject(error);
  }
);

//* ============================> ========================
//* ============================> || Response Interceptor||
//* ============================> ========================
axiosInstance.interceptors.response.use(
  (response) => {
    //? Simply return the response if successful
    return response;
  },
  (error) => {
    //? If server responded with an error
    if (error.response) {
      //? Handle 401 Unauthorized (invalid or expired token)
      if (error.response.status === 401) {
        window.location.href = "/login"; //? Redirect to login page
        console.error("Unauthorized, please log in again.");
      }
      //? Handle 500 Internal Server Error
      else if (error.response.status === 500) {
        console.error("Server error, please try again later.");
      }
      //? Handle timeout (Axios error code, not status code)
      else if (error.code === "ECONNABORTED") {
        console.error("A timeout has occurred, please try again later.");
      }
      //? Reject with server response data
      return Promise.reject(error.response.data);
    }
    //? If no response received (network error, server down, etc.)
    else if (error.request) {
      console.error("No response received from server.");
      return Promise.reject(error.request);
    }
    //? For other unexpected errors
    else {
      console.error("Error", error.message);
      return Promise.reject(error.message);
    }
  }
);

export default axiosInstance;
