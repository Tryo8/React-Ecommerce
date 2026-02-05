import { Link, useNavigate } from 'react-router-dom';
import img from '../../assets/images/shopping_mall2.jpg';
import googleIcon from '../../assets/images/google.png';
import Rate from 'rc-rate';
import { useState , useRef, useEffect} from 'react';
import { useAuth } from '../../core/context/AuthContext';
import { miAxios } from '../../core/axios/axios';
import { toast } from "sonner";
import { errorToast } from '../../core/utils/errorToast';
import UserReviews from '../../core/interfaces/UsersReviews';

const API = import.meta.env.VITE_API;
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export function SignUp () {
    const userReviews = UserReviews[Math.floor(Math.random() * UserReviews.length)];
    
    const [toggleEye, setToggleEye] = useState(false);
    const userRef = useRef();
    const [bigErrorMessage, setBigErrorMessage] = useState('');
    const errRef = useRef();
    const { setAuth } = useAuth();
    const navigate = useNavigate()

    // ALL FEILDS
    const [ username, setUsername] = useState('');
    const [ validUsername, setValidUsername] = useState(false);
    const [ usernameFocus, setUsernameFocus] = useState(false);

    const [ email, setEmail] = useState('');
    const [ validEmail, setvalidEmail] = useState(false);

    const [ address, setAddress] = useState('');
    const [ validAddress, setValidAddress] = useState(false);


    const [ pwd, setPwd] = useState('');
    const [ validPwd, setValidPwd] = useState(false);
    const [ pwdFocus, setPwdFocus] = useState(false);

    // ERROR MESSGE
    const [ errMsg, setErrMsg] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [pwdError, setPwdError] = useState('');
    const [addressError, setAddressError] = useState('');

    // SUBMIT BUTTON
    const [submitBtn, setSubmitBtn] = useState();



    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    },[]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setvalidEmail(result);
    },[email]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const validUsername = USER_REGEX.test(username);
        setValidUsername(validUsername);
   
    },[pwd, username]);

    useEffect(() => {
        setErrMsg('');
    },[email, pwd, username, address]); 

    const [pwdStrength, setPwdStrength] = useState("");

    useEffect(() => {
    setPwdStrength(checkPasswordStrength(pwd));
    }, [pwd]);

    const checkPasswordStrength = (pwd) => {
        let score = 0;

        if (pwd.length >= 8) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[!@#$%^&*]/.test(pwd)) score++;

        if (score <= 2) return "weak";
        if (score === 3 || score === 4) return "medium";
        return "strong";
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const forbiddenUsernames = ["admin", "root", "test", "superuser"];


        setUsernameError('');
        setEmailError('');
        setPwdError('');
        setAddressError('');
        setBigErrorMessage('');


        if (!username) {
            setUsernameError("Username is required");
            return;
        }
        else if (username.length > 38) {
            setUsernameError("Username is too long");
            return;
        }
        else if (username.length < 4) {
            setUsernameError("Username is too short");
            return;
        }
        else if (forbiddenUsernames.includes(username.toLowerCase())) {
            setUsernameError("This username is not allowed");
        }

        else if (!email) {
            setEmailError("Email is required");
            return;
        }
        else if (email.length > 159) {
            setEmailError("Email is too long");
            return;
        }
        else if (email.length < 5) {
            setEmailError("Email is too short");
            return;
        }

        else if (!address) {
            setAddressError("Address is required");
            return;
        }
        else if (address.length > 68) {
            setAddressError("Address is too long");
            return;
        }
        else if (address.length < 5) {
            setAddressError("Address is too short");
            return;
        }

        else if (!pwd) {
            setPwdError("Password is required");
            return;
        }   
        else if (pwd.length > 60) {
            setPwdError("Password is too long");
            return;
        }
        else if (address.pwd < 6) {
            setPwdError("Password is too short");
            return;
        }
        


        if (!USER_REGEX.test(username)) {
            setUsernameError("Username must be 4-38 chars, start with letter");
            return;
        }
        if (!EMAIL_REGEX.test(email)) {
            setEmailError("Invalid email format a typical email example@gmail.com");
            return;
        } 
        if (!PWD_REGEX.test(pwd)) {
            setPwdError("Password must have uppercase, number, special char, 6-60 characters");
            return;
        }

        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        if(!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry")
            return;
        }
        try{
            const res = await miAxios.post(`/register`,
                {username, address, email, pwd}
            )
            console.log(res.data);
            console.log(res.accessToken);
            setAuth({ accessToken: res.data.accessToken, user: res.data.username, user_uuid: res.data.user_uuid, 
                address: res.data.address });

            toast.success("Signed Up successfully, Sign In to continue");
            setTimeout(() => {
                navigate("/signIn")
            }, 2000);
        }
        catch(err){
            errorToast(err,"Something went wrong, Try again later")
            setBigErrorMessage(err.response?.data?.message || err.message || "Login failed");
        };
    };

    const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const REDIRECT_URI = "http://localhost:9090/auth/github/callback";

    function GitHubLoginButton() {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
    };


    return(
        <div className="container-fluid">
            <div className="row min-vh-100">
                <div className="col-12 col-md-6 col-lg-7 p-0 bg__img position-relative d__phone">
                    <img className="h-100 w-100 img-fluid  position-relative bg__img" src={img} alt="background image of a mall"/>
                    <div style={{width:'28rem'}} className='card z-3 rounded-4 position-absolute position-absolute top-50 bg__transparent text-light start-50 translate-middle p-2'>
                        <div className='d-flex gap-2 align-items-center'>
                            <img className='rounded-circle object-fit-cover' src={"https://images.pexels.com/photos/897817/pexels-photo-897817.jpeg"} height={30} width={30} alt="user profile image"/>
                            <span>Someuser</span>
                        </div>
                        <p className='p-2 txt__s m-0'>
                            efwefewf lorerverf43fe43rg 43 34 4344343g4h  5h45h4h  4 hrtth th  h4 4 th4 545   g4g45g 4g 4 
                        </p>
                        <div className='d-flex justify-content-center'>
                            <Rate style={{fontSize:'1.3rem'}} value={5} count={5} defaultValue={5}  disabled/>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-5 bg-light p-4 justify-content-center align-content-center">
                    <div className="p-4 mx-4 rounded-4">
                        <h5 className="text-center mb-4 txt__blue">Sign Up</h5>
                        <form onSubmit={handleSubmit}>
                            <p className='text-center text-danger'>{errMsg}</p>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                   <i className="bi bi-person"></i></span>
                                <input 
                                className={`form-control border-start-0 from-lg `} 
                                type="text" 
                                placeholder="User Name"
                                ref={userRef}
                 
                                id="username"
                                autoComplete="off"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                aria-describedby="username"
                                onFocus={() => setUsernameFocus(true)}
                                onBlur={() => setUsernameFocus(false)}
                          
                                />
                            </div>
                            <div className='form-text text-danger mb-4'>{usernameError}</div>


                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-envelope"></i></span>
                                <input 
                                className={`form-control border-start-0 from-lg `} 
                                type="text" 
                                placeholder="Email"
                      
                                id="email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-describedby="email"
                                />
                            </div>
                            <div className='form-text text-danger mb-4'>{emailError}</div>

                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                   <i className="bi bi-geo-alt"></i></span>
                                <input 
                                className={`form-control border-start-0 from-lg `} 
                                type="text" 
                                placeholder="Address"
          
                                id="address"
                                autoComplete="off"
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                aria-describedby="address"
                                />
                            </div>
                            <div className='form-text text-danger mb-4'>{addressError}</div>

    
                            <div className="input-group">
                        
                                <span className="input-group-text bg-white border-end-0">
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
                                
                                aria-invalid={validEmail ? "false" : "true"}
                                aria-describedby="uidnote"
                                />
                                 <span type="button" onClick={() => setToggleEye(prev => !prev)}  className="input-group-text bg-white border-start-0">
                                    {
                                        toggleEye ? 
                                        <i className="bi bi-eye pe-3"></i>
                                         :
                                        <i className="bi bi-eye-slash pe-3"></i>
                                    }
                                </span>
                            </div>
                            {pwd && (
                            <div className={`mt-1 form-text ${pwdStrength === "weak"? "text-danger": 
                            pwdStrength === "medium" ? "text-warning": "text-success"}`}>
                                Password strength: {pwdStrength}
                            </div>
                            )}

                            <div className='form-text text-danger mb-4'>{pwdError}</div>

                            <div className="d-grid mt-3">
                                <button type='submit' style={{padding:'.5rem'}} className="btn__submit__form">Sign Up</button>
                            </div>
                            {/* <div className='row justify-content-center align-items-center mt-2'>
                                <div className='col-4 p-0'><hr/></div>
                                <div className='col-3 p-0 text-center'>OR</div>
                                <div className='col-4 p-0'><hr/></div>
                            </div> */}
                            <div className='text-center txt__sm text-muted mt-4'>Don't have an account? <Link to="/signIn">Sign In</Link></div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )





}