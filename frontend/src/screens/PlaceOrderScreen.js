import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import { useDispatch, useSelector } from 'react-redux';
import Message from './../components/LoadingError/Error';
import { ORDER_COUNTCHECK_RESET, ORDER_CREATE_RESET } from "../Redux/Constants/OrderConstants";
import { createOrder, validateOrderItemsAvailability } from "../Redux/Actions/OrderActions";
import Loading from "../components/LoadingError/Loading";

const PlaceOrderScreen = () => {
    window.scrollTo(0, 0);

    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderValidation = useSelector((state) => state.orderValidation);
    const { loading: loadingValidation, error: errorValidation, success: successValidation } = orderValidation;

    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, success, error } = orderCreate;

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };
    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2)
    );

    cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2);
    cart.totalPrice = (+cart.itemsPrice + +cart.shippingPrice).toFixed(2);

    useEffect(() => {
        // console.log('effect 1')
        // console.log(`${successValidation} ${order} ${successValidation}`)
        // if (successValidation) {
        //     console.log('success validation')
        //     dispatch(createOrder({
        //         orderItems: cart.cartItems,
        //         shippingAddress: cart.shippingAddress,
        //         paymentMethod: cart.paymentMethod,
        //         itemsPrice: cart.itemsPrice,
        //         shippingPrice: cart.shippingPrice,
        //         totalPrice: cart.totalPrice,
        //     }));
        // }
        if (success) {
            // console.log('succes created')
            // history.push(`/order/${order._id}`);
            window.location.assign(`/order/${order._id}`);
            // dispatch({ type: ORDER_CREATE_RESET });
        }
        return () => {
            dispatch({ type: ORDER_CREATE_RESET })
        }
        // }, [dispatch, success, order, history, successValidation]);
    }, [dispatch, success]);

    useEffect(() => {
        // console.log('effect 2')
        if (successValidation) {
            // console.log('success validation')
            dispatch(createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                totalPrice: cart.totalPrice,
            }));
        }
        return () => {
            // console.log('reset countcheck')
            dispatch({ type: ORDER_COUNTCHECK_RESET })
        }
    }, [dispatch, successValidation]);

    const placeOrderHandler = (e) => {
        e.preventDefault();
        dispatch(validateOrderItemsAvailability(cart.cartItems));
        // dispatch(createOrder({
        //     orderItems: cart.cartItems,
        //     shippingAddress: cart.shippingAddress,
        //     paymentMethod: cart.paymentMethod,
        //     itemsPrice: cart.itemsPrice,
        //     shippingPrice: cart.shippingPrice,
        //     totalPrice: cart.totalPrice,
        // }));
    };

    return (
        <>
            <Header />
            <div className="container">
                <div className="row  order-detail">
                    <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                        <div className="row ">
                            <div className="col-md-4 center">
                                <div className="alert-success order-box">
                                    <i className="fas fa-user"></i>
                                </div>
                            </div>
                            <div className="col-md-8 center">
                                <h5>
                                    <strong>Customer</strong>
                                </h5>
                                <p>{userInfo.name}</p>
                                <p>{userInfo.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                        <div className="row">
                            <div className="col-md-4 center">
                                <div className="alert-success order-box">
                                    <i className="fas fa-truck-moving"></i>
                                </div>
                            </div>
                            <div className="col-md-8 center">
                                <h5>
                                    <strong>Order info</strong>
                                </h5>
                                <p>Shipping: {cart.shippingAddress.country}</p>
                                <p>Pay method: {cart.paymentMethod}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                        <div className="row">
                            <div className="col-md-4 center">
                                <div className="alert-success order-box">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                            </div>
                            <div className="col-md-8 center">
                                <h5>
                                    <strong>Deliver to:</strong>
                                </h5>
                                <p className="mb-1">
                                    {cart.shippingAddress.address}
                                    <br />
                                    {cart.shippingAddress.postalCode} {cart.shippingAddress.city}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row order-products justify-content-between">
                    <div className="col-lg-8">
                        <div style={{ marginTop: "10px" }}>
                            {errorValidation && <Message variant="alert-danger">{errorValidation}</Message>}
                            {loadingValidation && <Loading />}
                        </div>

                        {
                            cart.cartItems.length === 0 ? (
                                <Message variant="alert-info mt-5">Your cart is empty</Message>
                            ) : (
                                <>
                                    {
                                        cart.cartItems.map((item, index) => (
                                            <div key={index} className="order-product row">
                                                <div className="col-md-3 col-6">
                                                    <img src={item?.images[0]} alt={item?.name} />
                                                </div>
                                                <div className="col-md-5 col-6 d-flex align-items-center">
                                                    <Link to={`/products/${item.product}`}>
                                                        <h6>{item.name}</h6>
                                                    </Link>
                                                </div>
                                                <div className="mt-3 mt-md-0 col-md-2 col-6  d-flex align-items-center flex-column justify-content-center ">
                                                    <h4>QUANTITY</h4>
                                                    <h6>{item.qty}</h6>
                                                </div>
                                                <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center ">
                                                    <h4>SUBTOTAL</h4>
                                                    <h6>${(item.qty * item.price).toFixed(2)}</h6>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </>
                            )
                        }

                    </div>
                    <div className="col-lg-3 d-flex align-items-end flex-column mt-5 subtotal-order">
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Products</strong>
                                    </td>
                                    <td>${cart.itemsPrice}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Shipping</strong>
                                    </td>
                                    <td>${cart.shippingPrice}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Total</strong>
                                    </td>
                                    <td>${cart.totalPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                        {cart.cartItems.length === 0 ? null : (
                            <button type="submit" onClick={placeOrderHandler}>PLACE ORDER</button>
                        )}

                        {error && (
                            <div className="my-3 col-12">
                                <Message variant="alert-danger">{error}</Message>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlaceOrderScreen;
