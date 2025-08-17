import mongoose, { Document, Schema, Types } from "mongoose";

type EducationMode = "REGULAR" | "DISTANCE" | "ONLINE";

export interface EducationDocument extends Document {
    user: Types.ObjectId;
    degree: string;
    passingYear: Date;
    institution: string;
    mode: EducationMode;
    country: string;
};

const EducationSchema = new Schema<EducationDocument>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    degree: { type: String, required: true, trim: true },
    passingYear: { type: Date, required: true },
    institution: { type: String, required: true, trim: true },
    mode: { type: String, required: true, enum: ["REGULAR", "DISTANCE", "ONLINE"] },
    country: { type: String, required: true, trim: true },
}, { timestamps: true });

const Education = mongoose.model<EducationDocument>("Education", EducationSchema);
export default Education;