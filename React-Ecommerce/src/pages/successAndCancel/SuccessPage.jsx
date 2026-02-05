import success from '../../assets/images/checks/check.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { UserContext } from '../../core/context/UserContext';
import publicAxios from '../../core/axios/publicAxios';
import useAxiosPrivate from '../../core/hooks/useAxiosPrivate';
import { useRef } from 'react';


function SuccessPage ({mainMessage = 'Operation Successful ', smallMessage = "The operation was successfull"}) {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const queryClient = useQueryClient();
    const { user } = useContext(UserContext);
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate();

    const hasVerified = useRef(false);
    useEffect(() => {
        if (!sessionId || hasVerified.current) return;
        hasVerified.current = true;
        const verifyPayment = async () => {
            if (!sessionId) return;

            try {
                const res = await publicAxios.post("/verify-payment", { sessionId });
                if (res.data.paid) {
                    await axiosPrivate.post("/products/checkout-success")
                    queryClient.invalidateQueries(["cartItems", user?.id]); // clears cart
                    toast.success("Payment successful 🎉");
                } else {
                    toast.error("Payment not completed");
                    navigate("/cart");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error verifying payment");
                navigate("/cart");
            }
        };

        verifyPayment();
    }, [sessionId]);

    return (
        <div className="container min-vh-100 align-content-center">
            <div className="d-flex justify-content-center">
                <div style={{height:'25rem', width:'30rem'}} className="card bg-white shadow rounded-4 p-md-5 align-content-center text-center border-0">
                    <figure className='m-0'>
                        <img height={120} width={120} src={success} alt="empty box"/>
                    </figure>
                    <p className="fs-2 mt-2 text-success">{mainMessage}</p>
                    <small className="text-muted txt__sm">{smallMessage}</small>
                    <div className='d-flex justify-content-center mt-3'>
                        <button onClick={() => navigate('/')} className='btn__white'><i className="bi bi-arrow-left i__appear"></i> Return Home</button>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default SuccessPage