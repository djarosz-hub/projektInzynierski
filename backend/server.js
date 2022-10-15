import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/MongoDb.js";
import products from "./data/Products.js";

dotenv.config();
await connectDb();

const PORT = process.env.PORT || 3001;
const app = express();

app.get("/api/products", (req, res) => {
    res.json(products);
});

app.get("/api/products/:id", (req, res) => {
    const product = products.find((p) => p._id === req.params.id);
    res.json(product);
});


app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
});