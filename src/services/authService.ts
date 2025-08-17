import { ExtendedRequest } from "../types/types";
import { UserDocument } from "../models/User";
import { AdminDocument } from "../models/Admin";

export const loggedInUser = (request: ExtendedRequest): UserDocument => {
    // return (request as any).user;
    return request.user!;
}

export const loggedInAdmin = (request: ExtendedRequest): AdminDocument => {
    return request.admin!;
}