import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";
import axiosClient from "../axios-client";
import { Card } from 'primereact/card';
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
        
function ProcessOrder() {
    const {token, user, toast} = useStateContext();
    const jsonUser = JSON.parse(user);
    const [data, setData] = useState(null);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        document.title = "Đơn Hàng Đã Đặt - Dao Thủ Công Đa Sỹ";
        axiosClient.post('/orders/getOrderByUser',{
            id: jsonUser.id
        }).then(({data}) => {
            setData(data);
        })
    },[jsonUser.id, reload])
    if(!token){
        return <Navigate to="/" />
    }
    const items = [
        {
            label: 'Giỏ Hàng', template: () => <Link to="/gio-hang"><a className="text-dark font-semibold">Giỏ Hàng</a></Link>
        },
        {
            label: 'Đơn Hàng'
        }
    ];
    const home = { label: 'Trang Chủ', template: () => <Link to="/"><a className="text-dark font-semibold">Trang Chủ</a></Link> };

    const statusBodyTemplate = (rowData) => {
        const status = parseInt(rowData.status);
        if(status == "0"){
            return <Tag value="Đang chờ" severity={getSeverity(rowData)}></Tag>;
        } else if(status == "1"){
            return <Tag value="Đang giao" severity={getSeverity(rowData)}></Tag>;
        } else if(status == "2"){
            return <Tag value="Đã giao hàng" severity={getSeverity(rowData)}></Tag>;
        }else{
            return <Tag value="Đã hủy" severity={getSeverity(rowData)}></Tag>;
        }
    };
    
    const getSeverity = (order) => {
        const status = parseInt(order.status);

        if (status == "0") {
            return 'warning';
        } else if (status == "1") {
            return 'info';
        } else if (status == "2"){
            return 'success';
        }
        else {
           return 'danger';
        }
    };

    const cancelOrder = async (order) => {
        setLoading(true);
        await axiosClient.post('/orders/cancelOrder',{
            id : order.id
        })
        toast.current.show({ severity: 'info', summary: 'Thành Công', detail: "Hủy đơn hàng thành công.", life: 5000 });
        setReload(!reload);
        setLoading(false);
    }
    return (  
        <div className="container-fluid">
            <BreadCrumb className="mb-3" model={items} home={home} />
            <div>
                {data && data.map((item)=> (
                    <div key={item.id}>
                        <Card title={`Đơn Hàng Ngày ${item.created_at}`} className="mb-4 p-3">
                            {item.products.map((product) => (
                            <div className="d-flex gap-2 mb-2" key={product.idProduct}>
                                <img src={product.imageLink} width="100px" height="100px" alt={product.imageName} />
                                <div className="flex-1">
                                    <h4>{product.name}</h4>
                                    x{product.quantity}
                                </div>
                                <div style={{paddingRight:'10px'}}>
                                    <del>{product.price* product.quantity}đ</del>
                                    <div className="text-danger">
                                        {product.toMoney}đ
                                    </div>
                                </div>
                            </div>
                            ))}
                            <div className="d-flex gap-5 mt-4 p-3 rounded-1" style={{background:'#f5f5f5'}}>
                                <div className="flex-1 d-flex align-items-center " style={{fontSize:'25px'}}>
                                    <span className="mr-2">Trạng thái đơn hàng:</span> {statusBodyTemplate(item)}
                                </div>
                                <div className="d-flex flex-column justify-content-end" style={{paddingRight:'10px'}}>
                                    <span style={{fontSize:'25px'}}>Tổng đơn: {item.totalMoney}đ</span>
                                    <div className="d-flex justify-content-center">
                                        <Button loading={loading} disabled={item.status == '-1' || item.status == "2"} onClick={() => {cancelOrder(item)}} className="mt-4" severity="danger">Hủy Đơn</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProcessOrder;