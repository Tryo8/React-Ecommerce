import { Link, NavLink, useNavigate } from "react-router-dom"
import cartImg from '../assets/images/cart.png';
import { useContext, useState , useEffect} from "react";
import { UserContext } from "../core/context/UserContext";
import { miAxios } from "../core/axios/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../core/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import userDefault from '../assets/images/userDefault.png';
import { useLogout } from "../core/hooks/useLogout";
import PopoverSm from "../uicomponents/PopoverSm";
import logo from '../assets/shoponaire_noBg__sm.png';
import Avatar from "../uicomponents/Avatar";
import { getCartItemsQueryOptions } from "../core/queryOptions/queries";
import {  useRef } from "react";
import Collapse from "bootstrap/js/dist/collapse";

function NavBar() {
    const { user } = useContext(UserContext);
    const { auth, loading} = useAuth();
    const sginedIn = !!user && !!auth.accessToken && !loading;
    const userId = user?.id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const logout = useLogout();
    const [query, setQuery] = useState("");
    const [toggleSearch, setToggleSearch] = useState(false);
    const [geo, setGeo] = useState(null);
    const flags = {
        EG: "egypt",
        US: "united-states-of-america",
        DE: "germany",
        FR: "france",
        GB: "united-kingdom",
        IT: "italy",
        ES: "spain",
        CA: "canada",
        AU: "australia",
        BR: "brazil",
        JP: "japan",
        SA: "saudi-arabia",
    };
    const { data: cartItems = []} = useQuery(getCartItemsQueryOptions(userId));

    const collapseRef = useRef(null);
    const bsCollapse = useRef(null);

    useEffect(() => {
        if (collapseRef.current) {
            bsCollapse.current = new Collapse(collapseRef.current, { toggle: false });
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const trueQuery = query.trim();
        if (!trueQuery) return;

        navigate(`/user/search?q=${encodeURIComponent(trueQuery)}`);
    };

    
    useEffect(() => {
        miAxios.get("/api/geo").then(res => {
            setGeo(res.data);
        } 
    ) 
    }, []);

  
    return(
        <nav className="navbar  navbar-expand-lg bg__gray">
            <div className="container-fluid">
                <a className="navbar-brand">
                    <img src={logo} height={36} />
                </a>
                <button className="navbar-toggler" type="button" onClick={() => bsCollapse.current.toggle()} aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" ref={collapseRef} id="navbarNav">
                    <ul className="navbar-nav d-flex align-items-center align-content-center">
                        <NavLink to="/user/explore" className={({ isActive }) =>
                            `nav-link text-decoration-none ${isActive ? "active" : ""}`}>
                            Explore
                        </NavLink>
                        

                        <NavLink to="/user/discounts" className={({ isActive }) =>
                            `nav-link text-decoration-none ${isActive ? "active" : ""}`}>
                            Hot Sale
                        </NavLink>


                        <NavLink to="/user/orders" className={({ isActive }) =>
                            `nav-link text-decoration-none ${isActive ? "active" : ""}`}>
                            Orders
                        </NavLink>
                        <div className="nav-link text-decoration-none large__dropdown__toggle">
                            Menu
                            <div className="large__dropdown rounded-2 shadow bg-light p-md-3">
                                <div className="row">
                                    <h6 className="txt__sm text-dark">categories</h6>
                                    <div className="col p-1">
                                        <ul>
                                            <li><Link to="/user/products-categories/electronics" className="dropdown-item">Electronics</Link></li>
                                            <li><Link to="/user/products-categories/tech" className="dropdown-item">Tech</Link></li>
                                            <li><Link to="/user/products-categories/fashion" className="dropdown-item">Fashion</Link></li>
                                        </ul>
                                    </div>
                                     <div className="col p-1">
                                        <ul>
                                            <li><Link to="/user/products-categories/sports" className="dropdown-item">Sports</Link></li>
                                            <li><Link to="/user/products-categories/beauty" className="dropdown-item">Beauty</Link></li>
                                            <li><Link to="/user/products-categories/fitness" className="dropdown-item">Fitness</Link></li>
                                        </ul>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </ul>
                    {
                        toggleSearch ? (
                            <form className="ms-4 appear__side__left" onSubmit={handleSearch}>
                                <div className="d-flex input-group">
                                    <span className="input-group-text bg-white border__white">
                                        <i onClick={() => setToggleSearch(prev => !prev)} type="button" className="bi bi-search"></i>
                                    </span>
                                    <input 
                                    value={query} 
                                    onChange={(e) => setQuery(e.target.value)} 
                                    className="border__white form-control border-start-0 border-end-0 txt__s" 
                                    type="text" placeholder="Search..."/>
                                    <span className="input-group-text bg-white py-0 border__white">
                                    {
                                        query ? <i onClick={() => setQuery("")} type="button" className="bi bi-x text-danger pe-2 fs-5 appear__normal"></i> : '' 
                                    }
                                    </span>
                                    <button className="btn__gray px-2 border-0">Search</button>
                                </div>
                           
                            </form>
                        ): (  <button onClick={() => setToggleSearch(prev => !prev)} className="btn__circle ms-3"><i className="bi bi-search"></i></button>)
                    }
                    
                  
                    
                    {
                        sginedIn ?
                        <span className=" ms-auto align-items-center">
                            <div className="d-flex align-items-center gap-4 align-content-center">
                                     
                                <span className="ms-auto">
                                    <img height={15} className="" 
                                    src=
                                    {
                                        geo?.country
                                        ? `https://cdn.countryflags.com/thumbs/${flags[geo?.country]}/flag-3d-500.png`
                                        : undefined
                                    } />
                                </span>

                                <NavLink to="/user/cart" className={({ isActive }) =>
                                    `nav-link text-decoration-none position-relative ${isActive ? "active" : ""}`}>
                                    <i className="bi bi-cart3 fs-5"></i>
                                    <span className="txt__xxs position-absolute top-0 start-75 translate-middle badge rounded-pill bg__blue">
                                        {cartItems?.length || 0}
                                    </span>
                                </NavLink>
                                <div className="dropdown dropstart">
                                    {
                                        user?.user_img ? user?.user_img :  user?.avatar ?
                                        <img 
                                        type="button" 
                                        data-bs-toggle="dropdown" 
                                        width={30} 
                                        className="rounded-pill dropdown-toggle" 
                                        src={user?.user_img ? user?.user_img :  user?.avatar || userDefault} 
                                        onError={(e) => {e.target.onerror = null; e.target.src = userDefault}}
                                        alt="user pfp"/>  :
                                        <span  type="button" 
                                        data-bs-toggle="dropdown"><Avatar name={user?.username} size={30}/></span>
                                    }
                                    <ul className="dropdown-menu rounded-2">
                                        <li><Link className="dropdown-item" to="profile">
                                           <i className="bi bi-person"></i> Profile
                                        </Link></li>
                                        <li><button className="dropdown-item text-danger" 
                                            popoverTarget="logout">
                                            <i className="bi bi-power"></i> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </span>
                        :   
                        <span className="ms-auto">
                            <button onClick={() => navigate('/signIn')} className="btn__register rotating-border">Sign In
                                <i className="bi bi-box-arrow-in-right i__replace"></i>
                            </button>
                        </span>
                    }
                   <PopoverSm id={"logout"} message={"Are You Want Logout?"} clickFn={() => logout.mutate()} type={"error"} />
                </div>
            </div>
        </nav>
    )

}

export default NavBar