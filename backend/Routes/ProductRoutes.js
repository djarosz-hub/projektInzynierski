import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../Models/ProductModel.js';
import protect, { adminAccess } from './../Middleware/Auth.js';

const productRoute = express.Router();

//ADMIN ROUTES
productRoute.get("/all", protect, adminAccess, asyncHandler(async (req, res) => {
    console.log('all products get')
    try {
        const products = await Product.find({}).sort({ name: 1 }).collation({ locale: "en", caseLevel: true });
        res.json(products);
    } catch (e) {
        res.status(500);
        throw new Error("Products loading error");
    }
}));

productRoute.delete("/:id", protect, adminAccess, asyncHandler(async (req, res) => {

    const productId = req?.params?.id;
    if (!productId) {
        res.status(404);
        throw new Error("Product not found");
    }

    try {
        const product = await Product.findById(productId);
        if (product) {
            await product.remove();
            res.status(200).json({ message: "Product deleted" });
        } else {
            throw new Error();
        }
    } catch (e) {
        res.status(500);
        throw new Error("Product remove failed");
    }
}));

productRoute.post("/", protect, adminAccess, asyncHandler(async (req, res) => {
    const { name, price, description, image, countInStock } = req.body;
    if (!name || (!price || price < 0) || !description || !image || countInStock < 0) {
        res.status(400);
        throw new Error("Invalid product data");
    }

    const productExists = await Product.findOne({ name });

    if (productExists) {
        res.status(400);
        throw new Error("Product with this name already exists.");
    } else {
        try {
            const product = new Product({
                name,
                price,
                description,
                image,
                countInStock
            });
            if (product) {
                const createdProduct = await product.save();
                res.status(201).json(createdProduct);
            } else {
                throw new Error();
            }
        } catch (e) {
            res.status(500);
            throw new Error("Product creation failed.");
        }
    }
}));

productRoute.put("/:id", protect, adminAccess, asyncHandler(async (req, res) => {
    const { _id, name, price, description, image, countInStock } = req.body.product;

    if (!name || (!price || price < 0) || !description || !image || countInStock < 0 || _id != req.params.id) {
        res.status(400);
        throw new Error("Invalid product data");
    }

    let product = null;
    let newNameProduct = null;

    try {
        product = await Product.findById(_id);
        newNameProduct = await Product.findOne({ name: name });
    } catch (e) {
        res.status(500);
        throw new Error("Internal Server error");
    }

    if (!product) {
        res.status(404);
        throw new Error("Invalid product");
    }

    if (newNameProduct && name !== product.name) {
        res.status(404);
        throw new Error(`Product with name: '${name}' already exists, choose another name`);
    }

    try {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.countInStock = countInStock || product.countInStock;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (e) {
        res.status(500);
        throw new Error("Internal Server error");
    }
}));

//ADMIN ROUTES END

//COMMON ROUTES

productRoute.get("/productCount", protect, asyncHandler(async (req,res) => {
    console.log('products test')
    const productsToCheck = req.body;
    console.log(productsToCheck)
    console.log(Array.isArray(productsToCheck))
    if(!productsToCheck || !Array.isArray(productsToCheck)) {
        res.status(400);
        throw new Error("Invalid product data");
    }
    try {
        const productCountObj = {};
        const getProductData = (productId) => new Promise(resolve => resolve(Product.findById(productId)));
        const checkAllProducts = async() => {
            for (const productId of productsToCheck) {
                const product = await getProductData(productId);
                productCountObj[productId] = product.countInStock;
            }
            res.status(200).json(productCountObj)
        }
        checkAllProducts();
    } catch (e) {
        res.status(500);
        throw new Error("Internal Server error");
    }
}));


productRoute.get("/:id", asyncHandler(async (req, res) => {
    // console.log('test')
    try {
        const product = await Product.findById(req.params.id);
        // console.log('after')
        if (product) {
            res.json(product);
        } else {
            throw new Error();
        }
    } catch (e) {
        res.status(404);
        throw new Error("Product not Found.");
    }
}));

//COMMON ROUTES END

//USER ROUTES
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

    try {
        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1)).sort({ name: 1 }).collation({ locale: "en", caseLevel: true });

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (e) {
        throw new Error('Error loading products.');
    }
}));

productRoute.post("/:id/review", protect, asyncHandler(async (req, res) => {

    const { rating, comment } = req.body;
    const id = req.params.id;
    if (!rating || !comment || !id) {
        res.status(400);
        throw new Error("Invalid review data.");
    }

    let product = null;
    try {
        product = await Product.findById(id);
    } catch (error) {
        res.status(404);
        throw new Error("Product not found.");
    }
    if (product) {
        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            res.status(400);
            throw new Error("Product already reviewed.");
        }
        try {
            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment: comment,
                user: req.user._id
            };

            product.reviews.push(review);
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({ message: "Review added." });

        } catch (error) {
            res.status(400);
            throw new Error("Error adding review.");
        }
    } else {
        res.status(404);
        throw new Error("Product not found.");
    }
}));

//USER ROUTES END

export default productRoute;