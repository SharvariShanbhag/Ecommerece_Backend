const Product = require('../models/productModel'); // Import your Sequelize Product model
const Brand = require('../models/brandModel');   // Import Brand model for associations
const Category = require('../models/categoryModel'); // Import Category model for associations
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

// @desc    Create a new Product
// @route   POST /api/product/create
// @access  Private (auth required)
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, rating, quantity, inStock, categoryId, brandId } = req.body;
        const imageFilename = req.file ? req.file.filename : null;

        // Basic validation
        if (!name || !price || !quantity || !categoryId || !brandId) {
            if (imageFilename) deleteFile(imageFilename); // Clean up uploaded file on validation error
            return res.status(400).json({ message: 'Name, price, quantity, categoryId, and brandId are required.' });
        }

        // Check if Category and Brand exist
        const category = await Category.findByPk(categoryId);
        const brand = await Brand.findByPk(brandId);
        if (!category) {
            if (imageFilename) deleteFile(imageFilename);
            return res.status(404).json({ message: 'Category not found.' });
        }
        if (!brand) {
            if (imageFilename) deleteFile(imageFilename);
            return res.status(404).json({ message: 'Brand not found.' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            rating: rating || 0.0, // Use provided rating or default
            quantity,
            inStock: inStock !== undefined ? inStock : true, // Handle boolean correctly
            image: imageFilename,
            categoryId,
            brandId,
            createdBy: req.user ? req.user.id : null // Assuming req.user is set by auth middleware
        });

        res.status(201).json({ message: 'Product created successfully', product });

    } catch (error) {
        console.error('Error creating product:', error);
        if (req.file && req.file.filename) { // Clean up uploaded file on server error
            deleteFile(req.file.filename);
        }
        res.status(500).json({ message: 'Server error creating product.', error: error.message });
    }
};

// @desc    Get all Products
// @route   GET /api/product/getAllProducts
// @access  Public
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [ // Include associated Brand and Category data
                { model: Brand, as: 'Brand', attributes: ['id', 'name'] },
                { model: Category, as: 'Category', attributes: ['id', 'name'] }
            ]
        });
        res.status(200).json({ message: 'Products retrieved successfully', count: products.length, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error fetching products.', error: error.message });
    }
};

// @desc    Get Product by ID
// @route   GET /api/product/getProductByID/:id
// @access  Public
exports.getProductByID = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [
                { model: Brand, as: 'Brand', attributes: ['id', 'name'] },
                { model: Category, as: 'Category', attributes: ['id', 'name'] }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product retrieved successfully', product });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Server error fetching product.', error: error.message });
    }
};

// @desc    Update Product
// @route   PUT /api/product/updateProduct/:id
// @access  Private (auth required)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, rating, quantity, inStock, categoryId, brandId } = req.body;
        const imageFilename = req.file ? req.file.filename : null;

        const product = await Product.findByPk(id);

        if (!product) {
            if (imageFilename) deleteFile(imageFilename);
            return res.status(404).json({ message: 'Product not found.' });
        }

        const oldImage = product.image; // Store old image filename

        // Update fields if provided
        product.name = name !== undefined ? name : product.name;
        product.description = description !== undefined ? description : product.description;
        product.price = price !== undefined ? price : product.price;
        product.rating = rating !== undefined ? rating : product.rating;
        product.quantity = quantity !== undefined ? quantity : product.quantity;
        product.inStock = inStock !== undefined ? inStock : product.inStock;
        product.categoryId = categoryId !== undefined ? categoryId : product.categoryId;
        product.brandId = brandId !== undefined ? brandId : product.brandId;
        product.updatedBy = req.user ? req.user.id : product.updatedBy; // Update who updated it

        if (imageFilename) { // If a new image was uploaded
            product.image = imageFilename;
        }

        await product.save();

        // Delete old image only after successful product update and if a new image was uploaded
        if (imageFilename && oldImage && oldImage !== imageFilename) {
            deleteFile(oldImage);
        }

        res.status(200).json({ message: 'Product updated successfully', product });

    } catch (error) {
        console.error('Error updating product:', error);
        if (req.file && req.file.filename) { // Clean up new file on error
            deleteFile(req.file.filename);
        }
        res.status(500).json({ message: 'Server error updating product.', error: error.message });
    }
};

// @desc    Delete Product
// @route   DELETE /api/product/deleteProduct/:id
// @access  Private (auth required)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const deletedImage = product.image; // Get image filename before deletion

        await product.destroy(); // Delete product from database

        // Delete the associated image file after successful database deletion
        if (deletedImage) {
            deleteFile(deletedImage);
        }

        res.status(200).json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error deleting product.', error: error.message });
    }
};

// @desc    Get Products by Category
// @route   GET /api/product/byCategory/:categoryId
// @access  Public
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.findAll({
            where: { categoryId },
            include: [
                { model: Brand, as: 'Brand', attributes: ['id', 'name'] },
                { model: Category, as: 'Category', attributes: ['id', 'name'] }
            ]
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this category.' });
        }

        res.status(200).json({ message: 'Products by category retrieved successfully', count: products.length, products });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Server error fetching products by category.', error: error.message });
    }
};

// @desc    Get Products by Brand
// @route   GET /api/product/byBrand/:brandId
// @access  Public
exports.getProductsByBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        const products = await Product.findAll({
            where: { brandId },
            include: [
                { model: Brand, as: 'Brand', attributes: ['id', 'name'] },
                { model: Category, as: 'Category', attributes: ['id', 'name'] }
            ]
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this brand.' });
        }

        res.status(200).json({ message: 'Products by brand retrieved successfully', count: products.length, products });
    } catch (error) {
        console.error('Error fetching products by brand:', error);
        res.status(500).json({ message: 'Server error fetching products by brand.', error: error.message });
    }
};