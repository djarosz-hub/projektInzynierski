import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userListReducer, userLoginReducer } from './Reducers/UserReducer';
import { productCreateReducer, productDeleteReducer, productEditReducer, productListReducer, productUpdateReducer } from './Reducers/ProductReducer';
import { orderCancelReducer, orderDeliveredReducer, orderDetailsReducer, orderListReducer } from './Reducers/OrderReducer';
import { categoryCreateReducer, categoryListReducer } from "./Reducers/CategoryReducer";

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
    orderCancel: orderCancelReducer,
    categoryList: categoryListReducer,
    categoryCreate: categoryCreateReducer
});

const initialState = {
    userLogin: { userInfo: null },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;