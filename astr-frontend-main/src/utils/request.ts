import axios from "axios";

export const API_BASE_PATH = "https://api.lucky-star.fun/api";

export const instance = axios.create({
  baseURL: API_BASE_PATH,
  timeout: 10000,
  //   headers: { 'X-Custom-Header': 'foobar' },
});

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response?.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
