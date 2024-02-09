import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { Button } from "primereact/button";

function ResetPass() {
    const [email, setEmail] = useState('');
  const [errors, setErrors] = useState(null);
  const {token} = useStateContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  useEffect(()=>{
    document.title = "Quên Mật Khẩu - Dao Thủ Công Đa Sỹ";
  },[])
  if(token){
    return <Navigate to="/" />
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(email != ""){
      setLoading(true);
      setErrors(null);
      await axiosClient.post('/forgotPassword', {
        email
      })
      .then(({data}) => {
        setMessage(data);
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
                      <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                      <input type="email" id="email" required value={email} onChange={(e) => {setEmail(e.target.value)}} className="form-control form-control-lg mb-3" placeholder="Email" />
                    </div>
                    {errors && <div> {Object.keys(errors).map(key => ( <p className="alert text-center p-2" style={{backgroundColor: 'red', color: 'white'}} key={key}>{errors[key][0]}</p>))}</div>}
                    {message && <div className="mt-2"> <p className="alert text-center p-2" style={{backgroundColor: 'green', color: 'white'}} >{message}</p></div>}
                    <div className="mt-3 d-flex">
                      <Button loading={loading} type='submit' className="btn btn-gradient-primary auth-form-btn">Gửi mã</Button>
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

export default ResetPass;