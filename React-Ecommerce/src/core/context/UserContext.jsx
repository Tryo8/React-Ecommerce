import { useContext, useEffect,createContext, useState } from "react";
import { decode } from "@msgpack/msgpack";
import { miAxios } from "../axios/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { LoadingContext } from "./LoaderContext";
import { useAuth } from "./AuthContext";

import axios from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";


export const UserContext = createContext();

export function UserContextProvider ({children }) {
    const { auth } = useAuth();
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()
    
    const { data: user, refetch} = useQuery({

        queryKey: ["user"],
        enabled: !!auth.accessToken,
        queryFn: async () => 
        {
            const res = await axiosPrivate.get(`/user/get-current-user`,
            {
                responseType: "arraybuffer",
            });
            const user = decode(new Uint8Array(res.data));
            return user;
        },
    });

       
    const { data: wishList = []} = useQuery({

        queryKey: ["wishList"],
        queryFn: async () => 
        {
            const res = await miAxios.get(`/user/get-wish-list`,
                {headers: 
                    {
                        Authorization: `Bearer ${auth.accessToken}`
                        
                    }
                });
            return res.data;
        }
    });


    useEffect(() => {
        refetch();
    },[])

    return(
        <UserContext.Provider value={{ user, wishList }}>
            { children}
        </UserContext.Provider>
    ) 
}


export default UserContextProvider