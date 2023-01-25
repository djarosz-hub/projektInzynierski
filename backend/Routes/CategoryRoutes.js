import express from 'express';
import asyncHandler from 'express-async-handler';
import protect, { adminAccess } from '../Middleware/Auth.js';
import Category from './../Models/CategoryModel.js';

const categoryRoute = express.Router();
//COMMON ROUTES
categoryRoute.get("/all", asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 }).collation({ locale: "en", caseLevel: true });
        res.status(200).json(categories);
    } catch (e) {
        res.status(500);
        throw new Error("Categories loading error");
    }
}));

//COMMON ROUTES END

//ADMIN ROUTES
categoryRoute.post("/", protect, adminAccess, asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        res.status(400);
        throw new Error("Invalid category data");
    }

    let categoryExists = null;

    try {
        categoryExists = await Category.findOne({ name: name });
    } catch (e) {
        res.status(500);
        throw new Error("Internal Server error");
    }

    if (categoryExists) {
        res.status(400);
        throw new Error("Category with this name already exists");
    }

    try {
        const category = new Category({
            name,
            description
        });

        if (category) {
            await category.save();
            res.status(201).json({});
        } else {
            throw new Error();
        }
    } catch (e) {
        res.status(500);
        throw new Error("Category creation failed");
    }

}));

//ADMIN ROUTES END

export default categoryRoute;