import express,{  Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// importing routes 
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import authorRoutes from "./routes/authorRoutes"
import seedRoutes from "./routes/seedRoutes"
const app: Application = express();

app.use(cors({
    origin: "http://localhost:3000", // nextjs url
    credentials: true, // for cookies / auth headers
  }));
  
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

// routes 
app.use("/api/users/", userRoutes);
app.use("/api/books/", bookRoutes);
app.use("/api/authors/", authorRoutes);
app.use("/api/seed/", seedRoutes);

export default app;