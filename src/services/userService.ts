import { Types } from "mongoose";
import User, { UserDocument } from "../models/User";

/** all incoming requests of the user */
export const allUserRequests = async (userId: Types.ObjectId): Promise<UserDocument[]> => {
    const users: UserDocument[] = await User.find({ receivedRequests: { $in: [userId] } }).exec();
    return users;
};

/** all approved users of the user */
export const approvedUsersOfUser = async (userId: Types.ObjectId): Promise<UserDocument[]> => {
    const users: UserDocument[] = await User.find({ approvedRequests: { $in: [userId] } }).exec();
    return users;
};

/** all sented requests of the user */
export const allUserSentRequests = async (userId: Types.ObjectId): Promise<UserDocument[]> => {
    const users: UserDocument[] = await User.find({ sentRequests: { $in: [userId] } }).exec();
    return users;
};