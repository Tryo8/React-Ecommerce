import { useNavigate } from "react-router-dom"
import logo from '../assets/shoponaire_noBg__sm.png';



export function Footer () {
    const navigate = useNavigate();
    return(
        <footer className="mt-auto bg__gray main-footer position-relative">
            <div className="container py-5">
                <div className="row text-center text-md-start gy-3 pb-5">

           
                    <div className="col-12 col-md-4">
                        <h6 className="fw-bold mb-2">Shoponaire</h6>
                        <ul className="list-unstyled txt__s mb-0">
                            <li className="link__affect" onClick={() => navigate("/user/wish-list")}><i className="bi bi-chat-square-heart"></i> Wish List</li>
                             <li className="link__affect" onClick={() => navigate("/user/orders")}><i class="bi bi-box-seam"></i> Orders</li>
                        </ul>
                    </div>

             
                    <div className="col-6 col-md-4">
                        <h6 className="fw-bold mb-2">Company</h6>
                        <ul className="list-unstyled txt__s mb-0">
                            <li className="link__affect" onClick={() => navigate("/about")}>About Us</li>
                            <li className="link__affect" onClick={() => navigate("/contact")}>Contact</li>
                            <li className="link__affect" onClick={() => navigate("/careers")}>Careers</li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-4">
                        <h6 className="fw-bold mb-2">Legal</h6>
                        <ul className="list-unstyled txt__s mb-0">
                            <li className="link__affect"
                                onClick={() => navigate("/user/terms-of-service")}>
                                Terms of Service
                            </li>
                            <li className="link__affect" onClick={() => navigate("/user/privacy-policy")}>
                                Privacy Policy
                            </li>
                            <li className="link__affect" onClick={() => navigate("/user/cookies")}>
                                Cookie Policy
                            </li>
                        </ul>
                    </div>
                </div>
                <hr></hr>
                <div className="p-1 justify-content-center text-center">
                    <figure className="text-center">
                        <img src={logo} height={60} alt="shoponaire logo brand"  />
                    </figure>
                    <span className="txt__sm text-muted"> © {new Date().getFullYear()} Shoponaire. All rights reserved</span>
                </div>
            </div>
        </footer>

    )
}


