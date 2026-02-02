import { useEffect } from "react"
import img from '../assets/images/photo.png';
import emptyBox from '../assets/images/box.png';
import leaf from '../assets/images/leaf.png';
import { miAxios } from "../core/axios/axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingContext } from "../core/context/LoaderContext";
import { useContext } from "react";
import { UserContext } from "../core/context/UserContext";
import { toast } from "sonner";
import { useQueryClient,useMutation } from "@tanstack/react-query";
import { EmptyState, ErrorState } from "../core/placeholders/PlaceHolders";
import { loadStripe } from "@stripe/stripe-js";
import publicAxios from "../core/axios/publicAxios";
import { getCartItemsQueryOptions } from "../core/queryOptions/queries";
import useAxiosPrivate from "../core/hooks/useAxiosPrivate";
import { errorToast } from "../core/utils/errorToast";

export function Cart () {
    const { user } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);
    const userId = user?.id;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { data: cartItems = [], isLoading, isError, refetch} = useQuery(getCartItemsQueryOptions(userId));
    const productsForCheckout = cartItems.map(item => {
        const originalPrice = Number(item.price) || 0;
        const discount = Number(item.product_discount) || 0;

        const discountedPrice = discount > 0
            ? originalPrice - (originalPrice * discount) / 100
            : originalPrice;

        return {
            id: item.product_id,
            name: item.name,
            product_img: item.product_img,
            quantity: Number(item.quantity) || 1,
            price: Number(discountedPrice.toFixed(2)),
        };
    });

    const removeFromCart = useMutation({
        mutationFn: async (product_id) => {
            const res = await axiosPrivate.delete(`/products/remove-cart-item/${product_id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["cartItems", user?.id]);
            toast.success("Removed from cart successfully");
        },
        onError: (err) => {
            toast.error("Failed to remove from cart");
            console.error(err);
        }
    });

    const makePayment = async () => {
        try {
            const body = { products: productsForCheckout };
            const res = await axiosPrivate.post("/create-checkout-session", body, {
                headers: { "Content-Type": "application/json" },
            });
    
            window.location.href = res.data.url;
        } catch (err) {
            console.error("Stripe checkout error:", err);
        }
    };


    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    const totalAmount = cartItems.reduce((sum, item) => {
        return sum +  (Number(item?.product_discount ? (item?.price - (item?.price * item?.product_discount) / 100).toFixed(2) : item.price || 0) * Number(item.quantity || 1));
    }, 0);

        
    const { data: userLocation } = useQuery({

        queryKey: ["user-location"],
        queryFn: async () => 
        {
            const res = await axiosPrivate.get(`/user/get-location`);
            return res.data
        },
    });

    
    const increaseQuantity = useMutation({
        mutationFn: async (product_id) => {
            const res = await axiosPrivate.patch(
                `/products/increase-quantity/${product_id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["cartItems"]);
        },
        onError: (err) => {
            errorToast(err, "Failed to increase quantity, try again later")
        }
    });

    const decreaseQuantity = useMutation({
        mutationFn: async (product_id) => {
            const res = await axiosPrivate.patch(
                `/products/decrease-quantity/${product_id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["cartItems"]);
        },
        onError: (err) => {
            errorToast(err, "Failed to increase quantity, try again later")
        }
    });


    if (cartItems.length === 0) { 
        return <EmptyState btnText={'Explore'} navRoute={'/user/explore'} na customImg={emptyBox} message={"Your cart is feeling a bit Empty"} />

    }

    if(isError) {
        return <ErrorState message={"Error getting cart items"} refetchFn={refetch}/>
    };


    return(
        <div className="container my-4">
            <div className="d-flex justify-content-center">
                <div style={{width:'745px'}} className="text-center align-items-center d-flex p-3 rounded-4 bg__light border-bottom ">
                    Total: <b className="fw-medium text-success">${totalAmount.toFixed(2)}</b>
                    <button data-bs-toggle="modal" data-bs-target="#paymentModal" className="ms-auto btn__purple__grad">Order Now <i className="bi bi-arrow-right"></i></button>
                </div>

            </div>
    
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-7">
                    {
                        cartItems.map(item => (
                        <div key={item?.product_id} className="card my-3 rounded-4 bg__light border-0 border-bottom">
                            <div className="row g-0 justify-content-start p-1">
                                <div className="col-4 col-md-6  col-lg-3 justify-content-center align-content-center">
                                    <img 
                                    
                                    onError={(e) => {e.target.onerror = null; e.target.src = img}} 
                                    src={item?.product_img || img} 
                                    className="rounded-4 img-fluid  object-fit-contain" 
                                    alt={item?.name || "product image"}/>
                                </div>
                                <div className="col-6 col-md-8 col-lg-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{item?.name || "Name"}</h5>
                                            <span className="txt__xs ms-auto text-muted">
                                                Added On {new Date(item?.created_at).toDateString()}
                                            </span><br/>
                                        <p style={{minHeight:'3rem'}} className="card-text txt__s truncate-2 text-secondary text__phone">{item?.description || "N/A"}</p>
                                        
                                        <span className="mb-1 txt__xs gap-3 align-items-center d-flex justify-content-start p-1">
                                            <span onClick={() => increaseQuantity.mutate(item?.product_id)} type="button" className="p-1 btn__effect text-success rounded-2 border"> <i class="bi bi-plus-circle fs-6"></i></span>
                                           
                                            <span style={{width: "1.5rem"}} className="fs-6 text-center">{ item?.quantity}</span>
                                            <span onClick={() => decreaseQuantity.mutate(item?.product_id)} type="button" className="p-1 btn__effect text-danger rounded-2 border"> <i class="bi bi-dash-circle fs-6"></i></span>
                                        </span>
                                        <div className="d-flex mt-auto">
                                            <span className=" text-dark-emphasis">
                                                {
                                                    item?.price === 0 ? <span className="text-success">FOR FREE</span> :
                                                    (
                                                        item?.product_discount ? (
                                                            <span className="text___blue"><b className=" fw-light fs-5">$</b>
                                                                {(item?.price - (item?.price * item?.product_discount) / 100).toFixed(2)}
                                                                <span className="ps-2 txt__sm text-decoration-line-through text-danger">${item?.price}</span>
                                                            </span>
                                                        ) : 
                                                        (
                                                            <span className="text___blue"><b className=" fw-light fs-5">$</b>
                                                                {item?.price || 'N/A'}
                                                            </span>
                                                        )
                                                    )
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col justify-content-center align-content-center">
                                    <button className="btn__circle">
                                        <i onClick={() => removeFromCart.mutate(item?.product_id)} className="bi bi-trash3 fs-5 text-danger"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        ))
                    }
                </div>
            </div>
         
            <div className="modal" id="paymentModal" tabIndex="-1" aria-labelledby="paymentModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered justify-content-center">
                    <div className="modal-content rounded-4">
                        <div className="modal-header border-0 p-md-3">
                            <h1 className="modal-title fs-5" id="paymentModal">Payment Details</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div>
                            <div className="modal-body p-md-3">
                                <div className="p-3 rounded-4 bg__light mb-2">
                                    <p className="mb-0 fs-6 text-truncate"><i className="bi bi-geo-alt txt__blue"></i> 
                                    <span className="text-secondary">Location:</span>  {userLocation?.country && <span>{userLocation?.country}, </span>}
                                        {userLocation?.state && <span>{userLocation?.state}, </span>}
                                        {userLocation?.city && <span>{userLocation?.city}, </span>}
                                        {userLocation?.city_district && <span>{userLocation?.city_district}, </span>}
                                        {userLocation?.county && <span><span className="text-dark-emphasis">County: </span>{userLocation?.county}, </span>}
                                        {userLocation?.suburb && <span><span className="text-dark-emphasis">Area/Block: </span>{userLocation?.suburb}, </span>}
                                        {userLocation?.road && <span>{userLocation?.road}, </span>}
                                    </p>
                                </div>
                                <div className="p-3 rounded-4 bg__light mb-2">
                                    <p className="mb-0 fs-6 text-secondary"><i className="bi bi-credit-card-fill txt__blue"></i> Total: <span className="text-dark">${totalAmount.toFixed(2)}</span></p>
                                </div>
                                <p className="text-dark-emphasis txt__s mb-5">Will be delivered in the 2 week or so. idk how to handle this yet xd</p>
                                <div className="txt__sm text-muted">You will be redirected to the payment page </div>
                            </div>
                            <div className="modal-footer rounded-4">
                                <button type="button" className="btn__gray" data-bs-dismiss="modal">Cancel</button>
                                <button onClick={makePayment} type="button" className="btn__purple__grad">Continue to Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )



}