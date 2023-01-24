import React, { useState, useEffect } from "react";
import Toast from "./../LoadingError/Toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { editProduct, updateProduct } from './../../Redux/Actions/ProductActions';
import { PRODUCT_UPDATE_RESET } from "../../Redux/Constants/ProductConstants";
import { toast } from 'react-toastify';
import Message from './../LoadingError/Error';
import Loading from './../LoadingError/Loading';
import { listCategories } from "../../Redux/Actions/CategoryActions";

const ToastObjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
};

const EditProductMain = (props) => {
    const { productId } = props;
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState("");
    const [category, setCategory] = useState("");

    const dispatch = useDispatch();

    const productEdit = useSelector((state) => state.productEdit);
    const { loading, error, product } = productEdit;

    const productUpdate = useSelector((state) => state.productUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

    const categoryList = useSelector((state) => state.categoryList);
    const { loading: loadingCategories, error: errorCategories, categories } = categoryList;

    useEffect(() => {

        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            toast.success("Product updated.", ToastObjects);
        } else {
            if (!product.name || product._id !== productId) {
                dispatch(editProduct(productId));
            } else {
                console.log('got product:')
                console.log(product)
                setName(product.name);
                setPrice(product.price);
                setCountInStock(product.countInStock);
                setDescription(product.description);
                const imgArray = product.images;
                const imgString = imgArray.join(',');
                setImages(imgString);
                setCategory(product.categoryId);
            }
        }
    }, [product, dispatch, productId, successUpdate]);

    useEffect(() => {
        // console.log('effect cat')
        // console.log(categories)
        if (!categories?.length && !loadingCategories && !errorCategories) {
            // console.log('listing cat')
            dispatch(listCategories());
        }

    }, [categories, dispatch, loadingCategories, errorCategories]);

    const submitHandler = (e) => {
        e.preventDefault();

        if ((!name || name.trim() === "") ||
            (isNaN(price) || price <= 0) ||
            (isNaN(countInStock) || countInStock < 0) ||
            (!description || description.trim() === "") ||
            (!images || images.trim() === "") ||
            (!category || category.trim() === "")) {

            toast.error("Invalid product data", ToastObjects);
        } else {
            dispatch(updateProduct({
                _id: productId,
                name,
                price,
                description,
                images,
                countInStock,
                category
            }));
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
                        <h2 className="content-title">Update Product</h2>
                        <div>
                            <button type="submit" className="btn btn-primary">
                                Save updated
                            </button>
                        </div>
                    </div>

                    <div className="row mb-4 centeredFlex">
                        <div className="col-xl-8 col-lg-8">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    {errorUpdate && <Message variant="alert-danger">{errorUpdate}</Message>}
                                    {loadingUpdate && <Loading />}
                                    {
                                        loading ? (
                                            <Loading />
                                        ) : error ? (
                                            <Message variant="alert-danger">{error}</Message>
                                        ) : (
                                            <>
                                                <div className="mb-4">
                                                    <label htmlFor="product_title" className="form-label">
                                                        Product title
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
                                                    {/* <input
                                                        className="form-control"
                                                        placeholder="Image source links separated by commas"
                                                        type="text"
                                                        required
                                                        value={images}
                                                        onChange={(e) => setImages(e.target.value)}
                                                    /> */}
                                                    <textarea
                                                        placeholder="Image source links separated by commas"
                                                        className="form-control"
                                                        rows="3"
                                                        required
                                                        value={images}
                                                        onChange={(e) => setImages(e.target.value)}
                                                    ></textarea>
                                                </div>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </>
    );
};

export default EditProductMain;
