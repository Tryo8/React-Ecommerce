import { Link, useNavigate } from 'react-router-dom';
import bgLogo from '../../assets/images/bg__logo.jpg'
import img from '../../assets/images/shopping_mall.jpg';
import Rate from 'rc-rate';
import { useState , useRef, useEffect} from 'react';
import { useAuth } from '../../core/context/AuthContext';
import { miAxios } from '../../core/axios/axios';
import { toast } from "sonner";
import { errorToast } from '../../core/utils/errorToast';
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const API = import.meta.env.VITE_API;
export function SignIn () {

    const [toggleEye, setToggleEye] = useState(false);
    const userRef = useRef();
    const [bigErrorMessage, setBigErrorMessage] = useState('');
    const errRef = useRef();
    const { setAuth } = useAuth();
    const navigate = useNavigate()
    const [ password,   setPassword] = useState(false);

    const [ email, setEmail] = useState('');
    const [ validName, setValidName] = useState(false);
    const [ userFocus, setEmailFocus] = useState(false);

    const [ pwd, setPwd] = useState('');
    const [ validPwd, setValidPwd] = useState(false);
    const [ pwdFocus, setPwdFocus] = useState(false);


    const [ errMsg, setErrMsg] = useState('');
    const [ success, setSuccess] = useState(false);

    useEffect(() => {
          if (userRef.current) {
            userRef.current.focus();
        }
    },[]);

    // useEffect(() => {
    //     const result = USER_REGEX.test(email);
    //     setValidName(result);
    // },[email]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
   
    },[pwd]);

    useEffect(() => {
        setErrMsg('')
    },[email, pwd]); 


    const handleSubmit = async (e) => {
        e.preventDefault();
        // const v1 = USER_REGEX.test(email);
        // const v2 = PWD_REGEX.test(pwd);
        // if(!v1 || !v2) {
        //     setErrMsg("Invalid Entry")
        //     return;
        // }
        
        if(!email){
            setBigErrorMessage('Email is Rerquired')
            return;
        }
        else if(!pwd){
            setBigErrorMessage('Password is Rerquired')
            return;
        }
        else if (!EMAIL_REGEX.test(email)) {
            setBigErrorMessage("Invalid email format");
            return;
        };


        try{
            const res = await miAxios.post(`/login`,
                {email, pwd}
            )
            setAuth({ accessToken: res.data.accessToken, user: res.data.user, user_uuid: res.data.user_uuid, 
                address: res.data.address });

            toast.success("Signed In successfully");
            setTimeout(() => {
                window.location.reload()
            }, 500);
                 
           
        }
        catch(err){
          errorToast(err, "Something went wrong, Try again later")
           setBigErrorMessage(err.response?.data?.message || err.message || "Login failed");
        };
    };

    return(
        <div className="container-fluid">
            <div className="row min-vh-100">
                <div className="col-12 col-md-6 col-lg-7 p-0 bg__img position-relative">
                    <img className="h-100 w-100 img-fluid  position-relative bg__img" src={img} alt="background image of a mall"/>
                    <div style={{width:'28rem'}} className='card z-3 rounded-4 position-absolute position-absolute top-50 bg__transparent text-light start-50 translate-middle p-2'>
                        <div className='d-flex gap-2 align-items-center'>
                            <img className='rounded-circle object-fit-cover' src='https://images.pexels.com/photos/35438584/pexels-photo-35438584.jpeg' height={30} width={30} alt="user profile image"/>
                            <span>Someuser</span>
                        </div>
                        <p className='p-2 txt__s m-0'>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit natus, saepe incidunt sequi sunt facilis laboriosam nihil iusto sed adipisci optio aperiam, vel minus enim atque minima dolorum quia repellat!
                        </p>
                        <div className='d-flex justify-content-center'>
                            <Rate style={{fontSize:'1.3rem'}} value={5} count={5} defaultValue={5}  disabled/>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-5 bg-light p-4 justify-content-center align-content-center">
                    <div className="p-4 mx-4 rounded-4">
                        {
                            bigErrorMessage ? <div className='text-center text-danger mb-3'>{bigErrorMessage}</div>
                            : ''
                        }
                        <h5 className="text-center mb-4 txt__blue">Sign In</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 input-group">
                                <span className="input-group-text bg-white">
                                    <i className="bi bi-envelope"></i></span>
                                <input 
                                className={`form-control border-start-0 from-lg `} 
                                type="text" 
                                placeholder="Email"
                                ref={userRef}
                                id="email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-describedby="uidnote"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                                />
                            </div>
    
                            <div className="mb-4 input-group">
                        
                                <span className="input-group-text bg-white">
                                    <i className="bi bi-lock"></i>
                                </span>
                                <input 
                                className="form-control border-start-0 border-end-0 from-lg" 
                                type={toggleEye ? 'text' : 'password'} 
                                placeholder="Password" 
                                id="pwd"
                                autoComplete="off"
                                onChange={(e) => setPwd(e.target.value)}
                                required
                                aria-invalid={validName ? "false" : "true"}
                                aria-describedby="uidnote"
                                />
                                 <span type="button" onClick={() => setToggleEye(prev => !prev)}  className="input-group-text bg-white">
                                    {
                                        toggleEye ? 
                                        <i className="bi bi-eye pe-3"></i>
                                         :
                                        <i className="bi bi-eye-slash pe-3"></i>
                                    }
                                </span>
                            </div>
                            <div className='text-start txt__s text-decoration-underline'>Forgot password?</div>
                            <div className="d-grid mt-3">
                                <button type='submit' style={{padding:'.5rem'}} className="btn__submit__form">Sign In</button>
                            </div>
                            <div className='text-center txt__sm text-muted mt-4'>Don't have an account? <Link to="/signUp">Sign Up</Link></div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )


}


