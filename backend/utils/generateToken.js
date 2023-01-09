import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,
        {
            expiresIn: parseInt(process.env.JWT_EXPIRATION)
        }
    );
}

export default generateToken;