import express from 'express';
import asyncHandler from 'express-async-handler';
import protect, { adminAccess } from '../Middleware/Auth.js';
import Order from './../Models/OrderModel.js';
import Product from './../Models/ProductModel.js';
import sendEmail from './../utils/mailer.js';

const orderRoute = express.Router();

//COMMON FUNCTIONS
const getProduct = (productId) => new Promise(resolve => resolve(Product.findById(productId)));

const updateProductInfo = (product) => new Promise(resolve => resolve(product.save()));

//ADMIN ROUTES
orderRoute.get("/all", protect, adminAccess, asyncHandler(async (req, res) => {
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

        await order.save();
        res.status(200).json({});
    } catch (e) {
        res.status(500);
        throw new Error("Internal Server error");
    }
}));

orderRoute.put("/:id/cancel", protect, adminAccess, asyncHandler(async (req, res) => {

    const orderId = req?.params?.id;
    if (!orderId) {
        res.status(400);
        throw new Error("Invalid order id");
    }

    let order = null;

    try {
        order = await Order.findById(orderId).populate("user", "email");;
    } catch (e) {
        res.status(500);
        throw new Error("Internal Server error");
    }

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    try {
        order.isCancelled = true;
        await order.save();
    } catch (e) {
        res.status(500);
        throw new Error("Internal Server error");
    }

    const updateProductStock = async () => {
        for (const item of order?.orderItems) {
            const product = await getProduct(item.product);

            product.countInStock += item.qty;
            product.totalSold -= item.qty;

            await updateProductInfo(product);
        }
    };

    try {
        await updateProductStock();
    } catch (e) {
        order.isCancelled = false;
        await order.save();
        res.status(500);
        throw new Error('Failed to cancel order');
    }

    //EMAIL SECTION
    let emailBody = 'We cancelled your order containing following items: \n';
    for (const item of order.orderItems) {
        emailBody += `- ${item.name} \n`;
    }
    emailBody += `If order was cancelled wrongly please contact us: ${process.env.EMAIL_SERVICE_USER}`;
    sendEmail('Order has been cancelled', emailBody, order.user.email);
    //EMAIL SECTION END

    res.status(200).json({})
}));

//ADMIN ROUTES END

//COMMON ROUTES
orderRoute.get("/:id", protect, asyncHandler(async (req, res) => {
    const requestOrderId = req.params.id;
    if (!requestOrderId) {
        res.status(400);
        throw new Error("Invalid order id.");
    }

    let order = null;
    try {
        order = await Order.findById(requestOrderId).populate("user", "name email");
    } catch (e) {
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
        throw new Error("Invalid order data");
    }

    const initialProductValues = {};

    const updateProductStock = async () => {
        for (const item of orderItems) {
            const product = await getProduct(item.product);

            if (product.countInStock < item.qty) {
                throw new Error();
            }

            initialProductValues[product._id] = {
                countInStock: product.countInStock,
                totalSold: product.totalSold
            }

            product.countInStock = product.countInStock - item.qty;
            product.totalSold += item.qty;
            await updateProductInfo(product);
        }
    };

    const backupProductStock = async () => {
        try {
            for (const productId in initialProductValues) {
                const product = await getProduct(productId);
                product.countInStock = initialProductValues[productId].countInStock;
                product.totalSold = initialProductValues[productId].totalSold;
                await updateProductInfo(product);
            }
        } catch (e) {
            res.status(500);
            throw new Error('Internal Server error');
        }
    }

    try {
        await updateProductStock();
    } catch (e) {
        await backupProductStock();
        res.status(500);
        throw new Error('Internal Server error')
    }

    let createdOrder = null;

    try {
        const order = new Order({ user: req.user._id, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice });
        createdOrder = await order.save();
    } catch (error) {
        await backupProductStock();
        res.status(500);
        throw new Error("Failed to create order.");
    }

    //EMAIL SECTION
    let emailBody = 'You ordered following items:\n';
    for (const item of orderItems) {
        emailBody += `- ${item.name} \n`;
    }
    emailBody += 'Please visit our shop and finalize order.\n';
    sendEmail('Order has been created', emailBody, req.user.email);
    //EMAIL SECTION END

    res.status(201).json(createdOrder);
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
    if (!orderId) {
        res.status(400);
        throw new Error('Invalid order id');
    }

    const { id, status, update_time } = req.body;
    const { email_address } = req.body.payer;

    if (!id || !status || !update_time || !email_address) {
        res.status(400);
        throw new Error('Invalid payment data');
    }

    let order = null;
    try {
        order = await Order.findById(req.params.id);
    } catch (error) {
        res.status(404);
        throw new Error("Order not found");
    };
    let updatedOrder = null;
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

            updatedOrder = await order.save();
        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(500);
        throw new Error('Internal server error');
    }

    //EMAIL SECTION
    let emailBody = 'We received information about processing payment for your order with following items: \n';
    for (const item of updatedOrder.orderItems) {
        emailBody += `- ${item.name} \n`;
    }
    emailBody += 'We will send your order as soon as we receive payment confirmation.\nGreetings!';
    sendEmail('Payment for your order is being processed', emailBody, req.user.email);
    //EMAIL SECTION END

    res.status(200).json(updatedOrder);
}));

//USER ROUTES END



export default orderRoute;