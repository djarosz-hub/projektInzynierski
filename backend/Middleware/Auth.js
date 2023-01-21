import jwt from "jsonwebtoken";
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
        console.log('error protect');
        res.status(401);
        next(e);
    }
}

export const adminAccess = (req, res, next) => {
    const user = req.user;

    if (user && user.isAdmin) {
        console.log('admin correct')
        next();
    } else {
        console.log('admin failed')
        res.status(401);
        throw new Error("Not an admin");
    }
}

export default protect;


