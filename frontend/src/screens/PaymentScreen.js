import React, { useState } from "react";
import Header from "./../components/Header";
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from "../Redux/Actions/CartActions";
import { toast } from "react-toastify";
import Toast from './../components/LoadingError/Toast';


const PaymentScreen = ({ history }) => {
    window.scrollTo(0, 0);

    const toastId = React.useRef(null);
    const ToastObjects = {
        pauseOnFocusLoss: false,
        draggable: false,
        pauseOnHover: false,
        autoClose: 2000,
    }

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    if (!shippingAddress) {
        history.push("/shipping")
    }
    
    const [paymentMethod, setPaymentMethod] = useState("PayPal");

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        if (paymentMethod.trim() === '') {
            if (!toast.isActive(toastId.current)) {
                toastId.current = toast.error("Invalid payment method.", ToastObjects);
            }
            return;
        }

        dispatch(savePaymentMethod(paymentMethod));
        history.push("/placeorder");
    };

    return (
        <>
            <Toast />
            <Header />
            <div className="container d-flex justify-content-center align-items-center login-center">
                <form
                    className="Login2 col-md-8 col-lg-4 col-11"
                    onSubmit={submitHandler}
                >
                    <h6>SELECT PAYMENT METHOD</h6>
                    <div className="payment-container">
                        <div className="radio-container">
                            <input className="form-check-input" checked type="radio" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
                            <label className="form-check-label">PayPal or Credit Card</label>
                        </div>
                    </div>

                    <button type="submit">Continue</button>
                </form>
            </div>
        </>
    );
};

export default PaymentScreen;
