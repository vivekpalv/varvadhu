import { response, Response } from "express";
import { ExtendedRequest } from "../types/types";
import { loggedInUser } from "../services/authService";
import User, { UserDocument } from "../models/User";
import { clodinaryPublicId } from "../utils/extractor";
import Education, { EducationDocument } from "../models/Education";
import Address, { AddressDocument } from "../models/Address";
import Family, { FamilyDocument } from "../models/Family";
import UserReligion, { UserReligionDocument } from "../models/UserReligion";
import UserPreference, { UserPreferenceDocument } from "../models/UserPreference";
import Religion, { ReligionDocument } from "../models/Religion";
import mongoose, { Types } from "mongoose";

export const currentUser = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const user: UserDocument = loggedInUser(req);

    try {

        const currentUser = await User.findById(user._id).populate('religion').populate('family').populate('currentAddress').populate('nativeAddress').populate('educations').select('-__v -createdAt -updatedAt').exec();

        return res.status(200).json({ user: currentUser, success: true });
    } catch (error) {
        console.error(error);
        return res.status(200).json({ message: "Internal Server Error", success: false, error: error });
    }
};

export const updateProfile = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const user: UserDocument = loggedInUser(req);
    const { name, email, username, mobile, diet, dob, color, height, weight, nationality, gender, languages, nri, annualIncome, occupation, about } = req.body;

    try {

        const query: any = {};

        if (name) query.name = name;
        if (email) query.email = email;
        if (username) query.username = username;
        if (mobile) query.mobile = mobile;
        if (diet) query.diet = diet;
        if (dob) query.dob = dob;
        if (color) query.color = color;
        if (height) query.height = height;
        if (weight) query.weight = weight;
        if (nationality) query.nationality = nationality;
        if (gender) query.gender = gender;
        if (languages) query.languages = languages;
        if (nri) query.nri = nri;
        if (annualIncome) query.annualIncome = annualIncome;
        if (occupation) query.occupation = occupation;
        if (about) query.about = about;

        const updatedUser = await User.findByIdAndUpdate(user._id, query, { new: true }).exec();

        return res.status(200).json({ message: "User updated successfully", success: true, user: updatedUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
};

export const uploadProfilePicture = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const user: UserDocument = loggedInUser(req);
    const file = req.file as Express.Multer.File | undefined;

    if (!file) return res.status(422).json({ message: "No file uploaded", success: false });

    try {

        const profileImgUrl = file.path;
        const updatedUser: UserDocument | null = await User.findByIdAndUpdate(user._id, { profilePicture: profileImgUrl }, { new: true }).exec();
        if (!updatedUser) return res.status(404).json({ message: "User not found", success: false });

        return res.status(200).json({ message: "Profile picture uploaded successfully", success: true, image: updatedUser.profilePicture });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
};

export const addImageToGallery = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const files = req.files as Express.Multer.File[];

    if (files.length === 0) return res.status(422).json({ message: "No files uploaded", success: false });

    try {

        // console.log("files array:: ", files);

        const imagesPath: string[] = files.map((image) => { return image.path });

        const user: UserDocument | null = await User.findById(currentUser._id).exec();
        if (!user) return res.status(404).json({ message: "User not found", success: false });

        imagesPath.forEach(cloudinaryPath => user.gallery.push(cloudinaryPath));

        await user.save();

        const publicIds: (string | null)[] = imagesPath.map(url => clodinaryPublicId(url));
        console.log(publicIds);

        return res.status(200).json({ message: "Images added to gallery successfully", success: true, addedImages: imagesPath });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
};

export const addEducation = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const { degree, passingYear, institution, mode, country } = req.body;

    try {

        const education: EducationDocument = await Education.create({
            user: currentUser._id,
            degree: degree,
            passingYear: passingYear,
            institution: institution,
            mode: mode,
            country: country,
        });

        currentUser.educations?.push(education._id as Types.ObjectId);
        await currentUser.save();

        return res.status(201).json({ message: "education added successfully", education: education });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
};

export const removeEducation = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const educationId = req.params.educationId;

    try {

        const result = await Education.deleteOne({ _id: educationId, user: currentUser._id });

        if (result.deletedCount === 0) return res.status(404).json({ message: "education not found", success: false });

        return res.status(200).json({ message: "education deleted successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
};

export const setNativeAddress = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const { addressLine, district, state, country } = req.body;

    if (!addressLine && !district && !state && !country) return res.status(422).json({ message: "At least one address field is required", success: false });

    try {

        if (currentUser.nativeAddress) {
            const nativeAddress: AddressDocument | null = await Address.findById(currentUser.nativeAddress).exec();
            if (!nativeAddress) return res.status(404).json({ message: "native address not found" });

            if (addressLine) nativeAddress.addressLine = addressLine;
            if (district) nativeAddress.district = district;
            if (state) nativeAddress.state = state;
            if (country) nativeAddress.country = country;

            nativeAddress.save();

            return res.status(200).json({ message: "address updated successfully", success: true, address: nativeAddress });
        } else {
            const address: AddressDocument = await Address.create({
                user: currentUser._id,
                addressLine: addressLine,
                district: district,
                state: state,
                country: country
            });

            await User.findByIdAndUpdate(currentUser._id, { nativeAddress: address._id });

            return res.status(201).json({ message: "address created successfully", success: true, address: address });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
};

export const setCurrentAddress = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const { addressLine, district, state, country } = req.body;

    if (!addressLine && !district && !state && !country) return res.status(422).json({ message: "At least one address field is required", success: false });

    try {

        if (currentUser.currentAddress) {
            const currentAddress: AddressDocument | null = await Address.findById(currentUser.currentAddress).exec();
            if (!currentAddress) return res.status(404).json({ message: "native address not found" });

            if (addressLine) currentAddress.addressLine = addressLine;
            if (district) currentAddress.district = district;
            if (state) currentAddress.state = state;
            if (country) currentAddress.country = country;

            currentAddress.save();

            return res.status(200).json({ message: "address updated successfully", success: true, address: currentAddress });
        } else {
            const address: AddressDocument = await Address.create({
                user: currentUser._id,
                addressLine: addressLine,
                district: district,
                state: state,
                country: country
            });

            await User.findByIdAndUpdate(currentUser._id, { currentAddress: address._id });

            return res.status(201).json({ message: "address created successfully", success: true, address: address });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
};

export const setFamilyDetails = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const { fatherOccupation, motherOccupation, type, totalMembers, numberOfElderBrothers, numberOfElderSisters, numberOfYoungerBrothers, numberOfYoungerSisters } = req.body;

    try {
        if (currentUser.family) {
            const family: FamilyDocument | null = await Family.findById(currentUser.family).exec();
            if (!family) return res.status(404).json({ message: "family not found", success: false });

            if (fatherOccupation) family.fatherOccupation = fatherOccupation;
            if (motherOccupation) family.motherOccupation = motherOccupation;
            if (type) family.type = type;
            if (totalMembers) family.totalMembers = totalMembers;
            if (numberOfElderBrothers) family.numberOfElderBrothers = numberOfElderBrothers;
            if (numberOfElderSisters) family.numberOfElderSisters = numberOfElderSisters;
            if (numberOfYoungerBrothers) family.numberOfYoungerBrothers = numberOfYoungerBrothers;
            if (numberOfYoungerSisters) family.numberOfYoungerSisters = numberOfYoungerSisters;

            await family.save();

            return res.status(200).json({ message: "family details updated successfully", success: true, family: family });
        } else {

            const family: FamilyDocument = await Family.create({
                user: currentUser._id,
                fatherOccupation: fatherOccupation,
                motherOccupation: motherOccupation,
                type: type,
                totalMembers: totalMembers,
                numberOfElderBrothers: numberOfElderBrothers,
                numberOfElderSisters: numberOfElderSisters,
                numberOfYoungerBrothers: numberOfYoungerBrothers,
                numberOfYoungerSisters: numberOfYoungerSisters
            });

            await User.findByIdAndUpdate(currentUser._id, { family: family._id });

            return res.status(200).json({ message: "family created successfully", success: true, family: family });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
};

export const setUserReligion = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const { religionId, attributes } = req.body;
    if (!mongoose.Types.ObjectId.isValid(religionId)) return res.status(422).json({ message: "Religion ID is not valid", success: false });
    if (!Array.isArray(attributes)) return res.status(422).json({ message: "Attributes should be an array", success: false });

    try {

        const existingReligion = await Religion.findById(religionId).exec();
        if (!existingReligion) return res.status(404).json({ message: "Religion not found", success: false });

        const existingAttributeKeys = existingReligion.attributeKeys.map(meta => meta.key);
        const existingAttributeKeysOptional = existingReligion.attributeKeys.filter(meta => meta.isMandatory === false).map(meta => meta.key);
        console.log("existingAttributeKeys:: ", existingAttributeKeys);
        console.log("existingAttributeKeysOptional:: ", existingAttributeKeysOptional);

        attributes.forEach(attr => {
            if (!attr.key || !attr.value) return res.status(422).json({ message: "Each attribute should have a key and value", success: false });
            if (!existingAttributeKeys.includes(attr.key)) return res.status(422).json({ message: `Attribute key ${attr.key} not valid`, success: false });
        });

        console.log("attributes:: ", attributes);

        if (currentUser.religion) {

            console.log("updating user religion");

            const userReligion = await UserReligion.findById(currentUser.religion).exec();
            if (!userReligion) return res.status(404).json({ message: "user religion not found", success: false });

            userReligion.religion = existingReligion._id as Types.ObjectId;
            userReligion.name = existingReligion.name;
            userReligion.attributes = attributes;

            userReligion.save();

            return res.status(200).json({ message: "user's religion updated successfully", success: true, userReligion: userReligion })
        } else {

            console.log("creating user religion");

            const userReligion: UserReligionDocument = await UserReligion.create({
                user: currentUser._id,
                religion: existingReligion._id as Types.ObjectId,
                name: existingReligion.name,
                attributes: attributes
            });


            await User.findByIdAndUpdate(currentUser._id, { religion: userReligion._id });

            return res.status(200).json({ message: "user's religion created successfully", success: true, userReligion: userReligion })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
};

export const setUserPreference = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const currentUser: UserDocument = loggedInUser(req);
    const { religionId, minAge, maxAge, annualIncome, height, state } = req.body;

    try {

        if (currentUser.preference) {
            const preference: UserPreferenceDocument | null = await UserPreference.findById(currentUser.preference).exec();
            if (!preference) return res.status(404).json({ message: "prefernce not found", success: false });

            if (minAge) preference.minAge = minAge;
            if (maxAge) preference.maxAge = maxAge;
            if (annualIncome) preference.annualIncome = annualIncome;
            if (height) preference.height = height;
            if (state) preference.state = state;

            await preference.save();

            return res.status(200).json({ message: "preference updated succesfully", success: true, preference: preference });
        } else {
            const religion: ReligionDocument | null = await Religion.findById(religionId).exec();
            if (!religion) return res.status(404).json({ message: "Religion not found", success: false });

            const preference = await UserPreference.create({
                user: currentUser._id,
                religion: religion._id,
                minAge: minAge,
                maxAge: maxAge,
                annualIncome: annualIncome,
                height: height,
                state: state
            });

            return res.status(201).json({ message: "preference created successfully", success: true, preference: preference });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
};
