import { useEffect } from "react";
import { Link, useLocation, useNavigate} from "react-router-dom";
import logo from '../assets/shoponaire_noBg__sm.png';
import { useState } from "react";
export function NavTopPhone () {
    const location = useLocation();
    const navigate = useNavigate();
    const rowUrl = location.pathname
    const url = location.pathname.split("/").filter(Boolean);
    const upperCase = url[0];
    const mainUrl = upperCase.charAt(0).toUpperCase() + upperCase.slice(1);
        const [query, setQuery] = useState("");
 
    const handleSearch = (e) => {
        e.preventDefault();
        const trueQuery = query.trim();
        if (!trueQuery) return;

        navigate(`/user/search?q=${encodeURIComponent(trueQuery)}`);
    };

    return  (
        <div className="mb-auto NavTopPhone d-none bg-white p-3 pt-4 shadow-sm">
            <div className="d-flex align-items-center position-sticky justify-content-between align-content-center">
                {
                    rowUrl === "/user/explore" ? '' :
                    <span type="button" onClick={() => navigate(-1)}><i class="fa-solid fa-chevron-left txt__gray"></i></span>
                }
                <span>
                    <form className="ms-4 " onSubmit={handleSearch}>
                        <div className="d-flex input-group">
                            <span className="input-group-text form__sm  bg-white border__white">
                                <i onClick={() => setToggleSearch(prev => !prev)} type="button" className="bi bi-search"></i>
                            </span>
                            <input 
                           
                            onChange={(e) => setQuery(e.target.value)} 
                            className="border__white form__sm form-control border-start-0 py-0 border-end-0 txt__xs" 
                            type="text" placeholder="Search..."/>
                            <span className="input-group-text form__sm bg-white py-0 border-0 border-top border-bottom">
                            {
                                query ? <i onClick={() => setQuery("")} type="button" className="bi bi-x text-danger pe-2 fs-5 appear__normal"></i> : '' 
                            }
                            </span>
                            <button className="btn__gray px-2 border-0 py-0 txt__xxs form__sm">Search</button>
                        </div>
                    
                    </form>
                </span>
                <span className="txt__blue fs-6"> 
                    <Link to={'explore'}><img src={logo} height={30} /></Link>
                </span>
            </div>

        </div>
    )
}