import React, { useEffect, useState } from "react";
import Orders from "./Orders";
import { useDispatch, useSelector } from 'react-redux';
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import { listOrders } from "../../Redux/Actions/OrderActions";
import ReactPaginate from "react-paginate";

const OrderMain = () => {

    const [filterValue, setFilterValue] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");

    const pageSize = 20;

    const dispatch = useDispatch();

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;

    useEffect(() => {
        dispatch(listOrders());
    }, [dispatch]);

    const filterHandler = (order) => {
        console.log('status filter: ' + statusFilter)
        console.log('keyword filter: ' + filterValue);

        if (statusFilter) {
            if (statusFilter === "paid" && !order.isPaid) {
                return false;
            }
            if (statusFilter === "notPaid" && order.isPaid) {
                return false;
            }
            if (statusFilter === "delivered" && !order.isDelivered) {
                return false;
            }
            if (statusFilter === "notDelivered" && order.isDelivered) {
                return false;
            }
            if (statusFilter === "cancelled" && !order.isCancelled) {
                return false;
            }
        }

        if (filterValue) {
            // console.log('filvalue: ' + filterValue)
            const filter = filterValue.trim().toLowerCase();
            const orderUserNameIncludes = order.user.name.toLowerCase().includes(filter) ? true : false;
            const orderUserEmailIncludes = order.user.email.toLowerCase().includes(filter) ? true : false;
            const result = orderUserNameIncludes ? orderUserNameIncludes : orderUserEmailIncludes;
            return result;
        }

        return true;
    }

    const filteredOrders = orders && orders?.filter(order => filterHandler(order));
    console.log(filteredOrders)
    const handlePageClick = (data) => {
        const selectedPage = data.selected; // actual value, not label so for first page value is 0
        setCurrentPage(selectedPage);
        window.scrollTo(0, 0);
    };

    const handleKeywordFilter = (keyword) => {
        setFilterValue(keyword);
        setCurrentPage(0);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status)
        setCurrentPage(0);
    };

    return (
        <section className="content-main">
            <div className="content-header">
                <h2 className="content-title">Orders</h2>
            </div>

            <div className="card mb-4 shadow-sm">
                <header className="card-header bg-white">
                    <div className="row gx-3 py-3">
                        <div className="col-lg-4 col-md-6 me-auto">
                            <input
                                type="text"
                                placeholder="Filter by user name or email..."
                                className="form-control p-2"
                                value={filterValue}
                                onChange={(e) => handleKeywordFilter(e.target.value)}
                            />
                        </div>
                        <div className="col-lg-2 col-6 col-md-3">
                            <select className="form-select" value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)}>
                                <option value="">Show all</option>
                                <option value="paid">Paid</option>
                                <option value="notPaid">Not paid</option>
                                <option value="delivered">Delivered</option>
                                <option value="notDelivered">Not delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        {/* for future implementation */}
                        {/* <div className="col-lg-2 col-6 col-md-3">
                            <select className="form-select">
                                <option>Show 20</option>
                                <option>Show 30</option>
                                <option>Show 40</option>
                            </select>
                        </div> */}
                    </div>
                </header>
                <div className="card-body">
                    <div className="table-responsive">
                        {
                            loading ? (
                                <Loading />
                            ) : error ? (
                                <Message variant="alert-danger">{error}</Message>
                            ) : (
                                <Orders orders={filteredOrders} currentPage={currentPage} pageSize={pageSize} />
                            )
                        }
                        {
                            filteredOrders && filteredOrders.length > 0 && (
                                <ReactPaginate
                                    previousLabel={'PREVIOUS'}
                                    nextLabel={'NEXT'}
                                    breakLabel={'...'}
                                    breakClassName={'break-me'}
                                    pageCount={Math.ceil(filteredOrders?.length / pageSize)}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    initialPage={0}
                                    forcePage={currentPage}
                                    onPageChange={handlePageClick}
                                    containerClassName={'pagination'}
                                    activeClassName={'active-page'}
                                />)
                        }
                        {
                            !loading && filteredOrders.length === 0 && (
                                <div className="centered">No items matching this criteria - choose another filter.</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderMain;
