import express from 'express';
import asyncHandler from 'express-async-handler';
import protect, { adminAccess } from '../Middleware/Auth.js';
import User from '../Models/UserModel.js';
import generateToken from '../utils/generateToken.js';
import jwt from "jsonwebtoken";


const userRoute = express.Router();

userRoute.get("/initialUserData",
    // protect,
    asyncHandler(async (req, res) => {
        console.log('initial')
        if (req.session && req.session.token) {
            console.log('has session and token')
            try {
                const token = req.session.token;
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log('decoded:')
                console.log(decoded)
                const user = await User.findById(decoded.id);
                if (user) {
                    res.status(200).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        createdAt: user.createdAt
                    })
                } else {
                    res.status(404).json({});
                }
            } catch (e) {
                console.log(`error initialUserData: ` + e);
                res.status(403).json({});
            }
        } else {
            console.log('empty req')
            res.status(400).json({});
        }
    })
);

userRoute.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        req.session.token = generateToken(user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt
        })
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password ");
    }
}));

userRoute.post("/", asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists || (!name || !email || !password)) {
        res.status(400);
        throw new Error("User already exists or data is invalid");
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        req.session.token = generateToken(user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
}));

userRoute.get("/profile",
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            })
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    })
);

userRoute.put("/profile",
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                createdAt: updatedUser.createdAt,
                token: generateToken(updatedUser._id)
            })
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    })
);

userRoute.get("/", protect, adminAccess, asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
}))

export default userRoute;