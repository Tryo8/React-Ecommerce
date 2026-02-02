import { useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
export function AuthRoute () {
    const { user } = useContext(UserContext);

    const { auth, loading } = useAuth();
    if (loading) return null;

    if (!user && !auth?.accessToken) {
        return <Navigate to="/user/explore" replace />;
    }

    return <Outlet />; 
}