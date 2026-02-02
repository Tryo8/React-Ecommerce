import { miAxios } from "../axios/axios";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useRefreshToken from "./useRefreshToken";


const useAxiosPrivate = () => {
    const { auth } = useAuth();
    const refresh = useRefreshToken();

    useEffect(() => {
        const requestIntercept = miAxios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization'] && auth?.accessToken) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }

                return config;
            }, (error) => {
  
                return Promise.reject(error);
                
            } 
        );

        const responseIntercept = miAxios.interceptors.response.use(
            response => {
          
                return response;
            },     
            async (error) => {
                const prevRequest = error?.config;
                if (!prevRequest) return Promise.reject(error);
                if(error?.response?.status === 403 && !prevRequest?._retry){
                    prevRequest._retry = true;
                    try {
                        const newAccessToken = await refresh(); // call your hook
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return await miAxios(prevRequest); // retry original request
                    } catch (err) {
               
                        return Promise.reject(err);
                    }
                }
                return Promise.reject(error)
            }
        );

        return () => {
            miAxios.interceptors.request.eject(requestIntercept); //clean up
            miAxios.interceptors.response.eject(responseIntercept);
        }

    },[auth, refresh])

    return miAxios;
}

export default useAxiosPrivate;