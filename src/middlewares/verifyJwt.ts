import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { APP } from "../utils/constants";
import { extractId } from "../utils/jwtUtil";
import User, { UserDocument } from "../models/User";
import Admin, { AdminDocument } from "../models/Admin";
import { ExtendedRequest } from "../types/types";

const JWT_SECRET: string = APP.JWT_SECRET;

export const verifyUser = async (req: ExtendedRequest, res: Response, next: NextFunction): Promise<any> => {
    const token: string | undefined = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Token is missing, token is required for authentication", success: false });

    const splitedToken = token.split(" ")[1];
    if (!splitedToken) return res.status(401).json({ message: "Unable to split token", success: false });

    try {

        jwt.verify(splitedToken, JWT_SECRET, async (error: any, decoded: any) => {
            if (error) {
                if (error instanceof TokenExpiredError) return res.status(401).json({ message: "Token expired", success: false, tokenExpired: true });
                return res.status(401).json({ message: "Invalid token", success: false, error: error });
            }

            if (!decoded.roles.includes("USER")) return res.status(401).json({ message: "Unauthorized Role", success: false });

            const userId: string = extractId(splitedToken);

            const user: UserDocument | null = await User.findById(userId);
            if (!user) return res.status(401).json({ message: "User not found while verifying token", success: false });

            // (req as any).user = user;
            req.user = user;

            next();
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Invalid token", success: false });
    }
};

export const verifySuperAdmin = async (req: ExtendedRequest, res: Response, next: NextFunction): Promise<any> => {
    const token: string | undefined = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Token is missing, token is required for authentication", success: false });

    const splitedToken = token.split(" ")[1];
    if (!splitedToken) return res.status(401).json({ message: "Unable to split token", success: false });

    try {

        jwt.verify(splitedToken, JWT_SECRET, async (error: any, decoded: any) => {
            if (error) {
                if (error instanceof TokenExpiredError) return res.status(401).json({ message: "Token expired", success: false, tokenExpired: true });
                return res.status(401).json({ message: "Invalid token", success: false, error: error });
            }

            if (!decoded.roles.includes("ADMIN")) return res.status(401).json({ message: "Unauthorized Role", success: false });

            const adminId: string = extractId(splitedToken);

            const admin: AdminDocument | null = await Admin.findById(adminId);
            if (!admin) return res.status(401).json({ message: "Admin not found while verifying token", success: false });

            // (req as any).admin = admin;
            req.admin = admin;

            next();
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Invalid token", success: false });
    }
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const token: string | undefined = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Token is missing, token is required for authentication", success: false });

    const splitedToken = token.split(" ")[1];
    if (!splitedToken) return res.status(401).json({ message: "Unable to split token", success: false });

    try {

        jwt.verify(splitedToken, JWT_SECRET, async (error: any, decoded: any) => {
            if (error) {
                if (error instanceof TokenExpiredError) return res.status(401).json({ message: "Token expired", success: false, tokenExpired: true });
                return res.status(401).json({ message: "Invalid token", success: false, error: error });
            }

            if (!decoded.roles.includes("SUPER_ADMIN")) return res.status(401).json({ message: "Unauthorized Role", success: false });

            const adminId: string = extractId(splitedToken);

            const admin = await Admin.findById(adminId);
            if (!admin) return res.status(401).json({ message: "Admin not found while verifying token", success: false });

            (req as any).admin = admin;

            next();
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Invalid token", success: false });
    }
};