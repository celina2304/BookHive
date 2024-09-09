import mongoose from "mongoose";
import PublicationModel from "../models/publicationModel.js";
import BookModel from "../models/bookModel.js";

/* 
Route           /
Description     to get all the publications
Access          public
Parameters      none
Method          get
*/
export const getAllPublications = async (req, res) => {
    try {
        const {
            isbn
        } = req.query;
        const query = {};
        if (isbn) {
            query.books = isbn
        }
        const publications = await PublicationModel.find(query);
        return res.status(200).json({
            message: "Request successful",
            publications,
            count: publications.length
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};
/*
Route           /:_id
Description     to get specific publication
Access          public
Parameters      _id
Method          get
*/
export const getPublicationById = async (req, res) => {
    try {
        const {
            _id
        } = req.params;
        if (!_id) {
            return res.status(400).json({
                error: "Please provide publication id"
            });
        }
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({
                error: "Invalid publication id"
            });
        }
        const publication = await PublicationModel.findById(_id);

        if (!publication) {
            return res.status(404).json({
                error: "No publication found",
            });
        }
        return res.status(200).json({
            message: "Request succesful",
            publication
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

/* 
Route           /new-publication
Description     to add new publication
Access          public
Parameters      none
Method          POST
*/
export const addNewPublication = async (req, res) => {
    try {
        const publicationDetails = req.body;
        if (!publicationDetails || Object.keys(publicationDetails).length === 0) {
            return res.status(400).json({
                error: "Please provide publication details"
            });
        }
        const newPublication = new PublicationModel(publicationDetails);
        await newPublication.save();
        if (!newPublication) {
            return res.status(400).json({
                error: "Could not add publication"
            });
        }
        return res.status(201).json({
            message: "publication was added!!",
            newPublication
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    };
};


/*
Route           /update-publication/:_id
Description     to update publication  using id
Access          public
Parameters      _id
Method          PUT
*/
export const updatePublication = async (req, res) => {
    try {
        const {
            _id
        } = req.params;
        const publicationDetails = req.body;
        if (!_id) {
            return res.status(400).json({
                error: "Please provide publication id"
            });
        }
        if (!publicationDetails || Object.keys(publicationDetails).length === 0) {
            return res.status(400).json({
                error: "Please provide publication details"
            });
        }
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({
                error: "Invalid publication id"
            });
        }
        console.log()
        const updatedPublication = await PublicationModel.findByIdAndUpdate(_id, publicationDetails, {
            new: true,
            runValidators: true,
        });
        if (!updatedPublication) {
            return res.status(404).json({
                error: "Publication not found"
            });
        }
        return res.status(200).json({
            message: "Request succesful",
            updatedPublication
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

/*
Route           /delete-publication/:_id
Description     to delete a publication
Access          public
Parameters      _id
Method          DELETE
*/
export const deletePublication = async (req, res) => {
    try {
        const {
            _id
        } = req.params;
        if (!_id) {
            return res.status(400).json({
                error: "Please provide publication id"
            });
        }
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({
                error: "Invalid publication id"
            });
        }
        const deletedPublication = await PublicationModel.findByIdAndDelete(_id);
        if (!deletedPublication) {
            return res.status(404).json({
                error: "Publication not found"
            });
        }
        const updatedBooks = await BookModel.updateMany({
            publication: _id
        }, {
            $unset: {
                publication: ""
            }
        });
        return res.status(200).json({
            message: "Deleted publication successfully",
            deletedPublication,
            updatedBooks
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};