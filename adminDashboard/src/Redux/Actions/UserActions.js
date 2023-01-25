import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT, USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL, USER_LIST_RESET } from './../Constants/UserConstants';
import axios from 'axios';
import { toast } from "react-toastify";
import { PRODUCT_CREATE_RESET, PRODUCT_UPDATE_RESET } from '../Constants/ProductConstants';
import { CATEGORY_CREATE_RESET } from '../Constants/CategoryConstants';

export const getInitialUserData = () => {
    return async dispatch => {
        try {
            dispatch({ type: USER_LOGIN_REQUEST });
            const { data } = await axios.get(`/api/users/initialUserData`);
            
            if (!data || (data && !data.isAdmin)) {
                throw new Error();
            }
            dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        }
        catch (e) {
            dispatch({ type: USER_LOGIN_FAIL })
        }
    }
};

export const logout = () => (dispatch) => {
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_LIST_RESET });
    dispatch({ type: PRODUCT_CREATE_RESET });
    dispatch({ type: PRODUCT_UPDATE_RESET });
    dispatch({ type: CATEGORY_CREATE_RESET });
    fetch(`/api/users/logout`);
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

export const listUsers = () => async (dispatch) => {

    try {
        dispatch({ type: USER_LIST_REQUEST });
        const { data } = await axios.get(`/api/users`);
        dispatch({ type: USER_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }

        dispatch({
            type: USER_LIST_FAIL,
            payload: message,
        });
    }
};