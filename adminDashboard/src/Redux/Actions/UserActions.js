import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT, USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL, USER_LIST_RESET } from './../Constants/UserConstants';
import axios from 'axios';
import { toast } from "react-toastify";

export const getInitialUserData = () => {
    return async dispatch => {
        try {
            dispatch({ type: USER_LOGIN_REQUEST });
            const { data } = await axios.get(`/api/users/initialUserData`);
            console.log('data in initial action: ')
            console.log(data);
            if (!data) {
                throw new Error();
            }
            dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        }
        catch (e) {
            console.log(e)
            dispatch({ type: USER_LOGIN_FAIL })
        }
    }
};

export const login = (email, password) => async (dispatch) => {

    const ToastObjects = {
        pauseOnFocusLoss: false,
        draggable: false,
        pauseOnHover: false,
        autoClose: 2000,
    }

    try {
        dispatch({ type: USER_LOGIN_REQUEST });
        const { data } = await axios.post(`/api/users/login`, { email, password });

        if (!data?.isAdmin) {
            toast.error("Unauthorized user", ToastObjects);
            dispatch({ type: USER_LOGIN_FAIL });
        } else {
            dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        }
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: message,
        });
    }
};

export const logout = () => (dispatch) => {
    // localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_LIST_RESET });
    fetch(`/api/users/logout`);
    // document.location.href = "/login";
};

export const listUsers = () => async (dispatch, getState) => {

    try {
        dispatch({ type: USER_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/users`, config);
        dispatch({ type: USER_LIST_SUCCESS, payload: data });

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === "Not authorized, token invalid") {
            dispatch(logout());
        }
        dispatch({
            type: USER_LIST_FAIL,
            payload: message,
        });
    }
};