import mongoose from "mongoose";

const connectDB = async () => {
//     console.log("process.env.MONGO_URI");
     try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
          //     console.log(`MongoDB Connected: ${conn.connection.host}`);
          console.log("Database connected successfully...");
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
