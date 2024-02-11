import { BreadCrumb } from "primereact/breadcrumb";
import { InputNumber } from "primereact/inputnumber";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import unidecode from "unidecode";

function Cart() {
    const {token, user, toast, count, setCount} = useStateContext();
    const JSONuser = JSON.parse(user);
    const [cart, setCart] = useState([]);
    const [reload, setReload] = useState(false);
    const navigate =useNavigate();
    useEffect(() => {
        if(JSONuser){
            axiosClient.post(`carts/${JSONuser.id}/getCart`)
            .then(({data}) => {
                setCart(data);
            })
        }
        document.title = "Giỏ hàng - Dao Thủ Công Đa Sỹ";
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[reload])
    if(!token){
        return <Navigate to="/" />
    }
    const items = [
        {
            label: 'Giỏ Hàng'
        }
    ];
    const handleQuantityChange = (itemId, newQuantity) => {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
    };
    const deleteProduct = async (product) => {
        await axiosClient.post('carts/removeCart',{
            idProduct: product,
            idUser: JSONuser.id
        }).then(({data}) => {
            toast.current.show({ severity: 'success', summary: 'Thành Công', detail: data, life: 5000 });
        })
        setReload(!reload);
        setCount(count - 1);
    }
    const calculateTotalAmount = () => {
        if (cart && cart.length > 0) {
          return cart.reduce((accumulator, item) => {
            const itemPrice = item.price - (item.price * item.discount / 100);
            const itemTotal = itemPrice * item.quantity;
            return accumulator + itemTotal;
          }, 0).toFixed(2);
        }
      
        return 0.00;
    };

    const submitOrder = () => {
        localStorage.setItem('products', JSON.stringify(cart));
        navigate('/mua-hang');
    }
    const home = { label: 'Trang Chủ', template: () => <Link to="/"><a className="text-dark font-semibold">Trang Chủ</a></Link> };
    return (  
        <div className="container-fluid" style={{minHeight:'30vh'}}>
            <BreadCrumb className="mb-3" model={items} home={home} />
            <div className="row cart">
                <div className="col-lg-9 mb-5">
                    {cart.length != 0 ? (
                    <table className="w-100">
                        <thead>
                            <tr>
                                <th className="product-name" colSpan="2">Sản Phẩm</th>
                                <th className="product-price">Giá</th>
                                <th className="product-quantity">Số lượng</th>
                                <th className="product-subtotal">Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart && cart.map((item) => (
                            <tr key={item.id}>
                                <td data-title="Ảnh" className="item-table">
                                    <img src={item.imageLink} width="150px" height="150px" alt={item.imageName} />
                                </td>
                                <td data-title="Tên sản phẩm" className="item-table">
                                    <Link to={`/${encodeURIComponent(unidecode(item.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}> {item.name}</Link>
                                </td>
                                <td data-title="Đơn giá" className="item-table">
                                    {parseFloat(item.price - (item.price * item.discount / 100)).toFixed(2)}<span>{'\u0111'}</span>
                                </td>
                                <td data-title="Số lượng" className="item-table">
                                    <InputNumber inputId={`minmax-buttons-${item.id}`} value={item.quantity} onValueChange={(e) => handleQuantityChange(item.id, e.value)} mode="decimal" showButtons min={0} max={100} />
                                </td>
                                <td data-title="Tổng" className="item-table">
                                    {parseFloat(item.price - (item.price * item.discount / 100)).toFixed(2) * item.quantity}<span>{'\u0111'}</span>
                                </td>
                                <td className="remove-product">
                                    <i className="bi bi-x-lg" onClick={() => deleteProduct(item.idProduct)} style={{cursor:'pointer'}}></i>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>)
                    : "Giỏ hiện không có sản phẩm nào."}
                </div>
                <div className="col-lg-3">
                    <div>
                        <h3 className="mb-3">Tổng Tiền</h3>
                        <div className="total d-flex">
                            <span className="float-left">Tổng tiền:</span>
                            <div className="flex-1 d-flex justify-content-end">
                            <span className="text-dark">{calculateTotalAmount()}{'\u0111'}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center mt-4">
                            <button onClick={submitOrder} disabled={cart.length == 0} className="btn btn-danger rounded-0 w-100">Đặt hàng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;