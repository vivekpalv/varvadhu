import { Response } from "express";
import { ExtendedRequest } from "../types/types";
import User, { UserDocument } from "../models/User";

export const searchUsers = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const searchQuery = req.query.query;
    console.log("search query::: ", searchQuery);

    try {
        
        const users: UserDocument[] = await User.find().select('name username dob').populate('nativeAddress');

        return res.status(200).json({users: users})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};