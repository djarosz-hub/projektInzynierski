import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Toast from './../LoadingError/Toast';
import Message from './../LoadingError/Error';
import Loading from './../LoadingError/Loading';
import { toast } from "react-toastify";
import { updateProfile } from "../../Redux/Actions/UserActions";
import { USER_UPDATE_PROFILE_RESET } from "../../Redux/Constants/UserConstants";

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
        autoClose: 2000,
    }

    const dispatch = useDispatch();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { loading: updateLoading, error: errorUpdate } = userUpdateProfile;

    useEffect(() => {

        if (!toast.isActive(toastId.current) && !updateLoading && updateLoading != undefined) {
            if (errorUpdate) {
                toastId.current = toast.error("Profile updated failed", ToastObjects);
            } else {
                toastId.current = toast.success("Profile updated successfully", ToastObjects);
            }
        }

        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
        
        return () => {
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
        }
    }, [dispatch, user, errorUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (name.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("Invalid data.", ToastObjects);
            }
            return;
        }

        if (password !== confirmPassword) {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("Passwords are not matching", ToastObjects);
            }
            return;
        }

        dispatch(updateProfile({ name, password }))
        // if (!toast.isActive(toastId.current)) {
        //     toastId.current = toast.success("Profile updated successfully", ToastObjects);

        // }
    };

    return (
        <>
            <Toast />
            {error && <Message variant="alert-danger">{error}</Message>}
            {loading && <Loading />}
            {updateLoading && <Loading />}
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
                        <input className="form-control" type="email" value={email} readOnly disabled />
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
