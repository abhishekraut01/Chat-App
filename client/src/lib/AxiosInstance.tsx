import axios from "axios";

// Your axios instance
export const AxiosInstance = axios.create({
    baseURL: "https://we-chat-c8xi.onrender.com/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})