import React from 'react'
import { Redirect, Route } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

function PrivateRouter({ component: Component, ...rest }) {
    
    const userLogged = useSelector((state) => state.userInitialData.data);
    // dodac w route czy ma token
    //jak nie to sprawdzamy czy userlogged - dodac populowanie user logged na login/register
    
    console.log(userLogged)

    return (
        <Route
            {...rest}
            component={(props) => {
                console.log(userLogged)
                if (userLogged) {
                    return <Component {...props} />
                } else {
                    return <Redirect to={"/login"} />
                }
            }}
        />
    )
}

export default PrivateRouter;