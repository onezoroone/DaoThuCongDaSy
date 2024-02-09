import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { Sidebar } from 'primereact/sidebar';
import axiosClient from "../../axios-client";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import unidecode from "unidecode";
function DefaultLayout() {
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');
    const {token, user, toast, count, setUser, setToken, setCount} = useStateContext();
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState('');
    const JSONuser = JSON.parse(user);
    const navigate = useNavigate();
    useEffect(()=>{
        if (!isAdminPath) {
          import('../../assets/css/style.css');
          import ('primeicons/primeicons.css');
          import ('primereact/resources/primereact.css');
          import ('primereact/resources/themes/lara-light-indigo/theme.css');
        }
        axiosClient.get('/users/upTimeAccess')
        axiosClient.get('/categories/getCategories')
        .then(({data}) => {
            setCategories(data);
        })
        if(JSONuser){
            axiosClient.post(`getIndex/${JSONuser.id}`)
            .then(({data}) =>{
                setCount(data);
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAdminPath])
    useEffect(()=>{
        setVisible(false);
    },[location])
    const logOut = (ev) => {
        ev.preventDefault();
        axiosClient.post('/logOut')
        .then(() => {
          setUser(null);
          setToken(null);
          setCount(0);
        })
      }
      const footerContent = (
        <div>
            <Button label="Ok" severity="success" icon="pi pi-check" onClick={() => setVisible1(false)} autoFocus />
        </div>
    );
    const checkToken = () => {
        if(!token){
            setVisible1(true);
        }else{
            navigate('/gio-hang')
        }
    }
    const onSubmitSearch = (e) => {
        e.preventDefault();
        if(keyword.trim != ""){
            navigate(`/san-pham/tim-kiem?p=${encodeURIComponent(unidecode(keyword).toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`)
        }
    }
    return (
        <>
            <Toast ref={toast} />
            <header className="header-container mb-5">
                <div className="header-mobile d-flex">
                    <div className="logo" style={{userSelect:'none'}}>
                        <Link to="/" className="custom-logo-link"> 
                            <img src="/logos/logoslogab.png" width="270px" alt="logo" /> 
                        </Link>
                    </div>
                    <div className="flex-1 d-flex justify-content-end align-items-center">
                        <i className="bi bi-list mr-2" onClick={() => setVisible(true)} style={{fontSize:'40px', cursor:'pointer'}}></i>
                        <button onClick={checkToken} className="text-dark bg-transparent border-0">
                            <i className="bi bi-cart position-relative mr-2" style={{fontSize:'35px'}}>
                                <div className="badge">
                                    {count}
                                </div>
                            </i>
                        </button>
                    </div>
                    <Sidebar visible={visible} header="Thanh điều khiển" onHide={() => setVisible(false)} style={{background:'#ffffff', width:'270px'}}>
                        <div className="mb-4">
                            <div className="d-flex justify-content-center ">
                                <Link to="/" className="custom-logo-link"> 
                                    <img src="/logos/logoslogab.png" width="220px" alt="logo" /> 
                                </Link>
                            </div>
                            <div className="container-form-search">
                                <form className="d-flex form-search mt-2" onSubmit={onSubmitSearch}>
                                    <input type="text" className="input-search" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm kiếm..." />
                                    <button type="submit"><i className="fs-4 bi bi-search"></i></button>
                                </form>
                            </div>
                        </div>
                        <ul className="menu-category">
                            <li>
                                <Link to="/" className="nav-link">
                                    <span className="menu-title">Trang chủ</span>
                                </Link>
                            </li>
                            <li>
                                <div className="d-flex align-items-center">
                                    <button type="button" data-bs-toggle="collapse" data-bs-target="#category" aria-expanded="false" className="nav-link">
                                        <span className="menu-title">Loại Dao</span>
                                    </button>
                                    <i className="flex-1 d-flex justify-content-end bi bi-caret-down-fill"></i>
                                </div>
                                <div id="category" className="collapse">
                                    <ul className="sub-menu">
                                        {categories && categories.map((item) => (
                                            <li key={item.id}><Link to={`/san-pham/tim-kiem/the-loai=${item.categoryName}?id=${item.id}`}>{item.categoryName}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <Link to="/tin-tuc">Tin Tức</Link>
                            </li>
                            {/* <li>
                                <Link>Sản Phẩm Khác</Link>
                            </li> */}
                            <li>
                                <Link to="/san-pham/tim-kiem?sale=true">
                                    <span>Khuyến Mãi Sốc</span>
                                </Link>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/daothucongdasy">
                                    <span>Trung Tâm Hỗ Trợ</span>
                                </a>
                            </li>
                        </ul>
                        <div className="d-flex justify-content-center mt-5">
                            {token ? (
                            <div className="text-dark text-center">
                                <img src="/image/User_icon.png" width="100px" alt="" />
                                <span className="d-block text-dark">{JSONuser.name}</span>
                                <div className="mt-3">
                                    <div>
                                        <Link to="/tai-khoan/cai-dat" className="btn btn-success">Cài đặt</Link>
                                    </div>
                                    <div className="mt-2 text-white">
                                        <Link to="/don-hang/theo-doi" className="btn btn-primary text-white">Đơn hàng</Link>
                                    </div>
                                    <div className="mt-2">
                                        <button onClick={logOut} className="btn btn-warning text-white">Đăng xuất</button>
                                    </div>
                                </div>
                            </div>)
                            :(
                                <Link className="btn btn-danger p-3" to="/dang-nhap">
                                    <span className="text-white">Đăng nhập</span>
                                </Link>
                            )}
                        </div>
                    </Sidebar>
                </div>
                <div className="container-fluid header">
                    <div className="logo" style={{userSelect:'none'}}>
                        <Link to="/" className="custom-logo-link"> 
                            <img src="/logos/logoslogab.png" width="300px" alt="logo" /> 
                        </Link>
                    </div>	
                    <div className="container-form-search">
                        <form className="d-flex form-search" onSubmit={onSubmitSearch}>
                            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="input-search" placeholder="Tìm kiếm..." />
                            <button type="submit"><i className="fs-4 bi bi-search"></i></button>
                        </form>
                    </div>
                    <div className="phone d-flex position-relative ml-3">
                        <i className="bi bi-telephone fs-1"></i> 
                        <div className="ml-2">
                            <span className="d-block">Liên hệ:</span>
                            <span className="d-block fs-4">087.611.6507</span>
                        </div>
                    </div>
                    <div className="d-flex ml-3 text-center">
                        <div>
                            <button onClick={checkToken} to="/gio-hang" className="text-dark bg-transparent border-0">
                            <i className="fs-1 bi bi-cart position-relative d-block">
                                <div className="badge">
                                    {count}
                                </div>
                            </i>
                            <span className="d-block">Giỏ hàng</span>
                            </button>
                        </div>
                        <div className="ml-3">
                            {token ? (<div className="dropdown">
                            <a type="button" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false" className="text-dark dropdown-person">
                                <i className="fs-1 bi bi-person d-block"></i>
                                <span className="d-block">{JSONuser.name}</span>
                            </a>
                            <ul className="dropdown-menu p-3">
                                <li className="p-2"><Link to="/tai-khoan/cai-dat">Cài đặt</Link></li>
                                <li className="p-2"><Link to="/don-hang/theo-doi">Đơn hàng</Link></li>
                                <li className="p-2" style={{cursor:'pointer'}} onClick={logOut}>Đăng xuất</li>
                            </ul>
                            </div>
                            ) :
                            (
                            <Link className="text-dark" to="/dang-nhap">
                                <i className="fs-1 bi bi-person d-block"></i>
                                <span className="d-block">Đăng nhập</span>
                            </Link>
                            )}
                        </div>
                    </div>						
                </div>
                <nav className="navbar d-flex">
                    <div className="container-fluid">
                        <div className="d-flex justify-content-between align-items-center position-relative w-100">
                            <ul className="menu">
                                <li className="menu-item">
                                    <Link to="/">
                                        Trang Chủ
                                    </Link>
                                </li>
                                {/* <li className="menu-item">
                                    Dao Vip
                                    <i className="pi pi-angle-down ml-1"></i>
                                    <ul className="sub-menu">
                                        <li>
                                            <Link>
                                                Dao vip pro
                                            </Link>
                                        </li>
                                        <li>
                                            <Link>
                                                Dao siêu cấp
                                            </Link>
                                        </li>
                                        <li>
                                            <Link>
                                                Dao cực vip
                                            </Link>
                                        </li>
                                    </ul>
                                </li> */}
                                <li className="menu-item">
                                    Loại Dao
                                    <i className="pi pi-angle-down ml-1"></i>
                                    <ul className="sub-menu">
                                        {categories && categories.map((item) => (
                                            <li key={item.id}>
                                                <Link to={`/san-pham/tim-kiem/the-loai=${item.categoryName}?id=${item.id}`}>
                                                    {item.categoryName}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="menu-item">
                                    <Link to="/tin-tuc">
                                        Tin Tức
                                    </Link>
                                </li>
                                {/* <li className="menu-item">                                        
                                    Sản Phẩm Khác
                                    <i className="pi pi-angle-down ml-1"></i>
                                </li> */}
                            </ul>
                            <ul className="menu-right position-absolute">
                                <li>
                                    <Link to="/san-pham/tim-kiem?sale=true">
                                        <i className="fs-5 bi bi-fire mr-1"></i>
                                        <span>Khuyến Mãi Sốc</span>
                                    </Link>
                                </li>
                                <li>
                                    <a href="https://www.facebook.com/daothucongdasy">
                                        <i className="fs-5 bi bi-question-circle mr-1"></i>
                                        <span>Trung Tâm Hỗ Trợ</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <div className="page-body">
                <Outlet />
            </div>
            <div className="w-100 footer">
                <div className="container p-5 d-flex">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="contact col-md-6 p-0 m-0">
                                    <div className="text-white title-footer position-relative"><b>LIÊN HỆ</b></div>
                                    <div className="mt-3">
                                        Điện thoại: <span> 087.611.6507</span>
                                    </div>
                                    <div className="mt-3">
                                        Email: <span>testmailphpnqt@gmail.com</span>
                                    </div>
                                    <div className="mt-3">
                                        Fanpage:
                                        <a className="d-block" href="https://www.facebook.com/daothucongdasy">https://www.facebook.com/daothucongdasy</a>
                                    </div>
                                    <div className="mt-3">
                                        Shopee:
                                        <a  className="d-block" href="https://www.shopee.vn/dasdaokeo">https://www.shopee.vn/dasdaokeo</a>
                                    </div>
                                </div>
                                <div className="policy col-md-6 m-0">
                                    <div className="text-white title-footer position-relative"><b>CHÍNH SÁCH</b></div>
                                    <div className="mt-3"><Link>Chính sách giao nhận</Link></div>
                                    <div className="mt-3"><Link>Chính sách bảo hành - đổi trả</Link></div>
                                    <div className="mt-3"><Link>Chính sách ưu đãi</Link></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 p-0 m-0">
                            <div className="row">
                                <div className="description col-md-6 m-0">
                                    <div className="title-footer text-white position-relative"><b>MÔ TẢ</b></div>
                                    <div className="mt-3">Đây là nhưng loại dao siêu cấp vip pro nhất Đa Sỹ, đảm bảo ngon</div>
                                </div>
                                <div className="social-media col-md-6 m-0">
                                    <div className="title-footer text-white position-relative mb-2"><b>FANPAGE</b></div>
                                    <a href="https://www.facebook.com/daothucongdasy" className="mt-3 fanpage">DAS - Dao Thủ Công Đa Sỹ</a>
                                    <div className="mt-3">
                                        <a href="https://www.shopee.vn/dasdaokeo" className="fanpage">Shopee - DAS</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyright d-flex justify-content-center">
                    &copy; Copyright 2024 Dao Thủ Công Đa Sỹ. All rights reserved.
                </div>
            </div>
            <Dialog header="Thông báo" visible={visible1} modal footer={footerContent} style={{ width: '28rem' }} onHide={() => setVisible1(false)}>
                <p className="m-0">
                    Bạn cần đăng nhập để sử dụng chắc năng này.
                </p>
            </Dialog>
        </>
    );
}

export default DefaultLayout;