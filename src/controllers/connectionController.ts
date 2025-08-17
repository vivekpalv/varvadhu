import { Response } from "express";
import { ExtendedRequest } from "../types/types";
import User, { UserDocument } from "../models/User";
import { loggedInUser } from "../services/authService";
import { allUserRequests, allUserSentRequests, approvedUsersOfUser } from "../services/userService";

export const sendRequest = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const targetUserId = req.params.sendToUserId;

    try {

        const targetUser: UserDocument | null = await User.findById(targetUserId).exec();
        if (!targetUser) return res.status(404).json({ message: "User not found", success: false });
        if (currentUser.sentRequests.some(id => id.toString() === targetUserId)) return res.status(400).json({ message: "You have already sent a request to this user", success: false });
        if (targetUser.isBlacklisted) return res.status(400).json({ message: "This user is Blacklisted", success: false });

        currentUser.sentRequests.push(targetUser._id);
        targetUser.receivedRequests.push(currentUser._id);

        await Promise.all([currentUser.save(), targetUser.save()]);

        return res.status(200).json({ message: "Request sent successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending request" });
    }
};

export const acceptRequest = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const acceptingUserId = req.params.acceptingUserId;

    try {

        const acceptingUser: UserDocument | null = await User.findById(acceptingUserId).exec();
        if (!acceptingUser) return res.status(404).json({ message: "User not found", success: false });
        if (!currentUser.receivedRequests.some(id => id.toString() === acceptingUserId)) return res.status(400).json({ message: "You have not received a request from this user", success: false });
        if (acceptingUser.isBlacklisted) return res.status(400).json({ message: "This user is Blacklisted", success: false });

        currentUser.approvedUsers.push(acceptingUser._id);
        acceptingUser.approvedUsers.push(currentUser._id);

        currentUser.receivedRequests = currentUser.receivedRequests.filter(id => id.toString() !== acceptingUserId);
        acceptingUser.sentRequests = acceptingUser.sentRequests.filter(id => id.toString() !== currentUser._id.toString());

        await Promise.all([currentUser.save(), acceptingUser.save()]);

        return res.status(200).json({ message: "Request accepted successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending request" });
    }
};

export const rejectRequest = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const rejectingUserId = req.params.rejectingUserId;

    try {

        const rejectUser: UserDocument | null = await User.findById(rejectingUserId);
        if (!rejectUser) return res.status(404).json({ message: "user not found", success: false });

        currentUser.receivedRequests = currentUser.receivedRequests.filter(id => id.toString() !== rejectingUserId);
        rejectUser.sentRequests = rejectUser.sentRequests.filter(id => id.toString() !== currentUser._id.toString());

        await Promise.all([currentUser.save(), rejectUser.save()]);

        return res.status(200).json({ message: "user rejected successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending request" });
    }
};

export const revokeSentRequest = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const revokeUserId = req.params.revokeUserId;

    try {

        const revokeUser: UserDocument | null = await User.findById(revokeUserId);
        if (!revokeUser) return res.status(404).json({ message: "user not found", success: false });

        currentUser.sentRequests = currentUser.sentRequests.filter(id => id.toString() !== revokeUserId);
        revokeUser.receivedRequests = revokeUser.receivedRequests.filter(id => id.toString() !== currentUser._id.toString());

        await Promise.all([currentUser.save(), revokeUser.save()]);

        return res.status(200).json({ message: "request revoked successfully", success: true })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending request" });
    }
};

export const currentUserApprovedUsers = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);

    try {
        
        const approvedUsers: UserDocument[] = await approvedUsersOfUser(currentUser._id);

        return res.status(200).json({approvedUsers: approvedUsers});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending request" });
    }
};

export const currentUserAllRequests = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);

    try {
        
        const allRequests: UserDocument[] = await allUserRequests(currentUser._id);

        return res.status(200).json({requests: allRequests});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending request" });
    }
};

export const currentUserSentRequests = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);

    try {
        
        const sentRequests: UserDocument[] = await allUserSentRequests(currentUser._id);

        return res.status(200).json({sentRequests: sentRequests});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending request" });
    }
};