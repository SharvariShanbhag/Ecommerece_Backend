const Brand = require('../models/brandModel'); // Import your Sequelize Brand model
const path = require('path');
const fs = require('fs'); // For file system operations (deleting old image)

// Base directory for uploads (must match multer config)
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Helper to delete a file
const deleteFile = (filename) => {
    if (filename) {
        const filePath = path.join(UPLOADS_DIR, filename);
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete old file: ${filePath}`, err);
            else console.log(`Old file deleted: ${filePath}`);
        });
    }
};

// @desc    Create a new Brand
// @route   POST /api/brand/create
// @access  Private (auth required)
exports.createBrand = async (req, res) => {
    try {
        const { name, description } = req.body;
        const imageFilename = req.file ? req.file.filename : null;

        if (!name) {
            if (imageFilename) deleteFile(imageFilename);
            return res.status(400).json({ message: 'Brand name is required.' });
        }

        const brand = await Brand.create({
            name,
            description,
            image: imageFilename
        });

        res.status(201).json({ message: 'Brand created successfully', brand });

    } catch (error) {
        console.error('Error creating brand:', error);
        if (req.file && req.file.filename) { // Clean up uploaded file on server error
            deleteFile(req.file.filename);
        }
        res.status(500).json({ message: 'Server error creating brand.', error: error.message });
    }
};

// @desc    Get all Brands
// @route   GET /api/brand/getAllBrands
// @access  Public
exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll();
        res.status(200).json({ message: 'Brands retrieved successfully', count: brands.length, brands });
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ message: 'Server error fetching brands.', error: error.message });
    }
};

// @desc    Get Brand by ID
// @route   GET /api/brand/getBrandByID/:id
// @access  Public
exports.getBrandByID = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await Brand.findByPk(id);

        if (!brand) {
            return res.status(404).json({ message: 'Brand not found.' });
        }

        res.status(200).json({ message: 'Brand retrieved successfully', brand });
    } catch (error) {
        console.error('Error fetching brand by ID:', error);
        res.status(500).json({ message: 'Server error fetching brand.', error: error.message });
    }
};

// @desc    Update Brand
// @route   PUT /api/brand/updateBrand/:id
// @access  Private (auth required)
exports.updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const imageFilename = req.file ? req.file.filename : null; // New image filename if uploaded

        const brand = await Brand.findByPk(id);

        if (!brand) {
            if (imageFilename) deleteFile(imageFilename);
            return res.status(404).json({ message: 'Brand not found.' });
        }

        const oldImage = brand.image; // Store old image filename before update

        // Update fields if provided
        brand.name = name !== undefined ? name : brand.name;
        brand.description = description !== undefined ? description : brand.description;
        if (imageFilename) { // If a new image was uploaded
            brand.image = imageFilename;
        }

        await brand.save();

        // Delete old image only AFTER successful brand update and if a new image was uploaded
        if (imageFilename && oldImage && oldImage !== imageFilename) {
            deleteFile(oldImage);
        }

        res.status(200).json({ message: 'Brand updated successfully', brand });

    } catch (error) {
        console.error('Error updating brand:', error);
        if (req.file && req.file.filename) { // Clean up new file on error
            deleteFile(req.file.filename);
        }
        res.status(500).json({ message: 'Server error updating brand.', error: error.message });
    }
};

// @desc    Delete Brand
// @route   DELETE /api/brand/deleteBrand/:id
// @access  Private (auth required)
exports.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await Brand.findByPk(id);

        if (!brand) {
            return res.status(404).json({ message: 'Brand not found.' });
        }

        const deletedImage = brand.image; // Get image filename before deletion

        await brand.destroy(); // Delete brand from database

        // Delete the associated image file after successful database deletion
        if (deletedImage) {
            deleteFile(deletedImage);
        }

        res.status(200).json({ message: 'Brand deleted successfully' });

    } catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ message: 'Server error deleting brand.', error: error.message });
    }
};