import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../Models/ProductModel.js';
import protect, { adminAccess } from './../Middleware/Auth.js';

const productRoute = express.Router();

productRoute.get("/", asyncHandler(async (req, res) => {

    const pageSize = 3;
    const page = Number(req.query.pageNumber) || 1;

    //todo
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: "i"
        }
    } : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1)).sort({ _id: -1 });

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
}));

// admin get all products
productRoute.get("/all", protect, adminAccess, asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ _id: -1 });
    res.json(products);
}));


productRoute.get("/:id", asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product not Found");
    }

}));

productRoute.post("/:id/review", protect, asyncHandler(async (req, res) => {

    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            res.status(400);
            throw new Error("Product already reviewed.");
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment: comment,
            user: req.user._id
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: "Review added." });

    } else {
        res.status(404);
        throw new Error("Product not found.");
    }

}));

productRoute.delete("/:id", protect, adminAccess, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.remove();
        res.json({ message: "Product deleted." });
    } else {
        res.status(404);
        throw new Error("Product not Found.");
    }

}));

productRoute.post("/", protect, adminAccess, asyncHandler(async (req, res) => {
    const { name, price, description, image, countInStock } = req.body;
    const productExists = await Product.findOne({ name });

    if (productExists) {
        res.status(400);
        throw new Error("Product with this name already exists.");
    } else {
        const product = new Product({
            name,
            price,
            description,
            image,
            countInStock,
            user: req.user._id
        });

        if (product) {
            const createdProduct = await product.save();
            res.status(201).json(createdProduct);
        } else {
            res.status(400);
            throw new Error("Product creation failed.");
        }
    }
}));

productRoute.put("/:id", protect, adminAccess, asyncHandler(async (req, res) => {
    const { name, price, description, image, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.countInStock = countInStock || product.countInStock;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("Invalid product.");
    }
}));

export default productRoute;