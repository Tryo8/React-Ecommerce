import { useEffect, useState } from "react"
import img from '../assets/images/photo.png';
import { useContext  } from "react";
import { LoadingContext } from "../core/context/LoaderContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import imgError from '../assets/images/corrupted-file.png';
import { filterPriceProductsQuery, productsByCategoryQueryOptions, productsQueryOptions } from "../core/queryOptions/queries";
import { miAxios } from "../core/axios/axios";
import { errorToast } from "../core/utils/errorToast";
import { EmptyState } from "../core/placeholders/PlaceHolders";
import searchImg from '../assets/images/empty-search.png';
export function ProductsByCategory () {

    const { setLoading } = useContext(LoadingContext);
    const navigate = useNavigate();
    const { category } = useParams();
    const [priceQuery, setPriceQuery] = useState(200);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);



    const { data: products = [], 
        isPending, isError, error} = useQuery(productsByCategoryQueryOptions(category));



    if(isError) {
        console.log(isError)
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


    // function shuffleArray(arr) {
    //     const newArr = [...arr];
    //     for (let i = newArr.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    //     }
    //     return newArr;
    // }

    // const shuffledProducts = shuffleArray(products);
    // const numberOfItems = 5;
    // const displayedProducts = shuffledProducts.slice(0, numberOfItems);
    const productsArray = Array.isArray(products) ? products : [products];
    const highestPrice = Math.max(...products.map(p => p.price));


    const filteredProducts = productsArray.filter((product) => product.price >= minPrice && product.price <= maxPrice);

    function reset() {
        setMaxPrice(highestPrice)
        setMinPrice(0)
    };

    useEffect(() => {
        setLoading(isPending);
        setMaxPrice(highestPrice)
    }, [isPending, setLoading]);

    return(
        <div className="container my-4">
            <div className="p-3 row rounded-4 bg__light d-flex gap-3 mb-3 align-items-center">
                <div className="col d-flex gap-3 align-items-center">
                    <span className=" bg__white rounded-5 p-2 px-3 fw-semibold">Price</span>
                    <label htmlFor="lowestPrice" className="text-danger">Lower</label>
                    <input
                        className="form-range"
                        type="range"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        id="lowestPrice" min={0} max={1000}
                    />
                    
                    <label htmlFor="heighestPrice" className="text-success">Higher</label>
                    <input
                        className="form-range"
                        type="range"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        id="heighestPrice" min={0} max={10000}
                    />
                </div>
                <div className="col-5 d-flex align-items-center">
                    <span style={{width:'15'}} className="d-flex align-items-center align-content-center justify-content-center p-1 rounded-5">
                        {
                            minPrice !== 0 || highestPrice !== maxPrice  ? 
                            <i type="button" onClick={reset} className="bi bi-x-circle fs-5 appear__normal me-1 text-danger"></i> : '' 
                        }
                        <i className="bi bi-arrow-down-short fs-5 text-danger"></i>
                        <span style={{width:'5rem'}} className=" text-center">
                            <input 
                            placeholder="minumum" 
                            type="number" 
                            inputMode="numeric"
                            className="w-100 rounded-5 form-control txt__sm" 
                            value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} />
                        </span>
                        <i className="bi bi-arrow-up-short fs-5 text-success"></i>
                        <span style={{width:'5rem'}} className=" text-center">
                            <input 
                            placeholder="maximum" 
                            type="number"
                            inputMode="numeric"
                            className="w-100 rounded-5 form-control txt__sm"
                            value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}/>
                        </span>
                    </span> 
                </div>         
            </div>
            <div className="row px-2 my-2">
                {
                    filteredProducts.length === 0 ? <EmptyState customImg={searchImg} message={"No Results"}/>  :
                   filteredProducts.map((product) => 
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
                                    product?.product_discount ? (
                                        <span className="text___blue"><b className=" fw-light fs-5">$</b>
                                            {(product?.price - (product?.price * product?.product_discount) / 100).toFixed(2)}
                                            <span className="ps-2 txt__sm text-decoration-line-through text-danger">${product?.price}</span>
                                        </span>
                                    ) : 
                                    (
                                        product?.price === 0 ? <span className="text-success">FREE</span>
                                        :
                                        <span className="text___blue"><b className=" fw-light fs-5">$</b>
                                            {product?.price || 'N/A'}
                                        </span>
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
        </div>
    )
}