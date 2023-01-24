import axios from "axios";

import { logout } from "./UserActions";
import { CATEGORY_LIST_REQUEST, CATEGORY_LIST_SUCCESS, CATEGORY_LIST_FAIL, CATEGORY_CREATE_REQUEST, CATEGORY_CREATE_SUCCESS, CATEGORY_CREATE_FAIL } from './../Constants/CategoryConstants';

export const listCategories = () => async (dispatch) => {
    try {
        // console.log('try list categories')
        dispatch({ type: CATEGORY_LIST_REQUEST });
        const { data } = await axios.get(`/api/categories/all`);
        dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data });
    } catch (error) {
        console.log('error categories list')
        console.log(error)
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: CATEGORY_LIST_FAIL,
            payload: message,
        });
    }
};

export const createCategory = (name, description) => async (dispatch) => {
    // console.log('create category fired');
    try {
        dispatch({ type: CATEGORY_CREATE_REQUEST });
        const { data } = await axios.post(`/api/categories`, { name, description });
        dispatch({ type: CATEGORY_CREATE_SUCCESS, payload: data });
    } catch (error) {
        // console.log('create category fail')
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: CATEGORY_CREATE_FAIL,
            payload: message,
        });
    }
};