import React, { useEffect } from "react";
import OrderDetailProducts from "./OrderDetailProducts";
import OrderDetailInfo from "./OrderDetailInfo";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, markOrderDelivered } from "../../Redux/Actions/OrderActions";
import Loading from './../LoadingError/Loading';
import Message from './../LoadingError/Error';
import moment from 'moment';

const OrderDetailmain = (props) => {

    const { orderId } = props;
    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.orderDetails);
    const { loading, error, order } = orderDetails;

    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDelivered, success: successDelivered } = orderDeliver;

    useEffect(() => {
        dispatch(getOrderDetails(orderId))
    }, [dispatch, orderId, successDelivered]);

    const deliveredHandler = () => {
        dispatch(markOrderDelivered(order));
    }

    const unDeliveredHandler = () => {
        if (window.confirm('Do you want to mark order as undelivered?')) {
            dispatch(markOrderDelivered(order));
        }
    }

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
                                        <b className="text-white">{moment(order.createdAt).calendar()}</b>
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
                                {/* Payment Info */}
                                <div className="col-lg-3">
                                    <div className="box shadow-sm bg-light">
                                        {
                                            order.isDelivered ? (
                                                <>
                                                    {
                                                        loadingDelivered && <Loading />
                                                    }
                                                <button onClick={unDeliveredHandler} className="btn btn-success col-12">
                                                    Delivered: {" "} {moment(order.deliveredAt).calendar('DD/MM/YYYY')}
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
                                    </div>
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
