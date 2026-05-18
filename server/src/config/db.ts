import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log("MongoDb Connected Successfully")
    } catch (error) {
        console.log("MongoDb conncection failed", error)
        process.exit(1)
    }
}