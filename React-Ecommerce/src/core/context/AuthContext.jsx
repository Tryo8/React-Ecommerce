import { useContext, useEffect,createContext, useState } from "react";
import { miAxios } from "../axios/axios";
import axios from "axios";
import publicAxios from "../axios/publicAxios";

export const AuthContext = createContext();
const API = import.meta.env.VITE_API;
function AuthContextProvider ({children }) {

  const [auth, setAuth] = useState({ accessToken: null, user: null, address: null,id :null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await publicAxios.get(`/refresh`, {
          withCredentials: true, // sends httpOnly cookie
        });
        const data = res.data;
        setAuth({ accessToken: data.accessToken, user: data.user || null, user_uuid: data.user_uuid,
        address: data.address , id: res.data.id || 'unknown'});

      } catch (err) {
        setAuth({ accessToken: null, user: null, user_uuid: null, address: null, id: null });
        console.error("Refresh token failed:", err);
      } finally {
        setLoading(false); 
      } 
    };
      refreshAccessToken();
    }, []);



  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
     {!loading && children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext); // use it

export default AuthContextProvider