import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Galleria } from "primereact/galleria";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { TabView, TabPanel } from 'primereact/tabview';
import { Rating } from "primereact/rating";
import { ProgressBar } from "primereact/progressbar";  
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';     
import { InputTextarea } from 'primereact/inputtextarea';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Helmet } from "react-helmet";
import { BreadCrumb } from "primereact/breadcrumb";
import unidecode from "unidecode";
        
function Details() {
    const [product, setProduct] = useState([]);
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([])
    const [sold, setSold] = useState(0);
    const [visible, setVisible] = useState(false);
    const [rating, setRating] = useState(null);
    const [value2, setValue2] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [visible1, setVisible1] = useState(false);
    const nameProduct = useParams();
    const {token, toast, user, setCount} = useStateContext();
    const JSONuser = JSON.parse(user);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [reload1, setReload1] = useState(false);
    const [review, setReview] = useState('');
    const [reviews, setReviews] = useState([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetch = async () => {
            await axiosClient.post(`/products/${nameProduct.dynamicPath}/getProduct`)
            .then(({data}) => {
                document.title = `${data.product.name}`;
                setProduct(data.product);
                setImages(data.images);
                setCategories(data.categories);
                setSold(data.sold);
                setRelatedProducts(data.relatedProducts);
                setReviews(data.reviews);
                setTotalReviews(data.totalReviews)
            })
        }
        fetch();
    },[nameProduct.dynamicPath, reload])
    useEffect(()=>{
        if(JSONuser){
            axiosClient.post(`getIndex/${JSONuser.id}`)
            .then(({data}) =>{
                setCount(data);
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[reload1])
    const itemTemplate = (item) => {
        return <img src={item.imageLink} alt={item.imageName} style={{ maxWidth: '100%', maxHeight:'100%' }} />
    }

    const thumbnailTemplate = (item) => {
        return <img src={item.imageLink} width="100px" height="60px" alt={item.alt} />
    }
    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 3
        },
        {
            breakpoint: '767px',
            numVisible: 5
        },
        {
            breakpoint: '575px',
            numVisible: 3
        }
    ];
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

    const valueTemplate = () => {
        return (
            <React.Fragment>
            </React.Fragment>
        );
    };

    const handleAddtoCart = async () => {
        if(!token){
            setVisible1(true);
        }else{
            if(value2 > 0){
                setLoading(true);
                await axiosClient.post('/products/addToCart',{
                    idUser: JSONuser.id,
                    idProduct: product.id,
                    quantity: value2
                }).then(({data}) => {
                    toast.current.show({severity:'success', summary: 'Thành Công', detail: data, life: 5000});
                }).catch(err => {
                    toast.current.show({severity:'error', summary: 'Thất Bại', detail: err.response.data, life: 5000});
                })
                setValue2(1);
                setReload1(!reload1);
            }else{
                toast.current.show({severity:'error', summary: 'Thất Bại', detail: "Số lượng phải lớn hơn 0.", life: 5000});
            }
            setLoading(false);
        }
    }

    const footerContent = (
        <div>
            <Button label="Ok" severity="success" icon="pi pi-check" onClick={() => setVisible1(false)} autoFocus />
        </div>
    );

    const handleReview = () => {
        if(!token){
            setVisible1(true);
        }else{
            setVisible(true);
        }
    }

    const handleOrder = () => {
        product.imageLink = images[0].imageLink;
        product.quantity = value2;
        localStorage.setItem('products', JSON.stringify([product]));
        navigate('/mua-hang');
    }

    const onSubmitReview = async (e) => {
        e.preventDefault();
        if(rating != null && review != ""){
            setLoading(true);
            const formData = new FormData();
            formData.append('idUser', JSONuser.id);
            formData.append('idProduct', product.id);
            formData.append('rating', rating);
            formData.append('content', review);
            formData.append('image', selectedImage);
            await axiosClient.post('/products/postReview', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLoading(false);
            toast.current.show({ severity: 'success', summary: 'Thành Công', detail: 'Viết đánh giá sản phẩm thành công', life: 5000 });
            setVisible(false);
            setPreviewImage(null);
            setSelectedImage(null);
            setReview('');
            setRating(null);
            setReload(!reload);
        }else{
            toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Những mục có dấu * không được để trống!', life: 5000 });
        }
    }
    const items = [
        {
            label: 'Sản Phẩm'
        }
    ];
    const home = { label: 'Trang Chủ', template: () => <Link to="/"><a className="text-dark font-semibold">Trang Chủ</a></Link> };
    return (
        <>
        {product && images && images.length > 0 && (
            <Helmet>
                <title>{product.name}</title>
                <meta name="description" content={product.sumdescription}></meta>
                <meta name="keywords" content={product.keyword}></meta>
                <meta itemProp="name" content={product.name}></meta>
                <meta itemProp="description" content={product.sumdescription}></meta>
                <meta itemProp="image" content={images[0].imageLink}></meta>
                <meta property="og:image" content={images[0].imageLink}></meta>
                <meta property="og:title" content={product.name}></meta>
                <meta property="og:type" content="website"></meta>
                <meta property="og:description" content={product.sumdescription}></meta>
                <meta property="og:url" content={window.location}></meta>
                <meta name="robots" content="index,follow"></meta>
                <meta name="revisit-after" content="1 days"></meta>
                <meta name="ROBOTS" content="index,follow,noodp"></meta>
                <meta name="googlebot" content="index,follow"></meta>
                <meta name="BingBOT" content="index,follow"></meta>
                <meta name="yahooBOT" content="index,follow"></meta>
                <meta name="slurp" content="index,follow"></meta>
                <meta name="msnbot" content="index,follow"></meta>
                <meta name="language" content="Vietnamese, English"></meta>
                <meta property="og:site_name" content={window.location.hostname}></meta>
            </Helmet>
        )}
        <div className="container-fluid">
            <BreadCrumb className="mb-3" model={items} home={home} />
            <h1 className="d-none">{product && product.name}</h1>
            <div className="row m-0 p-0">
                <div className="col-lg-5 mt-3 position-relative" style={{userSelect: 'none'}}>
                    <Galleria value={images} responsiveOptions={responsiveOptions} numVisible={5} style={{ width: '100%', height:'100%' }} 
                    item={itemTemplate} thumbnailsPosition="bot" thumbnail={thumbnailTemplate} />
                    {product && product.quantity ==0 && <>
                    <div className="overlay"></div>
                    <div className="text">Hết hàng</div>
                    </>}
                </div>
                <div className="col-lg-5 mt-3">
                    {product && product.length != 0 ?  (
                        <div key={product.id}>
                            <div className="title-detail-product">
                                <i><h4>{product.name}</h4></i>
                            </div>
                            <div>
                                Loại dao: {categories && categories.map((item) => (<span key={item.id}>{item.categoryName}, </span>))}
                            </div>
                            <div className="price-product-detail mb-1">
                                <span className="mr-2">
                                    {parseFloat((parseInt(product.price) - (parseInt(product.discount) * parseInt(product.price) / 100)).toFixed(2))}{'\u0111'}
                                </span>
                                <del>{product.price} {'\u0111'}</del>
                            </div>
                            <div>
                                <label htmlFor="">Đặc điểm:</label>
                                <div dangerouslySetInnerHTML={{ __html: product.sumdescription }} />
                            </div>
                            <div className="mt-2">
                                <span className="mr-2">Số lượng:</span>
                                <InputNumber value={value2}  min={0} max={product.quantity} maxLength={2} onValueChange={(e) => setValue2(e.value)} showButtons buttonLayout="horizontal" step={1}
                                    decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                            </div>
                            <div className="mt-3">
                                <Button loading={loading} disabled={product.quantity == 0} severity="warning" onClick={handleAddtoCart} className="mr-2" label="Thêm Vào Giỏ" icon="pi pi-cart-plus" />
                                <Button loading={loading} severity="danger" disabled={product.quantity == 0} onClick={handleOrder} className="" label="Mua Ngay" icon="pi pi-check" />
                            </div>
                            <div className="mt-5">
                                <div>
                                    <i className="bi bi-eye-fill mr-2 text-primary"></i>
                                    Có {product.views} lượt xem sản phẩm
                                </div>
                                <div>
                                    <i className="bi bi-tag-fill mr-2 text-warning"></i>
                                    Có {sold ? sold.total : "0"} lượt mua sản phẩm
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            Không có sản phẩm nào được tìm thấy.
                        </div>
                    )}
                </div>
                <div className="col-lg-2 mt-3">
                    <div className="about-product">
                        <div style={{paddingBottom:'10px'}}>
                            Sẽ có tại nhà bạn từ 2-4 ngày làm việc
                        </div>
                        <div className="d-flex align-items-center" style={{borderTop:'1px solid #e1e2ef',paddingTop:'10px'}}>
                            <img src="/image/icon-service-transport.png" height="40px" className="mr-2" alt="" />
                            <div>
                                <b style={{fontSize: '14px'}}>Giao hàng miễn phí</b>
                                <p style={{fontSize: '13px'}}>Cho mọi sản phẩm</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center" style={{borderTop:'1px solid #e1e2ef',paddingTop:'10px'}}>
                            <img src="/image/icon-service-2.png" height="40px" className="mr-2" alt="" />
                            <div>
                                <b style={{fontSize: '14px'}}>Đổi trả miễn phí</b>
                                <p style={{fontSize: '13px'}}>Đổi trả miễn phí trong 30 ngày</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center" style={{borderTop:'1px solid #e1e2ef',paddingTop:'10px'}}>
                            <img src="/image/icon-service-3.png" height="30px" className="mr-2" alt="" />
                            <div>
                                <b style={{fontSize: '14px'}}>Thanh toán</b>
                                <p style={{fontSize: '13px'}}>Thanh toán khi nhận hàng</p>
                            </div>
                        </div>
                        <div className="d-flex" style={{borderTop:'1px solid #e1e2ef',paddingTop:'10px'}}>
                            <i className="mr-2 fs-2 bi bi-facebook"></i>
                            <div>
                                <b style={{fontSize: '14px'}}>Hỗ trợ online</b>
                                <p style={{fontSize: '13px'}}>Fanpage</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TabView>
                <TabPanel header="Mô Tả" >
                    {product && <div dangerouslySetInnerHTML={{ __html: product.description }} />}
                </TabPanel>
                <TabPanel header="Đánh Giá">
                    <div className="reviews">
                        <h2 style={{fontSize:'16px', marginBottom:'1.25rem'}}>Đánh giá</h2>
                        {totalReviews && 
                        <div className="row">
                            <div className="col-lg-3 mt-3">
                                <div className="card w-100 d-flex justify-content-center align-items-center" style={{padding:'1.875rem', background:'#f5f5f5', border:'1px solid #e1e2ef'}}>
                                    Lượt đánh giá ({totalReviews.total})
                                    <div className="d-flex align-items-center gap-2 mb-2 mt-2"><h2>{parseFloat(totalReviews.avg).toFixed(1)}</h2><span>/5</span></div>
                                </div>
                            </div>
                            <div className="col-lg-4 rating-reviews mt-3">
                                <div className="d-flex align-items-center">
                                    <Rating value={5} className="mr-2" readOnly cancel={false} />
                                    <ProgressBar className="progressbar mr-2" style={{height:'6px', background:'#f5f5f5'}} displayValueTemplate={valueTemplate} value={totalReviews.avg5* 100}></ProgressBar>
                                    {totalReviews.avg5 * 100}%
                                </div>
                                <div className="d-flex align-items-center">
                                    <Rating value={4} className="mr-2" readOnly cancel={false} />
                                    <ProgressBar className="progressbar mr-2" style={{height:'6px', background:'#f5f5f5'}} displayValueTemplate={valueTemplate} value={totalReviews.avg4* 100}></ProgressBar>
                                    {totalReviews.avg4 * 100}%
                                </div>
                                <div className="d-flex align-items-center">
                                    <Rating value={3} className="mr-2" readOnly cancel={false} />
                                    <ProgressBar className="progressbar mr-2" style={{height:'6px', background:'#f5f5f5'}} displayValueTemplate={valueTemplate} value={totalReviews.avg3* 100}></ProgressBar>
                                    {totalReviews.avg3 * 100}%
                                </div>
                                <div className="d-flex align-items-center">
                                    <Rating value={2} className="mr-2" readOnly cancel={false} />
                                    <ProgressBar className="progressbar mr-2" style={{height:'6px', background:'#f5f5f5'}} displayValueTemplate={valueTemplate} value={totalReviews.avg2* 100}></ProgressBar>
                                    {totalReviews.avg2 * 100}%
                                </div>
                                <div className="d-flex align-items-center">
                                    <Rating value={1} className="mr-2" readOnly cancel={false} />
                                    <ProgressBar className="progressbar mr-2" style={{height:'6px', background:'#f5f5f5'}} displayValueTemplate={valueTemplate} value={totalReviews.avg1* 100}></ProgressBar>
                                    {totalReviews.avg1 * 100}%
                                </div>
                            </div>
                            <div className="col-lg-5 mt-3">
                                <div className="card w-100" style={{padding:'1.5rem',paddingBottom:'1rem', marginLeft:'50px' ,border:'1px solid red'}}>
                                    <div>
                                        <strong className="text-danger">Lưu ý:</strong> Dao được thiết kế đơn giản và được làm từ chất lượng cao. Được các ghệ nhân từ làng làm ra.
                                    </div>
                                    <ul style={{paddingLeft:'1.5rem'}}>
                                        <li>Đơn giản và được làm từ vật liệu chất lượng cao</li>
                                        <li>Nhìn đẹp mắt và sắc bén</li>
                                    </ul>
                                </div>
                            </div>
                        </div>}
                        <div className="reviews-content">
                            <div className="d-flex reviews-content-title align-items-center">
                                <span>Đánh giá của người dùng</span>
                                <div className="flex-1">
                                    <button className="btn btn-danger rounded-5 p-3 float-end" onClick={handleReview}>Viết Đánh giá</button>
                                </div>
                            </div>
                            <div className="reviews-content-body p-3 d-flex">
                                {reviews && reviews.map((item) => (
                                <div key={item.id} className="d-flex reviews-content-detail">
                                    <div className="d-flex">
                                        <div className="mr-2">
                                            <Avatar image="/image/User_icon.png" size="xlarge" shape="circle" />
                                        </div>
                                        <div className="flex-1">
                                            <div>
                                                {item.ngaydang}
                                            </div>
                                            <div>
                                                {item.name}
                                            </div>
                                            <div>
                                                <Rating value={item.rating} readOnly cancel={false}></Rating>
                                            </div>
                                            <div className="mt-1">
                                                {item.content}
                                            </div>
                                            <div className="mt-2">
                                                {item.image && <img src={item.image} width="150px" height="150px" alt="a"></img>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
            <section className="d-flex group-title w-100 mb-4 mt-5">
                    <h4 className="w-25">Sản Phẩm Liên Quan</h4>
                    <div className="spacer"></div>
                </section>
            <section className="group-content">
                {relatedProducts && relatedProducts.map((product) => (
                    <div className="d-flex item-content" key={product.id}>
                        <Link to={`/${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><img src={product.imageLink} width="100%" className="rounded-4" height="250px" alt={product.imageName} /></Link>
                        <div className="mt-2 mb-2">
                            <Link to={`/${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><b><i>{product.name}</i></b></Link>
                        </div>
                        <div className="discount">
                            <span>-{product.discount}%</span>
                        </div>
                        <div className="price-product mb-1">
                            <del>{product.price} {'\u0111'}</del>-
                            <span>
                                {parseFloat((parseInt(product.price) - (parseInt(product.discount) * parseInt(product.price) / 100)).toFixed(2))} {'\u0111'}
                            </span>
                        </div>
                        <Rating value={product.rating} disabled cancel={false} />
                    </div>
                ))}
                </section>
            <Dialog header="Đánh giá" visible={visible} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} onHide={() => setVisible(false)}>
                <form onSubmit={onSubmitReview}>
                    {images.length !=0 && 
                        <div className="d-flex align-items-center" style={{borderBottom:'1px solid #e1e2ef', paddingBottom:'15px'}}>
                            <img src={images[0].imageLink} className="rounded-4" alt={images[0].imageName} width="40%" height="180px" />
                            <div className="flex-1 ml-3">
                                <h3>{product && product.name}</h3>
                            </div>
                        </div>
                    }
                    <div className="mt-4">
                        <div className="">
                            <span>Đánh giá tổng thể <strong className="text-danger">*</strong></span>
                            <Rating className="mt-2" value={rating} onChange={(e) => setRating(e.value)} cancel={false} />
                        </div>
                        <div className="mt-3">
                            <span>Thêm ảnh</span>
                            <div className="poster-upload-container d-flex justify-content-center mt-2">
                                <input type="file" accept="image/*" id="poster-upload-input" onChange={handleImageChange} />
                                <label htmlFor="poster-upload-input" style={{backgroundImage: `url(${previewImage})`}}>
                                    <span>Nhấn vào đây để tải ảnh lên</span>
                                </label>
                            </div>
                        </div>
                        <div className="mt-3">
                            <span>Đánh giá <strong className="text-danger">*</strong></span>
                            <div className="mt-2">
                                <InputTextarea placeholder="Viết đánh giá" value={review} onChange={(e) => setReview(e.target.value)} rows={5} className="w-100" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <Button loading={loading} label="Đăng" type="submit" severity="danger" className="w-100 rounded-3 "/>
                        </div>
                    </div>
                </form>
            </Dialog>
            <Dialog header="Thông báo" visible={visible1} modal footer={footerContent} style={{ width: '28rem' }} onHide={() => setVisible1(false)}>
                <p className="m-0">
                    Bạn cần đăng nhập để sử dụng chắc năng này.
                </p>
            </Dialog>
        </div>
        </>
    );
}

export default Details;