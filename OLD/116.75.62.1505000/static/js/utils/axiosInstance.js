import axios from 'axios';


const host = window.location.hostname;

// uat LINKS enable when deploy the

const BASE_URL =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.startsWith("172.16") ?
    process.env.REACT_APP_INTERNAL_API :
    process.env.REACT_APP_EXTERNAL_API;


// Developmant Enable links
// const BASE_URL =
//   process.env.REACT_APP_BACKEND_URL || window.location.origin;

// console.log("Host name",window.location.hostname)

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// console.log("BASE_URL axios.instance",BASE_URL)


axiosInstance.interceptors.request.use(
    (config) => {
        const authTokens = sessionStorage.getItem('authTokens');

        if (authTokens) {
            const parsedTokens = JSON.parse(authTokens);
            const accessToken = parsedTokens ? .access;
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response ? .status === 401) {

            sessionStorage.removeItem('authTokens');
            sessionStorage.removeItem('userInfo');

            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;