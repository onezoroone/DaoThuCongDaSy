import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';
function ListNews() {
    let emptyProduct = {
        id: null,
        title: '',
        image: null,
    };

    const [nNews, setNNews] = useState([]);
    const [deleteNewsDialog, setDeleteNewsDialog] = useState(false);
    const [deleteNNewsDialog, setDeleteNNewsDialog] = useState(false);
    const [news, setNews] = useState(emptyProduct);
    const [selectedNews, setSelectedNews] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [reLoad, setReLoad] = useState(false);
    const {toast} = useStateContext();
    const dt = useRef(null);
    useEffect(()=>{
        document.title = "Danh sách sản phẩm"
        axiosClient.post('/news/getNews')
        .then(({data}) => {
            setNNews(data);
        })
    },[reLoad])

    const hideDeleteNewsDialog = () => {
        setDeleteNewsDialog(false);
    };

    const hideDeleteNNewsDialog = () => {
        setDeleteNNewsDialog(false);
    };


    const confirmDeleteNews = (product) => {
        setNews(product);
        setDeleteNewsDialog(true);
    };

    const deleteNews = async () => {
        setDeleteNewsDialog(false);
        await axiosClient.post(`/news/${news.id}/deleteNews`)
        .then(({data}) => {
            toast.current.show({ severity: 'success', summary: 'Thành Công', detail: data, life: 5000 });
        })
        setNews(emptyProduct);
        setReLoad(!reLoad);
    };

    const confirmDeleteSelected = () => {
        setDeleteNNewsDialog(true);
    };

    const deleteSelectedNews = async () => {
        setDeleteNNewsDialog(false);
        for(let i = 0; i < selectedNews.length; i++){
            await axiosClient.post(`/news/${selectedNews[i].id}/deleteNews`)
            .then(({data}) => {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: data, life: 5000 });
            })
        }
        setReLoad(!reLoad);
        setSelectedNews(null);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="d-flex flex-wrap gap-2">
                <Link to="/admin/tin-tuc/them-moi"><Button label="Mới" className='rounded-4 w-100' icon="pi pi-plus" severity="success" /></Link>
                <Button label="Xóa" icon="pi pi-trash" className='rounded-4' severity="danger" onClick={confirmDeleteSelected} disabled={!selectedNews || !selectedNews.length} />
            </div>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.image} alt={rowData.image} className="shadow-2 border-round" style={{ width: '150px' }} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Link to={`/admin/tin-tuc/chinh-sua/${rowData.id}`}><Button icon="pi pi-pencil" outlined className="mr-2 rounded-circle" /></Link>
                <Button icon="pi pi-trash" outlined className='rounded-circle' severity="danger" onClick={() => confirmDeleteNews(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Quản Lý Tin Tức</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );

    const deleteNewsDialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" className='mr-2 rounded-4' outlined onClick={hideDeleteNewsDialog} />
            <Button label="Có" icon="pi pi-check" className='rounded-4' severity="danger" onClick={deleteNews} />
        </React.Fragment>
    );
    const deleteNNewsDialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" className='mr-2 rounded-4' outlined onClick={hideDeleteNNewsDialog} />
            <Button label="Có" icon="pi pi-check" className='rounded-4' severity="danger" onClick={deleteSelectedNews} />
        </React.Fragment>
    );

    return (
        <div>
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={nNews} selection={selectedNews} onSelectionChange={(e) => setSelectedNews(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} emptyMessage="Không có bài viết nào được tìm thấy."
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} news" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple"></Column>
                    <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }}></Column>
                    <Column field="title" header="Tên Bài Viết" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="image" header="Ảnh" body={imageBodyTemplate}></Column>
                    <Column field="create_at" header="Ngày Đăng"></Column>
                    <Column body={actionBodyTemplate} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={deleteNewsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác Nhận" modal footer={deleteNewsDialogFooter} onHide={hideDeleteNewsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle text-warning mr-2" style={{ fontSize: '2rem' }} />
                    {news && (
                        <span>
                            Bạn có muốn xóa tin <b>{news.title}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
            <Dialog visible={deleteNNewsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác Nhận" modal footer={deleteNNewsDialogFooter} onHide={hideDeleteNNewsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle text-warning mr-2" style={{ fontSize: '2rem' }} />
                    {news && <span>Bạn có muốn xóa các tin đã chọn?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default ListNews;