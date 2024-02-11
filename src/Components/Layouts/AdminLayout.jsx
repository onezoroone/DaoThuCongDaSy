import { Link, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { Toast } from 'primereact/toast';
import { useStateContext } from "../../contexts/ContextProvider";
import { useLocation } from 'react-router-dom';
import axiosClient from "../../axios-client";
import { Helmet } from "react-helmet";
import Pusher from "pusher-js";

function AdminLayout() {
    const {token, user, sidebar, toast, setSidebar, setToken, setUser} = useStateContext();
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');
    const JSONuser = JSON.parse(user);
    const [notifications, setNotifications] = useState([]);
    useEffect(()=>{
        if (isAdminPath) {
          import('../../assets/css/index.css');
          import ('primeicons/primeicons.css');
          import ('primereact/resources/primereact.css');
          import ('primereact/resources/themes/lara-light-indigo/theme.css');
        }
        if(sidebar){
            document.body.classList.add('sidebar-icon-only');
        }else{
            document.body.classList.remove('sidebar-icon-only');
        }
        axiosClient.post('/getNotifications')
        .then(({data}) => {
          setNotifications(data);
        })
        Pusher.logToConsole = false;
        const pusher = new Pusher('943e2c20b9125da3ca5a', {
          cluster: 'ap1'
        });

        const channel = pusher.subscribe('orders');
        channel.bind('notification', function(data) {
          axiosClient.post('/getNotifications')
          .then(({data}) => {
            setNotifications(data);
          })
          toast.current.show({ severity: 'info', summary: 'Thông Báo', detail: JSON.stringify(data.notification), life: 5000 });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[sidebar, isAdminPath])
    if(!token || JSONuser.role != "admin"){
      return <Navigate to="/admin/dang-nhap"></Navigate>
    }

    const handleLogout = (ev) => {
      ev.preventDefault();
      axiosClient.post('/logOut')
      .then(() => {
        setUser(null);
        setToken(null);
      })
    }
    const handleNotifications  = () => {
      axiosClient.post('/readNotifications');
    }
    const diffMinute = (data) => {
      const currentTime = new Date();

    // Thời gian từ dữ liệu trả về
      const dataTime = new Date(data);
      const diffInMinutes = Math.floor((currentTime - dataTime) / (1000 * 60));
      return diffInMinutes;
    } 
    return (
        <>
          <Helmet>
            <meta name="robots" content="noindex,nofollow"></meta>
          </Helmet>
            <Toast ref={toast} />
            <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
              <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                <Link to="/admin/dashboard" className="navbar-brand brand-logo"><img src="/logos/logoslogab.png" alt="logo" /></Link>
                <Link to="/admin/dashboard" className="navbar-brand brand-logo-mini"><img src="/logos/logo.png" alt="logo" /></Link>
              </div>
              <div className="navbar-menu-wrapper d-flex align-items-stretch">
                <button className="navbar-toggler navbar-toggler align-self-center" onClick={() => setSidebar(!sidebar)} type="button" data-toggle="minimize">
                  <span className="bi bi-list" ></span>
                </button>
                <div className="search-field d-none d-md-block">
                  <form className="d-flex align-items-center h-100" action="#">
                    <div className="input-group">
                      <div className="input-group-prepend bg-transparent">
                        <i className="input-group-text border-0 bi bi-search"></i>
                      </div>
                      <input type="text" className="form-control bg-transparent border-0" placeholder="Tìm kiếm..." />
                    </div>
                  </form>
                </div>
                <ul className="navbar-nav navbar-nav-right">
                  <li className="nav-item dropdown">
                    <a className="nav-link count-indicator dropdown-toggle" id="messageDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className="bi bi-envelope"></i>
                      <span className="count-symbol bg-warning"></span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="messageDropdown">
                      <h6 className="p-3 mb-0">Messages</h6>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item preview-item">
                        <div className="preview-thumbnail">
                          <img src="assets/images/faces/face4.jpg" alt="image" className="profile-pic" />
                        </div>
                        <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                          <h6 className="preview-subject ellipsis mb-1 font-weight-normal">Mark send you a message</h6>
                          <p className="text-gray mb-0"> 1 Minutes ago </p>
                        </div>
                      </a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item preview-item">
                        <div className="preview-thumbnail">
                          <img src="assets/images/faces/face2.jpg" alt="image" className="profile-pic" />
                        </div>
                        <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                          <h6 className="preview-subject ellipsis mb-1 font-weight-normal">Cregh send you a message</h6>
                          <p className="text-gray mb-0"> 15 Minutes ago </p>
                        </div>
                      </a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item preview-item">
                        <div className="preview-thumbnail">
                          <img src="assets/images/faces/face3.jpg" alt="image" className="profile-pic" />
                        </div>
                        <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                          <h6 className="preview-subject ellipsis mb-1 font-weight-normal">Profile picture updated</h6>
                          <p className="text-gray mb-0"> 18 Minutes ago </p>
                        </div>
                      </a>
                      <div className="dropdown-divider"></div>
                      <h6 className="p-3 mb-0 text-center">4 new messages</h6>
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link count-indicator dropdown-toggle" onClick={handleNotifications} id="notificationDropdown" href="#" data-bs-toggle="dropdown">
                      <i className="bi bi-bell"></i>
                      <span className="count-symbol bg-danger"></span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                      <h6 className="p-3 mb-0">Thông báo</h6>
                      {notifications && notifications.map((item)=>(
                        <>
                        <div className="dropdown-divider"></div>
                      <a className="dropdown-item preview-item">
                        <div className="preview-thumbnail">
                          <div className="preview-icon bg-success">
                            <i className="mdi mdi-calendar"></i>
                          </div>
                        </div>
                        <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                          <h6 className="preview-subject font-weight-normal mb-1">{diffMinute(item.created_at)} phút trước</h6>
                          <p className="text-gray ellipsis mb-0"><strong>{item.name}</strong> vừa đặt 1 đơn hàng.</p>
                        </div>
                      </a>
                        </>
                      ))}
                    
                    </div>
                  </li>
                  <li className="nav-item nav-profile dropdown">
                    <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                      <div className="nav-profile-img">
                        <img src="/logos/logo.png" alt="image" />
                        <span className="availability-status online"></span>
                      </div>
                      <div className="nav-profile-text">
                        <p className="mb-1 text-black text-uppercase">{user && user.name}</p>
                      </div>
                    </a>
                    <div className="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown">
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2 text-primary"></i> Đăng Xuất </button>
                    </div>
                  </li>
                  <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" onClick={() => setSidebar(!sidebar)} type="button" data-toggle="offcanvas">
                    <span className="bi bi-list "></span>
                  </button>
                </ul>
              </div>
            </nav>
            <div className="container-fluid page-body-wrapper">
                  <Sidebar />
                  <div className={`main-panel mb-5`}>
                    <div className="content-wrapper">
                      <Outlet />
                    </div>
                    <footer className="footer">
                      <div className="container-fluid d-flex justify-content-between">
                        <span className="text-muted d-block text-center text-sm-start d-sm-inline-block">
                          &copy; Copyright 2023 <strong className="text-danger">Dao Thủ Công Đa Sỹ</strong> All Rights Reserved.
                        </span>
                      </div>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default AdminLayout;