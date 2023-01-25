import React from "react";
import { useHistory } from "react-router-dom";
import moment from 'moment';

const Orders = (props) => {

    const { orders, pageSize, currentPage } = props;
    let history = useHistory();

    const showOrderHandler = (orderId) => {
        history.push(`/order/${orderId}`);
    };
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Total</th>
                    <th scope="col">Paid</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                {
                    orders.length && orders.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((order) => (
                        <tr key={order._id} onClick={() => showOrderHandler(order._id)} className={order.isCancelled ? "cancelled-order" : ""}>
                            <td>
                                <b>{order.user.name}</b>
                            </td>
                            <td>{order.user.email}</td>
                            <td>${order.totalPrice.toFixed(2)}</td>
                            <td>
                                {
                                    order.isPaid ? (
                                        <span className="badge rounded-pill alert-success">
                                            Paid at {moment(order.paidAt).format('hh:mm DD/MM/YYYY')}
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
                    ))
                }
            </tbody>
        </table>
    );
};

export default Orders;
