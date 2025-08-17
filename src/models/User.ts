import mongoose, { Document, Types, Schema } from "mongoose";
import { Gender, MaritalStatus, Occupation } from "../types/enums";

export interface UserDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    email?: string;
    username: string;
    mobile: string;
    about?: string;
    diet?: string;
    profilePicture?: string;
    gallery: string[];
    dob: Date;
    color?: string;
    height?: string;
    community?: string;
    weight?: string;
    profileCreatedBy?: string; // e.g., "SELF", "PARENT", "SIBLING"
    nationality: string;
    languages: string[];
    nri?: string;
    annualIncome?: number;
    gender: Gender;
    occupation?: Occupation;
    maritalStatus?: MaritalStatus;
    preference?: Types.ObjectId;
    religion?: Types.ObjectId;
    family?: Types.ObjectId;
    currentAddress?: Types.ObjectId;
    nativeAddress?: Types.ObjectId;
    educations?: Types.ObjectId[];
    sentRequests: Types.ObjectId[];
    receivedRequests: Types.ObjectId[];
    approvedUsers: Types.ObjectId[];
    role: string;
    percentage?: number;
    isBlacklisted?: boolean;
}

const userSchema = new Schema<UserDocument>({
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    about: { type: String, trim: true },
    profileCreatedBy: { type: String, trim: true }, // e.g., "SELF", "PARENT", "SIBLING"
    diet: { type: String, trim: true },
    profilePicture: { type: String, trim: true },
    gallery: [{ type: String, trim: true }],
    dob: { type: Date, required: true, trim: true },
    color: { type: String, trim: true },
    height: { type: Number, trim: true }, // cm
    weight: { type: Number, trim: true }, // cm
    nationality: { type: String, trim: true, required: true },
    languages: [{ type: String, trim: true }],
    nri: { type: String, trim: true }, // country name if NRI
    annualIncome: { type: Number, default: 0 },
    gender: { type: String, enum: Object.values(Gender), required: true },
    occupation: { type: String, enum: Object.values(Occupation) },
    maritalStatus: { type: String, enum: Object.values(MaritalStatus) }, 
    preference: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPreference'},
    religion: { type: Schema.Types.ObjectId, ref: "UserReligion" },
    family: { type: Schema.Types.ObjectId, ref: "Family" },
    currentAddress: { type: Schema.Types.ObjectId, ref: "Address" },
    nativeAddress: { type: Schema.Types.ObjectId, ref: "Address" },
    educations: [{ type: Schema.Types.ObjectId, ref: "Education" }],
    sentRequests: [{type: Schema.Types.ObjectId, ref: 'User'}],
    receivedRequests: [{type: Schema.Types.ObjectId, ref: 'User'}],
    approvedUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    role: { type: String, default: "USER" },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    isBlacklisted: { type: Boolean, default: false },

}, { timestamps: true });

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
