import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';
import { Slider } from "primereact/slider";
import { InputNumber } from 'primereact/inputnumber';
import { Toolbar } from 'primereact/toolbar';

function SaleProducts() {
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
    const [updateSaleProductDialog, setUpdateSaleProductDialog] = useState(false);
    const [updateSaleProductsDialog, setUpdateSaleProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [reLoad, setReLoad] = useState(false);
    const {toast} = useStateContext();
    const [discount, setDiscount] = useState(0);
    const dt = useRef(null);
    useEffect(()=>{
        document.title = "Danh sách sản phẩm";
        axiosClient.post('/products/getSaleProducts')
        .then(({data}) => {
            setProducts(data);
        })
    },[reLoad])
    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };


    const hideUpdateSaleProductDialog = () => {
        setUpdateSaleProductDialog(false);
    };

    const hideUpdateSaleProductsDialog = () => {
        setUpdateSaleProductsDialog(false);
    };

    const DialogDeleteSelected = () => {
        setUpdateSaleProductsDialog(true);
    }

    const dialogUpdateSale = (product) => {
        setDiscount(product.discount)
        setProduct(product);
        setUpdateSaleProductDialog(true);
    };

    const updateSaleProduct = async () => {
        setUpdateSaleProductDialog(false);
        await axiosClient.post(`/products/updateSaleProduct`,{
            idProduct: product.id,
            discount
        })
        .then(({data}) => {
            toast.current.show({ severity: 'success', summary: 'Thành Công', detail: data, life: 5000 });
        })
        setProduct(emptyProduct);
        setReLoad(!reLoad);
    };

    const UpdateSaleSelectedProducts = async () => {
        setUpdateSaleProductsDialog(false);
        for(let i = 0; i < selectedProducts.length; i++){
            await axiosClient.post(`/products/updateSaleProduct`,{
                idProduct: selectedProducts[i].id,
                discount
            })
            .then(({data}) => {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: data, life: 5000 });
            })
        }
        setSelectedProducts(null);
        setReLoad(!reLoad);
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.imageLink} alt={rowData.imageName} className="shadow-2 border-round" style={{ width: '150px' }} />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const priceDiscountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.PriceDiscount);
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={`${rowData.discount}%`} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" outlined className="mr-2 rounded-circle" onClick={() => {dialogUpdateSale(rowData)}} />
            </React.Fragment>
        );
    };

    const getSeverity = (product) => {
        const discount = parseInt(product.discount);

        if (discount > 50) {
            return 'danger';
        } else if (discount <= 50 && discount >= 20) {
            return 'warning';
        } else if (discount < 20 && discount >= 1) {
            return 'warning';
        } else {
            return 'info';
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

    const updateSaleProductDialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" className='mr-2 rounded-4' outlined onClick={hideUpdateSaleProductDialog} />
            <Button label="Lưu" icon="pi pi-check" className='rounded-4' severity="success" onClick={updateSaleProduct} />
        </React.Fragment>
    );
    const updateSaleProductsDialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" className='mr-2 rounded-4' outlined onClick={hideUpdateSaleProductsDialog} />
            <Button label="Có" icon="pi pi-check" className='rounded-4' severity="danger" onClick={UpdateSaleSelectedProducts} />
        </React.Fragment>
    );

    const leftToolbarTemplate = () => {
        return (
            <div className="d-flex flex-wrap gap-2">
                <Button label="Sửa" icon="pi pi-trash" className='rounded-4' severity="info" onClick={DialogDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };

    return (
        <div>
            <div className="card">
            <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>
                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="id" header="ID" sortable style={{ minWidth: '6rem' }}></Column>
                    <Column field="name" header="Tên Dao" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="imageLink" header="Ảnh" body={imageBodyTemplate}></Column>
                    <Column field="price" header="Giá" body={priceBodyTemplate} sortable></Column>
                    <Column field="discount" header="Tỉ Lệ Giảm Giá" body={statusBodyTemplate} sortable></Column>
                    <Column field="PriceDiscount" header="Giá Ưu Đãi" body={priceDiscountBodyTemplate} sortable></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={updateSaleProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Điều chỉnh giảm giá" modal footer={updateSaleProductDialogFooter} onHide={hideUpdateSaleProductDialog}>
                <div className="confirmation-content">
                    {product && <strong>{product.name}</strong>}
                    <div className="d-flex justify-content-center">
                        <div className="w-14rem">
                            <InputNumber value={discount} prefix="%" onValueChange={(e) => setDiscount(e.value)} className="w-full" />
                            <Slider value={discount} onChange={(e) => setDiscount(e.value)} className="w-full" />
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog visible={updateSaleProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Điều chỉnh giảm giá" modal footer={updateSaleProductsDialogFooter} onHide={hideUpdateSaleProductsDialog}>
                <div className="confirmation-content">
                    <div className="d-flex justify-content-center">
                        <div className="w-14rem">
                            <InputNumber value={discount} prefix="%" onValueChange={(e) => setDiscount(e.value)} className="w-full" />
                            <Slider value={discount} onChange={(e) => setDiscount(e.value)} className="w-full" />
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default SaleProducts;