import { useEffect, useState } from "react";
import { Carousel } from 'primereact/carousel';
import axiosClient from '../axios-client';
import { Link } from "react-router-dom";
import { Rating } from "primereact/rating";
import unidecode from "unidecode";
import { Helmet } from "react-helmet";
import SSRLayout from "../Components/Layouts/SSRLayout";
const formatDate = (inputDate) => {
    const dateObject = new Date(inputDate);
    if (isNaN(dateObject.getTime())) {
      return "Ngày không hợp lệ";
    }
    const day = dateObject.getDate();
    const month = dateObject.toLocaleString('vi-VN', { month: 'long' });
    const year = dateObject.getFullYear();
  
    return `Ngày ${day} ${month}, ${year}`;
};

function Home() {
    const [products, setProducts] = useState([]);
    const [mostViews, setMostViews] = useState([]);
    const [mostViews6, setMostViews6] = useState([]);
    const [countdown, setCountdown] = useState(0);
    const [firstNews, setFirstNews] = useState([]);
    const [news, setNews] = useState([]);
    const [leftLastProducts, setLeftLastProducts] = useState([]);
    const [centerLastProducts, setCenterLastProducts] = useState([]);
    const [rightLastProducts, setRightLastProducts] = useState([]);
    const [salesProducts, setSalesProducts] = useState([]);
    useEffect(()=>{
        axiosClient.post('/web/fetchData')
        .then(({data}) => {
            setProducts(data.posters.original);
            setMostViews(data.mostViewedProducts4.original);
            setMostViews6(data.mostViewedProducts6.original);
            const [firstNews, ...restOfNews] = data.news.original;
            setFirstNews(firstNews);
            setNews(restOfNews);
            const originalArray = data.lastestProducts.original;
            const chunkSize = 6;
            const chunkedArray = [];

            for (let i = 0; i < originalArray.length; i += chunkSize) {
                const chunk = originalArray.slice(i, i + chunkSize);
                chunkedArray.push(chunk);
            }
            setLeftLastProducts(chunkedArray[0]);
            setCenterLastProducts(chunkedArray[1]);
            setRightLastProducts(chunkedArray[2]);
            setSalesProducts(data.salesProducts.original);
        });
        const now = new Date();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
        const timeRemaining = endOfDay - now;

        setCountdown(timeRemaining);
        const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1000);
        }, 1000);
        return () => clearInterval(intervalId);
    },[])
    const posterTemplate = (poster) => {
        return (
            <div>
                <img src={`${poster.imageLink}`} className="slide-poster-home" alt={poster.imageName} width="100%" style={{height:'580px'}} />
            </div>
        );
    };
    const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countdown % (1000 * 60)) / 1000);
    return (
        <>
            {/* <SSRLayout /> */}
            {/* <Helmet>
                <title>DAS - Dao Thủ Công Đa Sỹ</title>
                <meta property="og:title" content="DAS - Dao Thủ Công Đa Sỹ" />
                <meta name="description" content="Mua dao chất lượng, giá rẻ. Liên tục cập nhật những sản phẩm chất lượng do làng nghề rèn Đa Sỹ làm ra." />
                <meta name="keywords" content="dao, keo, dao keo, dao chat luong tot, chat luong tot, dao thit ga, dao phay, dao bai thai, dao da sy, dao thu cong da sy, das, dao to, dao dai"></meta>
                <meta property="og:image" content="https://ik.imagekit.io/vi6fma9xb/logolink.png" />
                <meta property="fb:app_id" content="948993069961078" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Mua dao chất lượng, giá rẻ. Liên tục cập nhật những sản phẩm chất lượng do làng nghề rèn Đa Sỹ làm ra." />
                <meta property="og:url" content={window.location.href} />
                <link rel="canonical" href={window.location.href} />
                <meta name="robots" content="index,follow" />
                <meta name="ROBOTS" content="index,follow,noodp" />
                <meta name="googlebot" content="index,follow" />
                <meta name="BingBOT" content="index,follow" />
                <meta name="yahooBOT" content="index,follow" />
                <meta name="slurp" content="index,follow" />
                <meta name="msnbot" content="index,follow" />
                <meta name="language" content="Vietnamese, English" />
            </Helmet> */}
            <div className="container-fluid">
                <h1 className="d-none">DAS - Dao Thủ Công Đa Sỹ</h1>
                <div className="row">
                    <div className="col-lg-9" style={{userSelect:'none'}}>
                        <Carousel value={products} numVisible={1} numScroll={1} className="position-relative" itemTemplate={posterTemplate} autoplayInterval={5000} />
                        <div className="row text-center mt-5">
                            <div className="col-sm-6 row">
                                <div className="col-6">
                                    <img src="/image/icon-service-transport.png" alt="" />
                                    <div className="text-uppercase mt-2"><strong>Giao hàng miễn phí</strong></div>
                                    <p className="mt-2">Vận chuyển miễn phí với đơn hàng từ 1 triệu đồng</p>
                                </div>
                                <div className="col-6">
                                    <img src="/image/icon-service-change.png" alt="" />
                                    <div className="text-uppercase mt-2"><strong>Đổi trả hàng</strong></div>
                                    <p className="mt-2">Sản phẩm được phép đổi trả trong vòng 7 ngày</p>
                                </div>
                            </div>
                        
                            <div className="col-sm-6 row">
                                <div className="col-6">
                                    <img src="/image/icon-service-receive-money.png" alt="" />
                                    <div className="text-uppercase mt-2"><strong>Giao hàng nhận tiền</strong></div>
                                    <p className="mt-2">Thanh toán tiền mặt khi nhận hàng</p>
                                </div>
                                <div className="col-6">
                                    <img src="/image/icon-service-phone.png" alt="" />
                                    <div className="text-uppercase mt-2"><strong>đặt hàng online</strong></div>
                                    <p className="mt-2">087.611.6507</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="popular-products">
                            <h5 className="m-0" style={{paddingBottom: '17px'}}>Sản Phẩm Nổi Bật</h5>
                            {mostViews && mostViews.map((product) => (
                            <div className="group-product d-flex align-items-center mb-3" key={product.id}>
                                <div style={{width:'75px', height:'100px'}}>
                                    <Link to={`/${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><img src={product.imageLink} className="rounded-3" alt={product.imageName} style={{width:'100%', height:'100%'}} /></Link>
                                </div>
                                <div className="product-content flex-1 ml-3">
                                    <Link to={`/${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><h3 className="title-product">{product.name}</h3></Link>
                                    <div className="price-product mb-1">
                                        <del>{product.price} {'\u0111'}</del>-
                                        <span>
                                            {parseFloat((parseInt(product.price) - (parseInt(product.discount) * parseInt(product.price) / 100)).toFixed(2))} {'\u0111'}
                                        </span>
                                    </div>
                                    <Rating value={product.rating} disabled cancel={false} />
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid mt-5 content-main">
                <section className="d-flex group-title w-100 mb-4">
                    <h4 className="w-25">Sản Phẩm Nổi Bật</h4>
                    <div className="spacer"></div>
                    <Link to="/san-pham/tim-kiem" className="w-10" style={{color:'#3c3f5f'}}><span>Xem Tất Cả</span><i className="bi bi-arrow-right ml-1"></i></Link>
                </section>
                <section className="group-content">
                {mostViews6 && mostViews6.map((product) => (
                    <div className="d-flex item-content" key={product.id}>
                        <Link to={`/${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><img src={product.imageLink} width="100%" className="rounded-4" height="230px" alt={product.imageName} /></Link>
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
                <section className="poster-ads mt-5 d-flex" style={{height:'200px'}}>
                    {/* <div className="w-20 content-ads-left">
                        <h4>Khai Trương Giảm Giá Sốc</h4>
                        <div className="d-flex mt-4">
                            <Link><h5>Xem tất cả sản phẩm <i className="bi bi-arrow-right ml-1"></i></h5></Link>
                        </div>
                    </div>
                    <div className="w-60 content-ads-center">
                        <img src="/image/banner_index_2.jpg" width="100%" height="200px" alt="" />
                    </div>
                    <div className="w-20 text-center content-ads-right">
                        <h4>Giảm Giá Lên Đến 60%</h4>
                        <h5 className="mb-3">Cho Sản Phẩm Mới</h5>
                        <Link><b>Mua Ngay</b></Link>
                    </div> */}
                </section>
                <section className="d-flex group-title w-100 mt-5">
                    <h4 className="w-25">Sản Phẩm Mới Nhất</h4>
                    <div className="spacer"></div>
                    <Link to="/san-pham/tim-kiem" className="w-10" style={{color:'#3c3f5f'}}><span>Xem Tất Cả</span><i className="bi bi-arrow-right ml-1"></i></Link>
                </section>
                <section className="mt-4 d-flex row products-new-container">
                    <div className="col-md-3">
                        <div className="popular-products">
                            {leftLastProducts && leftLastProducts.map((product) => (
                            <div className="group-product position-relative d-flex align-items-center mb-3" key={product.id}>
                                <div className="position-relative" style={{width:'75px', height:'100px'}}>
                                    <Link to={`${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><img src={product.imageLink} className="rounded-3" width="100%" height="100%" alt={product.imageName} /></Link>
                                    <div className="lastest">
                                        <img src="/image/gif-new-14.gif" width="25px" height="25px" alt="new" />
                                    </div>
                                </div>
                                <div className="product-content ml-3 flex-1">
                                    <Link to={`${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><h3 className="title-product">{product.name}</h3></Link>
                                    <div className="price-product mb-1">
                                        <del>{product.price} {'\u0111'}</del>-
                                        <span>
                                            {parseFloat((parseInt(product.price) - (parseInt(product.discount) * parseInt(product.price) / 100)).toFixed(2))} {'\u0111'}
                                        </span>
                                    </div>
                                    <Rating value={product.rating} disabled cancel={false} />
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="grid-3 products-mobile-body">
                        {centerLastProducts && centerLastProducts.map((product) => (
                            <div className="d-flex item-content"  key={product.id}>
                                <Link style={{height:'280px'}} to={`${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}>
                                    <img src={product.imageLink} width="100%" className="rounded-4" height="100%" alt={product.imageName} />
                                </Link>
                                <div className="mt-2 mb-1">
                                    <Link to={`${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><b><i>{product.name}</i></b></Link>
                                </div>
                                <div className="discount">
                                    <span>-{product.discount}%</span>
                                </div>
                                <div className="lastest">
                                    <img src="/image/gif-new-14.gif" width="40px" height="40px" alt="new" />
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
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="popular-products">
                            {rightLastProducts && rightLastProducts.map((product) => (
                            <div className="group-product position-relative d-flex align-items-center mb-3" key={product.id}>
                                <div className="position-relative" style={{width:'75px', height:'100px'}}>
                                    <Link to={`${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><img src={product.imageLink} className="rounded-3" width="100%" height="100%" alt={product.imageName} /></Link>
                                    <div className="lastest">
                                        <img src="/image/gif-new-14.gif" width="25px" height="25px" alt="new" />
                                    </div>
                                </div>
                                <div className="product-content ml-3 flex-1">
                                   <Link to={`${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}> <h3 className="title-product">{product.name}</h3></Link>
                                    <div className="price-product mb-1">
                                        <del>{product.price} {'\u0111'}</del>-
                                        <span>
                                            {parseFloat((parseInt(product.price) - (parseInt(product.discount) * parseInt(product.price) / 100)).toFixed(2))} {'\u0111'}
                                        </span>
                                    </div>
                                    <Rating value={product.rating} disabled cancel={false} />
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid-3 content-new-products-mobile mt-4">
                    {centerLastProducts && centerLastProducts.map((product) => (
                        <div className="d-flex item-content" key={product.id}>
                            <Link style={{height:'240px'}} to={`${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><img src={product.imageLink} width="100%" className="rounded-4" style={{maxHeight:'100%'}} alt={product.imageName} /></Link>
                            <div className="mt-2 mb-1">
                                <Link to={`${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><b><i>{product.name}</i></b></Link>
                            </div>
                            <div className="discount">
                                <span>-{product.discount}%</span>
                            </div>
                            <div className="lastest">
                                <img src="/image/gif-new-14.gif" width="40px" height="40px" alt="new" />
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
                    </div>
                </section>
                <section className="poster-discount-ads">
                    <div className="detail-poster d-flex align-items-center ">
                        <div className="w-60">
                           <h4 className="text-white">
                            Siêu giảm giá mỗi ngày, hãy tìm sản phẩm ưa thích ngay!
                           </h4>
                        </div>
                        <div className="w-10">
                            <Link className="bg-warning text-white">Săn ngay</Link>
                        </div>
                        <div className="w-30" style={{paddingLeft:'60px'}}>
                            <h2>Giảm giá lên đến 60%</h2>
                        </div>
                    </div>  
                </section>
                <div className="flash-sale-group mt-5 mb-5">
                    <section className="d-flex group-title w-100 mt-2">
                        <h4 className="w-30">Flash Sale Mỗi Ngày <span>{hours}</span> : <span>{minutes}</span> : <span>{seconds}</span></h4> 
                        <div className="w-60"></div>
                        <Link to="/san-pham/tim-kiem?sale=true" className="w-10" style={{color:'#3c3f5f'}}><span>Xem Tất Cả</span><i className="bi bi-arrow-right ml-1"></i></Link>
                    </section>
                    <section className="grid-12 products-mobile-body mt-4">
                    {salesProducts && salesProducts.map((product) => (
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
                </div>
                <hr />
                <section className="d-flex group-title w-100 mt-5">
                    <h4 className="w-25">Tin Tức Mới Nhất</h4>
                    <div className="spacer"></div>
                    <Link to="/tin-tuc" className="w-10" style={{color:'#3c3f5f'}}><span>Xem Tất Cả</span><i className="bi bi-arrow-right ml-1"></i></Link>
                </section>
                <section className="news-container mt-4">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            {firstNews && firstNews.length != 0 &&  (
                                <div className="d-flex first-news-container">
                                    <img src={firstNews.image} width="100%" alt="" />
                                    <div style={{color:'#5E626D', fontSize:'14px'}}>
                                        {formatDate(firstNews.create_at)}
                                    </div>
                                    <Link style={{color:'#000'}}>
                                        <i><h5 className="m-0">{firstNews.title}</h5></i>
                                    </Link>
                                    <div className="m-0" style={{ fontSize: '16px', color: '#3c3f5f', overflow: 'hidden', height: '3em', textOverflow:'ellipsis'}}>
                                        <div dangerouslySetInnerHTML={{ __html: firstNews.content }} />
                                    </div>
                                    <Link to={`/tin-tuc/${encodeURIComponent(unidecode(firstNews.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`} className="btn btn-readmore">
                                        Đọc Thêm
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <div className="news-wrapper">
                                {news && news.map((item) => (
                                    <article key={item.id} className="d-flex">
                                        <div className="w-50">
                                            <img src={item.image} className="rounded-3" width="100%" height="100%" alt="" />
                                        </div>
                                        <div className="flex-1" style={{overflow:'hidden'}}>
                                            <div style={{color:'#5E626D', fontSize:'14px'}}>
                                                {formatDate(item.create_at)}
                                            </div>
                                            <Link style={{color:'#000'}}>
                                                <i><h5 className="m-0">{item.title}</h5></i>
                                            </Link>
                                            <Link to={`/tin-tuc/${encodeURIComponent(unidecode(item.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`} className="btn btn-readmore mt-3">
                                                Đọc Thêm
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Home;