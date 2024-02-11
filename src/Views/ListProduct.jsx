import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';

function ListProduct() {
    let emptyProduct = {
        id: null,
        name: '',
        imageLink: null,
        sumdescription: '',
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
    };

    const [products, setProducts] = useState([]);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [reLoad, setReLoad] = useState(false);
    const {toast} = useStateContext();
    const dt = useRef(null);
    useEffect(()=>{
        document.title = "Danh Sách Sản Phẩm";
        axiosClient.post('/products/getProducts')
        .then(({data}) => {
            setProducts(data);
        })
    },[reLoad])
    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };


    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };


    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        setDeleteProductDialog(false);
        await axiosClient.post(`/products/${product.id}/deleteProduct`)
        .then(({data}) => {
            toast.current.show({ severity: 'success', summary: 'Thông báo thành công', detail: data, life: 3000 });
        })
        setProduct(emptyProduct);
        setReLoad(!reLoad);
    };


    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = async () => {
        setDeleteProductsDialog(false);
        for(let i = 0; i < selectedProducts.length; i++){
            await axiosClient.post(`/products/${selectedProducts[i].id}/deleteProduct`)
            .then(({data}) => {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: data, life: 3000 });
            })
        }
        setSelectedProducts(null);
        setReLoad(!reLoad);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="d-flex flex-wrap gap-2">
                <Link to="/admin/san-pham/them-moi"><Button label="Mới" className='rounded-4 w-100' icon="pi pi-plus" severity="success" /></Link>
                <Button label="Xóa" icon="pi pi-trash" className='rounded-4' severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Xuất File Excel" icon="pi pi-upload" className="p-button-help rounded-4" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.imageLink} alt={rowData.imageName} className="shadow-2 border-round" style={{ width: '100px' }} />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        const quantity = parseInt(rowData.quantity);
        const previousDate = rowData.create_at;
        const currentDate = new Date();
        const diffInTime = currentDate.getTime() - new Date(previousDate).getTime();
        const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
        if(quantity > 10 && diffInDays < 1){
            return <Tag value="Mới" severity={getSeverity(rowData)}></Tag>;
        } else if(quantity < 10 && quantity > 0 && diffInDays >= 1){
            return <Tag value="Sắp hết hàng" severity={getSeverity(rowData)}></Tag>;
        } else if(quantity == 0){
            return <Tag value="Hết hàng" severity={getSeverity(rowData)}></Tag>;
        }else{
            return <Tag value="Còn hàng" severity={getSeverity(rowData)}></Tag>;
        }
    };

    const categoryBodyTemplate = (rowData) => {
        return (
                rowData && rowData.categoryName.map((item, index) => (
                    <span key={index}>{item}, </span>
                ))
        )
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Link to={`/admin/san-pham/chinh-sua/${rowData.id}`}><Button icon="pi pi-pencil" outlined className="mr-2 rounded-circle" /></Link>
                <Button icon="pi pi-trash" outlined className='rounded-circle' severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const getSeverity = (product) => {
        const quantity = parseInt(product.quantity);
        const previousDate = product.create_at;
        const currentDate = new Date();
        const diffInTime = currentDate.getTime() - new Date(previousDate).getTime();
        const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

        if (quantity > 10 && diffInDays < 1) {
            return 'success';
        } else if (quantity < 10 && quantity > 0 && diffInDays >= 1) {
            return 'warning';
        } else if (quantity === 0) {
            return 'danger';
        } else {
            return null;
        }
    };
    const header = (
        <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Quản Lý Sản Phẩm</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" className='mr-2 rounded-4' outlined onClick={hideDeleteProductDialog} />
            <Button label="Có" icon="pi pi-check" className='rounded-4' severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" className='mr-2 rounded-4' outlined onClick={hideDeleteProductsDialog} />
            <Button label="Có" icon="pi pi-check" className='rounded-4' severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div>
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }}></Column>
                    <Column field="name" header="Tên Dao" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="imageLink" header="Ảnh" body={imageBodyTemplate}></Column>
                    <Column field="price" header="Giá" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="categoryName" body={categoryBodyTemplate} header="Loại Dao" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="rating" header="Đánh Giá" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="quantity" header="Trạng Thái" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác Nhận" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle text-warning mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Bạn có muốn xóa sản phẩm  <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác Nhận" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle text-warning mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Bạn có muốn xóa các sản phẩm đã chọn?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default ListProduct;