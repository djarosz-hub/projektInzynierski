import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("Db connected");
    } catch (error) {
        console.log(`Error connecting to db: ${error.message}`);
        process.exit(1);
    }
}

export default connectDb;