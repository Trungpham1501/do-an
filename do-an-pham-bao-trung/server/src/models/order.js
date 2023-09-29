import mongoose from 'mongoose'

const { Schema } = mongoose

const orderSchema = new Schema(
  {
    code: { type: String, required: true },
    status: { type: Number, default: 1 },
    cars: [
      {
        _id: { type: Schema.Types.ObjectId, ref: 'Product' },
        code: { type: String, required: true },
        name: { type: String, maxLength: 256, required: true },
        image: { type: String },
        number: { type: Number, default: 0 },
        price: { type: Number, required: true },
      },
    ],
    user: {
      _id: { type: Schema.Types.ObjectId, ref: 'User' },
      code: { type: String },
      fullName: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
      avatar: { type: String },
      address: {
        district: { type: String },
        city: { type: String },
        detail: { type: String },
      },
    },
    note: { type: String, default: '' },
    totalMoney: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Order', orderSchema)
