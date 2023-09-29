import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema(
  {
    code: { type: String, required: true },
    fullName: { type: String, maxLength: 80, required: true },
    email: { type: String, maxLength: 256, required: true },
    phoneNumber: { type: String, maxLength: 10, minLength: 10 },
    avatar: {
      type: String,
      default:
        'https://firebasestorage.googleapis.com/v0/b/open-source-project-2f57f.appspot.com/o/images%2F85633671_p0.jpg?alt=media&token=354a89b1-35d1-4a0e-9f09-68a39e3e8f75',
    },
    address: {
      district: { type: String },
      city: { type: String },
      detail: { type: String },
    },
    isAdmin: { type: Boolean, default: false },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('User', userSchema)
