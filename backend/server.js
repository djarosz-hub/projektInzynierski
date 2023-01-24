import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/MongoDb.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRoute from "./Routes/UserRoutes.js";
import orderRoute from "./Routes/OrderRoutes.js";
import session from "express-session";
import categoryRoute from "./Routes/CategoryRoutes.js";
// import sendEmail from './utils/mailer.js';

dotenv.config();
await connectDb();

const app = express();
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        maxAge: parseInt(process.env.SESSION_MAX_AGE),
    }
}));
// sendEmail('testsubject','hello world', 'damoved@gmail.com');
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/categories", categoryRoute);
app.get("/api/config/paypal", (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
});


//error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
});