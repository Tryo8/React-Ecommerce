import axios from "axios";

const API = import.meta.env.VITE_API;

const publicAxios = axios.create({
  baseURL: API,
  withCredentials: true,
});

export default publicAxios;
