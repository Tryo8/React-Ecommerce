import LoadingContextProvider from "../core/context/LoaderContext"
import { GlobleSpinner } from "../core/utils/GlobleSpinner"
import NavBar from "../layout-components/NavBar"
import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import { Footer } from "../layout-components/Footer"
import { PhoneNav } from "../layout-components/PhoneNav"
import { NavTopPhone } from "../layout-components/NavTopPhone"

function UserLayout () {
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(el => {new bootstrap.Tooltip(el);});
    }, []);
    return(
        <div className="user-layout min-vh-100 ">
            <LoadingContextProvider>
                <NavBar/>
                <NavTopPhone/>
                <div className="main-content min-vh-100">
                    <Outlet/>
                </div>
                {/* BUTTON FOR GOING TOP PAGE*/}
                <a data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Scroll Top" href='#top' className="back__top">
                    <i className="bi bi-arrow-up fs-6"></i>
                </a>

                <GlobleSpinner/>
                <Footer/>
                <PhoneNav/>
            </LoadingContextProvider>
        </div>
    )

}

export default UserLayout