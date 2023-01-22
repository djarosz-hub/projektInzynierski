import express from 'express';
import asyncHandler from 'express-async-handler';
import protect, { adminAccess } from '../Middleware/Auth.js';
import User from '../Models/UserModel.js';
import generateToken from '../utils/generateToken.js';
import jwt from "jsonwebtoken";


const userRoute = express.Router();

userRoute.get("/initialUserData",
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
            res.status(204).json({});
        }
    })
);

userRoute.post("/login", asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Invalid data.");
    }

    try {
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
            throw new Error();
        }
    } catch (e) {
        res.status(401);
        throw new Error("Invalid Email or Password.");
    }

}));

userRoute.get("/logout", (req, res) => {
    try {
        if (req.session) {
            req.session.destroy();
        }
        res.status(200);
    } catch (error) {
        res.status(400);
    }
});

userRoute.post("/", asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Invalid data.");
    }
    console.log(name + ' ' + email + ' ' + password)
    const userExists = await User.findOne({ email });
    console.log('after')
    if (userExists || (!name || !email || !password)) {
        res.status(400);
        throw new Error("User already exists or data is invalid.");
    }

    try {
        const user = await User.create({ name, email, password });

        if (user) {
            req.session.token = generateToken(user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            })
        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(400);
        throw new Error("Invalid user data.");
    }
}));

userRoute.get("/profile",
    protect,
    asyncHandler(async (req, res) => {
        const requestUserId = req.user._id;
        if (!requestUserId) {
            res.status(404);
            throw new Error("Invalid user id.");
        }

        let user = null;
        try {
            user = await User.findById(requestUserId);
        } catch (error) {
            res.status(404);
            throw new Error("User not found.");
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt
        });
    })
);

userRoute.put("/profile",
    protect,
    asyncHandler(async (req, res) => {

        const userId = req.user._id;
        // const userId = 'dupa';
        const { name, password } = req.body;
        console.log(name + ' ' + password + ' ' + userId);
        // const requestUserId = '';
        if (!userId) {
            console.log('no id')
            res.status(404);
            throw new Error("Invalid data.");
        }
        let user = null;
        try {
            user = await User.findById(userId);
        } catch (error) {
            console.log('error finding user')
            res.status(404);
            throw new Error("User not found.");
        }
        if (user) {
            user.name = name || user.name;
            if (password) {
                user.password = password;
            }
            const updatedUser = await user.save();
            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                createdAt: updatedUser.createdAt
            })
        } else {
            console.log('error after user')

            res.status(404);
            throw new Error("User not found.");
        }
    })
);

userRoute.get("/", protect, adminAccess, asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (e) {
        res.status(500);
        throw new Error("Internal Server error");
    }
}))

export default userRoute;