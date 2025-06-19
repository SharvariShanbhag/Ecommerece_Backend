const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth')
const { uploadCategory } = require('../middleware/multer'); // Destructure uploadCategory from multer

router.post('/create', authMiddleware.auth, uploadCategory.single('image'), categoryController.createCategory);
router.get('/getAllCategories', categoryController.getAllCategories);
router.get('/getCategoryByID/:id', categoryController.getCategoryByID);
router.put('/updateCategory/:id', authMiddleware.auth, uploadCategory.single('image'), categoryController.updateCategory);
router.delete('/deleteCategory/:id', authMiddleware.auth, categoryController.deleteCategory); 

module.exports = router;