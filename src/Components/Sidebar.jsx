import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

function Sidebar() {
    const [active, setActive] = useState(1);
    const {sidebar, user} = useStateContext();
    const userJson = JSON.parse(user);
    useEffect(() => {
      const currentPath = window.location.pathname;
      if (currentPath === '/admin/dashboard') {
        setActive(1);
      }else if(currentPath === '/admin/poster'){
        setActive(2);
      }else if(currentPath === '/admin/san-pham/them-moi'){
        setActive(3);
      }else if(currentPath === '/admin/san-pham/danh-sach'){
        setActive(4);
      }else if(currentPath === '/admin/nguoi-dung/danh-sach'){
        setActive(5);
      }else if(currentPath === '/admin/loai-dao/danh-sach'){
        setActive(6);
      }else if(currentPath === '/admin/tin-tuc/them-moi'){
        setActive(7);
      }else if(currentPath === '/admin/tin-tuc/danh-sach'){
        setActive(8);
      }else if(currentPath === '/admin/don-hang/dang-cho'){
        setActive(9);
      }else if(currentPath === '/admin/don-hang/danh-sach'){
        setActive(10);
      }else if(currentPath === '/admin/san-pham/uu-dai'){
        setActive(11);
      }
    },[])
    return (
        <nav className={`sidebar sidebar-offcanvas ${sidebar ? " active" : ""}`} id="sidebar">
         <ul className="nav">
          <li className="nav-item nav-profile">
            <Link to="/admin/dashboard" className="nav-link">
              <div className="nav-profile-image">
                <img src="/logos/logo.png" alt="profile" />
                <span className="login-status online"></span>
              </div>
              <div className="nav-profile-text d-flex flex-column">
                <span className="font-weight-bold mb-2">Welcome {user && userJson.name}</span>
                <span className="text-secondary text-small">Trang Quản Trị</span>
              </div>
            </Link>
          </li>
          <li className={`nav-item ${active == 1 ? 'active' : ''}`} onClick={() => setActive(1)}>
            <Link to="/admin/dashboard" className="nav-link">
              <span className="menu-title">Dashboard</span>
              <i className="bi bi-house-door-fill menu-icon"></i>
            </Link>
          </li>
          <li className={`nav-item ${active == 2 ? 'active' : ''}`} onClick={() => setActive(2)}>
            <Link to="/admin/poster" className="nav-link">
              <span className="menu-title">Poster</span>
              <i className="bi bi-card-image menu-icon"></i>
            </Link>
          </li>
          <li className={`nav-item ${active == 3 || active == 4 ? 'active' : ''}`}>
            <a className="nav-link" data-bs-toggle="collapse" href="#products" aria-expanded="false" aria-controls="products">
              <span className="menu-title">Sản Phẩm</span>
              <i className="menu-arrow bi"></i>
              <i className="bi bi-list-task menu-icon"></i>
            </a>
            <div className="collapse" id="products">
              <ul className="nav flex-column sub-menu">
                <li className={`nav-item ${active == 3 ? 'active' : ''}`} onClick={() => setActive(3)}> <Link to="/admin/san-pham/them-moi" className="nav-link"><i className="bi bi-plus-circle-fill menu-icon" style={{marginLeft:'0', marginRight:'auto'}}></i><span className="menu-title">Thêm Mới</span></Link></li>
                <li className={`nav-item ${active == 4 ? 'active' : ''}`} onClick={() => setActive(4)}> <Link to="/admin/san-pham/danh-sach" className="nav-link"><i className="bi bi-eye-fill menu-icon" style={{marginLeft:'0', marginRight:'auto'}}></i><span className="menu-title">Danh Sách</span></Link></li>
              </ul>
            </div>
          </li>
          <li className={`nav-item ${active == 5 ? 'active' : ''}`} onClick={() => setActive(5)}>
            <Link to="/admin/nguoi-dung/danh-sach" className="nav-link">
              <span className="menu-title">Người Dùng</span>
              <i className="bi bi-people-fill menu-icon"></i>
            </Link>
          </li>
          <li className={`nav-item ${active == 6 ? 'active' : ''}`} onClick={() => setActive(6)}>
            <Link to="/admin/loai-dao/danh-sach" className="nav-link" href="pages/forms/basic_elements.html">
              <span className="menu-title">Thể Loại</span>
              <i className="bi bi-bookmarks-fill menu-icon"></i>
            </Link>
          </li>
          <li className={`nav-item ${active == 7 || active == 8 ? 'active' : ''}`}>
            <a className="nav-link" data-bs-toggle="collapse" href="#news" aria-expanded="false" aria-controls="news">
              <span className="menu-title">Tin Tức</span>
              <i className="menu-arrow bi"></i>
              <i className="bi bi-newspaper menu-icon"></i>
            </a>
            <div className="collapse" id="news">
              <ul className="nav flex-column sub-menu">
                <li className={`nav-item ${active == 7 ? 'active' : ''}`} onClick={() => setActive(7)}><Link to="/admin/tin-tuc/them-moi" className="nav-link"><i className="bi bi-plus-circle-fill menu-icon" style={{marginLeft:'0', marginRight:'auto'}}></i><span className="menu-title">Thêm Mới</span></Link></li>
                <li className={`nav-item ${active == 8 ? 'active' : ''}`} onClick={() => setActive(8)}><Link to="/admin/tin-tuc/danh-sach" className="nav-link"><i className="bi bi-eye-fill menu-icon" style={{marginLeft:'0', marginRight:'auto'}}></i><span className="menu-title">Danh Sách</span></Link></li>
              </ul>
            </div>
          </li>
          <li className={`nav-item ${active == 9 || active == 10 ? 'active' : ''}`}>
            <a className="nav-link" data-bs-toggle="collapse" href="#orders" aria-expanded="false" aria-controls="orders">
              <span className="menu-title">Đơn Hàng</span>
              <i className="menu-arrow bi"></i>
              <i className="bi-bag-fill menu-icon"></i>
            </a>
            <div className="collapse" id="orders">
              <ul className="nav flex-column sub-menu">
                <li className={`nav-item ${active == 9 ? 'active' : ''}`} onClick={() => setActive(9)}><Link to="/admin/don-hang/dang-cho" className="nav-link"><i className="bi bi-bag-dash-fill menu-icon" style={{marginLeft:'0', marginRight:'auto'}}></i><span className="menu-title">Đang Chờ</span></Link></li>
                <li className={`nav-item ${active == 10 ? 'active' : ''}`} onClick={() => setActive(10)}><Link to="/admin/don-hang/danh-sach" className="nav-link"><i className="bi bi-bag-check menu-icon" style={{marginLeft:'0', marginRight:'auto'}}></i><span className="menu-title">Danh Sách</span></Link></li>
              </ul>
            </div>
          </li>
          <li className={`nav-item ${active == 11 ? 'active' : ''}`} onClick={() => setActive(11)}>
            <Link to="/admin/san-pham/uu-dai" className="nav-link">
              <span className="menu-title">Sales</span>
              <i className="bi bi-cart-fill menu-icon"></i>
            </Link>
          </li>
        </ul>
      </nav>
    );
}

export default Sidebar;