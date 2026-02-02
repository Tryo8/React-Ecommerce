import { useContext } from "react";
import { LoadingContext } from "../context/LoaderContext";



export function GlobleSpinner () {

    const { loading } = useContext(LoadingContext);

    if (!loading) return null;
    
    return(
        <div className="d-flex loading__overlay">
            <div className="position-absolute">
                <div className="d-flex justify-content-center gap-3">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>
        </div>
    )

}