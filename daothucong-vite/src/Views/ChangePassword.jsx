import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

function ChangePassword() {
  const [errors, setErrors] = useState(null);
  const {token} = useStateContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [password, setPassword] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const tokenCheck = useParams();
  useEffect(()=>{
    document.title = "Quên Mật Khẩu - Dao Thủ Công Đa Sỹ";
  },[])
  if(token){
    return <Navigate to="/" />
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if( password != "" && passConfirm != ""){
      setLoading(true);
      setErrors(null);
      setMessage(null);
      await axiosClient.post('/resetPassword', {
        token: tokenCheck.dynamicPath,
        password,
        password_confirmation: passConfirm
      })
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(err => {
        const response = err.response;
        if(response && response.status === 422){
            if(response.data.errors) {
                setErrors(response.data.errors)
            }else{
            setErrors({
                email: [response.data.message]
            })
          }
        }
      });
      setLoading(false);
    }
  };
    return (  
        <div className="page-body-wrapper" style={{minHeight:'50vh'}}>
          <div className="d-flex justify-content-center align-items-center content-wrapper">
            <div className="row flex-grow">
              <div className='mx-auto'>
                <div className="rounded-4 text-left p-5" style={{background:'#f5f5f5'}}>
                  <div className="brand-logo">
                    <img src="/logos/logoslogab.png" alt="logo" width="250px" />
                  </div>
                  <h4 className="d-flex justify-content-center" style={{fontFamily:'"ubuntu-medium", sans-serif', fontSize:'1.13rem'}}>Quên mật khẩu</h4>
                  <form className="pt-3" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="password" className="form-label">Mật khẩu mới <span className="text-danger">*</span></label>
                      <input type="text" id="password" required value={password} onChange={(e) => {setPassword(e.target.value)}} className="form-control form-control-lg mb-3" placeholder="Mật khẩu" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="passwordConfirm" className="form-label">Nhập lại mật khẩu <span className="text-danger">*</span></label>
                      <input type="text" id="passwordConfirm" required value={passConfirm} onChange={(e) => {setPassConfirm(e.target.value)}} className="form-control form-control-lg mb-3" placeholder="Nhập lại mật khẩu" />
                    </div>
                    {errors && <div> {Object.keys(errors).map(key => ( <p className="alert text-center p-2" style={{backgroundColor: 'red', color: 'white'}} key={key}>{errors[key][0]}</p>))}</div>}
                    {message && <div className="mt-2"> <p className="alert text-center p-2" style={{backgroundColor: 'green', color: 'white'}} >{message}</p></div>}
                    <div className="mt-3 d-flex">
                      <Button loading={loading} type='submit' className="btn btn-gradient-primary auth-form-btn">Đổi mật khẩu</Button>
                    </div>
                  </form>
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

export default ChangePassword;