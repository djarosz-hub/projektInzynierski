import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from './Redux/store';
import { getInitialUserData } from './Redux/Actions/UserActions';


store.dispatch(getInitialUserData());

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
