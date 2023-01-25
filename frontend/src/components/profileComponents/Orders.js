import React from "react";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { Link } from 'react-router-dom';
import moment from 'moment';
const Orders = (props) => {

    const { orders, loading, error } = props;

    return (
        <div className=" d-flex justify-content-center align-items-center flex-column">
            {
                loading ? (
                    <Loading />
                ) : error ? (
                    <Message variant="alert-danger">{error}</Message>
                ) : (
                    <>
                        {
                            orders.length === 0 ? (
                                <div className="col-12 alert alert-info text-center mt-3">
                                    No Orders
                                    <Link
                                        className="btn btn-success mx-2 px-3 py-2"
                                        to="/"
                                        style={{
                                            fontSize: "12px",
                                        }}
                                    >
                                        START SHOPPING
                                    </Link>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>STATUS</th>
                                                <th>CREATED AT</th>
                                                <th>TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                orders.map((order, index) => (
                                                    <tr className={`${order.isCancelled ? "alert-cancelled" : order.isPaid ? "alert-success" : "alert-danger"}`} key={order._id}>
                                                        <td>
                                                            <a href={`/order/${order._id}`} className="link">
                                                                {index + 1}
                                                            </a>
                                                        </td>
                                                        <td>{order.isCancelled ? <>Cancelled</> : order.isPaid ? <>Paid</> : <>Not paid</>}</td>
                                                        <td>{moment(order.createdAt).format('hh:mm DD/MM/YYYY')}</td>
                                                        <td>${(order.totalPrice).toFixed(2)}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }
                    </>
                )
            }

        </div>
    );
};

export default Orders;
