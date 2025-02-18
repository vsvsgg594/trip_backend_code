import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
cloudinary.config(
    {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET

    }
)


const uploadedFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("File uploaded on Cloudinary:", response.secure_url);

        // Delete the local file after upload to save storage
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        
        // Ensure local file gets deleted even on error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return null;
    }
};
export {uploadedFileOnCloudinary};