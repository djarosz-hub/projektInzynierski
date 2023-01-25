import React from "react";
import { useHistory } from "react-router-dom";
import Loading from './../LoadingError/Loading';
import Message from './../LoadingError/Error';
import moment from 'moment';

const LatestOrder = (props) => {

    const { loading, error, orders } = props;
    let history = useHistory();

    const showOrderHandler = (orderId) => {
        history.push(`/order/${orderId}`);
    };

    return (
        <div className="card-body">
            <h3 className="card-title">Latest orders</h3>
            {
                loading ? (
                    <Loading />
                ) : error ? (
                    <Message variant="alert-danger">{error}</Message>
                ) : (
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Paid</th>
                                    <th scope="col">Created at</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders?.length ? ((orders.slice(0, 5).map((order) => (
                                        <tr key={order._id} onClick={() => showOrderHandler(order._id)}>
                                            <td>
                                                <b>{order.user.name}</b>
                                            </td>
                                            <td>{order.user.email}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>
                                                {
                                                    order.isPaid ? (
                                                        <span className="badge rounded-pill alert-success">
                                                            Paid At {moment(order.paidAt).format('hh:mm DD/MM/YYYY')}
                                                        </span>
                                                    ) : (
                                                        <span className="badge rounded-pill alert-danger">
                                                            Not paid
                                                        </span>
                                                    )
                                                }
                                            </td>
                                            <td>{moment(order.createdAt).format('hh:mm DD/MM/YYYY')}</td>
                                            <td>
                                                {
                                                    order.isDelivered ? (
                                                        <span className="badge btn-success">Delivered</span>
                                                    ) : (
                                                        <span className="badge btn-dark">Not delivered</span>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    )))) : null
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div >
    );
};

export default LatestOrder;
