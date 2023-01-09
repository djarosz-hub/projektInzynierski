import express from 'express';
import asyncHandler from 'express-async-handler';
import protect, { adminAccess } from '../Middleware/Auth.js';
import User from '../Models/UserModel.js';
import generateToken from '../utils/generateToken.js';

const userRoute = express.Router();

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

userRoute.get("/initialUserData",
    // protect,
    asyncHandler(async (req, res) => {
        console.log(req)
        if (req.user) {
            try {

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
                    console.log('not found')
                    res.status(404).json({});
                }

            } catch (e) {
                console.log(e)
                res.status(404).json({});
            }
        } else {
            console.log('empty req')
            res.status(404).json({});
        }
        // const user = await User.findById(req.user._id);

        // if (user) {
        //     res.json({
        //         _id: user._id,
        //         name: user.name,
        //         email: user.email,
        //         isAdmin: user.isAdmin,
        //         createdAt: user.createdAt
        //     })
        // } else {
        //     res.status(404).json({});
        //     // throw new Error("User not found");
        // }
    })
);

export default userRoute;