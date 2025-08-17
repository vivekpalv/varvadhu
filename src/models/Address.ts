import mongoose, { Document, Schema, Types } from "mongoose";


export interface AddressDocument extends Document {
  user: Types.ObjectId;
  addressLine: string;
  district: string;
  state: string;
  country: string;
}

const addressSchema = new Schema<AddressDocument>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addressLine: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
});

const Address = mongoose.model<AddressDocument>('Address', addressSchema);
export default Address;