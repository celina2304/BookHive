import AuthorModel from "../models/authorModel.js";
import BookModel from "../models/bookModel.js";
import PublicationModel from "../models/publicationModel.js";

/*
example
ISBN: "1234NE"
title: "Intro to react"
authors: ["aaeee-eef-eres-aerear", "aaeee-eef-eres-aerseder"]
language: "english"
pubDate: "23-04-2001" DD-MM-YYYY
numOfPage: 235
categories: ["coding", "javascript"]
publication: "sdede-2sfesf-sefsfa-cecss"
*/

/* 
Route           /
Description     to get all books
Access          public
Parameters      none
Query           ISBN, category, publicationId, authorId
Method          get
*/
export const getAllBooks = async (req, res) => {
    try {
        const {
            isbn,
            title,
            author_id,
            language,
            pub_date,
            category,
            publication,
        } = req.query;
        const query = {};
        if (isbn) {
            query.ISBN = isbn;
        }
        if (title) {
            query.title = title;
        }
        if (author_id) {
            query.authors = author_id;
        }
        if (language) {
            query.language = language;
        }
        if (pub_date) {
            query.pubDate = pub_date;
        }
        if (category) {
            query.categories = category;
        }
        if (publication) {
            query.publication = publication;
        }
        const books = await BookModel.find(query);
        return res.status(200).json({
            message: "Request successful",
            books,
            count: books.length
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
};

/*
Route           /author/:_id
Description     to get a list of books based on author id
Access          public
Parameters      _id
Method          get
*/
export const getBooksByAuthor = async (req, res) => {
    try {
        const {
            _id
        } = req.params;
        if (!_id) {
            return res.status(400).json({
                error: "Please provide author id",
            });
        }
        // if (!mongoose.Types.ObjectId.isValid(_id)) {
        //     return res.status(400).json({
        //         error: "Please provide author id"
        //     });
        // }
        // console.log("_id", _id);
        const books = await BookModel.find({
            authors: _id,
        });
        return res.status(200).json({
            message: "Request successful",
            books,
            count: books.length
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
};

/* 
Route           /new-book
Description     to add new book
Access          public
Parameters      none
Method          POST
*/
export const addNewBook = async (req, res) => {
    try {
        const bookDetails = req.body;
        if (!bookDetails) {
            return res.status(400).json({
                error: "Please provide bookDetails"
            })
        }
        const newBook = new BookModel(bookDetails); //dosent return anything
        await newBook.save();

        if (!newBook) {
            return res.status(400).json({
                error: "Could not add book"
            });
        }
        const updatedPublication = await PublicationModel.findByIdAndUpdate(bookDetails.publication, {
            $addToSet: {
                books: newBook.ISBN,
            }
        }, {
            new: true,
            runValidators: true,
        })
        for (const authorId of bookDetails.authors) {
            await AuthorModel.findByIdAndUpdate(
                authorId, {
                    $addToSet: {
                        books: bookDetails.ISBN
                    }
                }, {
                    new: true
                }
            );
        }
        return res.status(201).json({
            message: "book was added!!",
            newBook,
            updatedPublication
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
};

/* 
Route           /update-book/:isbn
Description     to update a book
Access          public
Parameters      isbn
Method          PUT
*/
export const updateBook = async (req, res) => {
    try {
        const {
            isbn
        } = req.params;
        let bookDetails = req.body;

        if (!isbn) {
            return res.status(400).json({
                error: "Please provide book isbn",
            });
        }
        if (!bookDetails) {
            return res.status(400).json({
                error: "Please provide book details",
            });
        }
        if (bookDetails["authors"]) {
            delete bookDetails.authors;
        }
        const updatedBook = await BookModel.findOneAndUpdate({
                ISBN: isbn,
            },
            bookDetails, {
                new: true,
                runValidators: true,
            }
        );
        if (!updatedBook) {
            return res.status(400).json({
                error: "Could not find a book with given isbn"
            })
        }
        return res.status(200).json({
            message: "Request successful",
            updatedBook,
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
};

/* 
Route           /add-author/:isbn
Description     to update/add new author
Access          public
Parameters      isbn
Method          PUT
*/
export const updateAndAddAuthor = async (req, res) => {
    try {
        const ISBN = req.params.isbn;
        const author = req.body.author;
        if (!ISBN) {
            res.status(400).json({
                error: "Please provide book isbn"
            });
        }
        if (!author) {
            res.status(400).json({
                error: "Please provide author details"
            });
        }
        // update book database
        console.log(ISBN, author)

        const updatedBook = await BookModel.findOneAndUpdate({
            ISBN
        }, {
            $addToSet: {
                authors: author
            }
        }, {
            new: true,
            runValidators: true,
        });
        console.log(updatedBook)
        if (!updatedBook) {
            return res.status(400).json({
                error: "Error updating book"
            })
        }
        //update author database
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(author, {
            $addToSet: {
                books: ISBN,
            },
        }, {
            new: true,
        });
        if (!updatedAuthor) {
            return res.status(400).json({
                error: "Error updating author"
            })
        }
        return res.json({
            message: "New author was added to book",
            updatedBook,
            updatedAuthor,
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};
/*
Route           /delete-book/:isbn
Description     to delete a book
Access          public
Parameters      isbn
Method          DELETE
*/
export const deleteBookByISBN = async (req, res) => {
    try {
        const ISBN = req.params.isbn;
        if (!ISBN) {
            return res.status(400).json({
                error: "Please provide book isbn"
            });
        }
        const deletedBook = await BookModel.findOneAndDelete(ISBN);
        if (!deletedBook) {
            return res.status(404).json({
                error: "Book not found"
            });
        }
        return res.json({
            message: "Deleted book successfully",
            deletedBook
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};
/*
Route           /delete-author/:isbn
Description     to delete an author from a book
Access          public
Parameters      isbn
Method          DELETE
*/
export const deleteAuthorFromBook = async (req, res) => {
    try {
        const ISBN = req.params.isbn;
        const {
            authorId
        } = req.body;
        if (!ISBN) {
            res.status(400).json({
                error: "Please provide book isbn"
            });
        }
        if (!authorId) {
            res.status(400).json({
                error: "Please provide author id"
            });
        }
        //update book database
        const updatedBook = await BookModel.findOneAndUpdate(
            ISBN, {
                $pull: {
                    authors: authorId,
                },
            }, {
                new: true,
            }
        );
        if (!updatedBook) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        //update author database
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(authorId, {
            $pull: {
                books: ISBN,
            },
        }, {
            new: true,
        });

        if (!updatedAuthor) {
            return res.status(404).json({
                error: "Author not found"
            });
        }
        return res.json({
            message: "Author was deleted from given book!!",
            updatedBook,
            updatedAuthor,
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};