import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import axiosClient from '../axios-client';
import { Dialog } from 'primereact/dialog';
import { OrderList } from 'primereact/orderlist';
import { useParams } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { useStateContext } from '../contexts/ContextProvider';
        
function ListOrders() {
    const [orders, setOrders] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [detailOrderDialog, setDetailOrderDialog] = useState(false);
    const [detailOrder, setDetailOrder] = useState([]);
    const dt = useRef(null);
    const check = useParams();
    const {toast} = useStateContext();
    const [reLoad, setReLoad] = useState(false);
    useEffect(()=>{
        setOrders([]);
        if(check.dynamicPath == "danh-sach"){
            document.title = "Danh Sách Đơn Hàng"
            axiosClient.post('/orders/getOrdersSuccess')
            .then(({data}) => {
                setOrders(data);
            })
        }else{
            document.title = "Danh Sách Đơn Hàng Đang Chờ"
            axiosClient.post('/orders/getOrdersPeding')
            .then(({data}) => {
                setOrders(data);
            })
        }
    },[check, reLoad])

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const rightToolbarTemplate = () => {
        return <Button label="Xuất File Excel" icon="pi pi-upload" className="p-button-help rounded-4" onClick={exportCSV} />;
    };

    const header = (
        <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Quản Lý Đơn Hàng</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );

    const openDialogDetail = (order) => {
        axiosClient.post('/orders/getDetailOrder',{
            idOrder: order.id
        })
        .then(({data}) => {
            setDetailOrder(data);
        })
        setDetailOrderDialog(true);
    };

    const hideDetailOrderDialog = () => {
        setDetailOrderDialog(false);
        setDetailOrder([]);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" outlined className='rounded-circle' severity="info" onClick={() => openDialogDetail(rowData)} />
            </React.Fragment>
        );
    };

    const detailOrderDialogFooter = (
        <React.Fragment>
            <Button label="Đóng" icon="pi pi-times" className='mr-2 rounded-4' outlined onClick={hideDetailOrderDialog} />
        </React.Fragment>
    );

    const itemTemplate = (item) => {
        return (
            <div className="d-flex flex-wrap p-2 align-items-center gap-3">
                <img className="w-4rem shadow-2 flex-shrink-0 border-round" style={{width:'8rem'}} src={item.imageLink} alt={item.imageName} />
                <div className="flex-1 d-flex flex-column gap-2" style={{marginRight:'auto'}}>
                    <span className="font-bold">{item.name}</span>
                    <div className="d-flex align-items-center gap-2">
                        <span>Số lượng:</span>
                        <span>{item.quantity}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span>Đơn giá: </span>
                        <span>{item.price}</span>
                    </div>
                </div>
                <span className="font-bold text-900">{item.toMoney} VNĐ</span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        const status = parseInt(rowData.status);
        if(status == "0"){
            return <Tag value="Đang chờ" severity={getSeverity(rowData)}></Tag>;
        } else if(status == "1"){
            return <Tag value="Đang giao" severity={getSeverity(rowData)}></Tag>;
        } else{
            return <Tag value="Đã thanh toán" severity={getSeverity(rowData)}></Tag>;
        }
    };

    const getSeverity = (order) => {
        const status = parseInt(order.status);

        if (status == "0") {
            return 'warning';
        } else if (status == "1") {
            return 'info';
        } else {
            return 'success';
        }
    };

    const getSeverityStatus = (option) => {
        if (option == "Đang chờ") {
            return 'warning';
        } else if (option == "Đang giao") {
            return 'info';
        } else {
            return 'success';
        }
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.totalMoney);
    };

    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };

    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={['Đang chờ', "Đang giao", "Đã thanh toán"]}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Chọn trạng thái"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverityStatus(option)}></Tag>;
                }}
            />
        );
    };

    const onRowEditComplete = (e) => {
        axiosClient.post('/orders/updateStatusOrder', {
            idOrder: e.newData.id,
            status: e.newData.status
        })
        .then(({data}) => {
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: data, life: 5000 });
            setReLoad(!reLoad);
        })
    };
    return (
        <div>
            <div className="card">
                <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={orders} editMode="row" onRowEditComplete={onRowEditComplete}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} emptyMessage="Không có đơn hàng nào."
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Orders" globalFilter={globalFilter} header={header}>
                    <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }}></Column>
                    <Column field="name" header="Tên Khách Hàng" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="totalMoney" body={priceBodyTemplate} header="Tổng Tiền"></Column>
                    <Column field="create_at" header="Ngày Đặt"></Column>
                    <Column field="status" editor={(options) => statusEditor(options)} header="Trạng Thái" body={statusBodyTemplate} style={{ minWidth: '12rem' }}></Column>
                    {check.dynamicPath == "dang-cho" && <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>}
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>

            <Dialog visible={detailOrderDialog} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Chi tiết đơn hàng" modal footer={detailOrderDialogFooter} onHide={hideDetailOrderDialog}>
                <div className="confirmation-content">
                <div className="card xl:flex xl:justify-content-center">
                    <OrderList dataKey="id" value={detailOrder} onChange={(e) => setDetailOrder(e.value)} itemTemplate={itemTemplate}></OrderList>
                </div>
                </div>
            </Dialog>
        </div>
    );
}

export default ListOrders;