import { Router } from "express";
import {
  getAllBooks,
  getBooksByAuthor,
  addNewBook,
  updateBook,
  deleteBookByISBN,
  deleteAuthorFromBook,
  borrowBook,
  returnBook
} from "../controllers/bookController";
import { checkAccessToken } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// GET all books -> public
router.get("/", checkAccessToken, getAllBooks);
// GET all books by author -> public
router.get("/author/:_id", checkAccessToken, getBooksByAuthor);

// borrow -> admin, librarian, user
router.post("/borrow/:isbn", checkAccessToken, authorizeRoles("user", "librarian", "admin"), borrowBook);
// return -> admin, librarian, user
router.post("/return/:isbn", checkAccessToken, authorizeRoles("user", "librarian", "admin"), returnBook);

// POST new book -> admin, librarian
router.post("/new-book", checkAccessToken, authorizeRoles("librarian", "admin"), addNewBook);
// PUT update book -> admin, librarian
router.put("/update-book/:isbn", checkAccessToken, authorizeRoles("librarian", "admin"), updateBook);

// DELETE BOOK - admin
router.delete("/delete-book/:isbn", checkAccessToken, authorizeRoles("admin"), deleteBookByISBN);
// DELETE Author from a book- admin
router.delete("/delete-author/:isbn", checkAccessToken, authorizeRoles("admin"), deleteAuthorFromBook);

export default router;
