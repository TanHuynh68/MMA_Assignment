import axios from "axios";
const url = "https://65e17811a8583365b3166f42.mockapi.io/api/v1"
export const axiosInstance = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 300000,
    timeoutErrorMessage: 'Connection is timeout exceeded'
})

axiosInstance.interceptors.request.use(
    (config) => {
      // const token = localStorage.getItem("token");
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
        // console.log(response);
        if(response&&response.data){
          return response.data
        }
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
  );
  
  
export default axiosInstance  