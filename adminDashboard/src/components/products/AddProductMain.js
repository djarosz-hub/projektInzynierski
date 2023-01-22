import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PRODUCT_CREATE_RESET } from './../../Redux/Constants/ProductConstants';
import { createProduct } from '../../Redux/Actions/ProductActions';
import Message from './../LoadingError/Error';
import Loading from './../LoadingError/Loading';
import Toast from './../LoadingError/Toast';

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
    const [image, setImage] = useState("");

    const dispatch = useDispatch();

    const productCreate = useSelector((state) => state.productCreate);
    const { loading, error, product } = productCreate;

    useEffect(() => {
        if (product) {
            toast.success("Product created.", ToastObjects);
            dispatch({ type: PRODUCT_CREATE_RESET });
            setName("");
            setPrice(0);
            setCountInStock(0);
            setDescription("");
            setImage("");
        }

        return () => {
            dispatch({ type: PRODUCT_CREATE_RESET })
        }
    }, [product, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();

        if ((!name || name.trim() === "") ||
            (isNaN(price) || price <= 0) ||
            (isNaN(countInStock) || countInStock < 0) ||
            (!description || description.trim() === "") ||
            (!image || image.trim() === "")) {

            toast.error("Invalid product data", ToastObjects);
        } else {
            dispatch(createProduct(name, price, description, image, countInStock));
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
                                        <label className="form-label">Image</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Inter Image URL"
                                            required
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                        />
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
