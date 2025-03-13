import axios from "axios";

// Your axios instance
export const AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})