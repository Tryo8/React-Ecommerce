import {  QueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { miAxios } from "../axios/axios";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
        await miAxios.get("/logout", { withCredentials: true });
        },
        onSuccess: () => {
            setAuth({ accessToken: null, user: null, user_uuid: null, address: null, id: null });
            localStorage.clear();
            queryClient.clear();
            queryClient.refetchQueries(); 
            toast.success("Logged out successfully");
            navigate("/signIn", { replace: true });
        },
        onError: (err) => {
            console.error("Logout failed:", err);
            toast.error("Logout failed. Try again.");
        },
    });
};