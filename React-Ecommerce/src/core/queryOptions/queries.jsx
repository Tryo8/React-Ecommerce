import { queryOptions } from "@tanstack/react-query";
import { miAxios } from "../axios/axios.js";
import { mutationOptions } from "@tanstack/react-query";
import { decode } from "@msgpack/msgpack";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { errorToast } from "../utils/errorToast.jsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.jsx";


export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: async () => {
    const res = await miAxios.get("/products/get-products");
    return res.data;
  },
});

export const productQueryOptions = (uuid) => queryOptions({
  queryKey: ["product", uuid],
  queryFn: async () => {
    const res = await miAxios.get(`/products/get-product/${uuid}`);
    return res.data;
  }
});

export const categoriesQueryOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const res = await miAxios.get("/products/get-categories");

    return res.data;
  },
});

export const productsByCategoryQueryOptions = (category) => queryOptions({
  queryKey: ["products-category", category],
  queryFn: async () => {
    const res = await miAxios.get(`/products/get-products-by-category/${category}`);
    console.log(res.data)
    return res.data;
  },
  enabled: !!category,
});


export const productReviewsQueryOptions = (productId) => queryOptions({
  enabled: productId != null,
  queryKey: ["productReviews", productId],
  queryFn: async () => {
    const res = await miAxios.get(`/products/get-product-reviews/${productId}`);
    return res.data;
  },
});


export const useReviewQueryOptions = (productId, userId) => queryOptions({
    enabled: !!productId && !!userId,
  queryKey: ["userReview", productId,userId],
  queryFn: async () => {
    const res = await miAxios.get(`/products/get-product-review/${productId}/${userId}`);
    return res.data;
  },
});

export const mainUserQueryOption = (product_id) => queryOptions({
  queryKey: ["main-user-review", product_id],
  queryFn: async () => {
    const axiosPrivate = useAxiosPrivate();
    const res = await axiosPrivate.get(`/user/get-user-review/${product_id}`);
    return res.data;
  }
});


export const searchProductsQuery = (q) => ({
  queryKey: ["searchProducts", q], 
  queryFn: async () => {       
    const res = await miAxios.get(`/products/search-products?q=${encodeURIComponent(q)}`);
    return res.data;
  },
  enabled: !!q,
});

export const filterPriceProductsQuery = (q) => ({
  queryKey: ["filterPriceProducts", q], 
  queryFn: async () => {       
    const res = await miAxios.get(`/products/filter-price?q=${encodeURIComponent(q)}`);
    return res.data;
  },
  enabled: !!q,
});


// CART

// GET CART ITEMS
export const getCartItemsQueryOptions= (userId) => queryOptions({
  enabled: !!userId,
  queryKey: ["cartItems", userId],
  queryFn: async () => {
    const res = await miAxios.get(`/products/get-cart-items/${userId}`);
    return res.data;
  }
});


// ORDERS

export const ordersQueryOptions = (userId) => queryOptions({
  enabled:!!userId || userId !== null || undefined,
  queryKey: ["orders", userId],
  queryFn: async () => {
    const res = await miAxios.get(`/products/get-orders/${userId}`);
    return res.data;
  },
});



// LOCATION

const getLocation = queryOptions({
  queryKey: ["user-location"],
  queryFn: async () => {
    const axiosPrivate = useAxiosPrivate();
    const res = await axiosPrivate.get("/user/get-location");
    return res.data
  },
});