import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import { login } from './../Redux/Actions/UserActions';
import Message from './../components/LoadingError/Error';
import Loading from "../components/LoadingError/Loading";

const Login = ({ location, history }) => {
    window.scrollTo(0, 0);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [invalidFormDataError, setInvalidFormDataError] = useState("");

    const redirect = location.search ? location.search.split("=")[1] : "/";

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { error, loading, userInfo } = userLogin;

    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [userInfo, history, redirect])

    const submitHandler = (e) => {
        e.preventDefault();
        if (email.trim() === '' || password.trim() === '') {
            setInvalidFormDataError('Please fill all required data correctly.');
        } else {
            setInvalidFormDataError('');
            dispatch(login(email, password));
        }
    }

    return (
        <>
            <Header />
            <div className="container d-flex flex-column justify-content-center align-items-center login-center">
                {error && <Message variant="alert-danger">{error}</Message>}
                {invalidFormDataError && <Message variant="alert-danger">{invalidFormDataError}</Message>}
                {loading && <Loading />}

                <form className="Login col-md-8 col-lg-4 col-11" onSubmit={submitHandler}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <button type="submit">Login</button>
                    <p>
                        <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Create Account</Link>
                    </p>
                </form>
            </div>
        </>
    );
};

export default Login;
