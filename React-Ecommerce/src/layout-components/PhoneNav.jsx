
import { useQuery } from "@tanstack/react-query";
import { Link, NavLink, useNavigate } from "react-router-dom"
import { getCartItemsQueryOptions } from "../core/queryOptions/queries";
import { useContext } from "react";
import { UserContext } from "../core/context/UserContext";
import { useAuth } from "../core/context/AuthContext";


export function PhoneNav () {
    const { user } = useContext(UserContext);
    const userId = user?.id
    const { data: cartItems = [], isLoading, isError, refetch} = useQuery(getCartItemsQueryOptions(userId));
    const { auth, loading} = useAuth();
    const sginedIn = !!user && !!auth.accessToken && !loading;
    return  (
        <footer className="mt-auto phone__nav position-fixed p-3 bg-white shadow mb-0">
            <div className="row align-items-center">
            
                <NavLink to="/user/explore" className={({ isActive }) =>
                    `nav-link text-decoration-none rounded-2 col align-items-center text-center px-1  ${isActive ? "active" : ""}`}>
                    <i className="bi bi-house fs-4"></i>
                </NavLink>
                <NavLink to="/user/cart" className={({ isActive }) =>
                    `nav-link text-decoration-none col align-items-center text-center position-relative px-1  ${isActive ? "active" : ""}`}>
                    <i className="bi bi-cart3 fs-4"></i>
                    <span className="txt__xxs position-absolute top-0 start-75 translate-middle badge rounded-pill bg__blue">
                        {cartItems.length || 0}   
                    </span>
                </NavLink>
                <NavLink to="/user/discounts" className={({ isActive }) =>
                    `nav-link text-decoration-none col align-items-center text-center px-1  ${isActive ? "active" : ""}`}>
                        <i className="bi bi-tags fs-4"></i>
                </NavLink>
                {
                    sginedIn ?
                
                    <NavLink to="/user/profile" className={({ isActive }) =>
                        `nav-link text-decoration-none col align-items-center text-center px-1  ${isActive ? "active" : ""}`}>
                            <i className="bi bi-person fs-4"></i>
                    </NavLink> :
                    <NavLink to="/signIn" className={({ isActive }) =>
                        `nav-link text-decoration-none col align-items-center text-center px-1  ${isActive ? "active" : ""}`}>
                           <i class="bi bi-box-arrow-in-right fs-4"></i>
                    </NavLink>

                }
            </div>

        </footer>
    )
}