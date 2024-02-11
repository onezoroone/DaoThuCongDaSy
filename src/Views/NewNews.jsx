import { Card } from "primereact/card";
import { Editor } from "primereact/editor";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Button } from "primereact/button";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, useParams } from "react-router-dom";
import unidecode from "unidecode";

function NewNews() {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [link, setLink] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [reLoad, setReLoad] = useState(false);
    const {toast} = useStateContext();
    const id = useParams();
    useEffect(()=>{
        document.title = 'Đăng Bài Viết Mới';
        setTitle('');
        setText('');
        setLink('');
        setKeyword('');
        setSelectedImage(null);
        setPreviewImage(null);
        if(id.dynamicPath){
            document.title = 'Sửa Bài Viết';
            axiosClient.post('/news/getNewsById',{
                id : id.dynamicPath
            }).then(({data}) => {
                setTitle(data.title);
                setText(data.content);
                setKeyword(data.keyword);
                setLink(data.linkProduct);
                setPreviewImage(data.image)
            })
        }
    },[id, reLoad])
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(file);
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const onSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        if(!id.dynamicPath){
            await axiosClient.post('/news/addNews',{
                title,
                text,
                link,
                selectedImage,
                keyword
            },{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(({data}) => {
                setTitle('');
                setText('');
                setLink('');
                setKeyword('');
                setSelectedImage(null);
                setPreviewImage(null);
                toast.current.show({ severity: 'success', summary: 'Thành Công', detail: data, life: 5000 });
            }).catch(err => {
                const response = err.response;
                if(response && response.status === 422){
                    const errors = response.data.errors;
                    errors && Object.keys(errors).map(key  => (
                        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: errors[key][0], life: 10000 })
                    ))
                }
            });
        }else{
            await axiosClient.post('/news/updateNews',{
                id: id.dynamicPath,
                title,
                text,
                link,
                selectedImage,
                keyword,
                slugTitle: encodeURIComponent(unidecode(title).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")
            },{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(({data}) => {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: data, life: 5000 });
                setReLoad(!reLoad)
            }).catch(err => {
                const response = err.response;
                if(response && response.status === 422){
                    const errors = response.data.errors;
                    errors && Object.keys(errors).map(key  => (
                        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: errors[key][0], life: 10000 })
                    ))
                }
            });
        }
        setLoading(false);
    }
    return (  
        <Card title="Đăng tin" style={{paddingLeft:'10px'}}>
            <form onSubmit={onSubmit}>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">Tiêu đề</label>
                <input value={title} onChange={(e) => {setTitle(e.target.value)}} type="text" id="title" className="form-control" required/>
            </div>
            <div className="mb-3">
                <label className="form-label">Nội dung</label>
                <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '400px' }} />
            </div>
            <div className="mb-3">
                <div className='add-image'>
                    <div className="image-upload-container">
                        <input type="file" accept="image/*" id="image-upload-input" onChange={handleImageChange} />
                        <label htmlFor="image-upload-input" style={{backgroundImage: `url(${previewImage})`}}>
                            <span>Chọn ảnh</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="linkProduct" className="form-label">Link sản phẩm</label>
                <input value={link} onChange={(e) => {setLink(e.target.value)}} type="text" id="linkProduct" className="form-control" />
            </div>
            <div className="mb-3">
                <label htmlFor="keyword" className="form-label">Từ khóa</label>
                <input value={keyword} onChange={(e) => {setKeyword(e.target.value)}} type="text" id="keyword" className="form-control" />
            </div>
            <div className="d-flex justify-content-center">
                <Link to="/admin/tin-tuc/danh-sach"><Button label="Đóng" severity="danger" className="p-3 mt-3 rounded-3 mr-2" /></Link>
                <Button type="submit" label={!id.dynamicPath ? "Đăng tin" : "Sửa tin"} loading={loading} className='p-3 btn btn-success mt-3'></Button>
            </div>
        </form>
        </Card>
    );
}

export default NewNews;