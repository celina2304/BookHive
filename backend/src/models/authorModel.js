import {
    Schema,
    model
} from "mongoose";

const AuthorSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    books: {
        type: [String],
        required: true,
    },
});

AuthorSchema.index({
    name: 1
}, {
    unique: true
});

const AuthorModel = model("Author", AuthorSchema);

export default AuthorModel;