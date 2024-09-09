import {
    Schema,
    model
} from "mongoose";

const PublicationSchema = new Schema({
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

PublicationSchema.index({
    name: 1
}, {
    unique: true
});
const PublicationModel = model("Publication", PublicationSchema);

export default PublicationModel;