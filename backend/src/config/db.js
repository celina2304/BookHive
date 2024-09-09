import mongoose from "mongoose";
import config from "./config.js";

const URI = config.db.dbURI;

const connectDb = async () => {
    try {
        await mongoose.connect(URI);
        console.log("MongoDB Connection Establised !!!");
    } catch (error) {
        console.log("Error connecting to database: ", error)
    }
}

export default connectDb;