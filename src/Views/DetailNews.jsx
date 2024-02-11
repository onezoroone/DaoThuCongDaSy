import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useParams } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";
import unidecode from "unidecode";
import { Helmet } from "react-helmet";

function DetailNews() {
    const title = useParams();
    const [data, setData] = useState(null);
    const [data1, setData1] = useState(null);
    const [name, setName] = useState('');
    useEffect(() => {
        axiosClient.post('/news/getNewsByTitle',{
            title : title.dynamicPath
        }).then(({data}) => {
            setData(data.news);
            setName(data.news.title);
            setData1(data.news1.original);
        })
    },[title.dynamicPath])
    document.title = `${name} - Dao Thủ Công Đa Sỹ`;
    const items = [
        {
            label: 'Tin Tức', template: () => <Link to="/tin-tuc"><a className="text-dark font-semibold">Tin Tức</a></Link>
        },
        {
            label: `${name}`
        }
    ];
    const home = { label: 'Trang Chủ', template: () => <Link to="/"><a className="text-dark font-semibold">Trang Chủ</a></Link> };
    return (
        <>
        {data && (
            <Helmet>
                <title>{data.title}</title>
                <meta name="description" content={data.content}></meta>
                <meta name="keywords" content={data.keyword}></meta>
                <meta itemProp="name" content={data.title}></meta>
                <meta itemProp="description" content={data.content}></meta>
                <meta itemProp="image" content={data.image}></meta>
                <meta property="og:image" content={data.image}></meta>
                <meta property="og:title" content={data.title}></meta>
                <meta property="og:type" content="website"></meta>
                <meta property="og:description" content={data.content}></meta>
                <meta property="og:url" content={window.location}></meta>
                <meta name="robots" content="index,follow"></meta>
                <meta name="ROBOTS" content="index,follow,noodp"></meta>
                <meta name="googlebot" content="index,follow"></meta>
                <meta name="BingBOT" content="index,follow"></meta>
                <meta name="yahooBOT" content="index,follow"></meta>
                <meta name="slurp" content="index,follow"></meta>
                <meta name="msnbot" content="index,follow"></meta>
                <meta name="language" content="Vietnamese, English"></meta>
            </Helmet>
        )}
        <div className="container-fluid">
            <BreadCrumb className="mb-3" model={items} home={home} />
            <div className="row">
                <div className="col-lg-9 mt-3">
                {data && (
                <div>
                    <h3>{data.title}</h3>
                    <div className="text-secondary">
                        {data.create_at}
                    </div>
                    <img className="mt-3" src={data.image} width="100%" style={{maxHeight:'500px'}} alt={data.image} />
                    <div className="mt-3" dangerouslySetInnerHTML={{ __html: data.content }} />
                </div>
                )}
                </div>
                <div className="col-lg-3 d-flex flex-column gap-4 mt-3">
                <div className="rounded-2" style={{padding:'10px', border:'1px solid #e1e2ef'}}>
                    <h4 >Tin mới nhất</h4>
                    {data1 && data1.map((item) => (
                        <div className="d-flex gap-2" key={item.id} style={{padding:'10px'}}>
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
        </>
    );
}

export default DetailNews;