import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
},
    {
        timestamps: true
    }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;