import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Loading from './../LoadingError/Loading';
import Message from './../LoadingError/Error';
import { listCategories } from "../../Redux/Actions/CategoryActions";

const CategoriesTable = () => {

    const dispatch = useDispatch();

    const categoryList = useSelector((state) => state.categoryList);
    const { loading, error, categories } = categoryList;

    useEffect(() => {
        // console.log(categories)
        dispatch(listCategories());
    }, [dispatch]);

    return (
        <div className="col-md-12 col-lg-8">
            {error && (<Message variant="alert-danger">{error}</Message>)}
            {loading && (<Loading />)}
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" />
                            </div>
                        </th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th className="text-end">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories?.map((category, index) => (
                        <tr key={category._id}>
                            <td>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" />
                                </div>
                            </td>
                            <td>{index + 1}</td>
                            <td>
                                <b>{category.name}</b>
                            </td>
                            <td>{category.description}</td>
                            <td className="text-end">
                                <div className="dropdown">
                                    <Link
                                        to="#"
                                        data-bs-toggle="dropdown"
                                        className="btn btn-light"
                                    >
                                        <i className="fas fa-ellipsis-h"></i>
                                    </Link>
                                    <div className="dropdown-menu">
                                        <Link className="dropdown-item" to="#">
                                            Edit info
                                        </Link>
                                        <Link className="dropdown-item text-danger" to="#">
                                            Delete
                                        </Link>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoriesTable;
