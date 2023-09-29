import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, maxLength: 256, required: true },
    image: { type: String },
    number: { type: Number, default: 0 },
    price: { type: Number, required: true },
    gallery: [{ type: String, default: "" }],
    desc: { type: String, default: "" },
    productType: {
      type: Schema.Types.ObjectId,
      ref: "ProductType",
      default: null,
    },
    tags: [{ column: String, value: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
