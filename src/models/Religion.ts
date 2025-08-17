import mongoose, { Document, Schema } from "mongoose";

interface AttributeKey {
    key: string;
    isMandatory: boolean;
}

export interface ReligionDocument extends Document {
    name: string;
    attributeKeys: AttributeKey[];
};

const attributeKeySchema = new Schema<AttributeKey>({
    key: { type: String, required: true },
    isMandatory: { type: Boolean, required: true }
});

const religionSchema = new Schema<ReligionDocument>({
    name: { type: String, required: true, unique: true, set: (n: string) => n.toUpperCase().trim() },
    attributeKeys: { type: [attributeKeySchema], required: true }

}, { timestamps: true });

const Religion = mongoose.model<ReligionDocument>("Religion", religionSchema);
export default Religion;