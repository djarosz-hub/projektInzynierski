import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PRODUCT_CREATE_RESET } from './../../Redux/Constants/ProductConstants';
import { createProduct } from '../../Redux/Actions/ProductActions';
import Message from './../LoadingError/Error';
import Loading from './../LoadingError/Loading';
import Toast from './../LoadingError/Toast';
import { listCategories } from "../../Redux/Actions/CategoryActions";

const ToastObjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
};

const AddProductMain = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState("");
    const [category, setCategory] = useState("");

    const dispatch = useDispatch();

    const productCreate = useSelector((state) => state.productCreate);
    const { loading, error, product } = productCreate;

    const categoryList = useSelector((state) => state.categoryList);
    const { loading: loadingCategories, error: errorCategories, categories } = categoryList;

    useEffect(() => {
        // console.log('effect')
        // console.log(categories)
        if (!categories?.length && !loadingCategories && !errorCategories) {
            console.log('listing cat')
            dispatch(listCategories());
        }

        if (product) {
            toast.success("Product created.", ToastObjects);
            dispatch({ type: PRODUCT_CREATE_RESET });
            setName("");
            setPrice(0);
            setCountInStock(0);
            setDescription("");
            setImages("");
            setCategory("");
        }

    }, [product, categories, dispatch, loadingCategories, errorCategories]);

    useEffect(() => {
        return () => {
            dispatch({ type: PRODUCT_CREATE_RESET })
        }
    }, [dispatch]);


    const submitHandler = (e) => {
        e.preventDefault();
        console.log('cat: ' + category)
        // return;
        // console.log(images)
        // return;
        if ((!name || name.trim() === "") ||
            (isNaN(price) || price <= 0) ||
            (isNaN(countInStock) || countInStock < 0) ||
            (!description || description.trim() === "") ||
            (!images || images.trim() === "") ||
            (!category || category.trim() === "")) {

            toast.error("Invalid product data", ToastObjects);
        } else {
            dispatch(createProduct({ name, price, description, images, countInStock, category }));
        }
    };

    return (
        <>
            <Toast />
            <section className="content-main" style={{ maxWidth: "1200px" }}>
                <form onSubmit={submitHandler}>
                    <div className="content-header">
                        <Link to="/products" className="btn btn-danger text-white">
                            Go to products
                        </Link>
                        <h2 className="content-title">Add product</h2>
                        <div>
                            <button type="submit" className="btn btn-primary">
                                Publish now
                            </button>
                        </div>
                    </div>

                    <div className="row mb-4 centeredFlex">
                        <div className="col-xl-8 col-lg-8">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    {error && <Message variant="alert-danger">{error}</Message>}
                                    {loading && <Loading />}
                                    <div className="mb-4">
                                        <label htmlFor="product_title" className="form-label">
                                            Product name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Type here"
                                            className="form-control"
                                            id="product_title"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="product_price" className="form-label">
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Type here"
                                            className="form-control"
                                            id="product_price"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="product_price" className="form-label">
                                            Count In Stock
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Type here"
                                            className="form-control"
                                            id="product_price"
                                            required
                                            min="0"
                                            value={countInStock}
                                            onChange={(e) => setCountInStock(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            placeholder="Type here"
                                            className="form-control"
                                            rows="7"
                                            required
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Category</label>
                                        {errorCategories && <Message variant="alert-danger">{errorCategories}</Message>}
                                        <select required value={category} onChange={(e) => setCategory(e.target.value)} className="col-12 bg-light p-3 mt-2 border-0 rounded">
                                            <option value="">Select...</option>
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
                                    <div className="mb-4">
                                        <label className="form-label">Images</label>
                                        <textarea
                                            placeholder="Image source links separated by commas"
                                            className="form-control"
                                            rows="3"
                                            required
                                            value={images}
                                            onChange={(e) => setImages(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </>
    );
};

export default AddProductMain;
