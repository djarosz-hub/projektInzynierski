import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
// import Pagination from "./pagination";
import { useDispatch, useSelector } from "react-redux";
import { listProduct } from './../../Redux/Actions/ProductActions';
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import ReactPaginate from 'react-paginate';
import { listCategories } from "../../Redux/Actions/CategoryActions";


const ShopSection = () => {

    // const { keyword, pageNumber } = props;
    const [filterValue, setFilterValue] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [categoryFilter, setCategoryFilter] = useState("");

    const pageSize = 9;
    //for future implementation
    // const [categoryId, setCategoryId] = useState('');

    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList);
    // const { loading, error, products, page, pages } = productList;
    const { loading, error, products } = productList;

    const categoryList = useSelector((state) => state.categoryList);
    const { loading: loadingCategories, error: errorCategories, categories } = categoryList;

    const filterHandler = (product) => {
        console.log('category filter: ' + categoryFilter)
        console.log('keyword filter: ' + filterValue);

        if (categoryFilter) {
            if (product.categoryId !== categoryFilter) {
                return false;
            }
        }

        if (filterValue) {
            // console.log('filvalue: ' + filterValue)
            const filter = filterValue.trim().toLowerCase();
            const nameIncludes = product.name.toLowerCase().includes(filter) ? true : false;
            const descriptionIncludes = product.description.toLowerCase().includes(filter) ? true : false;
            // console.log('nameIncludes:' + nameIncludes)
            // console.log('descriptionIncludes: ' + descriptionIncludes)
            const result = nameIncludes ? nameIncludes : descriptionIncludes;
            return result;
        }

        return true;
    }

    const filteredProducts = products && products?.filter(product => filterHandler(product));

    console.log('filtered:')
    console.log(filteredProducts)
    useEffect(() => {
        dispatch(listProduct());
        dispatch(listCategories());
        // dispatch(listProduct(keyword, pageNumber))
    }, [dispatch])
    // }, [dispatch, keyword, pageNumber])
    // console.log(products)

    const handlePageClick = (data) => {
        const selectedPage = data.selected; // actual value, not label so for first page value is 0
        console.log(selectedPage)
        setCurrentPage(selectedPage);

        window.scrollTo(0, 0);

        // props.setCurrentPage(selected * 10)
    };

    return (
        <>
            <div className="container">
                <div className="col-12 d-flex align-items-center padded">
                    {/* <form className="input-group"> */}
                    <input
                        type="search"
                        className="form-control rounded search"
                        placeholder="Filter items by name or description..."
                        onChange={(e) => setFilterValue(e.target.value)}
                    />
                    {/* <button className="search-button">
                            search
                        </button>
                    </form> */}
                </div>
                <div className="col-12 d-flex align-items-center padded top-margin">
                    {/* <label className="form-label">Category</label> */}
                    {errorCategories && <Message variant="alert-danger">{errorCategories}</Message>}
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="col-12 bg-light p-3 mt-2 border-0 rounded">
                        <option value="">Filter by category...</option>
                        {
                            categories?.length && (
                                categories.map((cat, index) => (
                                    <option key={index} value={cat._id}>{cat.name}</option>
                                ))
                            )
                        }
                        {/* <option value="5">5 - Excellent</option> */}
                    </select>
                </div>
                <div className="section">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 article">
                            <div className="shopcontainer row">
                                {
                                    loading ? (
                                        <div className="mb-5">
                                            <Loading />
                                        </div>
                                    ) : error ? (
                                        <Message variant="alert-danger">{error}</Message>
                                    ) : (
                                        <>
                                            {filteredProducts.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((product) => (
                                                <div
                                                    className="shop col-lg-4 col-md-6 col-sm-6"
                                                    key={product._id}
                                                >
                                                    <div className="border-product">
                                                        <Link to={`/products/${product._id}`}>
                                                            <div className="shopBack">
                                                                <img src={product?.images[0]} alt={product.name} />
                                                            </div>
                                                        </Link>

                                                        <div className="shoptext">
                                                            <p>
                                                                <Link to={`/products/${product._id}`}>
                                                                    {product.name}
                                                                </Link>
                                                            </p>

                                                            <Rating
                                                                value={product.rating}
                                                                text={product.reviews.length > 1 ? `${product.reviews.length} reviews` : `${product.reviews.length} review`}
                                                            />
                                                            <h3>${product.price.toFixed(2)}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )
                                }
                                {

                                    filteredProducts.length > 0 ? (
                                        <ReactPaginate
                                            previousLabel={'PREVIOUS'}
                                            nextLabel={'NEXT'}
                                            breakLabel={'...'}
                                            breakClassName={'break-me'}
                                            pageCount={Math.ceil(filteredProducts?.length / pageSize)}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            initialPage={0}
                                            forcePage={0}
                                            onPageChange={handlePageClick}
                                            containerClassName={'pagination'}
                                            activeClassName={'active-page'}
                                        />) : (
                                        <div className="centered">No items matching this criteria - choose another filter.</div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopSection;
