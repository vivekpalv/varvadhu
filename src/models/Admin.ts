import mongoose, { Document, Schema, Types } from "mongoose";
import { AdminRole } from "../types/enums";

export interface AdminDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    roles: AdminRole[];
};

const adminSchema = new Schema<AdminDocument>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    roles: [{ type: String, required: true, enum: Object.values(AdminRole) }],

}, { timestamps: true });

const Admin = mongoose.model<AdminDocument>("Admin", adminSchema);
export default Admin;