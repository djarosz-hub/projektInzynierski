import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Product from "./Product";
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from './../../Redux/Actions/ProductActions';
import Loading from './../LoadingError/Loading';
import Message from './../LoadingError/Error';
import { listCategories } from './../../Redux/Actions/CategoryActions';
import ReactPaginate from 'react-paginate';

const MainProducts = () => {

    const [filterValue, setFilterValue] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [categoryFilter, setCategoryFilter] = useState("");

    const pageSize = 12;

    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;

    const productDelete = useSelector((state) => state.productDelete);
    const { error: errorDelete, success: successDelete } = productDelete;

    const categoryList = useSelector((state) => state.categoryList);
    const { loading: loadingCategories, error: errorCategories, categories } = categoryList;

    useEffect(() => {
        // console.log(categories)
        dispatch(listCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch, successDelete]);

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

    const handlePageClick = (data) => {
        const selectedPage = data.selected; // actual value, not label so for first page value is 0
        // console.log(selectedPage)
        setCurrentPage(selectedPage);

        window.scrollTo(0, 0);

        // props.setCurrentPage(selected * 10)
    };

    const handleKeywordFilter = (keyword) => {
        setFilterValue(keyword);
        setCurrentPage(0);
    }
    const handleCategoryFilter = (category) => {
        setCategoryFilter(category)
        setCurrentPage(0);
    }

    return (
        <section className="content-main">
            <div className="content-header">
                <h2 className="content-title">Products</h2>
                <div>
                    <Link to="/addproduct" className="btn btn-primary">
                        Create new
                    </Link>
                </div>
            </div>

            <div className="card mb-4 shadow-sm">
                <header className="card-header bg-white ">
                    <div className="row gx-3 py-3">
                        <div className="col-lg-4 col-md-6 me-auto ">
                            <input
                                type="search"
                                className="form-control p-2"
                                placeholder="Filter items by name or description..."
                                onChange={(e) => handleKeywordFilter(e.target.value)}
                            />
                        </div>
                        {loadingCategories && <Loading />}
                        {errorCategories && <Message variant="alert-danger">{errorCategories}</Message>}
                        {
                            categories && categories?.length && (
                                <div className="col-lg-2 col-6 col-md-3">
                                    <select className="form-select" value={categoryFilter} onChange={(e) => handleCategoryFilter(e.target.value)}>
                                        <option value="">All categories</option>
                                        {
                                            categories.map((cat, index) => (
                                                <option key={index} value={cat._id}>{cat.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            )
                        }

                        {/* additional filtering for future implementation */}
                        {/* <div className="col-lg-2 col-6 col-md-3">
                            <select className="form-select">
                                <option>Latest added</option>
                                <option>Cheap first</option>
                                <option>Most viewed</option>
                            </select>
                        </div> */}
                    </div>
                </header>

                <div className="card-body">
                    {errorDelete && (<Message variant="alert-danger">{errorDelete}</Message>)}
                    {
                        loading ? (
                            <Loading />
                        ) : error ? (
                            <Message variant="alert-danger">{error}</Message>
                        ) : (
                            <div className="row">
                                {filteredProducts.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((product) => (
                                    <Product product={product} key={product._id} />
                                ))}
                            </div>
                        )
                    }
                    {

                        filteredProducts.length > 0 && (
                            <ReactPaginate
                                previousLabel={'PREVIOUS'}
                                nextLabel={'NEXT'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={Math.ceil(filteredProducts?.length / pageSize)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                initialPage={0}
                                forcePage={currentPage}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active-page'}
                            />)
                    }
                    {
                        !loading && filteredProducts.length === 0 && (
                            <div className="centered">No items matching this criteria - choose another filter.</div>
                        )
                    }
                </div>
            </div>
        </section>
    );
};

export default MainProducts;
