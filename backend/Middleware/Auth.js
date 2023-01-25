import jwt from "jsonwebtoken";
import User from '../Models/UserModel.js';

const protect = async (req, res, next) => {
    if (!req.session && !req.session.token) {
        res.status(401);
        throw new Error("Not authorized.");
    }
    try {
        const token = req.session.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (e) {
        res.status(401);
        next(e);
    }
}

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


