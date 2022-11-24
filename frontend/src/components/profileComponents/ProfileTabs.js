import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Toast from './../LoadingError/Toast';
import Message from './../LoadingError/Error';
import Loading from './../LoadingError/Loading';
import { toast } from "react-toastify";

const ProfileTabs = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const toastId = React.useRef(null);
    const ToastObjects = {
        pauseOnFocusLoss: false,
        draggable: false,
        pauseOnHover: false,
        autoClose: 3000,
    }

    const dispatch = useDispatch();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [dispatch, user]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toastId.current = toast.error("Passwords are not matching", ToastObjects);
        } else {
            alert('git')
        }
    };

    return (
        <>
            <Toast />
            {error && <Message variant="alert-danger">{error}</Message>}
            {loading && <Loading />}
            <form className="row  form-container" onSubmit={submitHandler}>
                <div className="col-md-6">
                    <div className="form">
                        <label for="account-fn">UserName</label>
                        <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form">
                        <label for="account-email">E-mail Address</label>
                        <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form">
                        <label for="account-pass">New Password</label>
                        <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form">
                        <label for="account-confirm-pass">Confirm Password</label>
                        <input className="form-control" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </>
    );
};

export default ProfileTabs;
