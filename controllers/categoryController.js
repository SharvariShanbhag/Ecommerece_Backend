const Category = require('../models/categoryModel'); // Import your Sequelize Category model
const path = require('path');
const fs = require('fs'); // For file system operations

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

// @desc    Create a new Category
// @route   POST /api/category/create
// @access  Private (auth required)
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const imageFilename = req.file ? req.file.filename : null;

        if (!name) {
            if (imageFilename) deleteFile(imageFilename);
            return res.status(400).json({ message: 'Category name is required.' });
        }

        const category = await Category.create({
            name,
            description,
            image: imageFilename
        });

        res.status(201).json({ message: 'Category created successfully', category });

    } catch (error) {
        console.error('Error creating category:', error);
        if (req.file && req.file.filename) {
            deleteFile(req.file.filename);
        }
        res.status(500).json({ message: 'Server error creating category.', error: error.message });
    }
};

// @desc    Get all Categories
// @route   GET /api/category/getAllCategories
// @access  Public
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({ message: 'Categories retrieved successfully', count: categories.length, categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error fetching categories.', error: error.message });
    }
};

// @desc    Get Category by ID
// @route   GET /api/category/getCategoryByID/:id
// @access  Public
exports.getCategoryByID = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.status(200).json({ message: 'Category retrieved successfully', category });
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({ message: 'Server error fetching category.', error: error.message });
    }
};

// @desc    Update Category
// @route   PUT /api/category/updateCategory/:id
// @access  Private (auth required)
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const imageFilename = req.file ? req.file.filename : null;

        const category = await Category.findByPk(id);

        if (!category) {
            if (imageFilename) deleteFile(imageFilename);
            return res.status(404).json({ message: 'Category not found.' });
        }

        const oldImage = category.image;

        category.name = name !== undefined ? name : category.name;
        category.description = description !== undefined ? description : category.description;
        if (imageFilename) {
            category.image = imageFilename;
        }

        await category.save();

        if (imageFilename && oldImage && oldImage !== imageFilename) {
            deleteFile(oldImage);
        }

        res.status(200).json({ message: 'Category updated successfully', category });

    } catch (error) {
        console.error('Error updating category:', error);
        if (req.file && req.file.filename) {
            deleteFile(req.file.filename);
        }
        res.status(500).json({ message: 'Server error updating category.', error: error.message });
    }
};

// @desc    Delete Category
// @route   DELETE /api/category/deleteCategory/:id
// @access  Private (auth required)
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        const deletedImage = category.image;

        await category.destroy();

        if (deletedImage) {
            deleteFile(deletedImage);
        }

        res.status(200).json({ message: 'Category deleted successfully' });

    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error deleting category.', error: error.message });
    }
};