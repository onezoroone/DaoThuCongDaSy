import React, { useEffect, useState } from 'react';
import axiosClient from '../axios-client';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useStateContext } from '../contexts/ContextProvider';
import { Dialog } from 'primereact/dialog';

function Poster() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [posters, setPosters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deletePoster, setDeletePoster] = useState(false);
    const [selectedPosterId, setSelectedPosterId] = useState(null);
    const [reLoad, setReLoad] = useState(false);
    const {toast} = useStateContext();
    useEffect(()=>{
        document.title = 'Quản Lý Poster Website';
        const fetchData = async () => {
            await axiosClient.post('posters/getPosters')
            .then(({data}) => {
                setPosters(data)
            })}
        fetchData()
    },[reLoad])
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
    const handleDeletePoster = async (id) => {
        setDeletePoster(false);
        await axiosClient.post(`/posters/${id}/deletePoster`);
        setReLoad(!reLoad);
        toast.current.show({ severity: 'success', summary: 'Thành Công', detail: 'Xóa ảnh thành công' });
    }
    const handleUploadImage = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('selectedImage', selectedImage);
        await axiosClient.post('/posters/uploadPoster', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        setLoading(false);
        toast.current.show({ severity: 'success', summary: 'Thành Công', detail: 'Tải ảnh lên thành công' });
        setPreviewImage(null);
        setSelectedImage(null);
        setReLoad(!reLoad);
    }
    const confirmDeleteSelected = (id) => {
        setSelectedPosterId(id);
        setDeletePoster(true);
    };
    const hideDeleteCategoriesDialog = () => {
        setDeletePoster(false);
    };
    const deletePosterDialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" className='mr-2 rounded-4' outlined onClick={hideDeleteCategoriesDialog} />
            <Button label="Có" icon="pi pi-check" className='rounded-4' severity="danger" onClick={() => handleDeletePoster(selectedPosterId)} />
        </React.Fragment>
    );
    
    return (
        <div>
            <div className="row">
                {posters && posters.map((poster, index) => (
                <div className="grid-margin stretch-card col-md-3" key={poster.id}>
                    <Card  title={`Poster ${index + 1}`} className="card text-center">
                        <img className="w-100" style={{height:'200px'}} src={poster.imageLink} alt={poster.imageName} />
                        <div className='p-card-footer'>
                            <Button label="Xóa" severity="danger" className='rounded-4' icon="pi pi-check" onClick={() => confirmDeleteSelected(poster.id)} />
                        </div>
                    </Card>
                </div>
                ))}
            </div>
            <div className='row'>
                <Card title="Thêm Poster Mới">
                    <div className="poster-upload-container d-flex justify-content-center">
                        <input type="file" accept="image/*" id="poster-upload-input" onChange={handleImageChange} />
                        <label htmlFor="poster-upload-input" style={{backgroundImage: `url(${previewImage})`}}>
                            <span>Chọn ảnh</span>
                        </label>
                    </div>
                    <div className='d-flex justify-content-center '>
                        <Button label="Tải lên" severity="success" disabled={!previewImage ? true : false} className='rounded-4 mt-3' loading={loading} onClick={handleUploadImage} />
                    </div>
                </Card>
            </div>
            <Dialog visible={deletePoster} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác Nhận" modal footer={deletePosterDialogFooter} onHide={hideDeleteCategoriesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle text-warning" style={{ fontSize: '2rem', marginRight:'10px' }} />
                    <span>Bạn có muốn xóa poster đã chọn?</span>
                </div>
            </Dialog>
        </div>
    );
}

export default Poster;