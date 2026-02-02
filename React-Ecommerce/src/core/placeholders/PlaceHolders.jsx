import { useNavigate } from 'react-router-dom';
import imgError from '../../assets/images/corrupted-file.png';
import leaf from '../../assets/images/leaf.png';




export const ErrorState = ({ refetchFn, message, customImg}) => {

    return <div className="container min-vh-100 justify-content-center align-content-center text-center">
            <div className="d-flex justify-content-center">
                <img src={customImg || imgError} height={140} alt="corrupted-file image"/>
            </div>
            <div className="text-danger"> 
                {message || ' Oops something went wrong, Try again later.'}
           </div>
            <div className="d-flex justify-content-center mt-3">
                {
                    refetchFn ? <button className="btn__gray" onClick={() => refetchFn()}>Refresh</button> : '' 
                }
            </div>
        </div>
}


export const EmptyState = ({ navRoute, message, customImg, btnText }) => {
    const navigate = useNavigate();
    return <div className="container min-vh-100 justify-content-center align-content-center">
                <div className="d-flex justify-content-center">
                    <div className="d-block text-center">
                        <figure>
                            <img  src={customImg || leaf} height={140}  alt="leaf"/>
                        </figure>
                        <div className="text-secondary">
                        { message || ''}</div>
                        {
                            navRoute ? <button className="btn__outline__blue mt-2" onClick={() => navigate(navRoute)}>{btnText}</button>
                            : ''
                        }
                        
                    </div>
                </div>
            </div>
}