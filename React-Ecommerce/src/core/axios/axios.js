import axios from "axios";
const API = import.meta.env.VITE_API;


export const miAxios = axios.create({
    baseURL:  API,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

