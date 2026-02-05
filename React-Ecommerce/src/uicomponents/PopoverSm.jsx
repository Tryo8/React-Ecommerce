import { useNavigate } from "react-router-dom";
import { useEffect, useRef,useState } from "react";



function PopoverSm ({ id, type, message, link, linkName, clickFn, cancelBtn}) {
    const navigate = useNavigate();
    const error = 
        <div className="border-0" popover="auto" id={id} >
            <div id="op">
                <div  className="popover__box border-start border-3 border-danger rounded-4 d-grid p-3 border-0 ">
                    <p className="txt__s d-flex align-items-center mb-0">  
                        <i className="bi bi-exclamation-circle pop text-danger fs-3 me-2"></i>
                        {message}
                    </p>
                    {
                        clickFn ?
                        <div className="d-flex justify-content-end gap-1">
                            <button className="btn__gray" popoverTarget={id} popoverTargetAction="hide">Cancel</button>
                            <button className="btn__red px-3" popoverTarget={id} popoverTargetAction="hide" onClick={clickFn}>Yes</button>
                        </div> 
                     : ''
                    }
                    
                </div>
            </div>
        </div>
    const notification = 
        <div className="border-0" popover="auto" id={id} >
            <div id="op">
                <div  className="popover__box border-start border-3 border-primary rounded-4 d-grid p-3 border-0 ">
                  
                    <p className="txt__s d-flex align-items-center mb-0">  
                        <i className="bi pop txt__blue bi-info-circle fs-3 me-2"></i>
                        {message}<span style={{cursor:'pointer'}} className="ms-1 txt__blue" onClick={() => navigate(`/${link}`)}>{linkName}</span>
                    </p>
                </div>
            </div>
        </div>
    const success = 
            <div className="border-0" popover="auto" id={id} >
                <div id="op">
                    <div  className="popover__box border-start border-3 border-success rounded-4 d-grid p-3 border-0 ">
                    
                        <p className="txt__s d-flex align-items-center mb-0">  
                            <i className="bi bi-check-circle rotate__i me-2 text-success fs-3"></i>
                            {message}<span style={{cursor:'pointer'}} className="ms-1 link-info" onClick={() => navigate(`/${link}`)}>{linkName}</span>
                        </p>
                    </div>
                </div>
            </div>


    if(type === "error") {
        return error;
    };

    if(type === "success") {
        return success;
    };

    if(type === "notification") {
        return notification;
    };


    return(
        <div className="border-0" popover="auto" id={id} >
            <div id="op">
                <div  className="card rounded-4 p-3 border-0">
                    <button popoverTargetAction="hide" popoverTarget={id} className=" btn-close"></button>
                    <p className="txt__sm">This a popover made for notifications, warning, error..etc not ideal though</p>
                </div>
            </div>
        </div>
    )
}



export default PopoverSm

