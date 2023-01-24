import React, { useEffect, useState } from "react";
import Message from './../LoadingError/Error';
import Loading from './../LoadingError/Loading';
import { toast } from 'react-toastify';
import Toast from './../LoadingError/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { CATEGORY_CREATE_RESET } from './../../Redux/Constants/CategoryConstants';
import { createCategory, listCategories } from "../../Redux/Actions/CategoryActions";

const ToastObjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
};

const CreateCategory = () => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const dispatch = useDispatch();

    const categoryCreate = useSelector((state) => state.categoryCreate);
    const { loading, error, success } = categoryCreate;

    useEffect(() => {
        if (success) {
            toast.success("Category created", ToastObjects);
            dispatch({ type: CATEGORY_CREATE_RESET });
            dispatch(listCategories());
            setName("");
            setDescription("");
        }
    }, [dispatch, success]);

    useEffect(() => {
        return () => {
            dispatch({ type: CATEGORY_CREATE_RESET })
        }
    }, [dispatch])



    const submitHandler = (e) => {
        e.preventDefault();
        console.log('sub')

        if ((!name || name.trim() === "") ||
            (!description || description.trim() === "")) {

            toast.error("Invalid category data", ToastObjects);
        } else {
            dispatch(createCategory(name, description));
        }
    };

    return (
        <>
            <Toast />
            <div className="col-md-12 col-lg-4">
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label htmlFor="product_name" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="form-control py-3"
                            id="product_name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Description</label>
                        <textarea
                            placeholder="Type here"
                            className="form-control"
                            rows="4"
                            required
                            maxLength={30}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="d-grid">
                        {error && <Message variant="alert-danger">{error}</Message>}
                        {loading && <Loading />}
                        <button className="btn btn-primary py-3">Create category</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateCategory;
