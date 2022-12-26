import React, { useState, useEffect } from "react";
import Toast from "./../LoadingError/Toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { editProduct } from './../../Redux/Actions/ProductActions';

const EditProductMain = (props) => {
    const { productId } = props;

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const dispatch = useDispatch();

    const productEdit = useSelector((state) => state.productEdit);
    const { loading, error, product } = productEdit;

    useEffect(() => {
        if (!product.name || product._id !== productId) {
            dispatch(editProduct(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setCountInStock(product.countInStock);
            setDescription(product.description);
            setImage(product.image);
        }
    }, [product, dispatch, productId]);

    return (
        <>
            <section className="content-main" style={{ maxWidth: "1200px" }}>
                <form>
                    <div className="content-header">
                        <Link to="/products" className="btn btn-danger text-white">
                            Go to products
                        </Link>
                        <h2 className="content-title">Update Product</h2>
                        <div>
                            <button type="submit" className="btn btn-primary">
                                Publish now
                            </button>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-xl-8 col-lg-8">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
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

export default EditProductMain;
