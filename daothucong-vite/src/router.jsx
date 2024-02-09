import { Navigate, createBrowserRouter } from "react-router-dom";
import Home from "./Views/Home";
import DefaultLayout from "./Components/Layouts/DefaultLayout";
import News from "./Views/News";
import AdminLayout from "./Components/Layouts/AdminLayout";
import Dashboard from "./Views/Dashboard";
import Poster from "./Views/Poster";
import NewProduct from "./Views/NewProduct";
import ListProduct from "./Views/ListProduct";
import EditProduct from "./Views/EditProduct";
import ListUser from "./Views/ListUser";
import ListCategory from "./Views/ListCategory";
import ListNews from "./Views/ListNews";
import NewNews from "./Views/NewNews";
import Login from "./Views/Admin/Login";
import SignUp from "./Views/SignUp";
import ListOrders from "./Views/ListOrders";
import SaleProducts from "./Views/SaleProducts";
import Filter from "./Views/Filter";
import Details from "./Views/Details";
import LoginGuest from "./Views/Login";
import Authenticate from "./Views/authenticate";
import ResetPass from "./Views/ResetPass";
import ChangePassword from "./Views/ChangePassword";
import Cart from "./Views/Cart";
import Order from "./Views/Order";
import Setting from "./Views/Setting";
import ProcessOrder from "./Views/ProcessOrder";
import DetailNews from "./Views/DetailNews";
import FilterCategory from "./Views/FilterCategory";
const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children:[
            {
                path: '/',
                element: <Home />
            },
            {
                path:'/tin-tuc',
                element: <News />
            },
            {
                path:'/tin-tuc/:dynamicPath',
                element: <DetailNews />
            },
            {
                path: 'san-pham/tim-kiem',
                element: <Filter />
            },
            {
                path: '/san-pham/tim-kiem/:dynamicPath',
                element: <FilterCategory />
            },
            {
                path: ':dynamicPath',
                element: <Details />
            },
            {
                path: '/dang-nhap',
                element: <LoginGuest />
            },
            {
                path: '/dang-ky',
                element: <SignUp />
            },
            {
                path: '/dang-ky/xac-thuc/:dynamicPath',
                element: <Authenticate />
            },
            {
                path: 'quen-mat-khau',
                element: <ResetPass />
            },
            {
                path: 'quen-mat-khau/doi-mat-khau/:dynamicPath',
                element: <ChangePassword />
            },
            {
                path: 'gio-hang',
                element: <Cart />
            },
            {
                path: 'mua-hang',
                element: <Order />
            },
            {
                path: 'tai-khoan/cai-dat',
                element: <Setting />
            },
            {
                path: 'don-hang/theo-doi',
                element: <ProcessOrder />
            },
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children:[
            {
                path:'dashboard',
                element: <Dashboard />
            },
            {
                path:'poster',
                element: <Poster />
            },
            {
                path:'san-pham/them-moi',
                element: <NewProduct />
            },
            {
                path:'san-pham/chinh-sua/:dynamicPath',
                element: <EditProduct />
            },
            {
                path:'san-pham/danh-sach',
                element: <ListProduct />
            },{
                path:'san-pham/uu-dai',
                element: <SaleProducts />
            },
            {
                path:'nguoi-dung/danh-sach',
                element: <ListUser />
            },
            {
                path:'loai-dao/danh-sach',
                element: <ListCategory />
            },
            {
                path:'tin-tuc/danh-sach',
                element: <ListNews />
            },
            {
                path:'tin-tuc/them-moi',
                element: <NewNews />
            },
            {
                path:'tin-tuc/chinh-sua/:dynamicPath',
                element: <NewNews />
            },
            {
                path:'don-hang/:dynamicPath',
                element: <ListOrders />
            }
        ]
    },
    {
        path:'/admin/dang-nhap',
        element: <Login />
    },
    {
        path: '*',
        element: <Navigate to="/" />
    }
])

export default router;