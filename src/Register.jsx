import "./css/login.css"
import BatteryStdIcon from '@mui/icons-material/BatteryStd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import img1 from "./assets/img/login-image/img_1.jpg";
import { Link, useNavigate } from "react-router-dom";
import { userRegisterValidation } from "./Logics";
import "./css/main.css"

function Register(){
    const [isLoading,setIsLoading] = useState(false);
    const [state,setState] = useState(false);
    const [username, setUserName] = useState("");
    const [password, setPassWord] = useState("");
    const [mail, setMail] = useState("");
    const navigate = useNavigate();
    const [loginFailed,setLoginFailed] = useState("");

    const handlePasswordVisibility = ()=>{
        const dd = document.getElementsByClassName("password")[0];
        if(!state){
            dd.setAttribute("type","text");
        }else{
            dd.setAttribute("type","password");
        }
        setState(!state);
    }

    const handleRegistration = async()=>{
        if(username == "" || password == "" || mail== "" ){
            setLoginFailed("500");
            return;
        }else if(!mail.includes("@")){
            setLoginFailed("412");
            return;
        }
        setIsLoading(true);
        const registerValidate = await userRegisterValidation(mail,username,password);
        setIsLoading(false);
        switch(registerValidate){
            case 200 : {
                setLoginFailed("200");
                alert("Account Created Successfully, click OK to redirect to login page...")
                setTimeout(()=>{
                    navigate("/");
                },500)
                break;
            }
            case 412 : {
                setLoginFailed("412");
                break;
            }
            case 418 : {
                setLoginFailed("418");
                console.log("in")
                break;
            }
            case 404 : {
                setLoginFailed("404");
                break;
            }
        }
    }

    return <>
        <div id="loader" className={isLoading ? "loader" : "d-none"}>
            <div id='loader-log'></div>
            <p id='loader-p'>Registering...Please Wait</p>
        </div>
        <div className="login-full">
            <div className="container-xl login-page">
                <div className="row login-row">
                    <div className="col login-area">
                        <div className="icon d-flex align-items-center">
                            <BatteryStdIcon />
                            <span><b>Hari GAS Booking</b></span>
                        </div>
                        <div className="welcome-text">
                            Register!
                            <div className="welcome-text-innote">SIMPLE AND FAST REGISTRATION!</div>
                        </div>
                        <div>
                            <div className="enter-usermail">
                                <input className="mail" placeholder="Enter Your MAIL Address" value={mail}
                                onChange={(event)=>{
                                    setMail(event.target.value);
                                    setLoginFailed("");
                                }}/>
                            </div>
                            <div className="enter-username">
                                <input className="username " placeholder="Enter Your User Name" value={username}
                                onChange={(event)=>{
                                    setUserName(event.target.value);
                                    setLoginFailed("");
                                }}/>
                            </div>
                            <div className="enter-password d-flex align-items-center">
                                <input type="password" className="password" placeholder="Enter Your Password" value={password}
                                onChange={(event)=>{
                                    setPassWord(event.target.value);
                                    setLoginFailed("");
                                }}/>
                                <span className="password-icon" onClick={handlePasswordVisibility}>
                                    {state ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                            </div>
                            <button className="login-button btn btn-primary mt-2" onClick={handleRegistration}>Register</button>
                            <p className="ptag mb-1">Upon Registration you will receive a <b>Gas ID</b>. <b>Gas ID</b> will be Visible into your Service Page Profile Section</p>
                            <div className="link-tc">
                                <div><Link to="https://gasbooking-server.onrender.com/tc" target="_blank"><u>Terms And Conditions</u></Link></div>
                                {
                                    loginFailed === "418" ? <p style={{color : "red"}} className="m-0"><b>User Already Exist, Try Logging In!!!</b></p> : 
                                    loginFailed === "500" ? <p style={{color : "red"}} className="m-0"><b>One or More Input Field is Empty!!!</b></p>  : 
                                    loginFailed === "412" ? <p style={{color : "red"}} className="m-0"><b>Invalid Mail Addresss Format</b></p>  :
                                    loginFailed === "504" ? <p style={{color : "red"}} className="m-0"><b>Something happened!!!</b></p>  : <></>
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

export default Register;