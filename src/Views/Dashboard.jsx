import { useEffect, useState} from "react";
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import axiosClient from "../axios-client";
import { Carousel } from "primereact/carousel";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

function Dashboard() {
    const [chartData, setChartData] = useState({});
    const [productsMostView, setProductsMostVỉew] = useState([]);
    const [productMostSold, setProductMostSold] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrdersPending, setTotalOrdersPending] = useState(0);
    const [totalOrdersSuccess, setTotalOrdersSuccess] = useState(0);
    const [totalNews, setTotalNews] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [revenue, setRevenue] = useState({});
    const [totalMoney, setTotalMoney] = useState(0);
    const [chartData1, setChartData1] = useState({});
    useEffect(() => {
        document.title = "Trang Quản Trị Viên DAOTHUCONGDASY";
        axiosClient.post('/products/getProductsData')
        .then(({data}) => {
            setTotalProducts(data.totalProducts.original.count);
            setTotalOrdersPending(data.totalOrders.original.pending.count);
            setTotalOrdersSuccess(data.totalOrders.original.success.count);
            setTotalUsers(data.totalUsers.original.count);
            setTotalNews(data.totalNews.original.count);
            setTotalMoney(data.totalMoney.original.total);
            setProductsMostVỉew(data.mostViewedProducts.original);
            setProductMostSold(data.mostSellableProducts.original);
            const month = data.revenue.original.map(item => item.day);
            const revenue = data.revenue.original.map(item => item.revenue);
            setRevenue({
                labels: month,
                datasets: [
                    {
                        label: 'Doanh thu theo ngày trong tháng',
                        fill: true,
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
                        yAxisID: 'y',
                        tension: 0.4,
                        data: revenue
                    }
                ]

            });
            const days = data.viewsDaily.original.map(item => item.day);
            const viewsDaily = data.viewsDaily.original.map(item => item.total);
            const soldDaily = data.soldDaily.original.map(item => item.total);
            setChartData({
                labels: days,
                datasets: [
                    {
                        label: 'Lượt xem sản phẩm hằng ngày',
                        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
                        data: viewsDaily
                    },
                    {
                        label: 'Lượt mua sản phẩm hằng ngày',
                        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--pink-500'),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--pink-500'),
                        data: soldDaily
                    }
                ]
            });
            const times = data.accessTimes.original.map(item => item.total_count)
            setChartData1({
                labels: ['Sáng (0-10h)', 'Chiều (10-18h)', 'Tối (18-24h)'],
                datasets: [
                    {
                        data: times,
                        backgroundColor: [
                            getComputedStyle(document.documentElement).getPropertyValue('--blue-500'), 
                            getComputedStyle(document.documentElement).getPropertyValue('--yellow-500'), 
                            getComputedStyle(document.documentElement).getPropertyValue('--green-500')
                        ],
                        hoverBackgroundColor: [
                            getComputedStyle(document.documentElement).getPropertyValue('--blue-400'), 
                            getComputedStyle(document.documentElement).getPropertyValue('--yellow-400'), 
                            getComputedStyle(document.documentElement).getPropertyValue('--green-400')
                        ]
                    }
                ]
            })
        });
    }, []);

    const [chartOptions, ] = useState({
        indexAxis: 'y',
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    fontColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary'),
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
                },
                grid: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border'),
                    drawBorder: false
                }
            }
        }
    });

    const [chartOptions1,] = useState({
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            }
        }
    });

    const [revenueOptions, ] = useState({
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
                },
                grid: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                ticks: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
                },
                grid: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
                }
            }
        }
    });

    const productViewTemplate = (product) => {
        return (
            <div className="border-1 surface-border border-round text-center p-1">
                <div className="mb-3">
                    <img src={product.imageLink} alt={product.imageName} className="w-6 shadow-2" style={{width: '100%', height:'350px'}} />
                </div>
                <div>
                    <h4 className="mb-1">{product.name}</h4>
                    <Tag value={`Số lượng: ${product.quantity}`} severity={getSeverity(product)}></Tag>
                    <div className="mt-2 justify-content-center">
                        <Link to={`/admin/san-pham/chinh-sua/${product.id}`}><Button icon="pi pi-search" className="rounded-3" /></Link>
                    </div>
                </div>
            </div>
        );
    };

    const productSoldTemplate = (product) => {
        return (
            <div className="border-1 surface-border border-round text-center p-1">
                <div className="mb-3">
                    <img src={product.imageLink} alt={product.imageName} className="w-6 shadow-2" style={{width: '100%', height:'350px'}} />
                </div>
                <div>
                    <h4 className="mb-1">{product.name}</h4>
                    <Tag value={`Số lượng bán được: ${product.total_quantity_sold}`} severity={getSeverity(product)}></Tag>
                    <div className="mt-2 justify-content-center">
                        <Link to={`/admin/san-pham/chinh-sua/${product.id}`}><Button icon="pi pi-search" className="rounded-3" /></Link>
                    </div>
                </div>
            </div>
        );
    };

    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 5,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 4,
            numScroll: 1
        },
        {
            breakpoint: '1000px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '700px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const getSeverity = (product) => {
        const quantity = parseInt(product.quantity);

        if (quantity > 10) {
            return 'success';
        } else if (quantity < 10 && quantity > 0) {
            return 'warning';
        } else if (quantity === 0) {
            return 'danger';
        } else {
            return null;
        }
    };
    return (  
        <>
            <div className="row">
                <div className="col-md-3 grid-margin stretch-card">
                    <div className="card bg-gradient-danger card-img-holder text-white">
                        <div className="card-body">
                            <img src="/image/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                            <h4 className="font-weight-normal mb-3">Sản Phẩm <i className="bi bi-list-task float-right" style={{fontSize:'24px'}}></i>
                            </h4>
                            <h2 className="mb-3 text-center">{totalProducts}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 grid-margin stretch-card">
                    <div className="card bg-orange-gradient card-img-holder text-white">
                        <div className="card-body">
                            <img src="/image/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                            <h4 className="font-weight-normal mb-3">Người Dùng <i className="bi bi-people-fill float-right" style={{fontSize:'24px'}}></i>
                            </h4>
                            <h2 className="mb-3 text-center">{totalUsers}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 grid-margin stretch-card">
                    <div className="card bg-green-gradient card-img-holder text-white">
                        <div className="card-body">
                            <img src="/image/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                            <h4 className="font-weight-normal mb-3">Bài Viết <i className="bi bi-newspaper float-right" style={{fontSize:'24px'}}></i>
                            </h4>
                            <h2 className="mb-3 text-center">{totalNews}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 grid-margin stretch-card">
                    <div className="card bg-blue-gradient card-img-holder text-white">
                        <div className="card-body">
                            <img src="/image/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                            <h4 className="font-weight-normal mb-3">Tổng Tiền Tháng Này <i className="bi bi-graph-up-arrow float-right" style={{fontSize:'24px'}}></i>
                            </h4>
                            <h2 className="mb-3 text-center">{totalMoney} VNĐ</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 grid-margin stretch-card">
                    <div className="card bg-gradient-warning card-img-holder text-white">
                        <div className="card-body">
                            <img src="/image/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                            <h4 className="font-weight-normal mb-3">Đơn Hàng Đang Chờ <i className="bi bi-bag-x-fill float-right" style={{fontSize:'24px'}}></i>
                            </h4>
                            <h2 className="mb-3 text-center">{totalOrdersPending}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 grid-margin stretch-card">
                    <div className="card bg-gradient-primary card-img-holder text-white">
                        <div className="card-body">
                            <img src="/image/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                            <h4 className="font-weight-normal mb-3">Đơn Hàng <i className="bi bi-bag-check-fill float-right" style={{fontSize:'24px'}}></i>
                            </h4>
                            <h2 className="mb-3 text-center">{totalOrdersSuccess}</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row" >
                <div className="col-md-9 grid-margin stretch-card">
                    <Card title="Lượt Xem Và Lượt Mua Hàng" className="card">
                        <Chart type="bar" data={chartData} options={chartOptions} />
                    </Card>
                </div>
                <div className="col-md-3 grid-margin stretch-card">
                    <Card title="Thời gian hoạt động" className="card">
                        <Chart type="pie" data={chartData1} options={chartOptions1} />
                    </Card>
                </div>
            </div>
            <div className="row">
                <div className="col-12 grid-margin stretch-card">
                    <Card title="Doanh thu" className="card">
                        <Chart type="line" data={revenue} options={revenueOptions} />
                    </Card>
                </div>
            </div>
            <div className="row">
                <div className="col-12 grid-margin stretch-card">
                    <Card title="Sản phẩm bán chạy nhất" className="card">
                        <Carousel value={productMostSold} responsiveOptions={responsiveOptions} numVisible={5} numScroll={1} itemTemplate={productSoldTemplate} />
                    </Card>
                </div>
            </div>
            <div className="d-flex w-100 mt-3 products-popular">
                <div className="col-12 grid-margin stretch-card">
                    <Card title="Sản phẩm được xem nhiều nhất" className="card">
                        <Carousel value={productsMostView} responsiveOptions={responsiveOptions} numVisible={5} numScroll={5} itemTemplate={productViewTemplate} />
                    </Card>
                </div>
            </div>
        </>
    );
}

export default Dashboard;