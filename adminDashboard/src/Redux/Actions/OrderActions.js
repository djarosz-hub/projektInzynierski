import { ORDER_CANCEL_FAIL, ORDER_CANCEL_REQUEST, ORDER_CANCEL_SUCCESS, ORDER_DELIVERED_FAIL, ORDER_DELIVERED_REQUEST, ORDER_DELIVERED_SUCCESS, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_LIST_FAIL, ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS } from "../Constants/OrderConstants";
import axios from 'axios';
import { logout } from "../Actions/UserActions";

export const listOrders = () => async (dispatch) => {

    try {
        console.log('try orders')
        dispatch({ type: ORDER_LIST_REQUEST });
        const { data } = await axios.get(`/api/orders/all`);
        dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
    } catch (error) {
        console.log(error)
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: message,
        });
    }
};

export const getOrderDetails = (id) => async (dispatch) => {
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

export const markOrderDelivered = (orderId) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_DELIVERED_REQUEST });
        await axios.put(`/api/orders/${orderId}/delivered`);
        dispatch({ type: ORDER_DELIVERED_SUCCESS });
        // dispatch({ type: ORDER_DELIVERED_SUCCESS, payload: data });

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_DELIVERED_FAIL,
            payload: message,
        });
    }
};

export const markOrderCancelled = (orderId) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_CANCEL_REQUEST });
        await axios.put(`/api/orders/${orderId}/cancel`);
        dispatch({ type: ORDER_CANCEL_SUCCESS });

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_CANCEL_FAIL,
            payload: message,
        });
    }
};