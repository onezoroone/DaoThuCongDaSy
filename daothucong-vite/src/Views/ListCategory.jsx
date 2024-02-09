import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';
function ListCategory() {
    let emptyProduct = {
        id: null,
        categoryName: '',
    };
    const [categories, setCategories] = useState([]);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);
    const [category, setCategory] = useState(emptyProduct);
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reLoad, setReLoad] = useState(false);
    const {toast} = useStateContext();
    const dt = useRef(null);
    useEffect(()=>{
        document.title = "Quản Lý Danh Sách Sản Phẩm";
        axiosClient.post('categories/getCategories')
        .then(({data}) => {
            setCategories(data)
        })
    },[reLoad])

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    };

    const hideDeleteCategoriesDialog = () => {
        setDeleteCategoriesDialog(false);
    };

    const confirmDeleteProduct = (category) => {
        setCategory(category);
        setDeleteCategoryDialog(true);
    };
    // Xóa 1
    const deleteCategory = async () => {
        await axiosClient.post(`/categories/${category.id}/deleteCategory`)
        .then(({data}) => {
            setDeleteCategoryDialog(false);
            toast.current.show({ severity: 'success', summary: 'Thành Công', detail: data, life: 3000 });
        });
        setCategory(emptyProduct);
        setReLoad(!reLoad)
    };

    const confirmDeleteSelected = () => {
        setDeleteCategoriesDialog(true);
    };
    // Xóa nhiều 
    const deleteSelectedCategories = async () => {
        setDeleteCategoriesDialog(false);
        for(let i = 0; i < selectedCategories.length; i++){
            await axiosClient.post(`/categories/${selectedCategories[i].id}/deleteCategory`)
            .then(({data}) => {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: data, life: 3000 });
            })
        }
        setSelectedCategories(null);
        setReLoad(!reLoad);
    };

    const openNew = () => {
        setSubmitted(false);
        setCategoryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    };
    // Thêm loại dao
    const addCategory = async () => {
        setSubmitted(true);
        setLoading(true);
        if (categoryName.trim()) {
            await axiosClient.post('/categories/addCategory',{
                categoryName
            }).then(({data}) => {
                setCategoryDialog(false);
                setCategoryName('');
                toast.current.show({ severity: 'success', summary: 'Thành Công', detail: data, life: 3000 });
            }).catch(err => {
                const response = err.response;
                if(response && response.status === 422){
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: response.data.message, life: 3000 });
                }
            });
            setLoading(false);
            setReLoad(!reLoad)
        }
    };
    // Toolbar bên trái datatable
    const leftToolbarTemplate = () => {
        return (
            <div className="d-flex flex-wrap gap-2">
                <Button label="Mới" className='rounded-4' icon="pi pi-plus" severity="success" onClick={openNew}/>
                <Button label="Xóa" icon="pi pi-trash" className='rounded-4' severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCategories || !selectedCategories.length} />
            </div>
        );
    };
    // Hành động
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-trash" outlined className='rounded-circle' severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    // header
    const header = (
        <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Quản Lý Thể Loại</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );

    const categoryDialogFooter = (
        <React.Fragment>
            <Button label="Đóng" icon="pi pi-times" className='rounded-4 mr-2' outlined onClick={hideDialog} />
            <Button label="Thêm" loading={loading} icon="pi pi-check" className='rounded-4' onClick={addCategory} />
        </React.Fragment>
    );

    const deleteCategoryDialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" className='mr-2 rounded-4' outlined onClick={hideDeleteCategoryDialog} />
            <Button label="Có" icon="pi pi-check" className='rounded-4' severity="danger" onClick={deleteCategory} />
        </React.Fragment>
    );
    const deleteCategoriesDialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" className='mr-2 rounded-4' outlined onClick={hideDeleteCategoriesDialog} />
            <Button label="Có" icon="pi pi-check" className='rounded-4' severity="danger" onClick={deleteSelectedCategories} />
        </React.Fragment>
    );

    return (
        <div>
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={categories} selection={selectedCategories} onSelectionChange={(e) => setSelectedCategories(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} emptyMessage="Không có thể loại nào được tìm thấy."
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="id" header="ID" sortable style={{ minWidth: '10%' }}></Column>
                    <Column field="categoryName" header="Tên Dao" sortable style={{ minWidth: '60%' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '20%' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={categoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Thêm Loại Dao" modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Tên Loại
                    </label>
                    <InputText id="name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !categoryName })} />
                    {submitted && !categoryName && <small className="p-error">Tên không được để trống.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteCategoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác Nhận" modal footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle text-warning mr-2" style={{ fontSize: '2rem' }} />
                    {category && (
                        <span>
                            Bạn có muốn xóa loại <b>{category.categoryName}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteCategoriesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác Nhận" modal footer={deleteCategoriesDialogFooter} onHide={hideDeleteCategoriesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle text-warning mr-2" style={{ fontSize: '2rem' }} />
                    {category && <span>Bạn có muốn xóa các loại dao đã chọn?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default ListCategory;