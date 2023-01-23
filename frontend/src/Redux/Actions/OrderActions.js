import axios from 'axios';
import { ORDER_COUNTCHECK_FAIL, ORDER_COUNTCHECK_REQUEST, ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_PAYMENT_FAIL, ORDER_PAYMENT_REQUEST, ORDER_PAYMENT_SUCCESS, ORDER_USER_LIST_FAIL, ORDER_USER_LIST_REQUEST, ORDER_USER_LIST_SUCCESS, ORDER_COUNTCHECK_SUCCESS } from './../Constants/OrderConstants';
import { CART_CLEAR_ITEMS } from './../Constants/CartConstants';
import { logout } from './UserActions';

export const validateOrderItemsAvailability = (items) => async (dispatch) => {
    const productIds = [];
    const orderItemsCountObj = {};
    for (const item of items) {
        productIds.push(item.product);
        orderItemsCountObj[item.product] = {
            qty: item.qty,
            name: item.name
        }
    }
    // console.log(orderItemsCountObj['63a8d7c8a52bc205f3dbaf89'].name)
    // return;
    try {
        dispatch({ type: ORDER_COUNTCHECK_REQUEST });
        const { data } = await axios.post("/api/products/productCount", { productIds });
        let errorMessage = '';
        for (const productId of productIds) {
            if (data[productId] < orderItemsCountObj[productId].qty) {
                const itemName = orderItemsCountObj[productId].name;
                if(data[productId] === 0) {
                    errorMessage += `Item: ${itemName} is no more available. `;
                } else {
                    errorMessage += `Only ${data[productId]} pieces of following item: ${itemName} are available. `;
                }
            }
        }

        if (errorMessage) {
            errorMessage += 'Please align items count in cart and try again.';
            throw new Error(errorMessage);
        } else {
            dispatch({ type: ORDER_COUNTCHECK_SUCCESS });
        }
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_COUNTCHECK_FAIL,
            payload: message,
        });
    }
};

export const createOrder = (order) => async (dispatch) => {
    // console.log('createorder fired');
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
    console.log('getting details')
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

export const listUserOrders = () => async (dispatch) => {
    try {
        dispatch({ type: ORDER_USER_LIST_REQUEST });
        const { data } = await axios.get(`/api/orders`);
        dispatch({ type: ORDER_USER_LIST_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_USER_LIST_FAIL,
            payload: message,
        });
    }
};

