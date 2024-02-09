/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "primereact/editor";
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { FileUpload } from 'primereact/fileupload';
import { Link, useParams } from "react-router-dom";
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';
import { Button } from "primereact/button";
import { Galleria } from 'primereact/galleria';
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import unidecode from "unidecode";

function EditProduct() {
    const [name, setName] = useState('');
    const [sumDes, setSumDes] = useState('');
    const [des, setDes] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [categories, setCategories] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState([]);
    const fileUploadRef = useRef(null);
    const {toast} = useStateContext();
    const id = useParams();
    const [images, setImages] = useState([]);
    const [reLoad, setReLoad] = useState(false);
    useEffect(()=>{
        axiosClient.post('categories/getCategories')
        .then(({data}) => {
            setCategories(data);
        })
        axiosClient.post(`/products/${id.dynamicPath}/getProductById`)
        .then(({data}) => {
            setName(data.product[0].name);
            setSumDes(data.product[0].sumdescription);
            setDes(data.product[0].description);
            setPrice(data.product[0].price);
            setQuantity(data.product[0].quantity);
            setKeyword(data.product[0].keyword);
            setSelectedCategories(data.categories);
            setImages(data.images);
            setProduct(data);
        });
        document.title = `Chỉnh Sửa Sản Phẩm`;
    },[id, reLoad])

    const handleDeleteImage= async (idImage) => {
        setLoading(true);
        await axiosClient.post(`/images/${idImage}/deleteImage`)
        .then(({data}) => {
            toast.current.show({ severity: 'success', summary: 'Thông báo', detail: data, life: 5000 });
        });
        setReLoad(!reLoad);
        setLoading(false);
    }

    const ImageTemplate = (item) => {
        return (
            <React.Fragment>
                {item && <img src={item.imageLink} className="position-relative" alt={item.imageName} style={{ width: '100%', height:'100%' }} />}
                <Button label="Xóa" type="button" loading={loading} className="position-absolute rounded-4" severity="danger" onClick={() => {handleDeleteImage(item.id)}} style={{top:'0' ,right:'0'}} />
            </React.Fragment>
        );
    };

    const thumbnailTemplate = (item) => {
        return <img src={item.imageLink} alt={item.imageName} style={{ maxHeight: '80px'}} />
    }
    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];
    const itemTemplate = (file, props) => {
        return (
            <div className="d-flex align-items-center flex-wrap">
                <div className="d-flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="d-flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger rounded-5" style={{marginLeft:'auto'}} onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };
    const onTemplateClear = () => {
        setTotalSize(0);
    };
    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };
    const headerTemplate = (options) => {
        const { className, chooseButton, cancelButton } = options;
        const value = totalSize / 100000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex'}}>
                {chooseButton}
                {cancelButton}
                <div className="d-flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 10 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };
    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };
    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined rounded-5' };

    const onSubmit = async (ev) => {
        ev.preventDefault();
        if(product.product[0].name == name && product.product[0].description == des && product.product[0].sumdescription == sumDes && product.product[0].price == price && product.product[0].quantity == quantity && product.product[0].keyword == keyword && JSON.stringify(product.categories) == JSON.stringify(selectedCategories) && !fileUploadRef.current.getFiles().length){
            toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Dữ liệu không có sự thay đổi so với ban đầu.', life: 5000 });
        }else{
            setLoading(true);
            const files = fileUploadRef.current.getFiles();
            await axiosClient.post('/products/updateProduct',{
                idProduct : id.dynamicPath,
                name,
                files,
                sumDes,
                des,
                price,
                quantity,
                selectedCategories,
                keyword,
                slug: encodeURIComponent(unidecode(name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(({data}) => {
                fileUploadRef.current.clear();
                toast.current.show({ severity: 'success', summary: 'Thông báo thành công', detail: data, life: 5000 });
            }).catch(err => {
                const response = err.response;
                if(response && response.status === 422){
                    const errors = response.data.errors;
                    errors && Object.keys(errors).map(key  => (
                        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: errors[key][0], life: 10000 })
                    ))
                }
            });
            setLoading(false);
            setReLoad(!reLoad);
        }
    }
    return (  
        <form style={{background: '#fff'}} className="p-3" onSubmit={onSubmit}>
            <div className="d-flex">
                <div className="w-50 mr-3">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Tên Dao
                        </label>
                        <input id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tóm tắt mô tả</label>
                        <Editor value={sumDes} onTextChange={(e) => setSumDes(e.htmlValue)} style={{ height: '230px' }} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mô tả chi tiết</label>
                        <Editor value={des} onTextChange={(e) => setDes(e.htmlValue)} style={{ height: '230px' }} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">
                            Giá
                        </label>
                        <InputText id="price" value={price} onChange={(e) => setPrice(e.target.value)} keyfilter="num" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">
                            Số lượng
                        </label>
                        <InputText id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}  keyfilter="int" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Loại dao
                        </label>
                        <MultiSelect value={selectedCategories} onChange={(e) => setSelectedCategories(e.value)} options={categories} optionLabel="categoryName" display="chip" 
                            placeholder="Chọn loại dao" className="w-100"/>
                    </div>
                </div>
                <div className="w-50">
                    <div className="mb-3">
                        <label className="form-label">
                            Ảnh
                        </label>
                        <Galleria value={images} responsiveOptions={responsiveOptions} numVisible={5} style={{ maxWidth: '100%' }} 
                            item={ImageTemplate} thumbnail={thumbnailTemplate} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Tải lên ảnh mới
                        </label>
                        <FileUpload ref={fileUploadRef} name="demo[]" onClear={onTemplateClear} onError={onTemplateClear} itemTemplate={itemTemplate}
                         maxFileSize={10000000} chooseOptions={chooseOptions} cancelOptions={cancelOptions} url={'/api/upload'}
                         onSelect={onTemplateSelect} headerTemplate={headerTemplate} multiple accept="image/*" emptyTemplate={<p className="m-0">Kéo thả ảnh vào đây.</p>} />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="keyword" className="form-label">
                            Từ khóa tìm kiếm
                        </label>
                        <input id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} type="text" className="form-control"/>
                    </div>
                    <div className="d-flex justify-content-end ">
                        <Link to="/admin/san-pham/danh-sach"><button type="submit" className="btn p-3 mr-3 btn-danger">
                            Đóng
                        </button></Link>
                        <Button loading={loading} type="submit" className="btn p-3 btn-success">
                            Lưu
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default EditProduct;