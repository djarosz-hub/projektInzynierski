import express from 'express';
import asyncHandler from 'express-async-handler';
import protect, { adminAccess } from '../Middleware/Auth.js';
import Order from './../Models/OrderModel.js';

const orderRoute = express.Router();



//ADMIN ROUTES
orderRoute.get("/all", protect, adminAccess, asyncHandler(async (req, res) => {
    console.log('get');
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).collation({ locale: "en", caseLevel: true }).populate("user", "id name email");
        res.status(200).json(orders);
    } catch (e) {
        res.status(500);
        throw new Error('Internal Server error');
    }
}));

orderRoute.put("/:id/delivered", protect, adminAccess, asyncHandler(async (req, res) => {

    const orderId = req?.params?.id;
    if (!orderId) {
        res.status(400);
        throw new Error("Invalid order id");
    }

    let order = null;

    try {
        order = await Order.findById(orderId);
    } catch (e) {
        res.status(500);
        throw new Error("Internal Server error");
    }

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    try {
        order.isDelivered = !order?.isDelivered;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (e) {
        res.status(500);
        throw new Error("Internal Server error");
    }
}));

//ADMIN ROUTES END

//COMMON ROUTES
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
        const userIdFromRequest = req?.user?.id;
        const userIdFromOrder = order?.user?.id;
        const isAdmin = req?.user?.isAdmin;
        if (userIdFromRequest !== userIdFromOrder && !isAdmin) {
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

//COMMON ROUTES END

//USER ROUTES
orderRoute.post("/", protect, asyncHandler(async (req, res) => {

    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

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
        const userOrders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).collation({ locale: "en", caseLevel: true });
        res.status(200).json(userOrders);
    } catch (e) {
        res.status(500);
        throw new Error("Failed to load user orders");
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

//USER ROUTES END



export default orderRoute;