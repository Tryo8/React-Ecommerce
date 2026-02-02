import cancel from '../../assets/images/checks/close.png';
import { useNavigate } from 'react-router-dom';



function CancelPage ({mainMessage = 'Operation Failed', smallMessage = "The operation was not successfull"}) {
    const navigate = useNavigate();

    return (
        <div className="container min-vh-100 align-content-center">
            <div className="d-flex justify-content-center">
                <div style={{height:'25rem', width:'30rem'}} className="card bg-white shadow align-content-center  rounded-4 p-md-5 text-center border-0">
                    <figure className='m-0'>
                        <img height={120} width={120} src={cancel} alt="empty box"/>
                    </figure>
                    <p className="fs-2 mt-2 text-danger">{ mainMessage }</p>
                    <small className="text-muted txt__sm">{ smallMessage }</small>
                    <div className='d-flex justify-content-center mt-3'>
                        <button onClick={() => navigate('/')} className='btn__white'><i className="bi bi-arrow-left i__appear"></i> Return Home</button>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default CancelPage