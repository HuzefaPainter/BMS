import axios from "axios";
import { api_domain } from "../api_constants";

export const axiosInstance = axios.create({
    baseURL: api_domain,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});
