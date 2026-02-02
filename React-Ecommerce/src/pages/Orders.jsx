import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mainUserQueryOption, ordersQueryOptions } from "../core/queryOptions/queries";
import { useContext, useEffect, useRef, useState } from "react";
import { EmptyState, ErrorState } from "../core/placeholders/PlaceHolders";
import { UserContext } from "../core/context/UserContext";
import { LoadingContext } from "../core/context/LoaderContext";
import imgBox from '../assets/images/box.png';
import img from '../assets/images/photo.png';
import { errorToast } from "../core/utils/errorToast";
import { toast } from "sonner";
import useAxiosPrivate from "../core/hooks/useAxiosPrivate";
import Rate from "rc-rate";


export default function Orders () {
    const { user } = useContext(UserContext);
    const userId = user?.id;
    const top = useRef()
    const axiosPrivate = useAxiosPrivate()
    const { setLoading } = useContext(LoadingContext);
    const queryClient = useQueryClient();
    const [selectedId, setSelectedId] = useState(0);
    const [selectedComment, setSelectedComment] = useState('');
     const [selectedRate, setSelectedRate] = useState(0);
    const [isSubmmitting, setIsSubmmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [review , setReview] = useState({
        comment: '',
        rating: 0
    })
    const { data: orders = [], isLoading,error, isError, refetch} = useQuery(ordersQueryOptions(userId));
  
    useEffect(() => {
        console.log(orders)
        setLoading(isLoading);
    },[isLoading, setLoading]);

    const setDelivered = useMutation({
        mutationFn: async (product_id) => {
            const res = await axiosPrivate.patch(
                `/products/delivered/${product_id}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Order delivered!")
            queryClient.invalidateQueries(["orders"]);
        },
        onError: (err) => {
            errorToast(err, "Failed to increase quantity, try again later")
        }
    });

    const handleAddReview = async (e, product_id) => {
        setIsSubmmitting(true)
        e.preventDefault();
        try{
            const res = await axiosPrivate.post(`/products/add-review/${product_id}`,review);
            setSuccess(true)
            return toast.success("Review sent successfully")
        } catch (err) {
            return errorToast(err)
        } finally {
            setIsSubmmitting(false);
        }
        
    }

    const removeOrder = useMutation({
        mutationFn: async (order_id) => {
            const res = await axiosPrivate.delete(`/products/delete-order/${order_id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["wishList"]);
            toast.success("Removed order successfully")
        },
        onError: (err) => {
            errorToast(err, "Failed to remove from wishlist, try again later")
        }
    });

    useEffect(() => {
        top.current?.scrollIntoView({ behavior: "smooth" });
    },[]);


    if(isError) {

        return <ErrorState message={"Error getting orders"} refetchFn={refetch}/>
    }
    return(
        <div className="container my-4">
            <h5 ref={top} className="bg__light p-3 text-center rounded-4">Orders</h5>
            <div className="row justify-content-center gap-2 bg__light border-bottom rounded-4 mx-0 mt-3 p-3">
                <p className="text-center txt__sm text-muted mt-2">orders marked as done will expire in 24 hours time.</p>
                {
                    orders?.length === 0 ? '' :
                    <div className="bg__success text-center text-white txt__s">
                    Your Will Order Arrives In 1 Day</div>
                }
                {
                    orders?.length === 0 ? <EmptyState customImg={imgBox} message={"You have no orders"}/> :
                    orders.map((o) => (
                        <div key={o?.order_id} style={{ minHeight: '6rem' }} className="col-12 col-sm-6 col-md-6 col-lg-3 rounded-4 border p-md-2 justify-content-center  align-items-center align-content-center">
                            <div className="row gap-1 align-items-center">
                                <div className="col-4 col-sm-6 col-md-5 col-lg-4 justify-content-center  align-items-center align-content-center pe-0">
                                    <img style={{ maxHeight: '80px' }}
                                 
                                    src={o?.product_img || img} 
                                    onError={(e) => {e.target.onerror = null; e.target.src = img}}  
                                    className="object-fit-cover img-fluid rounded-4" alt={o?.name || 'Product display image'}/>
                                </div>
                                <div className="col col-sm-6 col-md col-lg align-items-center align-content-center p-1">
                                    <h6 className="text-secondary-emphasis txt__sm text-truncate">{o?.name}</h6>
                                    <div className="d-flex align-items-center">
                                        {
                                            o?.status === "pending" ? 
                                            <span className="text-danger txt__sm">
                                                pending <i className="bi bi-clock-history"></i>
                                            </span> :
                                            o?.status === "delivered" ? 
                                       
                                            <span className="text-success txt__sm">
                                                delivered <i class="bi bi-check2-circle"></i>
                                            </span>
                                            : 
                                            <span className="text-dark-emphasis txt__sm">{o?.status}</span>
                                        }
                                    </div>
                                    <div className="d-flex align-items-center gap-1 pe-2 flex-wrap">
                                        <div className="text-secondary txt__xs">Qty {o?.quantity}</div>
                                        {
                                            o?.status === "pending" ?  
                                            <button className="btn__white__soft txt__xs ms-auto" onClick={() => setDelivered.mutate(o?.product_id)}>Mark as Done</button>
                                            : o?.status === "delivered" ?
                                            <>
                                                <button onClick={() => removeOrder.mutate(o?.order_id)} style={{height:'30px',width:'30px'}} className="btn__white__soft ms-auto">
                                                    <i class="bi bi-trash3 txt__sm text-danger"></i>
                                                </button>
                                                <button className="btn__white__soft txt__xs " 
                                                onClick={() => {setSelectedId(o?.product_id); setSelectedComment(o?.user_comment); setSelectedRate(o?.user_rating)}}  
                                                data-bs-toggle="modal" data-bs-target="#addReviewModal">Leave Review</button>
                                            </>
                                            : o?.status === "expired" ? 
                                            <button onClick={() => removeOrder.mutate(o?.order_id)} style={{height:'30px',width:'30px'}} className="btn__white__soft ms-auto">
                                                <i class="bi bi-trash3 txt__sm text-danger"></i>
                                            </button>
                                            : null
                                          
                                        }

                                    </div>
                    
                                    
                                </div>
                            </div>
                          
                        </div>
                    ))
                }

            </div>

            
            <div className="modal" id="addReviewModal" tabIndex="-1" aria-labelledby="addReviewModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered justify-content-center">
                    <div style={{width:'26rem'}} className="modal-content rounded-4">
                        <div className="modal-header border-0">
                            <h1 className="modal-title fs-5 text-dark-emphasis" id="addReviewModal"><i class="bi bi-chat-left-heart"></i> Review</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={(e) => handleAddReview(e, selectedId)}>
                            <div className="modal-body px-3">
                                <div className="mb-3">
                                    <label className="text-dark-emphasis form-label">Comment</label>
                                    <textarea value={review?.comment || selectedComment || ''} 
                                    onChange={(e) => setReview(prev => ({...prev, comment: e.target.value}))} placeholder="Enter Your Review" className="form-control" rows="3"></textarea>
                                </div>
                                <label className="text-dark-emphasis form-label">Rate</label>
                                <div className="rounded-4 p-2 border d-flex align-items-center">
                                    <i class="bi bi-emoji-frown pe-1 text-danger"></i>
                                    <Rate style={{ fontSize: '1.3rem' }} value={review?.rating || selectedRate || 0} count={5} onChange={(value) =>
                                        setReview(prev => ({...prev,rating: value}))}/>
                                    <i class="bi bi-emoji-smile text-success"></i>
                                </div>
                                
                            </div>
                            <div className="modal-footer rounded-4">
                                <button type="button" className="btn__gray" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn__blue">{
                                    isSubmmitting ? <span><i class="fa-solid fa-spinner fa-spin-pulse"></i> 
                                    Submmiting...</span>: success ? <span><i class="bi bi-check2-circle"></i> Done</span> : 'Send Review'
                                }</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}