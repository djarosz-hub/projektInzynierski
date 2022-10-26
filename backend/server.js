import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/MongoDb.js";
import products from "./data/Products.js";
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";

dotenv.config();
await connectDb();

const app = express();

app.use("/api/import", ImportData);
app.use("/api/products", productRoute);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
});