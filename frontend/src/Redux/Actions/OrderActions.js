import axios from 'axios';
import { ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_RESET, ORDER_DETAILS_SUCCESS, ORDER_PAYMENT_FAIL, ORDER_PAYMENT_REQUEST, ORDER_PAYMENT_SUCCESS, ORDER_USER_LIST_FAIL, ORDER_USER_LIST_REQUEST, ORDER_USER_LIST_SUCCESS } from './../Constants/OrderConstants';
import { CART_CLEAR_ITEMS } from './../Constants/CartConstants';
import { logout } from './UserActions';

export const createOrder = (order) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_CREATE_REQUEST });

        const { data } = await axios.post(`/api/orders`, order);
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
        dispatch({ type: CART_CLEAR_ITEMS, payload: data });
        localStorage.removeItem("cartItems");

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: message,
        });
    }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {

        dispatch({ type: ORDER_DETAILS_REQUEST });
        const { data } = await axios.get(`/api/orders/${id}`);
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: message,
        });
    }
};

export const payOrder = (orderId, paymentResult) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_PAYMENT_REQUEST });
        const { data } = await axios.put(`/api/orders/${orderId}/payment`, paymentResult);
        dispatch({ type: ORDER_PAYMENT_SUCCESS, payload: data });
        //check
        // dispatch({ type: ORDER_DETAILS_RESET });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_PAYMENT_FAIL,
            payload: message,
        });
    }
};

export const listUserOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_USER_LIST_REQUEST });
        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`/api/orders`, config);
        dispatch({ type: ORDER_USER_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (message === "Not authorized, token invalid") {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_USER_LIST_FAIL,
            payload: message,
        });
    }
};

