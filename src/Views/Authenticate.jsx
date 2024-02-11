import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

function Authenticate() {
    const tokenCode = useParams();
    const [message, setMessage] = useState("");
    const {token} = useStateContext();
    useEffect(()=>{
        axiosClient.post(`/verify/${tokenCode.dynamicPath}`)
        .then(({data}) => {
            setMessage(data);
        })
    },[tokenCode.dynamicPath])
    if(token){
        return <Navigate to="/" />
    }
    return (
        <div className="page-body-wrapper" style={{minHeight:'50vh'}}>
          <div className="d-flex justify-content-center align-items-center content-wrapper">
            <div className="row flex-grow">
              <div className='mx-auto'>
                <div className="rounded-4 text-left p-5" style={{background:'#f5f5f5'}}>
                  <div className="brand-logo">
                    <img src="/logos/logoslogab.png" alt="logo" width="250px" />
                  </div>
                  <h4 style={{fontFamily:'"ubuntu-medium", sans-serif', fontSize:'1.13rem'}}>Đăng ký ngay để đến với Dao Thủ Công Đa Sỹ</h4>
                  {message && <div className="mt-2"> <p className="alert text-center p-2" style={{backgroundColor: `green`, color: 'white'}} >{message}</p></div>}
                  <div className="mt-3 form-auth">
                    <div className="d-flex justify-content-center ">
                      Bạn đã có tài khoản? <Link to="/dang-nhap" className="text-danger">Đăng nhập ngay</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}

export default Authenticate;