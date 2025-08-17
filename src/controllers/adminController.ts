import { Response } from "express";
import { ExtendedRequest } from "../types/types";
import Religion, { ReligionDocument } from "../models/Religion";
import { getAllReligions } from "../services/religionService";

export const createReligion = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    const { name, attributeKeys } = req.body;

    try {

        const religion: ReligionDocument = await Religion.create({ name: name, attributeKeys: attributeKeys });

        return res.status(200).json({ message: "religion created successfully", religion: religion, success: true });
    } catch (error: any) {
        console.error(error);
        if (error.code === 11000 && error.keyValue?.name) return res.status(409).json({ message: `Religion with name '${error.keyValue.name}' already exists.`, success: false, errorCode: "DUPLICATE_RELIGION_NAME", });
        return res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
};

export const getReligions = async (req: ExtendedRequest, res: Response): Promise<Response> => {
    try {

        const religions: ReligionDocument[] = await getAllReligions();

        return res.status(200).json({ religions: religions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};