import {
    Schema,
    Types,
    model,
    Document
  } from "mongoose";
  
  // Example
  /*
  ISBN: "1234567890"
  title: "Intro to React"
  authors: ["userId1", "userId2"]
  language: "English"
  pubDate: "23-04-2001" (DD-MM-YYYY)
  numOfPage: 235
  categories: ["coding", "javascript"]
  publication: "pubId123"
  borrowed: true
  borrowedBy: userid
  dueDate: "23-04-2025"
  */
  

  export interface IBook extends Document {
    ISBN: string;
    title: string;
    authors: string[];
    language: string;
    pubDate: Date;
    numOfPage: Number;
    categories: string[];
    publication: string;
    
    // borrowings
    borrowed: boolean;
    borrowedBy: Types.ObjectId | null;
    borrowedDate: Date | null;
    dueDate: Date | null;
}

  const BookSchema = new Schema<IBook>({
    ISBN: { type: String, required: true, unique: true, minLength: 10, maxLength: 13 },
    title: { type: String, required: true },
    authors: { type: [String], required: true, minItems: 1 },
    language: { type: String, required: true },
    pubDate: { type: Date, required: true },
    numOfPage: { type: Number, required: true, min: 10 },
    categories: { type: [String], required: true, minItems: 1 },
    publication: { type: String, required: true },
  
    // Borrowing fields
    borrowed: { type: Boolean, default: null },
    borrowedBy: { type: Types.ObjectId, ref: "User", default: null },
    borrowedDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
  }, { timestamps: true });
  
  const BookModel = model("Book", BookSchema);
  
  BookSchema.index({ ISBN: 1, title: 1 }, { unique: true });
  BookModel.syncIndexes();
  
  export default BookModel;
  