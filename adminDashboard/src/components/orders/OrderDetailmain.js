import React, { useEffect } from "react";
import OrderDetailProducts from "./OrderDetailProducts";
import OrderDetailInfo from "./OrderDetailInfo";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, markOrderCancelled, markOrderDelivered } from "../../Redux/Actions/OrderActions";
import Loading from './../LoadingError/Loading';
import Message from './../LoadingError/Error';
import moment from 'moment';
import { ORDER_CANCEL_RESET, ORDER_DELIVERED_RESET } from "../../Redux/Constants/OrderConstants";

const OrderDetailmain = (props) => {

    const { orderId } = props;
    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.orderDetails);
    const { loading, error, order } = orderDetails;

    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDelivered, success: successDelivered, error: errorDelivered } = orderDeliver;

    const orderCancel = useSelector((state) => state.orderCancel);
    const { loading: loadingCancel, success: successCancel, error: errorCancelled } = orderCancel;

    useEffect(() => {
        dispatch(getOrderDetails(orderId))

        return () => {
            dispatch({ type: ORDER_CANCEL_RESET });
            dispatch({ type: ORDER_DELIVERED_RESET });
        }
    }, [dispatch, orderId, successDelivered, successCancel]);

    const deliveredHandler = () => {
        dispatch(markOrderDelivered(orderId));
    };

    const unDeliveredHandler = () => {
        if (window.confirm('Do you want to mark order as undelivered?')) {
            dispatch(markOrderDelivered(orderId));
        }
    };

    const cancelHandler = () => {
        if (window.confirm('Do you want to cancel order? This operation is irreversible.')) {
            dispatch(markOrderCancelled(orderId));
        }
    };

    return (
        <section className="content-main">
            <div className="content-header">
                <Link to="/orders" className="btn btn-dark text-white">
                    Back To Orders
                </Link>
            </div>
            {
                loading ? (
                    <Loading />
                ) : error ? (
                    <Message variant="alert-danger">{error}</Message>
                ) : (
                    <div className="card">
                        <header className="card-header p-3 Header-green">
                            <div className="row align-items-center ">
                                <div className="col-lg-6 col-md-6">
                                    <span>
                                        <i className="far fa-calendar-alt mx-2"></i>
                                        <b className="text-white">Created at: {moment(order.createdAt).format('HH:MM DD/MM/YYYY')}</b>
                                    </span>
                                    <br />
                                    <small className="text-white mx-3 ">
                                        Order ID: {order._id}
                                    </small>
                                </div>
                            </div>
                        </header>
                        <div className="card-body">
                            {/* Order info */}
                            <OrderDetailInfo order={order} />

                            <div className="row">
                                <div className="col-lg-9">
                                    <div className="table-responsive">
                                        <OrderDetailProducts order={order} loading={loading} />
                                    </div>
                                </div>
                                {/* Delivery and cancellation info */}
                                <div className="col-lg-3">
                                    {/* <div className="box shadow-sm bg-light">
                                        {
                                            order.isDelivered ? (
                                                <>
                                                    {
                                                        loadingDelivered && <Loading />
                                                    }
                                                    <button onClick={unDeliveredHandler} className="btn btn-success col-12">
                                                        Delivered at {" "} {moment(order.deliveredAt).format('DD/MM/YYYY')}
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {
                                                        loadingDelivered && <Loading />
                                                    }
                                                    <button onClick={deliveredHandler} className="btn btn-dark col-12">
                                                        MARK AS DELIVERED
                                                    </button>
                                                </>
                                            )
                                        }
                                    </div> */}
                                    {
                                        order.isDelivered && (
                                            <div className="box shadow-sm bg-light top-space">

                                                {
                                                    loadingDelivered && <Loading />
                                                }
                                                {
                                                    errorDelivered && <Message variant="alert-danger">{errorDelivered}</Message>
                                                }
                                                <button onClick={unDeliveredHandler} className="btn btn-success col-12">
                                                    Delivered at {" "} {moment(order.deliveredAt).format('DD/MM/YYYY')}
                                                </button>
                                            </div>
                                        )
                                    }

                                    {
                                        (!order.isDelivered && !order.isCancelled) && (
                                            <div className="box shadow-sm bg-light top-space">
                                                {
                                                    loadingDelivered && <Loading />
                                                }
                                                {
                                                    errorDelivered && <Message variant="alert-danger">{errorDelivered}</Message>
                                                }
                                                <button onClick={deliveredHandler} className="btn btn-dark col-12">
                                                    MARK AS DELIVERED
                                                </button>
                                            </div>
                                        )
                                    }

                                    {
                                        (!order.isDelivered && !order.isCancelled) && (
                                            <div className="box shadow-sm bg-light top-space">
                                                {
                                                    loadingCancel && <Loading />
                                                }
                                                {
                                                    errorCancelled && <Message variant="alert-danger">{errorCancelled}</Message>
                                                }
                                                <button onClick={cancelHandler} className="btn btn-cancel col-12">
                                                    CANCEL ORDER
                                                </button>
                                            </div>
                                        )
                                    }

                                    {
                                        order.isCancelled && (
                                            <div className="box shadow-sm bg-light top-space">
                                                <button disabled className="btn btn-dark col-12">
                                                    ORDER HAS BEEN CANCELED
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </section>
    );
};

export default OrderDetailmain;
