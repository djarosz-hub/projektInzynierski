import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { productCreateReviewReducer, productDetailsReducer, productListReducer } from './Reducers/ProductReducer';
import { cartReducer } from "./Reducers/CartReducer";
import { userDetailsReducer, userLoginReducer, userRegisterReducer, userUpdateProfileReducer } from "./Reducers/UserReducer";
import { orderCreateReducer, orderDetailsReducer, orderItemsValidationReducer, orderPaymentReducer, orderUserListReducer } from './Reducers/OrderReducer';
import { categoryListReducer } from './Reducers/CategoryReducer';

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
    orderValidation: orderItemsValidationReducer,
    categoryList: categoryListReducer,
});

const cartItemsFromLocalStorage = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];
const shippingInfoFromLocalStorage = localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")) : {};
const paymentMethodFromLocalStorage = localStorage.getItem("paymentMethod") ? JSON.parse(localStorage.getItem("paymentMethod")) : "";

const initialState = {
    cart: {
        cartItems: cartItemsFromLocalStorage,
        shippingAddress: shippingInfoFromLocalStorage,
        paymentMethod: paymentMethodFromLocalStorage
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