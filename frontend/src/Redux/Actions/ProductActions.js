import { PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL, PRODUCT_CREATE_REVIEW_REQUEST, PRODUCT_CREATE_REVIEW_SUCCESS, PRODUCT_CREATE_REVIEW_FAIL } from './../Constants/ProductConstants';
import axios from "axios";
import { logout } from './UserActions';

export const listProduct = (keyword = " ", pageNumber = " ") => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_LIST_REQUEST });

        const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`);

        dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });
        const { data } = await axios.get(`/api/products/${id}`);
        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
        console.log('data in details action')
        console.log(data)
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const createProductReview = (productId, review) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST });
        await axios.post(`/api/products/${productId}/review`, review);
        dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: PRODUCT_CREATE_REVIEW_FAIL,
            payload: message,
        });
    }
};