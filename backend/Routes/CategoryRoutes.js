import express from 'express';
import asyncHandler from 'express-async-handler';
import protect, { adminAccess } from '../Middleware/Auth.js';
import Category from './../Models/CategoryModel.js';

const categoryRoute = express.Router();
//COMMON ROUTES
categoryRoute.get("/all", asyncHandler(async (req, res) => {
    console.log('all cat get')
    try {
        // throw new Error()
        const categories = await Category.find({}).sort({ name: 1 }).collation({ locale: "en", caseLevel: true });
        res.status(200).json(categories);
    } catch (e) {
        console.log('cat get error')
        res.status(500);
        throw new Error("Categories loading error");
    }
}));

//COMMON ROUTES END

//ADMIN ROUTES
categoryRoute.post("/", protect, adminAccess, asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        // console.log('invalid cat data')
        res.status(400);
        throw new Error("Invalid category data");
    }

    let categoryExists = null;

    try {
        categoryExists = await Category.findOne({ name: name });
        // throw new Error();
    } catch (e) {
        // console.log('exists error')
        res.status(500);
        throw new Error("Internal Server error");
    }

    if (categoryExists) {
        // console.log('cat exists')
        res.status(400);
        throw new Error("Category with this name already exists");
    }

    try {
        const category = new Category({
            name,
            description
        });

        if (category) {
            // console.log('category created')
            // console.log(category)
            await category.save();
            res.status(201).json({});
        } else {
            throw new Error();
        }
    } catch (e) {
        console.log('creation error')
        res.status(500);
        throw new Error("Category creation failed");
    }

}));

//ADMIN ROUTES END

export default categoryRoute;