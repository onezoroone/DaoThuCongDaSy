import { useEffect, useState } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import axiosClient from '../axios-client';
function ListUser() {
    const [customers, setCustomers] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        document.title = "Danh Sách Người Dùng"
        const fetchData = async () => {
            await axiosClient.post('users/getUsers')
            .then(({data}) => {
                setCustomers(data)
            })}
        fetchData()
        setLoading(false)
    },[])

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilter} onInput={(e) => setGlobalFilter(e.target.value)}  placeholder="Nhập từ khóa" />
                </span>
            </div>
        );
    };

    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'true-icon pi-check-circle': rowData.verified == "true", 'false-icon pi-times-circle': rowData.verified == "false" })}></i>;
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable value={customers} paginator rows={10} dataKey="id"  globalFilter={globalFilter} loading={loading}
                    header={header} emptyMessage="Không có người dùng nào được tìm thấy.">
                <Column field="name" header="Tên" style={{ minWidth: '12rem' }} />
                <Column header="Địa chỉ" field='address' style={{ minWidth: '12rem' }}/>
                <Column field='email' header="Email" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} />
                <Column field="phone" header="Số Điện Thoại" style={{ minWidth: '12rem' }}/>
                <Column field="note" header="Ghi chú" style={{ minWidth: '12rem' }}/>
                <Column field="verified" header="Xác thực" style={{ minWidth: '6rem' }} body={verifiedBodyTemplate} />
            </DataTable>
        </div>
    );
}

export default ListUser;