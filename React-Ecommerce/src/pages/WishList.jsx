import { useContext, useEffect, useRef } from "react"
import { UserContext } from "../core/context/UserContext"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { miAxios } from "../core/axios/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState } from "../core/placeholders/PlaceHolders";
import useAxiosPrivate from "../core/hooks/useAxiosPrivate";
import img from '../assets/images/photo.png';

export default function WishList () {
    const { wishList, user } = useContext(UserContext)
    const isSignedIn = !!user;
    const top = useRef();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        top.current?.scrollIntoView({ behavior: "smooth" });
    },[])

    const removeFromWishList = useMutation({
        mutationFn: async (productId) => {
            const res = await axiosPrivate.delete(`/products/remove-wish-list-item/${productId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["wishList"]);
            toast.success("Removed from wish list");
        },
        onError: (err) => {
            toast.error("Failed to remove from wish list");
            console.error(err);
        }
    });

    const goToCart = (productId) => {
        navigate(`/user/product/${productId}`)
    }


    return(
        <div className="container my-4">
            <h5 ref={top} className="bg__light p-3 text-center rounded-4">Your wish list</h5>
            <div className="row px-2">
                {
                    wishList.length === 0 ? 
                    <EmptyState navRoute={isSignedIn ? '' : '/signIn'}
                     btnText={'Sign In'} message={isSignedIn ? "Your wish list seems a bit hollow" :"Sign In to add to your wish list and more"}  /> :
                    wishList.map((product) => (
            
                        <div key={product?.product_id} style={{height:'22rem', perspective:" 1000px"}} className="col-6 col-md-5 col-sm-6  col-lg-3 p-1 rounded-4" >
                            <div className="card shadow-sm bg__light card__product border-0 rounded-4 h-100">
                                <img onClick={() => goToCart(product?.product_uuid)} onError={(e) => {e.target.onerror = null; e.target.src = img}} height={160} width={160} className="card-img-top rounded-top-4 object-fit-cover" src={product?.product_img || img} alt="product display image"/>
                                <div className="card-body p-3" onClick={() => goToCart(product?.product_uuid)}>
                                    <h5 className="text-truncate">{ product?.name || "N/A"}</h5>
                                    <p onClick={() => goToCart(product?.product_uuid)} style={{height:'3rem'}} className="mb-0 truncate-2 text-secondary txt__s">{ product?.description || "N.A"}</p>
                                    <small>{ product?.category || "N/A"}</small>
                                </div>
                                <div className="d-flex mt-auto px-3 pb-3 align-items-center">
                                <button 
                                className="btn__circle"
                                onClick={() => removeFromWishList.mutate(product?.product_id)}><i className="bi bi-trash3 text-danger"></i></button>
                                {
                                    product?.status === "out_of_stock" ? <span className="ms-auto txt__xs text-danger">Out of Stock</span> : ""
                                }
                                    
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

    )
}