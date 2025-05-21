const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/create', productController.createProduct);
router.get('/getAllproducts', productController.getAllProducts);
router.get('/getproductByID/:id', productController.getProductsByID);
router.put('/updateproduct/:id', productController.updateProducts); // Added :id
router.delete('/deleteproduct/:id', productController.deleteProducts);

module.exports = router;