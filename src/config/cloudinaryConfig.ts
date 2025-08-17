import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { CLOUDINARY } from "../utils/constants";

cloudinary.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "uploads",
    resource_type: "auto", // handles images, pdfs, etc.
    transformation: [{ width: 500, height: 500, crop: "limit" }],
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, // Optional: to control filename
  }),
});

const deleteImage = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
      invalidate: true, // Invalidate CDN cache
    });

    if (result.result !== "ok") {
      console.warn(`Failed to delete image: ${publicId} (status: ${result.result})`);
    } else {
      console.log(`Deleted image: ${publicId}`);
    }
  } catch (error) {
    console.error(`Error deleting image (${publicId}):`, error);
    throw error;
  }
};

export const deleteImages = async (publicIds: string[]): Promise<void> => {
  await Promise.all(publicIds.map((id) => deleteImage(id)));
};

export { cloudinary };
