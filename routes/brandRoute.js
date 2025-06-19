const express = require('express')
const brandController = require('../controllers/brandController')
const authMiddleware = require('../middleware/auth')
const { uploadBrand } = require('../middleware/multer'); // Destructure uploadBrand from multer

const router = express.Router();

router.post('/create', authMiddleware.auth, uploadBrand.single('image'), brandController.createBrand);
router.get('/getAllBrands', brandController.getAllBrands);
router.get('/getBrandByID/:id', brandController.getBrandByID);
router.put('/updateBrand/:id', authMiddleware.auth, uploadBrand.single('image'), brandController.updateBrand);
router.delete('/deleteBrand/:id', authMiddleware.auth, brandController.deleteBrand); 

module.exports = router;