/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Editor } from "primereact/editor";
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { FileUpload } from 'primereact/fileupload';
import axiosClient from "../axios-client";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { useStateContext } from "../contexts/ContextProvider";
import unidecode from "unidecode";

function NewProduct() {
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
    const fileUploadRef = useRef(null);
    const {toast} = useStateContext();
    useEffect(()=>{
        document.title = 'Thêm Mới Sản Phẩm';
        axiosClient.post('categories/getCategories')
        .then(({data}) => {
            setCategories(data)
        })
    },[])
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const files = fileUploadRef.current.getFiles();
        await axiosClient.post('/products/addProduct',{
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
            setName('');
            setSumDes('');
            setDes('');
            setPrice(0);
            setQuantity(0);
            setSelectedCategories(null);
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
    }
    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
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

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined rounded-5' };

    return (  
        <form style={{background: '#fff'}} className="p-3 rounded-4" onSubmit={onSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Tên Dao
                        </label>
                        <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoFocus type="text" className="form-control"/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tóm tắt mô tả</label>
                        <Editor value={sumDes} onTextChange={(e) => setSumDes(e.htmlValue)} style={{ height: '230px' }} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mô tả chi tiết</label>
                        <Editor value={des} onTextChange={(e) => setDes(e.htmlValue)} style={{ height: '230px' }} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="" className="form-label">Ảnh Sản Phẩm</label>
                        <FileUpload ref={fileUploadRef} name="demo[]" onClear={onTemplateClear} onError={onTemplateClear} itemTemplate={itemTemplate}
                         maxFileSize={10000000} chooseOptions={chooseOptions} cancelOptions={cancelOptions} url={'/api/upload'}
                         onSelect={onTemplateSelect} headerTemplate={headerTemplate} multiple accept="image/*" emptyTemplate={<p className="m-0">Kéo thả ảnh vào đây.</p>} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">
                            Giá
                        </label>
                        <InputText value={price} onChange={(e) => setPrice(e.target.value)} id="price" keyfilter="num" className="form-control"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">
                            Số lượng
                        </label>
                        <InputText id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} keyfilter="int" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Loại dao
                        </label>
                        <MultiSelect value={selectedCategories} onChange={(e) => setSelectedCategories(e.value)} options={categories} optionLabel="categoryName" display="chip" 
                            placeholder="Chọn loại dao" className="w-100"/>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="keyword" className="form-label">
                            Từ khóa tìm kiếm
                        </label>
                        <input id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} type="text" className="form-control"/>
                    </div>
                    <div className="d-flex justify-content-end ">
                        <Button type="submit" loading={loading} className="btn p-4 btn-success">
                            Thêm Sản Phẩm
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default NewProduct;