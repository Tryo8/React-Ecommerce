import { useQuery } from "@tanstack/react-query";
import { miAxios } from "../core/axios/axios";
import { useAuth } from "../core/context/AuthContext";
import { useParams } from "react-router-dom";
import userDefault from '../assets/images/userDefault.png';
import { useReviewQueryOptions } from "../core/queryOptions/queries";
import Rate from "rc-rate";
import Avatar from "../uicomponents/Avatar";
import { useContext, useRef } from "react";
import { LoadingContext } from "../core/context/LoaderContext";
import { ErrorState } from "../core/placeholders/PlaceHolders";
import NotFound from "./NotFound";
import { useEffect } from "react";

export function User () {
    const { user_uuid, productId } = useParams();
    const { auth } = useAuth();
    const topRef = useRef();
    const { setLoading} = useContext(LoadingContext);


    const { data: user = null, isError, isLoading, error, refetch} = useQuery({
        enabled:!!user_uuid,
        queryKey: ["getUser"],
        queryFn: async () => 
        {
            const res = await miAxios.get(`/user/get-user/${user_uuid}`);
            return res.data; 
        },
    });

    const { data: userReview} = useQuery(useReviewQueryOptions(productId, user?.id));

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth" });
        setLoading(isLoading);

    }, [isLoading, setLoading, user]);

    if(isError) {
        if(error.status === 404) return <NotFound/>
        return <ErrorState refetchFn={refetch}/>
    }
    
    return(
        <div className="container my-4 ">
            <div className="card bg__light p-3 rounded-4 border-0">
                <div className="d-flex align-items-center gap-2">
                    {
                        user?.avatar || user?.user_img ? 
                        <figure>
                            <img 
                            src={user?.avatar || user?.user_img || userDefault}  
                            onError={(e) => {e.target.onerror = null; e.target.src = userDefault}} 
                            height={100}
                            className=" rounded-circle"  
                            />
                        </figure> :
                         <Avatar size={100} name={user?.username || '?'} />
                    }
                    
                    <div>
                        <span ref={topRef} className="display-6">{user?.username || "userUnknown"}</span>
                        <div className="text-muted">@{user?.username || "userUnknown"}</div>
                    </div>
                </div>
            </div>
            <h5 className="my-4">{user?.username}'s Review</h5>
            <div className="card p-3 rounded-4 bg-transparent border">
                <div className="txt__s text-muted">{new Date(userReview?.created_at).
                    toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", })}
                </div>
                <p>
                    { userReview?.comment || "Faild to display comment" }
                </p>
                <Rate style={{fontSize:'1.3rem'}} value={userReview?.rating} count={5} defaultValue={5}  disabled/>
            </div>
        </div>
    )

}

