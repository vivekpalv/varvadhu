import mongoose, { Document, Types, Schema } from "mongoose";

export interface UserPreferenceDocument extends Document {
    user: Types.ObjectId;
    religion?: Types.ObjectId;
    minAge?: number;
    maxAge?: number;
    annualIncome?: number;
    height?: number;
    state?: string;
};

const userPreferenceSchema = new Schema<UserPreferenceDocument>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    religion: { type: mongoose.Schema.Types.ObjectId, ref: 'Religion', required: true, unique: true },
    minAge: { type: Number, min: 21 },
    maxAge: { type: Number, min: 21 },
    annualIncome: { type: Number, default: 0 },
    height: { type: Number, default: 0, min: 0 },
    state: { type: String, trim: true }
});

const UserPreference = mongoose.model<UserPreferenceDocument>("UserPreference", userPreferenceSchema);
export default UserPreference;