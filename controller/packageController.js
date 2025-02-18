import Package from "../model/Package.js";
import {uploadedFileOnCloudinary} from '../utils/clouldinary.js'

export const packageController = async (req, res) => {
    console.log(req.files);
    try {
        const packageData = req.body;
        console.log("Request Files:", req.files);

        if (!packageData.packageName || !packageData.hotelName || !packageData.packageDestination || !packageData.location || !packageData.selectedCities || !packageData.price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let mainImageUrl = null;
        if (req.files?.mainImage && req.files.mainImage[0]) {
            const uploadedMainImage = await uploadedFileOnCloudinary(req.files.mainImage[0].path);
            mainImageUrl = uploadedMainImage?.secure_url || null;
        }

        const additionalImageUrls = [];
        if (req.files?.additionalImages && req.files.additionalImages.length > 0) {
            for (const file of req.files.additionalImages) {
                const uploadedImage = await uploadedFileOnCloudinary(file.path);
                if (uploadedImage) {
                    additionalImageUrls.push(uploadedImage.secure_url);
                }
            }
        }

        // Include images in packageData
        const newPackage = new Package({
            ...packageData,
            mainImage: mainImageUrl,
            additionalImages: additionalImageUrls,
        });

        await newPackage.save();

        return res.status(200).json({
            message: "Package created successfully",
            newPackage,
        });

    } catch (error) {
        console.error("Failed to create package:", error);
        return res.status(500).json({ message: "Failed to create package" });
    }
};


export const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find();

        if (packages.length === 0) {
            return res.status(404).json({ message: "No packages found" });
        }

        return res.status(200).json({
            message: "Packages retrieved successfully",
            packages
        });

    } catch (err) {
        console.error("Failed to get all packages:", err);  
        return res.status(500).json({ message: "Failed to get packages", error: err.message });
    }
};


export const deletePackage = async (req, res) => {
    try {
        const { packageId } = req.params; 

        const packageToDelete = await Package.findByIdAndDelete(packageId); 

        if (!packageToDelete) {
            return res.status(404).json({ message: "Package not found" }); 
        }

        return res.status(200).json({ message: "Package deleted successfully" });

    } catch (error) {
        console.error("Error deleting package:", error); 
        return res.status(500).json({ message: "Failed to delete package", error: error.message });
    }
};
