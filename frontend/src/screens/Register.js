import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import { useDispatch, useSelector } from 'react-redux';
import { register } from "../Redux/Actions/UserActions";
import Message from './../components/LoadingError/Error';
import Loading from './../components/LoadingError/Loading';

const Register = ({ location, history }) => {
    window.scrollTo(0, 0);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [invalidFormDataError, setInvalidFormDataError] = useState("");

    const redirect = location.search ? location.search.split("=")[1] : "/";

    const dispatch = useDispatch();

    const userRegister = useSelector((state) => state.userRegister);
    const { error, loading, userInfo } = userRegister;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo: userInfoLogin } = userLogin;

    useEffect(() => {
        if (userInfo || userInfoLogin) {
            history.push(redirect)
        }
    }, [userInfo, userInfoLogin, history, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
            setInvalidFormDataError('Please fill all required data correctly.');
        } else {
            setInvalidFormDataError('');
            dispatch(register(name, email, password));
        }
    }

    return (
        <>
            <Header />
            <div className="container d-flex flex-column justify-content-center align-items-center login-center">
                {error && !invalidFormDataError && <Message variant="alert-danger">{error}</Message>}
                {invalidFormDataError && <Message variant="alert-danger">{invalidFormDataError}</Message>}
                {loading && <Loading />}
                <form className="Login col-md-8 col-lg-4 col-11" onSubmit={submitHandler}>
                    <input type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <button type="submit">Register</button>
                    <p>
                        <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                            I Have Account <strong>Login</strong>
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
};

export default Register;
