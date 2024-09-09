import config from "./config/config.js";
import app from "./app.js";
import connectDb from "./config/db.js";

// database connection 
connectDb();

// setting port 
const port = config.port;

app.listen(port, () => {
    console.log("server is running on port:", port)
})