import React from 'react'
import { Redirect, Route } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Loading from './components/LoadingError/Loading';

function PrivateRouter({ component: Component, ...rest }) {

    // console.log('sel' + selectors)
    // const dispatch = useDispatch();

    // const userInitial = useSelector((state) => state.userInitialData);
    // const { loading: loadingInitial, userInfo: initialUserInfo } = userInitial;

    // console.log('initial')
    // console.log(initialUserInfo)
    // console.log(userLogged)
    // dodac w route czy ma token
    //jak nie to sprawdzamy czy userlogged - dodac populowanie user logged na login/register
    const userLogin = useSelector((state) => state.userLogin);
    const { loading, userInfo } = userLogin;
    // console.log('userInfo')
    // console.log(userInfo)
    // useEffect(() => {
    //     console.log('effect loading')
    //     console.log(loadingInitial)
    //     console.log('effect initial')
    //     console.log(initialUserInfo)
    // }, [dispatch, loading, userInfo])
    //loadingInitial, initialUserInfo
    return (
        <Route
            {...rest}
            render={props =>
                loading ? (
                    <Loading />
                ) : userInfo ? (
                    <Component {...props} />
                ) : (
                    <Redirect to='/login' />
                )
            }
        />
    );

    // return (
    //     <Route
    //         {...rest}
    //         component={(props) => {
    //             loading ? (
    //                 <Loading />
    //             ) : initial ? (
    //                 <Component {...props} />
    //             ) : (
    //                 <Redirect to='/login' />
    //             )


    //             // console.log(userLogged)
    //             // if (userInfo) {
    //             //     return <Component {...props} />
    //             // } else {
    //             //     return <Redirect to={"/login"} />
    //             // }
    //         }}
    //     />
    // )
}

export default PrivateRouter;