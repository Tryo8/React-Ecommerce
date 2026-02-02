import img from '../assets/images/box.png';
import { useNavigate } from 'react-router-dom';



function NotFound () {
    const navigate = useNavigate();

    return (
        <div className="container min-vh-100 align-content-center">
            <div className="d-flex justify-content-center">
                <div style={{height:'25rem', width:'30rem'}} className="card bg-white shadow rounded-4 p-md-3 text-center border-0">
                    <figure className='m-0'>
                        <img height={140} width={140} src={img} alt="empty box"/>
                    </figure>
                    <div style={{fontFamily:'monospace'}} className="display-5 ">4<b className='txt__blue'  style={{fontFamily:'monospace'}}>0</b>4</div>
                    <p className="fs-5">Page Not Found</p>
                    <small className="text-muted txt__sm">The page you're looking for may have been removed</small>
                    <div className='d-flex justify-content-center mt-3 gap-2'>
                        <button onClick={() => navigate('/')} className='btn__white'><i className="bi bi-arrow-left i__appear"></i> Return Home</button>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default NotFound