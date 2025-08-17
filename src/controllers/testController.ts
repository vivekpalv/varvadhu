import { Request, Response } from "express";
import { getLoadAverage, getNetworkInterfaces, getSystemInfo } from "../utils/osUtil";

export const osInformation = (req: Request, res: Response): Response => {
    const os = {
        systemInfo: getSystemInfo(),
        networkInterfaces: getNetworkInterfaces(),
        loadAverage: getLoadAverage()
    }

    return res.status(200).json({os: os});
}