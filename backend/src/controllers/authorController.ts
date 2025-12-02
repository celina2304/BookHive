import mongoose, { FilterQuery } from "mongoose";
import type { Request, Response } from "express";

import AuthorModel, { IAuthor } from "../models/authorModel";

/* 
Route           /fix thi
Description     to get all the authors
Access          public
Parameters      none
Method          get
*/
export const getAllAuthors = async (req: Request, res: Response) => {
    try {
        const {
            name,
            isbn
        } = req.query;

        const query: FilterQuery<IAuthor> = {};
        
        if (name) {
            query.name = name;
        }
        if (isbn) {
            query.books = isbn;
        }
        const authors = await AuthorModel.find(query);
        return res.status(200).json({
            message: "Request successful",
            authors,
            count: authors.length,
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

/*
Route           /:_id
Description     to get specific author
Access          public
Parameters      _id
Method          get
*/
export const getAuthorById = async (req: Request, res: Response) => {
    try {
        const {
            _id
        } = req.params;
        if (!_id) {
            return res.status(400).json({
                error: "Please provide author id"
            });
        }
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({
                error: "Invalid author Id"
            })
        }
        const author = await AuthorModel.findById(_id);
        if (!author) {
            return res.status(400).json({
                error: "No author found",
            });
        }
        return res.status(200).json({
            author
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

/* 
Route           /new-author
Description     to add new author
Access          public
Parameters      none
Method          POST
*/
export const addNewAuthor = async (req: Request, res: Response) => {
    try {
        await AuthorModel.syncIndexes();
        const authorDetails = req.body;
        if (!authorDetails) {
            return res.status(400).json({
                error: "Please provide author details"
            })
        }
        const author = new AuthorModel(authorDetails);
        await author.save();
        if (!author) {
            return res.status(400).json({
                error: "Could not add author"
            });
        }
        return res.status(201).json({
            message: "author was added!!",
            author
        });
    } catch (error) {
        return res.json({
            error: error
        });
    };
};
/*
Route           /update-author/:_id
Description     to update author name
Access          public
Parameters      _id
Method          PUT
*/
export const updateAuthor = async (req: Request, res: Response) => {
    try {
        const {
            _id
        } = req.params;
        const authorDetails = req.body;

        if (!_id) {
            return res.status(400).json({
                error: "Please provide author id"
            });
        }
        if (!authorDetails || Object.keys(authorDetails).length === 0) {
            return res.status(400).json({
                error: "Please provide author details"
            });
        }
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({
                error: "Invalid author id"
            });
        }
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(_id, authorDetails, {
            new: true,
            runValidators: true
        });
        if (!updatedAuthor) {
            return res.status(404).json({
                error: "Author not found"
            });
        }
        return res.status(200).json({
            message: "Request successful",
            updatedAuthor
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};
/*
Route           /delete-author/:_id
Description     to delete a whole author
Access          admin
Parameters      _id
Method          DELETE
*/
export const deleteAuthor = async (req: Request, res: Response) => {
    try {
        const {
            _id
        } = req.params;
        const deletedAuthor = await AuthorModel.findByIdAndDelete(_id);
        if (!deletedAuthor) {
            return res.status(404).json({
                error: "Author not found"
            })
        }
        return res.status(200).json({
            message: "Deleted author succesfully",
            deletedAuthor
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
}
