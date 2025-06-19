const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// --- MODIFIED fileFilter for ONLY JPG and PNG ---
const fileFilter = (req, file, cb) => {
    // Check specific MIME types for JPG and PNG
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // Accept the file
    } else {
        // Reject the file and provide a specific error message
        cb(new Error('Only JPG and PNG image files are allowed!'), false);
    }
};

const uploadBrand = multer({ storage: storage, fileFilter: fileFilter });
const uploadCategory = multer({ storage: storage, fileFilter: fileFilter });
const uploadProduct = multer({ storage: storage, fileFilter: fileFilter });

module.exports = {
    uploadBrand,
    uploadCategory,
    uploadProduct
};