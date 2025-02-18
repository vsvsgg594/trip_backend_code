import multer from 'multer';

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

// Middleware for handling multiple file uploads
const uploadFields = upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 },
]);

export { upload, uploadFields };
