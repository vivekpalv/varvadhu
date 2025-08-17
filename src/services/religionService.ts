import Religion, { ReligionDocument } from "../models/Religion";

export const getAllReligions = async (): Promise<ReligionDocument[]> => {
    const religions: ReligionDocument[] = await Religion.find();
    return religions;
}