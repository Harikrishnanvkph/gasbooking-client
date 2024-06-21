import "./css/login.css"
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect, useState } from "react";
import img1 from "./assets/img/login-image/img_1.jpg";
import { useNavigate } from "react-router-dom";
import { getUser, userLoginValidation } from "./Logics";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {  setCustomer } from "./Store/Slicer";
import { persistor } from "./Store/Store";
import { resetState } from "./Store/Slicer";
import "./css/main.css"

function LoginPage(){
    const [message,setMessage] = useState("Server may take time to load for first time");
    const [state,setState] = useState(false);
    const [username, setUserName] = useState("");
    const [password, setPassWord] = useState("");
    const [code,setCode] = useState("204");
    const [isLoading,setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetState());
        const clearPersistedState = async () => {
            localStorage.clear();
            await persistor.purge();
            await persistor.flush();
        };
        clearPersistedState();
    }, []);
    
    

    const handlePasswordVisibility = ()=>{
        const dd = document.getElementsByClassName("password")[0];
        if(!state){
            dd.setAttribute("type","text");
        }else{
            dd.setAttribute("type","password");
        }
        setState(!state);
    }

    const handleLogin = async()=>{
        if(username == "" || password == ""){
            setCode("404");
            return;
        }
        setIsLoading(true);
        const loginValidate = await userLoginValidation(username,password);
        setIsLoading(false);
        const [returnCode,_] = loginValidate.split("/");
        if(returnCode == "200"){
            setCode("204");
            const getU = await getUser(username);
            dispatch(setCustomer(getU));
            navigate("/Info");
        }else if(returnCode == "418"){
            setMessage("Validation Pending. Please Complete to Login!")
            setCode("418");
            await new Promise((resolve)=>{
                const alertElement = document.getElementById('customAlert');
                alertElement.style.display = 'block';
                setTimeout(() => {
                    alertElement.style.display = 'none';
                    resolve();
                }, 2000);
            })
        }else{
            setCode("405");
        }
    }

    return <>
        <div id="customAlert" className="custom-alert">Validation Pending<p className="m-0">Click on Link below to Validate</p></div>
        <div id="loader" className={isLoading ? "loader" : "d-none"}>
            <div id='loader-log'></div>
            <p id='loader-p'>{message}</p>
        </div>
        <div className="login-full ">
            <div className="container-xl login-page">
                <div className="row login-row">
                    <div className="col login-area">
                        <div className="icon d-flex align-items-center">
                            <BatteryStdIcon />
                            <span><b>Hari GAS Booking</b></span>
                        </div>
                        <div className="welcome-text">
                            Welcome!
                            <div className="welcome-text-innote">Please Login to Continue...</div>
                        </div>
                        <div className="form-login">
                            <div className="enter-username">
                                <input className="username" name="fl-name" placeholder="Enter Your Gas ID or User Name"
                                value={username} onChange={(event)=>{
                                    setCode("204");
                                    setUserName(event.target.value)
                                }}/>
                            </div>
                            <div className="enter-password d-flex align-items-center">
                                <input type="password" name="fl-pass" className="password" placeholder="Enter Your Password"
                                value={password} onChange={(event)=>{
                                    setCode("204");
                                    setPassWord(event.target.value)
                                }} />
                                <span className="password-icon" onClick={handlePasswordVisibility}>
                                    {state ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                            </div>
                            <div className="password-forgot"><p className="password-forgot-btn" onClick={()=>{
                                navigate("/forgot")
                            }}>Forget Password?</p></div>
                            <button className="login-button btn btn-primary" onClick={handleLogin}>
                                Login</button>
                            <div className="line-div">
                                <h6 className="line-text">Or</h6>
                                <div className="line"></div>
                            </div>
                            <div>
                                <button className="login-register btn btn-primary" onClick={()=>{
                                    navigate("/register")
                                }}>Create An Account</button>
                                {
                                    code == "405" ? <p style={{color : "red"}} className="m-2"><b>Invalid Credentials, Please Retry Login!!!</b></p> : 
                                    code == "404" ? <p style={{color : "red"}} className="m-2"><b>One or More Input Field is Empty!!!</b></p> : 
                                    code == "418" ? <p className="mt-2" style={{fontSize : "15px"}}>Validation Pending! to validate Click <Link to="/validate" state={{name : username}}>Validate</Link></p>:
                                    code == "204" ? <p className="mt-2" style={{fontSize : "15px"}}>Here for first time? Create an Account in no time!</p> : <></>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col login-companyshow">
                        <img src={img1} alt="" />
                    </div>
                </div>
            </div>

        </div>
    </>

}

export default LoginPage;