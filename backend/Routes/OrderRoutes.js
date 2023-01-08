import express from 'express';
import asyncHandler from 'express-async-handler';
import protect, { adminAccess } from '../Middleware/Auth.js';
import Order from './../Models/OrderModel.js';

const orderRoute = express.Router();

orderRoute.post("/", protect, asyncHandler(async (req, res) => {

    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("Invalid order - no items.");
    } else {
        const order = new Order({ user: req.user._id, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice });

        const createOrder = await order.save();
        res.status(201).json(createOrder)
    }
}));

orderRoute.get("/", protect, asyncHandler(async (req, res) => {
    const userOrders = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(userOrders);
}));

orderRoute.get("/all", protect, adminAccess, asyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ _id: -1 }).populate("user", "id name email");
    res.json(orders);
}));

orderRoute.get("/:id", protect, asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found.");
    }
}));

orderRoute.put("/:id/payment", protect, asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } else {
        res.status(404);
        throw new Error("Order not found.");
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