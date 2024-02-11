import { InputNumber } from "primereact/inputnumber";
import { Panel } from "primereact/panel";
import { Slider } from "primereact/slider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { ListBox } from "primereact/listbox";
import { Rating } from "primereact/rating";
import { BreadCrumb } from 'primereact/breadcrumb';
import { SelectButton } from "primereact/selectbutton";     
import { Paginator } from 'primereact/paginator';
import unidecode from "unidecode";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from 'primereact/dropdown';
        
        
function Filter() {
    const [value, setValue] = useState([20,80]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [max, setMax] = useState(100);
    const [min, setMin] = useState(0);
    const [sortOption, setSortOption] = useState('newest');
    const navi = useNavigate();

    useEffect(() => {
        document.title = "Tất Cả Sản Phẩm - Dao Thủ Công Đa Sỹ";
        axiosClient.post('/products/filterProducts')
        .then(({data}) => {
            const prices = data.products.original.map(product => product.price - (product.price * product.discount / 100));
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setCategories(data.categories.original);
            setProducts(data.products.original);
            setValue([minPrice, maxPrice]);
            setMax(maxPrice);
            setMin(minPrice);
        })
    },[])

    const handleValueMinChange = (event) => {
        const newValue = [...value];
        newValue[0] = parseInt(event.target.value) || 0;
    
        setValue(newValue);
    };

    const handleValueMaxChange = (event) => {
        const newValue = [...value];
        newValue[1] = parseInt(event.target.value) || 0;
    
        setValue(newValue);
    };
    const onPageChange = (event) => {
        setCurrentPage(event.page);
    };

    const handleSearch = (e) => {
        setSelectedCategories(e.value);

    }
    const currentUrl = window.location.href;
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('p')){
            var keyword = urlParams.get('p');
        }
        if(urlParams.get('sale')){
            setSortOption('descSale');
        }
        if(products){
            const categoryFiltered = selectedCategories.length !== 0
            ? products.filter(product =>
                selectedCategories.some(selectedCategory =>
                    product.categoryName.includes(selectedCategory.categoryName)
                )
                )
            : products;
    
            const priceFiltered = categoryFiltered.filter(
            product => product.price >= value[0] && product.price <= value[1]
            );
            const keywordFiltered = keyword  ? priceFiltered.filter(product => product.slugName.includes(keyword))
            : priceFiltered;
            const sortedProducts = keywordFiltered.sort((a, b) => {
                switch (sortOption) {
                case 'newest':
                    return new Date(b.create_at) - new Date(a.create_at);
                case 'oldest':
                    return new Date(a.create_at) - new Date(b.create_at);
                case 'ascPrice':
                    return (a.price - (a.price * a.discount / 100)) - (b.price - (b.price * b.discount / 100));
                case 'descPrice':
                    return (b.price - (b.price * b.discount / 100)) - (a.price - (a.price * a.discount / 100));
                case 'ascName':
                    return a.name.localeCompare(b.name);
                case 'descName':
                    return b.name.localeCompare(a.name);
                case 'descSale':
                    return b.discount - a.discount;
                default:
                    return 0;
                }
            });
            
            setFilteredProducts(sortedProducts);
        }
    }, [selectedCategories, value, products ,sortOption, currentUrl]);

    const displayedProducts = filteredProducts.slice(
        currentPage * 12,
        (currentPage + 1) * 12
    );
    const items = [{label: 'Lọc Sản Phẩm'}];
    const home = { label: 'Trang Chủ', template: () => <Link to="/"><a className="text-dark font-semibold">Trang Chủ</a></Link> };
    const justifyOptions = [
        {name: 'Mới nhất', value: 'newest'},
        {name: 'Cũ nhất', value: 'oldest'},
        {name: 'Tăng dần', value: 'ascPrice'},
        {name: 'Giảm dần', value: 'descPrice'},
        {name: 'Tên A-Z', value: 'ascName'},
        {name: 'Tên Z-A', value: 'descName'}
    ];
    return (
        <div className="container-fluid">
            <div className="mb-3">
                <BreadCrumb model={items} home={home} />
            </div>
            <div className="row">
                <div className="col-md-3 mt-3">
                <Panel header="Giá">
                    <Slider value={value} onChange={(e) => setValue(e.value)} max={max} min={min} className="w-100" range />
                    <div className="d-flex w-100 justify-content-center mt-3 align-items-center" style={{paddingBottom:'10px'}}>
                        <InputNumber value={value[0]} onValueChange={handleValueMinChange} style={{width:'120px'}} mode="currency" currency="VND" locale="vi-VI" /> <b className="ml-2 mr-2">-</b> 
                        <InputNumber value={value[1]} onValueChange={handleValueMaxChange} style={{width:'120px'}} mode="currency" currency="VND" locale="vi-VI" />
                    </div>
                </Panel>
                <Panel header="Loại Dao" toggleable className="mt-5">
                    <ListBox multiple value={selectedCategories} onChange={handleSearch} options={categories} optionLabel="categoryName" className="w-full md:w-14rem" />
                </Panel>
                
                </div>
                <div className="col-md-9 mt-3">
                    <div className="d-flex justify-content-center mb-3 align-items-center">
                    <div className="mr-3">
                        <Link to="/san-pham/tim-kiem" className="btn btn-primary">Làm Mới</Link>
                    </div>
                        <h4 className="mr-2"><span>Sắp xếp theo:</span></h4>
                        <SelectButton value={sortOption} onChange={(e) => {navi('/san-pham/tim-kiem');setSortOption(e.value);}} optionLabel="name" options={justifyOptions} />
                        <div className="dropdown-filter">
                        <Dropdown value={sortOption} onChange={(e) => {setSortOption(e.value);navi('/san-pham/tim-kiem')}} options={justifyOptions} optionLabel="name" 
                            placeholder="Select a City" className="w-full md:w-14rem" />
                        </div>
                    </div>
                    <div className="grid-4 filter-container">
                        {filteredProducts &&  displayedProducts.map((product) => (
                            <div className="d-flex item-content mb-3" key={product.id}>
                                <Link to={`/${encodeURIComponent(unidecode(product.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-$/, "")}`}>
                                <img src={product.imageLink} width="100%" className="rounded-4" height="300px" alt={product.imageName} />
                                </Link>
                                <div className="mt-2 mb-1">
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
                    </div>
                    {filteredProducts &&  
                    <Paginator className="mt-4" first={currentPage * 12} rows={12} totalRecords={filteredProducts.length} onPageChange={onPageChange} />}
                </div>
            </div>
        </div>
    );
}

export default Filter;