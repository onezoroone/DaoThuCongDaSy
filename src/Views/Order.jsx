/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { Button } from "primereact/button";
import { BreadCrumb } from "primereact/breadcrumb";

function Order() {
    const {token, user, toast} = useStateContext();
    const JSONuser = JSON.parse(user);
    const [loading, setLoading] = useState(false);
    const storedProductInfo = JSON.parse(localStorage.getItem('products'));
    const navi = useNavigate();
    const [reload, setReload] = useState(false);
    useEffect(() => {
        document.title = "Đặt Hàng - Dao Thủ Công Đa Sỹ"
    },[reload])
    if(!token || !storedProductInfo){
        return <Navigate to="/" />
    }
    const handleOrder = async () => {
        if(storedProductInfo.length != 0){
            setLoading(true);
            await axiosClient.post('/Order',{
                idUser: JSONuser.id,
                product: storedProductInfo,
            })
            .then(({data}) => {
                toast.current.show({severity:'success', summary: 'Thành Công', detail: data, life: 5000});
                localStorage.removeItem('products');
                navi("/don-hang/theo-doi");
            })
            setLoading(false);
        }else{
            toast.current.show({severity:'error', summary: 'Không có sản phẩm nào trong đơn hàng đi lựa hàng ngay!', life: 10000,
            content: (props) => (
                <div className="flex flex-column align-items-left">
                    <div className="font-medium text-lg my-3 text-900">{props.message.summary}</div>
                    <Link to="/"><Button className="p-button-sm flex rounded-3 " label="Đi lựa ngay" severity="danger"></Button></Link>
                </div>
            )});
        }
    }
    const deleteProduct = async (product) => {
        toast.current.show({ severity: 'success', summary: 'Thành Công', detail: "Xóa thành công sản phẩm ra khỏi đơn hàng.", life: 5000 });
        const newArray = storedProductInfo.filter(item => item.id !== product);
        localStorage.setItem('products', JSON.stringify(newArray));
        if(newArray.length == 0){
           navi("/"); 
        }
        setReload(!reload);
    }
    const calculateTotalAmount = () => {
        if (storedProductInfo && storedProductInfo.length > 0) {
          return storedProductInfo.reduce((accumulator, item) => {
            const itemPrice = item.price - (item.price * item.discount / 100);
            const itemTotal = itemPrice * item.quantity;
            return accumulator + itemTotal;
          }, 0).toFixed(2);
        }
      
        return 0.00;
    };
    const items = [
        {
            label: 'Giỏ Hàng', template: () => <Link to="/gio-hang"><a className="text-dark font-semibold">Giỏ Hàng</a></Link>
        },
        {
            label: 'Đặt Hàng'
        }
    ];
    const home = { label: 'Trang Chủ', template: () => <Link to="/"><a className="text-dark font-semibold">Trang Chủ</a></Link> };
    return (  
        <div className="container-fluid">
            <BreadCrumb className="mb-3" model={items} home={home} />
            <div className="row cart">
                <div className="col-lg-6">
                    <div className="p-5 rounded-4" style={{background:'#f5f5f5'}}>
                        <h2 className="text-danger">Thông tin người nhận</h2>
                        <div className="mt-3">
                            <h4>Tên: {JSONuser.name}</h4>
                        </div>
                        <div className="mt-3">
                            <h4>Địa chỉ nhận hàng: {JSONuser.address}</h4> <Link className="text-primary" to="/tai-khoan/cai-dat">Thay đổi địa chỉ nhận hàng</Link>
                        </div>
                        <div className="mt-3">
                           <h4> Số điện thoại: {JSONuser.phone && JSONuser.phone}</h4>
                        </div>
                        <div className="mt-3">
                            <h4>Tổng tiền đơn hàng: {calculateTotalAmount()}{'\u0111'}</h4>
                        </div>
                        <div className="mt-3">
                            <Button loading={loading} onClick={handleOrder} disabled={storedProductInfo.length == 0} className="btn btn-danger">Xác nhận</Button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                <table className="mt-3 w-100">
                        <thead>
                            <tr>
                                <th className="product-name" colSpan="2">Sản Phẩm</th>
                                <th className="product-price">Giá</th>
                                <th className="product-quantity">Số lượng</th>
                                <th className="product-subtotal">Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {storedProductInfo && storedProductInfo.map((item) => (
                            <tr key={item.id}>
                                <td data-title="Ảnh" className="item-table">
                                    <img src={item.imageLink} width="150px" height="150px" alt={item.imageLink} />
                                </td>
                                <td data-title="Tên sản phẩm" className="item-table">
                                    {item.name}
                                </td>
                                <td data-title="Đơn giá" className="item-table">
                                    {parseFloat(item.price - (item.price * item.discount / 100)).toFixed(2)}<span>{'\u0111'}</span>
                                </td>
                                <td data-title="Số lượng" className="item-table">
                                    {item.quantity}
                                </td>
                                <td data-title="Tổng" className="item-table">
                                    {parseFloat(item.price - (item.price * item.discount / 100)).toFixed(2) * item.quantity}<span>{'\u0111'}</span>
                                </td>
                                <td className="remove-product">
                                    <i className="bi bi-x-lg" onClick={() => deleteProduct(item.id)} style={{cursor:'pointer'}}></i>
                                </td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Order;