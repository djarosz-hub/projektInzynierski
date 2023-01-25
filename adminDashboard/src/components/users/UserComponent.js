import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { listUsers } from './../../Redux/Actions/UserActions';
import Loading from '../LoadingError/Loading.js';
import Message from '../LoadingError/Error.js';
import ReactPaginate from "react-paginate";


const UserComponent = () => {

    const [filterValue, setFilterValue] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);

    const pageSize = 10;

    const dispatch = useDispatch();
    const userList = useSelector((state) => state.userList);
    const { loading, error, users } = userList;

    useEffect(() => {
        dispatch(listUsers());
    }, [dispatch]);

    const filterHandler = (user) => {

        if (typeFilter) {
            if (typeFilter === "admin" && !user.isAdmin) {
                return false;
            }
            if (typeFilter === "user" && user.isAdmin) {
                return false;
            }
        }

        if (filterValue) {
            const filter = filterValue.trim().toLowerCase();
            const userNameIncludes = user.name.toLowerCase().includes(filter) ? true : false;
            const userEmailIncludes = user.email.toLowerCase().includes(filter) ? true : false;

            const result = userNameIncludes ? userNameIncludes : userEmailIncludes;
            return result;
        }

        return true;
    }

    const filteredUsers = users && users?.filter(user => filterHandler(user));
  
    const handlePageClick = (data) => {
        const selectedPage = data.selected; // actual value, not label so for first page value is 0
        setCurrentPage(selectedPage);
        window.scrollTo(0, 0);
    };

    const handleKeywordFilter = (keyword) => {
        setFilterValue(keyword);
        setCurrentPage(0);
    }

    const handleTypeFilter = (type) => {
        setTypeFilter(type)
        setCurrentPage(0);
    }

    return (
        <section className="content-main">
            <div className="content-header">
                <h2 className="content-title">Customers</h2>
                {/* for future implementation */}
                {/* <div>
                    <Link to="#" className="btn btn-primary">
                        <i className="material-icons md-plus"></i> Create new
                    </Link>
                </div> */}
            </div>

            <div className="card mb-4">
                <header className="card-header">
                    <div className="row gx-3">
                        <div className="col-lg-4 col-md-6 me-auto">
                            <input
                                type="text"
                                placeholder="Filter by user name or email..."
                                className="form-control"
                                value={filterValue}
                                onChange={(e) => handleKeywordFilter(e.target.value)}
                            />
                        </div>

                        <div className="col-lg-2 col-6 col-md-3">
                            <select className="form-select" value={typeFilter} onChange={(e) => handleTypeFilter(e.target.value)}>
                                <option value="">Type: all</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>
                </header>

                <div className="card-body">
                    {
                        loading ? (
                            <Loading />
                        ) : error ? (
                            <Message variant="alert-danger">{error}</Message>
                        ) : (
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
                                {
                                    filteredUsers.length && filteredUsers.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((user) => (
                                        <div className="col" key={user._id}>
                                            <div className="card card-user shadow-sm">
                                                <div className="card-header">
                                                    <img
                                                        className="img-md img-avatar"
                                                        src="images/favicon.png"
                                                        alt="User pic"
                                                    />
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title mt-5">{user.name}</h5>
                                                    <div className="card-text text-muted">
                                                        <p className="m-0">{user.isAdmin ? 'Admin' : 'Customer'}</p>
                                                        <p>
                                                            <a href={`mailto:${user.email}}`}>{user.email}</a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                    {
                        filteredUsers && filteredUsers.length > 0 && (
                            <ReactPaginate
                                previousLabel={'PREVIOUS'}
                                nextLabel={'NEXT'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={Math.ceil(filteredUsers?.length / pageSize)}
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
                        !loading && filteredUsers.length === 0 && (
                            <div className="centered">No items matching this criteria - choose another filter.</div>
                        )
                    }

                </div>
            </div>
        </section>
    );
};

export default UserComponent;
