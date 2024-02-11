import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { Button } from "primereact/button";
import { Link, Navigate } from "react-router-dom";

function LoginGuest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(null);
  const {token, setToken, setUser} = useStateContext();
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    document.title = "Đăng Nhập - Dao Thủ Công Đa Sỹ";
  },[])
  if(token){
    return <Navigate to="/" />
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(email != "" && password != ""){
      setLoading(true);
      await axiosClient.post('/login', {
        email,
        password,
      })
      .then(({data}) => {
        setToken(data.token);
        setUser(JSON.stringify(data.user))
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
                  <h4 style={{fontFamily:'"ubuntu-medium", sans-serif', fontSize:'1.13rem'}}>Chào mừng đến với Dao Thủ Công Đa Sỹ</h4>
                  <form className="pt-3" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                      <input type="text" id="email" required value={email} onChange={(e) => {setEmail(e.target.value)}} className="form-control form-control-lg mb-3" placeholder="Email" />
                    </div>
                    <div className="form-group mb-2">
                      <label htmlFor="email" className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                      <input type="password"  id="password"required value={password} onChange={(e) => {setPassword(e.target.value)}} className="form-control form-control-lg" placeholder="Mật khẩu" />
                    </div>
                    {errors && <div> {Object.keys(errors).map(key => ( <p className="alert text-center p-2" style={{backgroundColor: 'red', color: 'white'}} key={key}>{errors[key][0]}</p>))}</div>}
                    <div className="mt-3 d-flex">
                      <Button loading={loading} type='submit' className="btn btn-gradient-primary auth-form-btn">ĐĂNG NHẬP</Button>
                    </div>
                  </form>
                  <div className="mt-3 form-auth">
                    <div className="d-flex justify-content-center ">
                      Bạn chưa có tài khoản? <Link to="/dang-ky" className="text-danger">Đăng ký ngay</Link>
                    </div>
                    <div className="d-flex justify-content-center mt-2">
                      <Link to="/quen-mat-khau" className="text-danger">Quên mật khẩu</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}

export default LoginGuest;