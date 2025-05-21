const Products = require('../models/productModel');

const createProduct = async (req, res) => {
    const { name, price, category_id, brand_id, Quantity, description, InStock } = req.body;
    
    try {
        // Validate required fields
        if (!name || !price || !category_id || !brand_id || !Quantity) {
            return res.status(400).send({
                success: false,
                error: "Missing required fields (name, price, category_id, brand_id, Quantity)"
            });
        }

        const newProduct = await Products.create({
            name,
            price,
            category_id,
            brand_id,
            Quantity,
            description,  // Optional
            InStock: InStock !== undefined ? InStock : true  // Defaults to true
        });

        res.status(201).send({
            message: 'Product created successfully',
            success: true,
            product: newProduct
        });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send({
            success: false,
            error: error.message || "Failed to create product"
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Products.findAll();
        res.status(200).send({
            success: true,
            products: products  // Fixed: Return actual products instead of the model
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({
            success: false,
            error: "Failed to fetch products"
        });
    }
};

const getProductsByID = async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send({
                success: false,
                error: "Product not found"
            });
        }
        res.status(200).send({
            success: true,
            product: product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send({
            success: false,
            error: "Failed to fetch product"
        });
    }
};

const updateProducts = async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send({
                success: false,
                error: "Product not found"
            });
        }

        const updatedProduct = await product.update(req.body);
        res.status(200).send({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send({
            success: false,
            error: "Failed to update product"
        });
    }
};

const deleteProducts = async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send({
                success: false,
                error: "Product not found"
            });
        }

        await product.destroy();
        res.status(200).send({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send({
            success: false,
            error: "Failed to delete product"
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductsByID,
    updateProducts,
    deleteProducts
};




// const Products = require('../models/productModel'); // Make sure to import your model



// const createProduct = async(req,res)=>{
//     const {name} = req.body
// try{
//     const newProduct= await Products.create({name})
//         // newBrand.save();
//     res.status(200).send({message:'Product Created Succesfully',success:true})
// }catch(error){
//     res.status(500).send({error:error})
// }
// }

// const getAllProducts =async(req,res)=>{
//     try{
//         const products = await Products.findAll()
//         res.status(200).send({Products:Products,success:true})
//         // res.status(200).send({message :'success'})
//     }catch(error){
//         res.status(500).send({error:error})
//     }
// }


// const getProductsByID =(req,res)=>{
//     try{
//         res.status(200).send({message :'success'})
//     }catch(error){
//         res.status(500).send({error:error})
//     }
// }

// const updateProducts =(req,res)=>{
//     try{
//         res.status(200).send({message :'success'})
//     }catch(error){
//         res.status(500).send({error:error})
//     }
// }

// const deleteProducts =(req,res)=>{
//     try{
//         res.status(200).send({message :'success'})
//     }catch(error){
//         res.status(500).send({error:error})
//     }
// }



// module.exports = {
//     createProduct,
//     getAllProducts,
//     getProductsByID,
//     updateProducts,
//     deleteProducts
// };