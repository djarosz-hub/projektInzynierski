import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { productCreateReviewReducer, productDetailsReducer, productListReducer } from './Reducers/ProductReducer';
import { cartReducer } from "./Reducers/CartReducer";
import { userDetailsReducer, userLoginReducer, userRegisterReducer, userUpdateProfileReducer } from "./Reducers/UserReducer";
import { orderCreateReducer, orderDetailsReducer, orderPaymentReducer, orderUserListReducer } from './Reducers/OrderReducer';

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productCreateReview: productCreateReviewReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPayment: orderPaymentReducer,
    orderUserList: orderUserListReducer,
});

const cartItemsFromLocalStorage = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];

const shippingInfoFromLocalStorage = localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")) : {};

const initialState = {
    cart: {
        cartItems: cartItemsFromLocalStorage,
        shippingAddress: shippingInfoFromLocalStorage
    },
    userLogin: { userInfo: null },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;