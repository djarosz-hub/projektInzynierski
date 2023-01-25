import React, { useEffect, useState } from "react";
import Header from "./../components/Header";
import Rating from "../components/homeComponents/Rating";
import { Link } from "react-router-dom";
import Message from "./../components/LoadingError/Error";
import { useDispatch, useSelector } from "react-redux";
import { createProductReview, listProductDetails } from "../Redux/Actions/ProductActions";
import Loading from './../components/LoadingError/Loading';
import { PRODUCT_CREATE_REVIEW_RESET } from "../Redux/Constants/ProductConstants";
import moment from 'moment';
import { addToCart } from './../Redux/Actions/CartActions';
import ImageSlider from "../components/productComponents/ImageSlider";

const SingleProduct = ({ match }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [invalidFormDataError, setInvalidFormDataError] = useState("");
    const [mainImage, setMainImage] = useState("");

    const dispatch = useDispatch();
    const productId = match.params.id;

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productCreateReview = useSelector((state) => state.productCreateReview);
    const { loading: loadingCreateReview, error: errorCreateReview, success: successCreateReview } = productCreateReview;

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    useEffect(() => {
        if (successCreateReview) {
            setRating(0);
            setComment("");
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }

        dispatch(listProductDetails(productId));

        return () => {
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }

    }, [dispatch, productId, successCreateReview])

    useEffect(() => {
        if (product && product.images) {
            setMainImage(product.images[0]);
        }
    }, [product])

    const AddToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart(productId, 1));
    }

    const submitReviewHandler = (e) => {
        e.preventDefault();
        if (!rating || comment.trim() === '') {
            setInvalidFormDataError('Please fill all required data correctly.');
        } else {
            setInvalidFormDataError('');
            dispatch(createProductReview(productId, { rating, comment }))
        }
    }

    return (
        <>
            <Header />
            <div className="container single-product">
                {
                    loading ? (
                        <Loading />
                    ) : error ? (
                        <Message variant="alert-danger">{error}</Message>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-md-6">
                                    <ImageSlider images={product.images} name={product.name}/>
                                </div>
                                <div className="col-md-6">
                                    <div className="product-dtl">
                                        <div className="product-info">
                                            <div className="product-name">{product.name}</div>
                                        </div>
                                        <p>{product.description}</p>

                                        <div className="product-count col-lg-7 ">
                                            <div className="flex-box d-flex justify-content-between align-items-center">
                                                <h6>Price</h6>
                                                <span>${product.price}</span>
                                            </div>
                                            <div className="flex-box d-flex justify-content-between align-items-center">
                                                <h6>Status</h6>
                                                {product.countInStock > 0 ? (
                                                    <span>In Stock</span>
                                                ) : (
                                                    <span>unavailable</span>
                                                )}
                                            </div>
                                            <div className="flex-box d-flex justify-content-between align-items-center">
                                                <h6>Reviews</h6>
                                                <Rating
                                                    value={product.rating}
                                                    text={product.reviews.length > 1 ? `${product.reviews.length} reviews` : `${product.reviews.length} review`}
                                                />
                                            </div>
                                            {
                                                product.countInStock > 0 ?
                                                    cartItems.filter(item => item.product === productId).length > 0 ? (
                                                        <button disabled className="round-black-btn">Already in cart</button>
                                                    ) : (
                                                        <button onClick={AddToCart} className="round-black-btn">Add To Cart</button>
                                                    ) : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row my-5">
                                <div className="col-md-6">
                                    <h6 className="mb-3">REVIEWS</h6>
                                    {
                                        product.reviews.length === 0 && (
                                            <Message variant={"alert-info mt-3"}>No Reviews</Message>
                                        )
                                    }
                                    {
                                        product.reviews.map((review) => (
                                            <div key={review._id} className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded">
                                                <strong>{review.name}</strong>
                                                <Rating value={review.rating} />
                                                <span>{moment(review.createdAt).format('DD/MM/YYYY')}</span>
                                                <div className="alert alert-info mt-3">
                                                    {review.comment}
                                                </div>
                                            </div>
                                        ))
                                    }

                                </div>
                                <div className="col-md-6">
                                    <h6>WRITE A CUSTOMER REVIEW</h6>
                                    <div className="my-4">
                                        {loadingCreateReview && <Loading />}
                                        {errorCreateReview && (<Message variant={"alert-danger"}>{errorCreateReview}</Message>)}
                                        {invalidFormDataError && <Message variant="alert-danger">{invalidFormDataError}</Message>}
                                    </div>
                                    {
                                        userInfo ? (
                                            <form onSubmit={submitReviewHandler}>
                                                <div className="my-4">
                                                    <strong>Rating</strong>
                                                    <select value={rating} onChange={(e) => setRating(e.target.value)} className="col-12 bg-light p-3 mt-2 border-0 rounded">
                                                        <option value="">Select...</option>
                                                        <option value="1">1 - Poor</option>
                                                        <option value="2">2 - Fair</option>
                                                        <option value="3">3 - Good</option>
                                                        <option value="4">4 - Very Good</option>
                                                        <option value="5">5 - Excellent</option>
                                                    </select>
                                                </div>
                                                <div className="my-4">
                                                    <strong>Comment</strong>
                                                    <textarea
                                                        row="3"
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                                                        required
                                                    ></textarea>
                                                </div>
                                                <div className="my-3">
                                                    <button disabled={loadingCreateReview} className="col-12 bg-black border-0 p-3 rounded text-white">
                                                        SUBMIT
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="my-3">
                                                <Message variant={"alert-warning"}>
                                                    Please{" "}
                                                    <Link to="/login">
                                                        " <strong>Login</strong> "
                                                    </Link>{" "}
                                                    to write a review{" "}
                                                </Message>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </>
                    )
                }

            </div>
        </>
    );
};

export default SingleProduct;
