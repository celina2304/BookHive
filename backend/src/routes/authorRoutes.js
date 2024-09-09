import {
    Router
} from "express";

import {
    addNewAuthor,
    deleteAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor
} from "../controllers/authorController.js";

const router = Router();

router.get("/", getAllAuthors);

router.get("/:_id", getAuthorById);

router.post("/new-author", addNewAuthor);

router.put("/update-author/:_id", updateAuthor);

router.delete("/delete-author/:_id", deleteAuthor);

export default router;