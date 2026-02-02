
import { useEffect, useRef } from 'react';
import logo from '../assets/shoponaire_noBg.png';



export function TermsOfService() {

    const top = useRef();


    useEffect(() => {
        top.current.scrollIntoView({ behavior: "smooth"})
    },[]);


    return(
        <div className="container" ref={top}>
            <div className="row justify-content-center">
                <div className="col-12 col-lg-7 terms-content">
                     <h5 ref={top} className="bg__light p-3 text-center rounded-4 mt-4">Terms of Service</h5>
                    <section className="terms-section my-3" id="intro">
                      <p  className="terms-intro mb-5">
                        Welcome to <strong>Shoponaire</strong>. These Terms of Service govern your
                        access to and use of the Shoponaire website, mobile application, and all
                        related services. Our platform provides users with the ability to browse,
                        purchase, and manage products from a variety of sellers in a secure and
                        convenient environment.
                        </p>

                        <p className="terms-intro mb-5">
                        By using Shoponaire, you confirm that you are at least 18 years old or have
                        the consent of a legal guardian, and that you agree to comply with these
                        Terms. Please read them carefully, as they outline your rights, obligations,
                        and limitations when using our Service.
                        </p>
                    </section>

                    <section className="terms-section my-5" id="section1">
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                        By accessing, browsing, or using the Shoponaire application, website, or
                        any related services (collectively referred to as the “Service”), you
                        acknowledge that you have read, understood, and agree to be bound by
                        these Terms of Service and all applicable laws and regulations.
                        </p>
                        <p>
                        If you do not agree with any part of these Terms, you must immediately
                        discontinue use of the Service. Continued use of Shoponaire after changes
                        to these Terms constitutes acceptance of the updated Terms.
                        </p>
                    </section>

                    <section className="terms-section my-5" id="section2">
                        <h2>2. User Accounts</h2>
                        <p>
                        Certain features of Shoponaire require the creation of a user account.
                        When registering, you agree to provide accurate, current, and complete
                        information and to keep your account details up to date.
                        </p>
                        <p>
                        You are solely responsible for maintaining the confidentiality of your
                        login credentials and for all activities conducted under your account.
                        Shoponaire shall not be liable for any loss or damage resulting from
                        unauthorized use of your account.
                        </p>
                        <p>
                        We reserve the right to suspend, restrict, or terminate accounts that
                        violate these Terms, engage in fraudulent activity, or harm other users
                        or the integrity of the Service.
                        </p>
                    </section>

                    <section className="terms-section my-5" id="section3">
                        <h2>3. Orders & Payments</h2>
                        <p>
                        All orders placed through Shoponaire are subject to product availability
                        and order confirmation. We reserve the right to refuse or cancel any order
                        at our discretion, including in cases of pricing errors or suspected
                        fraud.
                        </p>
                        <p>
                        Prices, promotions, product descriptions, and availability may be updated
                        at any time without prior notice. Payment must be completed using the
                        supported payment methods displayed at checkout.
                        </p>
                        <p>
                        Shoponaire is not responsible for delays, errors, or failures caused by
                        third-party payment processors, banks, or financial institutions.
                        </p>
                    </section>

                    <section className="terms-section my-5" id="section4">
                        <h2>4. Shipping, Returns & Refunds</h2>
                        <p>
                        Estimated shipping times provided on Shoponaire are for reference only
                        and may vary due to carrier delays, customs processing, or unforeseen
                        circumstances beyond our control.
                        </p>
                        <p>
                        Return and refund eligibility is governed by our Return Policy and may
                        vary depending on the seller, product category, or promotional conditions.
                        Customers must initiate return requests within the specified return
                        window.
                        </p>
                        <p>
                        Items that arrive damaged, defective, or incorrect must be reported
                        promptly. Failure to comply with return procedures may result in denial
                        of a refund or replacement.
                        </p>
                    </section>

                    <section className="terms-section my-5" id="section5">
                        <h2>5. Limitation of Liability</h2>
                        <p>
                        To the maximum extent permitted by law, Shoponaire shall not be liable for
                        any indirect, incidental, special, consequential, or punitive damages,
                        including but not limited to loss of profits, data, or business
                        opportunities.
                        </p>
                        <p>
                        The Service and all content, products, and features are provided on an
                        “as is” and “as available” basis without warranties of any kind, whether
                        express or implied.
                        </p>
                        <p>
                        In jurisdictions that do not allow certain liability limitations, our
                        liability shall be limited to the fullest extent permitted by applicable
                        law.
                        </p>
                    </section>
                    <p className="px-4">If you have any suggestions or feedback contact us at: <span className="txt__blue">soponaire@gmail.org</span></p>
                </div>

                <div className="col-12 col-lg-2 bg__light px-0">
                    <div className="card__list  text-start py-3 bg-transparent">
                        <ul className="txt__s" style={{listStyle:'none', appearance:'none',padding:'0'}}>
                            <li><a href="#intro">Introduction</a></li>
                            <li><a href="#section1">Acceptance of Terms</a></li>
                            <li><a href="#section2">User Accounts</a></li>
                            <li><a href="#section3">Orders & Payments</a></li>
                            <li><a href="#section4">Returns & Refunds</a></li>
                            <li><a href="#section5">Limitation of Liability</a></li>
                            <li className='d-flex justify-content-center'>
                                <img src={logo} height={100}/>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}