import mongoose from "mongoose";

export async function connectDB() {
    try {
        const MongoUrl=process.env.MONGO_URL;

        if(!MongoUrl){
            throw new error("MONGO_URL is required");
        }

        const conn=await mongoose.connect(MongoUrl);
        console.log("MongoDB Connected", conn.connection.host);
    } catch (error) {
        console.log("MongoDb connection Error", error.message);
        process.exit(1);
        // 1 means failed, 0 means success
    }
}