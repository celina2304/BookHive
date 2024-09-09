import {
    Router
} from "express";
import {
    getAllBooks,
    getBooksByAuthor,
    addNewBook,
    updateBook,
    updateAndAddAuthor,
    deleteBookByISBN,
    deleteAuthorFromBook
} from "../controllers/bookController.js";

const router = Router();

// GET requests
router.get("/", getAllBooks);

router.get("/author/:_id", getBooksByAuthor)

// POST requests
router.post("/new-book", addNewBook);

// PUT requests
router.put("/update-book/:isbn", updateBook);

router.put("/add-author/:isbn", updateAndAddAuthor);

// DELETE requests
router.delete("/delete-book/:isbn", deleteBookByISBN);

router.delete("/delete-author/:isbn", deleteAuthorFromBook);

export default router;