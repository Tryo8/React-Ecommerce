import { useEffect, useState, useMemo  } from "react"
import img from '../assets/images/photo.png';
import userDefault from '../assets/images/userDefault.png';
import { miAxios } from "../core/axios/axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingContext } from "../core/context/LoaderContext";
import { useContext } from "react";
import { UserContext } from "../core/context/UserContext";
import { useMutation ,useQueryClient} from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";
import imgError from '../assets/images/corrupted-file.png';
import PopoverSm from "../uicomponents/PopoverSm";
import { ErrorState } from "../core/placeholders/PlaceHolders";
import Viewer from "react-viewer";
import { getCartItemsQueryOptions, ordersQueryOptions, productQueryOptions, productReviewsQueryOptions, productsByCategoryQueryOptions, productsQueryOptions } from "../core/queryOptions/queries";

import Rate from "rc-rate";
import { errorToast } from "../core/utils/errorToast";
import { useAuth } from "../core/context/AuthContext";
import useAxiosPrivate from "../core/hooks/useAxiosPrivate";
import Avatar from "../uicomponents/Avatar";
import NotFound from "../pages/NotFound";
export function Product() {
    const { user, wishList } = useContext(UserContext);
    const { uuid } = useParams();
    const {auth, loading} = useAuth()
    const { setLoading } = useContext(LoadingContext);
    const [ visible, setVisible ] = useState(false);
    const [btnLoad, setBtnLoad] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const userId = user?.id; 
    const navigate = useNavigate();
    const topRef = useRef();
    const isSignedIn = !!user && !!auth.accessToken && !loading;
    const carouselRef = useRef(null);
    const queryClient = useQueryClient();
    const [reviewId, setReviewId] = useState(0);
    const [report, setReport] = useState({
        reason: '',
        comment: ''
    });

    

    const scroll = (direction) => {
    const el = carouselRef.current;
    const scrollAmount = 450;
        el.scrollBy({
            left: direction === "next" ? scrollAmount : -scrollAmount,
            behavior: "smooth",
        });
    };


    // GET PRODUCT
    const { data: product, isLoading, isError, error, refetch} = useQuery(productQueryOptions(uuid));
    
    //CHECK IF PRODUCT IN USER'S WISH LIST
    const isProductInWishList = wishList.some(p => p.product_id === product?.product_id);

    // GET REVIEWS
    const { data: productReviews = [], isPending} = useQuery(productReviewsQueryOptions(product?.product_id));

    // GET RANDOM PRODUCT OF SAME CATEGORY
    const { data: products = []} = useQuery(productsByCategoryQueryOptions(product?.category));
    
    // GET CART ITEMS   
    const { data: cartItems = []} = useQuery(getCartItemsQueryOptions(userId));
    // GET ORDERS
    const { data: orders = []} = useQuery(ordersQueryOptions(userId));

    const addToCartMutation = useMutation({
        enabled: product?.product_id != null,
        mutationFn: async () => {
            const res = await axiosPrivate.post(`/products/add-to-cart/${product?.product_id}`);
            setBtnLoad(true)
            return res.data;
        },
        onSuccess: () => {
            toast.success("Added to cart successfully");
            queryClient.invalidateQueries({ queryKey: ["cartItems"] });
        },
        onError: (err) => {
            errorToast(err, "Faild to add to cart")
        }
    }); 

    const addToWishListMutation = useMutation({
        enabled: product?.product_id != null,
        mutationFn: async () => {
        const res = await miAxios.post(`/products/add-to-wish-list/${product?.product_id}`,{}, {
             headers: {Authorization: `Bearer ${auth.accessToken}`},
        });
        return res.data;
        },
        onSuccess: () => {
            toast.success("Added to your wish list");
            queryClient.invalidateQueries({ queryKey: ["wishList"] });
        }, onError: (err) => {
            errorToast(err, "Failed to add to wishlist, try again later")
        }
    }); 

    const reportReview = useMutation({
        mutationFn: async (report) => {
            const res = await miAxios.post(
                `/products/report-review/${reviewId}`,
                { report , user_id: user?.id}, // <-- send report in body

            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Reported successfully");
        },
        onError: (err) => {
            errorToast(err, "Failed to report, try again later")
        }
    });

    const handleReport = (e) => {
        e.preventDefault();
        if (!report.reason) {
            toast.error("Please select a reason");
            return;
        }
        reportReview.mutate(report); // <-- send only the report object
    };



    const removeFromWishList = useMutation({
        enabled: !!product?.product_id,
        mutationFn: async () => {
            const res = await miAxios.delete(`/products/remove-wish-list-item/${product?.product_id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["wishList"]);
            toast.success("Removed from wish list");
        },
        onError: (err) => {
            errorToast(err, "Failed to remove from wishlist, try again later")
        }
    });


    async function removeReview( reviewId) {
        if(!product?.product_id) return console.log("wait")
        try{
            const res = await axiosPrivate.delete(`/products/delete-review/${product?.product_id}/${reviewId}/${user?.id}`);
            toast.success("Removed review successfully");
            queryClient.invalidateQueries({ queryKey: ["productReviews"] });
        } catch(err) {
            errorToast(err, "Failed to remove review, Try again later")
        }
        
    }

    // DISPLAY PRODUCTS RELATED TO THE SAME CATEGORY idk logic xd
    function shuffleArray(arr) {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }


    const relatedProducts = useMemo(() => {
        if (!products?.length || !product?.product_id) return [];

        return shuffleArray(
            products.filter(p => p.product_id !== product.product_id)
        ).slice(0, 4);

    }, [products, product?.product_id]);
    
    const isInCart = cartItems.some(item => item?.product_id === product?.product_id);
    const isInOrders = orders.some(item => item?.product_id === product?.product_id);
    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth" });
        setLoading(isLoading);

        console.log(product)

    }, [isLoading, setLoading,user,productReviews]);

    if(isError) {
        if(error.status === 404) return <NotFound/>
        return <ErrorState message={"Error loading product"} refetchFn={refetch}/>
    }


    return(
        <div className="container my-4">
            <div className="row gap-2 mb-3 rounded-4 p-4 bg__light">
                <figure className="d-grid col-lg-3 position-relative img__product">
                    <img 
                    type="button"
                    onError={(e) => {e.target.onerror = null; e.target.src = img}} 
                    onClick={() => setVisible(true)} loading="lazy" 
                    className="rounded-4 object-fit-cover img-fluid"
                    src={product?.product_img || img}  alt={product?.name || "product display image"}/>
                    <span  onClick={() => setVisible(true)} className="icon__view text-center position-absolute top-50 start-50 translate-middle text-white">
                        <i className="bi bi-eye-fill fs-4"></i>
                        <div>view</div>
                    </span>
                   
                    <small className="txt__xs text-muted text-center">Added On {new Date(product?.created_at).toDateString() || "Unknown date"}</small>

                    <Viewer visible={visible} onClose={() => setVisible(false) } images={[{src: product?.product_img, alt: product?.name}]} />
                </figure>

                <div className="col">
                    <h3 className="mb-0">{ product?.name || "product name"}</h3>
                    <PopoverSm linkName={'Sign In'} link={'signIn'} message={'Please sign in first to countinue'} type={"notification"} id={"notification"} />
                    <div className="p-1">
                        <div className="d-flex">
                            <p className="txt__blue">{product?.category || "N/A"}</p>
                            <div className="ms-auto d-flex gap-2 justify-content-end">
                                {
                                    isSignedIn ?

                                    isProductInWishList ?  
                                    <button onClick={() => removeFromWishList.mutate()}  className="btn__circle">
                                    <i className="bi bi-heart-fill text-danger"></i></button>:
                                    <button onClick={() => addToWishListMutation.mutate({ productId: product.id })} 
                                    className="btn__circle"><i className="bi bi-heart-fill text-muted"></i></button>

                                    : <button popoverTarget="sginIn" 
                                    className="btn__circle"><i className="bi bi-heart-fill text-muted"></i></button>

                                }
                                <PopoverSm id={'sginIn'} type={'notification'} message={"Please sign in first to countinue"} link={'signIn'} linkName={'Sign In'} />
                                {
                                    isSignedIn ?
                                    <>
                                        {
                                            product?.status === "out_of_stock" ||  product?.status === "Unkown" ? (<span className="ms-auto text-danger align-items-center align-content-center">Out Of Stock</span>) : 
                                            (
                                                    
                                                isInCart ? 
                                                <button onClick={() => navigate('/user/cart')} className="btn__blue">Go to Cart <i class="bi bi-arrow-right"></i></button>
                                                :
                                                isInOrders ? <span className="align-content-center txt__purple">Ordered</span> :
                                                <button onClick={() =>addToCartMutation.mutate({ productId: product.id })} className="btn__purple__grad justify-content-between">Add to Cart<i className="bi bi-cart-plus ms-2"></i></button> 
                                            
                                            )
                                        }
                                    
                                    </>
                                    :
                                    <button popoverTarget="notification"  className="btn__yellow ms-auto">Add to Cart<i className="bi bi-cart-plus"></i></button>
                                } 
                            </div>
                        </div>
   
                        <span className="fw-bold">Description</span>
                        <p className="text-secondary text__s">{product?.description || "No description was provided or found"}</p>
                    </div>
                    <span className="mt-auto fs-5">   
                        {
                            product?.price === 0 ? <span className="text-success">FOR FREE</span> :
                            (
                                product?.product_discount ? (
                                    <span className="text___blue"><b className=" fw-light fs-5">$</b>
                                        {(product?.price - (product?.price * product?.product_discount) / 100).toFixed(2)}
                                        <span className="ps-2 txt__sm text-decoration-line-through text-danger">${product?.price}</span>
                                    </span>
                                ) : 
                                (
                                    <span className="text___blue"><b className=" fw-light fs-5">$</b>
                                        {product?.price || 'N/A'}
                                    </span>
                                )
                            )
                        }
                    </span>
                </div>
            </div>

            <div className=" position-relative p-2">
                {
                    relatedProducts.length === 0 ? '' : 
                    (<>
                
                        <h5 className="mb-4">You may also like <i className="bi bi-bag-heart"></i></h5>
                        <button onClick={() => scroll("prev")} className="btn__circle btn__arrow__left position-absolute z-3 end-100 top-50">
                        <i className="fa-solid fa-chevron-left fs-5"></i>
                        </button>
                        <div className="row px-3 my-2 flex-nowrap overflow-hidden position-relative" ref={carouselRef}>
                        
                            {
                                relatedProducts.map((product) => 
                                    <div key={product?.product_id} style={{height:'22rem', perspective:" 1000px"}} className="col-6 col-md-5 col-sm-6  col-lg-3 p-1 rounded-4" >
                                        <div onClick={() => navigate(`/user/product/${product?.product_uuid}`)} className="card shadow-sm bg__light card__product border-0 rounded-4 h-100">
                                            <img onError={(e) => {e.target.onerror = null; e.target.src = img}} height={160} width={160} className="card-img-top rounded-top-4 object-fit-cover" src={product?.product_img || img} alt="product display image"/>
                                            <div className="card-body p-3">
                                                <h5 className="text-truncate">{ product?.name || "N/A"}</h5>
                                                <p style={{height:'3rem'}} className="mb-0 truncate-2 text-secondary txt__s">{ product?.description || "N.A"}</p>
                                                <small>{ product?.category || "N/A"}</small>
                                            </div>
                                            <div className="d-flex mt-auto px-3 pb-3 align-items-center">
                                            {
                                                product?.price === 0 ? <span className="text-success">FOR FREE</span> :
                                                (
                                                    product?.product_discount ? (
                                                        <span className="text___blue"><b className=" fw-light fs-5">$</b>
                                                            {(product?.price - (product?.price * product?.product_discount) / 100).toFixed(2)}
                                                            <span className="ps-2 txt__sm text-decoration-line-through text-danger">${product?.price}</span>
                                                        </span>
                                                    ) : 
                                                    (
                                                        <span className="text___blue"><b className=" fw-light fs-5">$</b>
                                                            {product?.price || 'N/A'} {product?.product_discount }
                                                        </span>
                                                    )
                                                )
                                            }
                                            {
                                                product?.status === "out_of_stock" ? <span className="ms-auto txt__xs text-danger">Out of Stock</span> : ""
                                            }
                                                
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        
                        </div>
                        <button  onClick={() => scroll("next")} className="btn__circle btn__arrow__right position-absolute z-3 start-100 top-50">
                            <i className="fa-solid fa-chevron-right fs-5"></i>
                        </button>
                    </>)
                }
            </div>
            
            <div className="card bg-transparent p-3 rounded-4 border-0">
                <h5 className="mb-4">Reviews <i className="bi bi-chat-left-heart "></i></h5>
                <div className="row align-items-start justify-content-">
                {
                    productReviews.length === 0 ? (<div className="text-center text-muted">There are no reviews</div>) :
                    (
                        <>
                            <div className="col-12 col-md-6 col-lg-9">
                                {
                                    productReviews.length === 0 ? (<div className="text-center text-muted">There are no reviews</div>) :
                                    (
                                        productReviews.map((review) => (
                                            <div key={review?.review_id} className="d-grid p-3 ps-4 border rounded-4 my-3">
                                                <div className="d-flex position-relative align-items-center">
                                                    <span onClick={() => 
                                                    navigate(`/user/user/${review?.user_uuid}/${review?.product_id}`)} 
                                                    style={{top:'-31px', cursor:'pointer'}} 
                                                    className="position-absolute main__bg rounded-4 d-flex align-items-center gap-1">
                                                    {
                                                        review?.avatar || review?.user_img ? 
                                                        <img 
                                                        onError={(e) => {e.target.onerror = null; e.target.src = userDefault}} 
                                                        className="rounded-circle" 
                                                        height={30} 
                                                        src={review?.avatar || review?.user_img || userDefault} />
                                                        :
                                                        <span><Avatar name={review?.username} size={30} /></span>
                                                        
                                                    }
                                                        
                                                        <span className="text-dark">{review?.username || "unknownUser"}</span>
                                                    </span>
                                                </div>
                                                <p className="pt-3 mb-2 txt__gray truncate-8">
                                                    {review?.comment || "Failed to load comment"}
                                                </p>
                                                <div className="txt__sm text-muted">Reviewed On {new Date(review?.created_at).
                                                toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", })}</div>
                                                <div className="d-flex align-items-center">
                                                    <Rate style={{fontSize:'1.3rem'}} value={review?.rating} count={5} defaultValue={5}  disabled/>
                                                    {
                                                        isSignedIn && user && review?.id === user?.id ? 
                                                        <button  popoverTarget={`deleteReview-${review.review_id}`} className="ms-auto btn__circle">
                                                            <i className="bi bi-trash3 text-danger"></i>
                                                        </button> : 
                                                        <>
                                                            {
                                                                isSignedIn ? 
                                                                    (<span 
                                                                        onClick={() => setReviewId(review?.review_uuid)}
                                                                        className="ms-auto text-secondary txt__sm semi__link"
                                                                        data-bs-toggle="modal" data-bs-target="#reportModal">
                                                                        Report
                                                                    </span>) :                    
                                                                    (<button 
                                                                        popoverTarget="notification"
                                                                        className="ms-auto text-secondary bg-transparent border-0 txt__sm semi__link">
                                                                        Report
                                                                    </button>)                                  
                                                            }
                                                        </>
                                                    }
                                                </div>
                                                <PopoverSm  id={`deleteReview-${review?.review_id}`} type={"error"} message={"Are You Want Remove Your Review?"} clickFn={() => removeReview(review?.review_id)}/>
                                            </div>
                                        ))
                                    )

                                }
                            </div>
                            <div className="col-12 col-md-5 col-lg-3">
                                <div className="card rounded-4 bg__light border-0 p-3 my-3">
                                    <h5>Customer Reviews</h5>
                                    {
                                        <>
                                            <h5 className="fw-bold text-dark">
                                            {(
                                                productReviews.reduce((sum, r) => sum + r.rating, 0) /
                                                productReviews.length
                                            ).toFixed(1)} Stars
                                            </h5>

                                            <Rate disabled allowHalf style={{ fontSize: '1.4rem' }}
                                            value={
                                                productReviews.reduce((sum, r) => sum + r.rating, 0) /
                                                productReviews.length
                                            }/>

                                            <small className="text-muted">
                                                {
                                                    productReviews.length === 1 ? <span>{productReviews.length} review</span> : (<span>{productReviews.length} reviews</span>)
                                                } 
                                            </small>
                                        </>  
                                    }
                                </div>
                            </div>
                        </>
                    )
                }
                </div>
            </div>


            <div className="modal" id="reportModal" tabIndex="-1" aria-labelledby="reportModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered justify-content-center">
                    <div style={{width:'26rem'}} className="modal-content rounded-4">
                        <div className="modal-header border-0">
                            <h1 className="modal-title fs-5 text-danger" id="reportModal"><i className="bi bi-flag"></i> Report</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleReport}>
                            <div className="modal-body px-3">
                                <h5>Select reason</h5>
                                <div className="form-check btn__effect py-1 rounded-2">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="inappropriate"
                                        name="reason"
                                        value="inappropriate"
                                        checked={report.reason === "inappropriate"}
                                        onChange={(e) => setReport(prev => ({ ...prev, reason: e.target.value }))}
                                    />
                                    <label htmlFor="inappropriate" className="form-check-label">Inappropriate</label>
                                </div>
                                <div className="form-check btn__effect py-1 rounded-2">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="reason"
                                        id="off-topic"
                                        value="off-topic"
                                        checked={report.reason === "off-topic"}
                                        onChange={(e) => setReport(prev => ({ ...prev, reason: e.target.value }))}
                                    />
                                    <label htmlFor="off-topic" className="form-check-label">Off Topic</label>
                                </div>
                                <div className="form-check btn__effect py-1 rounded-2">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="reason"
                                        id="other"
                                        value="other"
                                        checked={report.reason === "other"}
                                        onChange={(e) => setReport(prev => ({ ...prev, reason: e.target.value }))}
                                    />
                                    <label htmlFor="other" className="form-check-label">Other</label>
                                </div>
                                <div className="mb-3 mt-3">
                                    <label className="form-label">Comment</label>
                                    <textarea
                                        placeholder="Enter Your Comment Here"
                                        className="form-control"
                                        rows="3"
                                        value={report.comment}
                                        onChange={(e) => setReport(prev => ({ ...prev, comment: e.target.value }))}
                                    ></textarea>
                                    <div className="form-text txt__sm">Please describe your reason the comment feild above</div>
                                </div>
                            </div>
                            <div className="modal-footer rounded-4">
                                <button type="button" className="btn__gray" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn__red" data-bs-dismiss="modal">Submit Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}