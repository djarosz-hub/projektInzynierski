import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userListReducer, userLoginReducer } from './Reducers/UserReducer';
import { productCreateReducer, productDeleteReducer, productEditReducer, productListReducer, productUpdateReducer } from './Reducers/ProductReducer';
import { orderDeliveredReducer, orderDetailsReducer, orderListReducer } from './Reducers/OrderReducer';

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userList: userListReducer,
    productList: productListReducer,
    productCreate: productCreateReducer,
    productEdit: productEditReducer,
    productUpdate: productUpdateReducer,
    productDelete: productDeleteReducer,
    orderList: orderListReducer,
    orderDetails: orderDetailsReducer,
    orderDeliver: orderDeliveredReducer,
});

const userInfoFromLocalStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

const initialState = {
    userLogin: { userInfo: userInfoFromLocalStorage },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;