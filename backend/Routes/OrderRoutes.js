import express from 'express';
import asyncHandler from 'express-async-handler';
import protect, { adminAccess } from '../Middleware/Auth.js';
import Order from './../Models/OrderModel.js';

const orderRoute = express.Router();

orderRoute.post("/", protect, asyncHandler(async (req, res) => {

    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;
    console.log(orderItems)
    console.log(shippingAddress)
    console.log(paymentMethod)
    console.log(itemsPrice)
    console.log(shippingPrice)
    console.log(totalPrice)
    if (!orderItems || orderItems.length === 0 || !shippingAddress || !paymentMethod || !itemsPrice || !shippingPrice || !totalPrice) {
        res.status(400);
        throw new Error("Invalid order data.");
    }

    try {
        const order = new Order({ user: req.user._id, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice });
        const createOrder = await order.save();
        res.status(201).json(createOrder);
    } catch (error) {
        res.status(500);
        throw new Error("Failed to create order.");
    }
}));

orderRoute.get("/", protect, asyncHandler(async (req, res) => {
    try {
        const userOrders = await Order.find({ user: req.user.id }).sort({ _id: -1 });
        res.status(200).json(userOrders);
    } catch (e) {
        res.status(500);
        throw new Error("Failed to load user orders");
    }
}));

orderRoute.get("/all", protect, adminAccess, asyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ _id: -1 }).populate("user", "id name email");
    res.json(orders);
}));

orderRoute.get("/:id", protect, asyncHandler(async (req, res) => {
    const requestOrderId = req.params.id;
    if (!requestOrderId) {
        // console.log('wrong id');
        res.status(400);
        throw new Error("Invalid order id.");
    }

    let order = null;
    try {
        order = await Order.findById(requestOrderId).populate("user", "name email");
    } catch (e) {
        // console.log('error getting order')
        res.status(404);
        throw new Error("Order not found.");
    }

    if (order) {
        const userIdFromRequest = req.user.id;
        const userIdFromOrder = order.user.id;
        if (userIdFromRequest !== userIdFromOrder) {
            res.status(404);
            throw new Error("Order not found.");
        }
        res.status(200).json(order);
    } else {
        // console.log('not have order')
        res.status(500);
        throw new Error("Internal Server error.");
    }
}));

orderRoute.put("/:id/payment", protect, asyncHandler(async (req, res) => {

    const orderId = req.params.id;
    // const orderId = "";
    if (!orderId) {
        res.status(400);
        throw new Error('Invalid order id');
    }

    const { id, status, update_time } = req.body;
    const { email_address } = req.body.payer;
    // const { email_address } = '';
    if (!id || !status || !update_time || !email_address) {
        res.status(400);
        throw new Error('Invalid payment data');
    }

    let order = null;
    try {
        order = await Order.findById(req.params.id);
        // throw new Error();
    } catch (error) {
        res.status(404);
        throw new Error("Order not found");
    };

    try {
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: id,
                status: status,
                update_time: update_time,
                email_address: email_address,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);

        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(500);
        throw new Error('Internal server error');
    }
}));

orderRoute.put("/:id/delivered", protect, adminAccess, asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } else {
        res.status(404);
        throw new Error("Order not found.");
    }
}));

export default orderRoute;