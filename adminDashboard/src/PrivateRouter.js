import React from 'react'
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from './components/LoadingError/Loading';

function PrivateRouter({ component: Component, ...rest }) {
    const userLogin = useSelector((state) => state.userLogin);
    const { loading, userInfo } = userLogin;

    return (
        <Route
            {...rest}
            component={(props) =>
                loading ? (
                    <Loading />
                ) : userInfo?.isAdmin ? (
                    <Component {...props} />
                ) : (
                    <Redirect to='/login' />
                )
            }
        />
    )
}

export default PrivateRouter;