import mongoose, { Document, Types, Schema } from "mongoose";
import { KycStatus } from "../types/enums";

interface KycDoc {
    type: string;
    urls: string[];
}

export interface KycDocument extends Document {
    user: Types.ObjectId;
    status: KycStatus;
    documents: KycDoc[];
}

const kycDocSchema = new Schema<KycDoc>({
    type: { type: String, required: true },
    urls: { type: [String], required: true }
}, { _id: false });

const kycSchema = new Schema<KycDocument>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: { type: String, enum: Object.values(KycStatus) },
    documents: { type: [kycDocSchema], required: true }
    
}, { timestamps: true });

const Kyc = mongoose.model<KycDocument>("Kyc", kycSchema);
export default Kyc;