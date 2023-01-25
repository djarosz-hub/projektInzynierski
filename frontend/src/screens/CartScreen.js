import React, { useEffect } from "react";
import Header from "./../components/Header";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from './../Redux/Actions/CartActions';
import { ORDER_COUNTCHECK_RESET } from './../Redux/Constants/OrderConstants';
import { validateOrderItemsAvailability } from './../Redux/Actions/OrderActions';
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";

const CartScreen = ({ history }) => {
    window.scrollTo(0, 0);
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderValidation = useSelector((state) => state.orderValidation);
    const { loading, error, success } = orderValidation;

    const totalPrice = cartItems.reduce((a, i) => a + (i.qty * i.price), 0).toFixed(2);

    useEffect(() => {
        if (success && !error) {
            history.push("/login?redirect=shipping");
        }
    }, [dispatch, success, error]);

    useEffect(() => {
        return () => {
            dispatch({ type: ORDER_COUNTCHECK_RESET });
        }
    }, []);

    const checkoutHandler = (e) => {
        e.preventDefault();
        dispatch(validateOrderItemsAvailability(cartItems));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    };

    const decreaseQty = (productId, qty) => {
        if (qty === 1) {
            dispatch(removeFromCart(productId))
        } else {
            dispatch(addToCart(productId, qty - 1));
        }
    };

    const increaseQty = (productId, qty) => {
        dispatch(addToCart(productId, qty + 1));
    };


    return (
        <>
            <Header />
            <div className="container">
                {
                    cartItems.length === 0 ? (
                        <div className=" alert alert-info text-center mt-3">
                            Your cart is empty
                            <Link
                                className="btn btn-success mx-5 px-5 py-3"
                                to="/"
                                style={{
                                    fontSize: "12px",
                                }}
                            >
                                SHOPPING NOW
                            </Link>
                        </div>
                    ) : (
                        <>
                            {loading && <Loading/>}
                            {error && <Message variant="alert-danger">{error}</Message>}
                            <div className=" alert alert-info text-center mt-3">
                                Total Cart Products
                                ({cartItems.length})
                            </div>
                            {
                                cartItems.map((item) => (
                                    <div className="cart-iterm row" key={item.product}>
                                        <div
                                            onClick={() => removeFromCartHandler(item.product)}
                                            className="remove-button d-flex justify-content-center align-items-center">
                                            <i className="fas fa-times"></i>
                                        </div>
                                        <div className="cart-image col-md-3">
                                            <img src={item?.images[0]} alt={item.name} />
                                        </div>
                                        <div className="cart-text col-md-5 d-flex align-items-center">
                                            <Link to={`/products/${item.product}`}>
                                                <h4>{item.name}</h4>
                                            </Link>
                                        </div>
                                        <div className="cart-qty col-md-2 col-sm-5 mt-md-5 mt-3 mt-md-0 d-flex flex-column justify-content-center">
                                            <h6 className="qty-info-container-flex">QUANTITY</h6>
                                            <div className="qty-info-container-flex">
                                                <div className="qty-handler" onClick={() => decreaseQty(item.product, item.qty)}>-</div>
                                                <input type="number" value={item.qty} disabled className="qty-input" />
                                                <div className="qty-handler" onClick={() => increaseQty(item.product, item.qty)}>+</div>
                                            </div>
                                        </div>
                                        <div className="cart-price mt-3 mt-md-0 col-md-2 align-items-sm-end align-items-start  d-flex flex-column justify-content-center col-sm-7">
                                            <h6>PRICE</h6>
                                            <h4>${item.price.toFixed(2)}</h4>
                                        </div>
                                    </div>
                                ))
                            }

                            <div className="total">
                                <span className="sub">total:</span>
                                <span className="total-price">${totalPrice}</span>
                            </div>
                            <hr />
                            <div className="cart-buttons d-flex align-items-center row">
                                <Link to="/" className="col-md-6 ">
                                    <button>Continue To Shopping</button>
                                </Link>
                                {
                                    userInfo && totalPrice > 0 ? (
                                        <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
                                            <button onClick={checkoutHandler}>Checkout</button>
                                        </div>
                                    ) : (
                                        <Link to="/login" className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
                                            <button>Log in to place order</button>
                                        </Link>
                                    )
                                }
                            </div>
                        </>
                    )
                }
            </div>
        </>
    );
};

export default CartScreen;
