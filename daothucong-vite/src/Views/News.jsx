import { BreadCrumb } from "primereact/breadcrumb";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import unidecode from "unidecode";

function News() {
    const [data, setData] = useState(null);
    const [data1, setData1] = useState(null);
    useEffect(()=>{
        document.title = "Tin Tức - Dao Thủ Công Đa Sỹ";
        axiosClient.get('/news/getNews')
        .then(({data}) => {
            setData(data.news.original);
            setData1(data.newsViews.original);
        })
    },[])
    const items = [
        {
            label: 'Tin Tức'
        }
    ];
    const home = { label: 'Trang Chủ', template: () => <Link to="/"><a className="text-dark font-semibold">Trang Chủ</a></Link> };
    return (  
        <div className="container-fluid">
            <BreadCrumb className="mb-3" model={items} home={home} />
            <h4 className="rounded-1" style={{background:'#f5f5f5', padding:'10px'}}>Tin tức</h4>
            <div className="mt-2 row" style={{padding:'10px'}}>
                <div className="col-lg-9 mt-3 d-flex flex-column gap-4">
                    {data && data.map((item) => (
                        <div className="row rounded-3" key={item.id} style={{background:'#f5f5f5', padding:'20px'}}>
                            <div className="col-md-4">
                                <Link to={`/tin-tuc/${encodeURIComponent(unidecode(item.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><img src={item.image} alt={item.image} width="100%" height="200px" /></Link>
                            </div>
                            <div className="col-md-8 d-flex flex-column justify-content-center">
                                <div className="text-secondary">
                                    {item.create_at}
                                </div>
                                <Link to={`/tin-tuc/${encodeURIComponent(unidecode(item.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><h5>{item.title}</h5></Link>
                                <div className="flex-1" style={{maxHeight:'100px',maxWidth:'100%', overflow:'hidden'}}>
                                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-lg-3 d-flex flex-column gap-4 mt-3">
                    <div className="rounded-2" style={{background:'#f5f5f5', padding:'10px'}}>
                    <h4 >Tin tức được xem nhiều nhất</h4>
                    {data1 && data1.map((item) => (
                        <div className="d-flex gap-2" key={item.id} style={{background:'#f5f5f5', padding:'10px'}}>
                            <Link to={`/tin-tuc/${encodeURIComponent(unidecode(item.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><img src={item.image} width="150px" height="120px" alt={item.image} /></Link>
                            <div className="flex-1 d-flex justify-content-center flex-column">
                                <div className="text-secondary">
                                    {item.create_at}
                                </div>
                                <Link to={`/tin-tuc/${encodeURIComponent(unidecode(item.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}><h6>{item.title}</h6></Link>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default News;