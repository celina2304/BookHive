import config from "./config/config";
import app from "./app";
import connectDb from "./config/db";

// database connection 
connectDb();
console.log(config)

// setting port 
const port = config.PORT;

app.listen(port, () => {
    console.log("server is running on port:", port)
})