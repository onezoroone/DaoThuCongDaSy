import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { Button } from "primereact/button";
import { Link, Navigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState(null);
  const [address, setAddress] = useState('');
  const {token, setUser} = useStateContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [passConfirm, setPassConfirm] = useState('');
  useEffect(()=>{
    document.title = "Đăng Ký - Dao Thủ Công Đa Sỹ";
  },[])

  if(token){
    return <Navigate to="/" />
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(email != "" && password != "" && address != "" && name != ""){
      setLoading(true);
      setErrors(null);
      await axiosClient.post('/signUp', {
        name,
        email,
        phone,
        password,
        password_confirmation: passConfirm,
        address,
      })
      .then(response => {
        setMessage(response.data.message);
        setUser(response.data.user);
      })
      .catch(err => {
        const response = err.response;
        if(response && response.status === 422){
          if(response.data.errors) {
              setErrors(response.data.errors)
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
                  <h4 style={{fontFamily:'"ubuntu-medium", sans-serif', fontSize:'1.13rem'}}>Đăng ký ngay để đến với Dao Thủ Công Đa Sỹ</h4>
                  <form className="pt-3" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="name" className="form-label">Tên <span className="text-danger">*</span></label>
                          <input type="text" id="name"  value={name} onChange={(e) => {setName(e.target.value)}} className="form-control form-control-lg mb-3" placeholder="Tên" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                          <input type="email"  id="email" value={email} onChange={(e) => {setEmail(e.target.value)}} className="form-control form-control-lg" placeholder="Email" />
                        </div>
                        <div className="form-group mt-2">
                          <label htmlFor="phone" className="form-label">Số điện thoại</label>
                          <InputText keyfilter="num" id="phone" value={phone} onChange={(e) => {setPhone(e.target.value)}} className="form-control form-control-lg" placeholder="Số điện thoại" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="password" className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                          <input type="text" id="password"  value={password} onChange={(e) => {setPassword(e.target.value)}} className="form-control form-control-lg mb-3" placeholder="Mật khẩu" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="confirmPassword" className="form-label">Nhập lại mật khẩu <span className="text-danger">*</span></label>
                          <input type="text" id="confirmPassword" value={passConfirm} onChange={(e) => {setPassConfirm(e.target.value)}} className="form-control form-control-lg" placeholder="Xác nhận mật khẩu" />
                        </div>
                        <div className="form-group mt-2">
                          <label htmlFor="address" className="form-label">Địa chỉ <span className="text-danger">*</span></label>
                          <InputTextarea id="address" value={address} rows={4} onChange={(e) => {setAddress(e.target.value)}} className="form-control form-control-lg" placeholder="Địa chỉ" />
                        </div>
                      </div>
                    </div>
                    {errors && <div> {Object.keys(errors).map(key => ( <p className="alert text-center p-2 mt-2" style={{backgroundColor: 'red', color: 'white'}} key={key}>{errors[key][0]}</p>))}</div>}
                    {message && <div className="mt-2"> <p className="alert text-center p-2" style={{backgroundColor: 'green', color: 'white'}} >{message}</p></div>}
                    <div className="mt-3 d-flex">
                      <Button loading={loading} type='submit' className="btn btn-gradient-primary auth-form-btn">ĐĂNG KÝ</Button>
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

export default SignUp;