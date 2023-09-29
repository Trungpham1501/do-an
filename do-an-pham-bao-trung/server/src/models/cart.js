import mongoose from "mongoose";

const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", cartSchema);
