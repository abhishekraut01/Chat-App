import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs/promises"; // Use Promises API for async file system operations
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

// Configure Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

/**
 * Upload a file to Cloudinary.
 * @param {string} localFilePath - The path to the local file to upload.
 * @returns {Promise<UploadApiResponse | null>} - Cloudinary response object on success, or null on failure.
 */
const uploadOnCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
    try {
        if (!localFilePath) {
            console.error("No file path provided for Cloudinary upload.");
            return null;
        }

        // Upload file to Cloudinary
        const response: UploadApiResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Auto-detect the file type (image, video, etc.)
        });

        // Delete the local file after successful upload
        await fs.unlink(localFilePath);
        return response;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);

        // Attempt to delete the local file if an error occurs
        try {
            await fs.unlink(localFilePath);
            console.log(`Local file deleted: ${localFilePath}`);
        } catch (unlinkError) {
            console.error(`Failed to delete local file: ${localFilePath}`, unlinkError);
        }

        return null;
    }
};

export default uploadOnCloudinary;