import {
    Schema,
    Types,
    model
} from "mongoose";


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

const BookSchema = new Schema({
    ISBN: {
        type: String,
        required: true,
        unique: true,
        minLength: 10,
        maxLength: 13,
    },
    title: {
        type: String,
        required: true,
    },
    authors: {
        type: [String],
        required: true,
        minItems: 1,
    },
    language: {
        type: String,
        required: true,
    },
    pubDate: {
        type: String,
        required: true,
    },
    numOfPage: {
        type: Number,
        required: true,
        minimum: 10,
    },
    categories: {
        type: [String],
        required: true,
        minItems: 1
    },
    publication: {
        type: String,
        required: true
    },
});

const BookModel = model("Book", BookSchema);
BookSchema.index({
    ISBN: 1,
    title: 1
}, {
    unique: true
});

BookModel.syncIndexes();

export default BookModel;