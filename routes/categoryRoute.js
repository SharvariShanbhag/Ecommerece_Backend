const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const router = express.Router();
const auth = require('../middleware/auth');



router.post('/create', auth,CategoryController.createCategory)
router.get('/getAllCategories', CategoryController.getAllCategories)
router.get('/getCategoryByID/:id', CategoryController.getCategoryByID)
router.put('/updateCategory', auth,CategoryController.updateCategory)
router.delete('/deleteCategory/:id', auth, CategoryController.deleteCategory)

module.exports = router;


