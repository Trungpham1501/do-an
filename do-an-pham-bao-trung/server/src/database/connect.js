import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log(url);
    console.log(`Connect to Database success!`);
  } catch (error) {
    console.log(`Connect fail with error: ${error}`);
  }
};

export default connectDB;
