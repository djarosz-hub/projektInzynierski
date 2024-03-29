import { ORDER_COUNTCHECK_FAIL, ORDER_COUNTCHECK_REQUEST, ORDER_COUNTCHECK_RESET, ORDER_COUNTCHECK_SUCCESS, ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_RESET, ORDER_CREATE_SUCCESS, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_PAYMENT_FAIL, ORDER_PAYMENT_REQUEST, ORDER_PAYMENT_RESET, ORDER_PAYMENT_SUCCESS, ORDER_USER_LIST_FAIL, ORDER_USER_LIST_REQUEST, ORDER_USER_LIST_SUCCESS, ORDER_USER_LIST_RESET } from "../Constants/OrderConstants";

export const orderCreateReducer = (state = {}, action) => {
    switch (action.type) {

        case ORDER_CREATE_REQUEST:
            return { loading: true };

        case ORDER_CREATE_SUCCESS:
            return { loading: false, success: true, order: action.payload };

        case ORDER_CREATE_FAIL:
            return { loading: false, error: action.payload };

        case ORDER_CREATE_RESET:
            return {};

        default:
            return state;
    }
}

export const orderItemsValidationReducer = (state = {}, action) => {
    switch (action.type) {

        case ORDER_COUNTCHECK_REQUEST:
            return { loading: true };

        case ORDER_COUNTCHECK_SUCCESS:
            return { loading: false, success: true };

        case ORDER_COUNTCHECK_FAIL:
            return { loading: false, error: action.payload };

        case ORDER_COUNTCHECK_RESET:
            return {};

        default:
            return state;
    }
}

export const orderDetailsReducer = (state = { loading: true, orderItems: [], shippingAddress: {} }, action) => {
    switch (action.type) {

        case ORDER_DETAILS_REQUEST:
            return { ...state, loading: true };

        case ORDER_DETAILS_SUCCESS:
            return { loading: false, order: action.payload };

        case ORDER_DETAILS_FAIL:
            return { loading: false, error: action.payload, success: false };

        default:
            return state;
    }
}

export const orderPaymentReducer = (state = {}, action) => {
    switch (action.type) {

        case ORDER_PAYMENT_REQUEST:
            return { loading: true };

        case ORDER_PAYMENT_SUCCESS:
            return { loading: false, success: true };

        case ORDER_PAYMENT_FAIL:
            return { loading: false, error: action.payload };

        case ORDER_PAYMENT_RESET:
            return {};

        default:
            return state;
    }
}

export const orderUserListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {

        case ORDER_USER_LIST_REQUEST:
            return { loading: true };

        case ORDER_USER_LIST_SUCCESS:
            return { loading: false, orders: action.payload };

        case ORDER_USER_LIST_FAIL:
            return { loading: false, error: action.payload };

        case ORDER_USER_LIST_RESET:
            return { orders: [] };

        default:
            return state;
    }
}