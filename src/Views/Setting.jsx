import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { Button } from "primereact/button";
import { BreadCrumb } from "primereact/breadcrumb";

function Setting() {
    const {user, token, toast, setUser} = useStateContext();
    const jsonUser = JSON.parse(user);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        document.title = "Cài Đặt - Dao Thủ Công Đa Sỹ";
        if(jsonUser){
            setName(jsonUser.name);
            setPhone(jsonUser.phone);
            setAddress(jsonUser.address);
        }
    },[reload])
    if(!token){
        return <Navigate to="/" />
    }
    const handleShowInput = (input) => {
        const id = document.getElementById(input);
        if(id){
            id.style.display = "block";
        }
    }
    const cancelChange = () => {
        setName(jsonUser.name);
        setPhone(jsonUser.phone);
        setAddress(jsonUser.address);
        document.getElementById('name').style.display = 'none';
        document.getElementById('phone').style.display = 'none';
        document.getElementById('address').style.display = 'none';
    }

    const saveChange = async () => {
        if(name != "" && address != ""){
            if(name != jsonUser.name || jsonUser.address != address || phone != jsonUser.phone){
                setLoading(true);
                await axiosClient.post('/users/updateUser',{
                    id : jsonUser.id,
                    address,
                    phone,
                    name
                })
                .then(({data}) => {
                    setUser(JSON.stringify(data))
                    toast.current.show({ severity: 'success', summary: 'Thành Công', detail: "Cập nhật thành công.", life: 5000 });
                    document.getElementById('name').style.display = 'none';
                    document.getElementById('phone').style.display = 'none';
                    document.getElementById('address').style.display = 'none';
                })
                setReload(!reload)
                setLoading(false)
            }else{
                toast.current.show({ severity: 'info', summary: 'Thông Báo', detail: "Dữ liệu không khác cũ.", life: 5000 });
            }
        }
    }

    const items = [
        {
            label: 'Cài Đặt'
        }
    ];
    const home = { label: 'Trang Chủ', template: () => <Link to="/"><a className="text-dark font-semibold">Trang Chủ</a></Link> };
    return (  
        <div className="container-fluid" style={{minHeight:'30vh'}}>
            <BreadCrumb className="mb-3" model={items} home={home} />
            <div className="d-flex justify-content-center">
                <div className="setting-user d-flex">
                <div className="d-flex">
                        <div>
                            <h4>Tên: <i>{jsonUser.name}</i></h4>
                            <input type="text" id="name" className="rounded-2 p-2" style={{display:'none'}} onChange={(e) => setName(e.target.value)} value={name} />
                        </div>
                        <div className="ml-3">
                            <button onClick={() => handleShowInput('name')} className="float-end btn btn-primary">Thay đổi</button>
                        </div>
                    </div>
                    <div>
                        <h4>Email: {jsonUser.email}</h4>
                    </div>
                    <div className="d-flex">
                        <div>
                            <h4>Số điện thoại: {jsonUser.phone}</h4>
                            <input type="text" className="rounded-2 p-2" id="phone" style={{display:'none'}} onChange={(e) => setPhone(e.target.value)} value={phone} />
                        </div>
                        <div className="ml-3">
                            <button onClick={() => handleShowInput('phone')} className="float-end btn btn-primary">Thay đổi</button>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="">
                            <h4>Địa chỉ: <i>{jsonUser.address}</i></h4>
                            <input type="text" className="rounded-2 p-2" id="address" style={{display:'none'}} onChange={(e) => setAddress(e.target.value)} value={address} />
                        </div>
                        <div className="ml-3">
                            <button onClick={() => handleShowInput('address')} className="btn btn-primary float-end">Thay đổi</button>
                        </div>
                    </div>
                    <div>
                        <Button loading={loading} className="btn btn-success mr-3" onClick={saveChange}>Lưu</Button>
                        <button className="btn btn-danger" onClick={cancelChange}>Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Setting;