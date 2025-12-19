import axios from "axios";
import { API_URL } from "./config";

const API = axios.create({
    baseURL: API_URL + "/ai",
});

API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const aiAPI = {
    chat: async (message, history = [], context = "") => {
        const res = await API.post("/chat", { message, history, context });
        return res.data;
    },
};
