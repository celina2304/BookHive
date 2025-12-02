import mongoose from "mongoose";
import config from "./config";

// fallback for undefined mongodb_uri
if(!config.DB.DATABASE_URL){
    throw new Error("MONGODB_URI not present in config")
}
const URI = config.DB.DATABASE_URL;

const connectDb = async () => {
    try {
        await mongoose.connect(URI);
        console.log("MongoDB Connection Establised !!!");
    } catch (error) {
        console.log("Error connecting to database: ", error)
    }
}

export default connectDb;