import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { miAxios } from "../axios/axios";

const API = import.meta.env.VITE_API;

const useRefreshToken = () => {
    const { setAuth } = useAuth();


    const refresh = async () => {
        try {

            const res = await miAxios.get(`/refresh`, {
                withCredentials: true,
            });

            const { accessToken, user_uuid, username, address } = res.data;
        
            setAuth({
                accessToken,
                user: { username },
                user_uuid,
                address
            });
            console.log(accessToken)

        return accessToken;
        } catch (err) {
            console.error("Refresh token failed:", err);
            // setAuth({ accessToken: null, user: null, user_uuid: null , address: null});
            if (err?.response?.status === 403) {
                setAuth({ accessToken: null, user: null, user_uuid: null, address: null});
            }
            throw err; 
        }
    };

  return refresh;
};

export default useRefreshToken;
