import mongoose, { Document } from "mongoose";
import { OtpType } from "../types/enums";

export interface OtpDocument extends Document {
    otp: Number;
    type: OtpType;
    mobile: Number;
    expireAt?: Date;
};

const otpSchema = new mongoose.Schema<OtpDocument>({
    otp: { type: Number, required: true, min: 1000, max: 9999 },
    type: { type: String, required: true, enum: Object.values(OtpType) },
    mobile: { type: Number, required: true },
    expireAt: { type: Date, default: () => new Date(Date.now() + 3 * 60 * 1000), expires: 0 }
    
}, { timestamps: true });

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;