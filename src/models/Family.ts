import mongoose, { Document, Types, Schema } from "mongoose";

export interface FamilyDocument extends Document {
    user: Types.ObjectId;
    fatherOccupation?: string;
    motherOccupation?: string;
    type?: string;
    totalMembers?: Number;
    numberOfElderBrothers?: Number;
    numberOfElderSisters?: Number;
    numberOfYoungerBrothers?: Number;
    numberOfYoungerSisters?: Number;
}

const familySchema = new Schema<FamilyDocument>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fatherOccupation: { type: String, default: null, set: (fo: string) => fo.toUpperCase().trim() },
    motherOccupation: { type: String, default: null, set: (mo: string) => mo.toUpperCase().trim() },
    type: { type: String, default: null }, // NUCLEAR, EXTENDED, SINGLE PARENT, etc.
    totalMembers: { type: Number, default: 0 },
    numberOfElderBrothers: { type: Number, default: 0 },
    numberOfElderSisters: { type: Number, default: 0 },
    numberOfYoungerBrothers: { type: Number, default: 0 },
    numberOfYoungerSisters: { type: Number, default: 0 }

}, {timestamps: true});

const Family = mongoose.model<FamilyDocument>("Family", familySchema);
export default Family;