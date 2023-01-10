import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import User from '../Models/UserModel.js';

const protect = async (req, res, next) => {

    if (!req.session && !req.session.token) {
        console.log('no session or no token')
        res.status(401);
        throw new Error("Not authorized.");
    }
    try {
        const token = req.session.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        console.log('success protect')
        next();
    } catch (e) {
        // console.error(e)
        console.log('error protect');
        res.status(401);
        next(e);
    }
    

    // console.log(decoded)
    //not sending password
    // console.log(req.user)


    // let token;
    // if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    //     try {
    //         token = req.headers.authorization.split(" ")[1];
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //         //not sending password
    //         req.user = await User.findById(decoded.id).select("-password");
    //         next();
    //     } catch (error) {
    //         console.error(error);
    //         res.status(401);
    //         throw new Error("Not authorized.");
    //     }
    // }

    // if (!token) {
    //     res.status(403)
    //     throw new Error("Not authorized, no token.");
    // }
}
// );

export const adminAccess = (req, res, next) => {

    const user = req.user;

    if (user && user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not an admin");
    }
}

export default protect;


