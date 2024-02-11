import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axiosClient from '../../axios-client';
import { useStateContext } from '../../contexts/ContextProvider';
import { Button } from 'primereact/button';

function Login() {
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(null);
    const {user, token, setToken, setUser} = useStateContext();
    const [loading, setLoading] = useState(false);
    const JSONuser = JSON.parse(user);
    useEffect(()=>{
      document.title = "Đăng Nhập Trang Quản Trị"
        if (isAdminPath) {
          import('../../assets/css/index.css');
        }
    },[isAdminPath])
    if(token && JSONuser.role == "admin"){
      return <Navigate to="/admin/dashboard"></Navigate>
    }
    const handleSubmit = async (e) => {
      e.preventDefault();
      if(email != "" && password != ""){
        setLoading(true);
        setErrors(null);
        await axiosClient.post('/login', {
          email,
          password,
        })
        .then(({data}) => {
          setToken(data.token);
          const json = JSON.stringify(data.user);
          setUser(json)
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
        })
        setLoading(false)
      }
    };
    return (  
        <div className="page-body-wrapper" style={{minHeight:'100vh'}}>
          <div className="d-flex justify-content-center align-items-center content-wrapper">
            <div className="row flex-grow">
              <div className='mx-auto'>
                <div className="bg-white rounded-4 text-left p-5">
                  <div className="brand-logo">
                    <img src="/logos/logoslogab.png" alt="logo" width="250px" />
                  </div>
                  <h4 style={{fontFamily:'"ubuntu-medium", sans-serif', fontSize:'1.13rem'}}>Chào mừng đến với Dao Thủ Công Đa Sỹ</h4>
                  <h6 className="font-weight-light">Đăng nhập để tiếp tục.</h6>
                  <form className="pt-3" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input type="text" required value={email} onChange={(e) => {setEmail(e.target.value)}} className="form-control form-control-lg" placeholder="Tài khoản" />
                    </div>
                    <div className="form-group">
                      <input type="password" required value={password} autoComplete="current-password" onChange={(e) => {setPassword(e.target.value)}} className="form-control form-control-lg" placeholder="Mật khẩu" />
                    </div>
                    {errors && <div> {Object.keys(errors).map(key => ( <p className="alert text-center p-2" style={{backgroundColor: 'red', color: 'white'}} key={key}>{errors[key][0]}</p>))}</div>}
                    <div className="mt-3 d-flex justify-content-center ">
                      <Button loading={loading} type='submit' className="btn btn-gradient-primary auth-form-btn">ĐĂNG NHẬP</Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}

export default Login;