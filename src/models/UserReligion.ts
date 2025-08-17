import mongoose, { Document, Schema, Types } from "mongoose";

interface Attribute {
    key: string;
    value: string;
}

export interface UserReligionDocument extends Document {
    user: Types.ObjectId;
    religion: Types.ObjectId;
    name: string;
    attributes: Attribute[];
}

const attributesSchema = new Schema<Attribute>({
    key: { type: String, required: true },
    value: { type: String, required: true }
});

const userReligionShema = new Schema<UserReligionDocument>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    religion: { type: mongoose.Schema.Types.ObjectId, ref: 'Religion', required: true },
    name: { type: String },
    attributes: [{type: attributesSchema, required: true}]

}, { timestamps: true });

const UserReligion = mongoose.model<UserReligionDocument>("UserReligion", userReligionShema);
export default UserReligion;