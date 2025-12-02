import {
    Schema,
    model,
    Document,
    Types
} from "mongoose";

interface BorrowedBook {
    bookId: string;
    dueDate: Date;
    returned: boolean;
}

export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    role: "admin" | "user" | "librarian" | "guest";
    borrowedBooks: BorrowedBook[];
    fines: number;
    avatar?: string
}

const borrowedBookSchema = new Schema<BorrowedBook>({
    bookId: { type: String, required: true },
    dueDate: { type: Date, required: true },
    returned: { type: Boolean, required: true, default: false }
}, { _id: false }); // prevents auto _id for sub-documents


const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: {
        type: String, required: true, enum: ["admin", "librarian", "user", "guest"],
        default: "user",
    },
    borrowedBooks: {
        type: [borrowedBookSchema],
        required: true,
    },
    fines: { type: Number },
    avatar: { type: String }
});


const userModel = model("User", userSchema);

export default userModel;