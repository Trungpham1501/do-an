import mongoose from "mongoose";

const { Schema } = mongoose;

const productTypeSchema = new Schema({
  name: String,
  filter: [{ column: String, value: String }],
});

export default mongoose.model("ProductType", productTypeSchema);
