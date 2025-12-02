import {
    Schema,
    model,
    Document
} from "mongoose";

export interface IAuthor extends Document{
    name: string;
    books: string[];
}

const AuthorSchema = new Schema<IAuthor>({
    name: { type: String, unique: true, required: true },
    books: { type: [String], required: true },
});
const AuthorModel = model("Author", AuthorSchema);

export default AuthorModel;