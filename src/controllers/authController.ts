import { Request, Response } from "express";
import User from "../models/User";
import { signToken } from "../utils/jwtUtil";
import Otp from "../models/Otp";
import { otpGenerator } from "../utils/generator";
import { OTP } from "../utils/constants";
import Admin from "../models/Admin";
import { AdminRole } from "../types/enums";

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    const { name, mobile, dob, gender, nationality, otp, profileCreatedBy, maritalStatus, email } = req.body;

    try {
        const validOtp = await Otp.findOne({ mobile: mobile, otp: otp, type: "REGISTER" });
        if (!validOtp) return res.status(404).json({ message: "Invalid OTP", success: false });

        const user = await User.findOne({ mobile: mobile }).exec(); // exec returns a promise not a thenable (promise is more safer than thenable)
        if (user) return res.status(404).json({ message: "User already exists", success: false });

        const nameWithoutSpaces = name.replace(/\s+/g, '_'); // Replace spaces with underscores
        const currentDate = new Date();
        const username = `${nameWithoutSpaces}_${mobile}_${currentDate.getTime()}`; // Create a unique username based on name, mobile, and current timestamp

        const newUser = await User.create({ 
            name: name, 
            username: username, 
            mobile: mobile, 
            dob: dob, 
            gender: gender, 
            nationality: nationality, 
            profileCreatedBy: profileCreatedBy, 
            maritalStatus: maritalStatus, 
            email: email,
            percentage: 20 // Initial percentage can be set to 20 or any other value as per your logic
        });

        const userId: string = newUser._id.toString();
        const roles: string[] = [newUser.role];

        const token: string = signToken(userId, roles);

        await Otp.deleteMany({mobile: mobile, type: "REGISTER"}).exec();

        return res.status(201).json({ message: "User created successfully", success: true, token: token, user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
    const { mobile, otp } = req.body;

    try {

        const validOtp = await Otp.findOne({ mobile: mobile, type: "LOGIN", otp: otp }).exec();
        if (!validOtp) return res.status(404).json({ message: "Invalid OTP", success: false });

        const user = await User.findOne({ mobile: mobile }).exec();
        if (!user) return res.status(404).json({ message: "User not found", success: false });

        const userId: string = user._id.toString();
        const roles: string[] = [user.role];

        const token: string = signToken(userId, roles);

        await Otp.deleteMany({ mobile: mobile, type: "LOGIN" }).exec();

        return res.status(200).json({ message: "User logged in successfully", success: true, token: token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const sendLoginResgiterOtp = async (req: Request, res: Response): Promise<Response> => {
    const { mobile } = req.body;

    if (!mobile) return res.status(400).json({ message: "Mobile number is required", success: false });

    try {

        const user = await User.findOne({ mobile: mobile }).exec();
        const otp: number = otpGenerator(OTP.LENGTH);

        if (user) {

            const existingOtp = await Otp.findOne({ mobile: mobile, type: "LOGIN" }).exec();

            if (existingOtp) {
                existingOtp.otp = otp;
                existingOtp.expireAt = new Date(Date.now() + OTP.LOGIN_EXPIRY);
                await existingOtp.save();

                return res.status(200).json({ message: "OTP re-sent successfully", success: true, existed: true });
            };

            await Otp.create({ mobile: mobile, type: "LOGIN", otp: otp });

            return res.status(200).json({ message: "OTP sent successfully", success: true, existed: true });
        } else {

            const registerOtpExpiry: Date = new Date(Date.now() + OTP.REGISTER_EXPIRY);

            const existingOtp = await Otp.findOne({ mobile: mobile, type: "REGISTER" }).exec();

            if (existingOtp) {
                existingOtp.otp = otp;
                existingOtp.expireAt = registerOtpExpiry;
                await existingOtp.save();

                return res.status(200).json({ message: "OTP re-sent successfully", success: true, existed: false });
            };
            await Otp.create({ mobile: mobile, type: "REGISTER", otp: otp, expireAt: registerOtpExpiry });

            return res.status(200).json({ message: "OTP sent successfully", success: true, existed: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};


export const adminSignUp = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password } = req.body;

    try {

        const admin = await Admin.create({ 
            name: name,
            email: email, 
            password: password,
            roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN]
        });
        
        return res.status(200).json({ message: "Admin signup not implemented yet", success: true, admin: admin });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const adminLogin = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {

        const admin = await Admin.findOne({ email: email, password: password }).exec();
        if (!admin) return res.status(404).json({ message: "Admin not found", success: false });

        const token: string = signToken(admin._id.toString(), admin.roles);

        return res.status(200).json({ message: "Admin logged in successfully", success: true, token: token, admin: admin });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};