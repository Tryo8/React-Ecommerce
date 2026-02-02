import { useEffect, useState } from "react"
import img from '../assets/images/photo.png';
import { miAxios } from "../core/axios/axios";
import { useContext  } from "react";
import { LoadingContext } from "../core/context/LoaderContext";
import { useQuery } from "@tanstack/react-query";
import PopoverSm from "../uicomponents/PopoverSm";
import { useNavigate } from "react-router-dom";
import imgError from '../assets/images/corrupted-file.png';
import { productsQueryOptions } from "../core/queryOptions/queries";
export function Products () {

    const { setLoading } = useContext(LoadingContext);
    const navigate = useNavigate();


    const { data: products = [], isPending, isError, error, refetch} = useQuery(productsQueryOptions);
    const [visibleCount, setVisibleCount] = useState(16); // first 8 products


    useEffect(() => {
        const handleScroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                // reached bottom, load more
                setVisibleCount(prev => Math.min(prev + 4, products.length));
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [products.length]);

    useEffect(() => {
        setLoading(isPending);
    }, [isPending, setLoading]);

    if(isError) {
        return<div className="container min-vh-100 justify-content-center align-content-center text-center">
            <div className="d-flex justify-content-center">
                <img src={imgError} height={140} alt="corrupted-file image"/>
            </div>
            <div className="text-danger">Oops something went wrong, Try again later.</div>
            <div className="d-flex justify-content-center mt-3">
                <button className="btn__gray" onClick={() => refetch()}>Refresh</button>
            </div>
        </div>
    };
    const s = "col-6 col-md-5 col-sm-6"  
    return(
        <div className="row px-2 my-2">
            {
                products.slice(0, visibleCount).map((product) => 
                    <div  key={product?.product_id} 
                    style={{height:'22rem', perspective:" 1000px"}} className="col-6 col-md-5 col-sm-6 col-lg-3 p-1 rounded-4" >
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
                                            {product?.price || 'N/A'}
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
         {visibleCount < products.length && 
            <div className="d-flex justify-content-center mt-3">
                <div className="spinner-border txt__blue" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
        </div>
    )
}