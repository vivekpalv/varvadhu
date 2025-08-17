import { Request } from "express";
import { UserDocument } from "../models/User";
import { AdminDocument } from "../models/Admin";

export interface ExtendedRequest extends Request {
    user?: UserDocument | null;
    admin?: AdminDocument | null;
};