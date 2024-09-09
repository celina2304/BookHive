import express from "express";
import cors from "cors";

// importing routes 
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import authorRoutes from "./routes/authorRoutes.js"
import publicationRoutes from "./routes/publicationRoutes.js"
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// routes 
app.use("/user/", userRoutes);
app.use("/books/", bookRoutes);
app.use("/authors/", authorRoutes);
app.use("/publications/", publicationRoutes);

export default app;