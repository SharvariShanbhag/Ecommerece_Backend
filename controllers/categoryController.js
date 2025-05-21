const Category = require('../models/categoryModel');
const createCategory = async (req, res) => {
    const { name } = req.body;
    
    try {
        // Validate required fields
        if (!name?.trim()) {
            return res.status(400).send({
                success: false,
                error: "Category name is required (2-30 characters)"
            });
        }

        // Length validation
        if (name.trim().length < 2 || name.trim().length > 30) {
            return res.status(400).send({
                success: false,
                error: "Category name must be 2-30 characters"
            });
        }

        const newCategory = await Category.create({ 
            name: name.trim(),
            is_active: true
        });

        res.status(201).send({
            message: 'Category created successfully',
            success: true,
            category: newCategory
        });

    } catch (error) {
        console.error("Error creating category:", error);
        
        // Handle known errors
        if (error.name === 'SequelizeUniqueConstraintError' || 
            error.message.includes('already exists')) {
            return res.status(409).send({
                success: false,
                error: "Category name already exists"
            });
        }
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).send({
                success: false,
                error: error.errors.map(e => e.message).join(', ')
            });
        }

        // Fallback for unknown errors
        res.status(500).send({
            success: false,
            error: error.message || "Failed to create category"
        });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        
        const findOptions = {
            order: [['created_at', 'DESC']]
        };
        
        if (!includeInactive) {
            findOptions.where = { is_active: true };
        }
        
        const categories = await Category.findAll(findOptions);
        
        res.status(200).send({
            success: true,
            categories: categories,
            count: categories.length
        });

    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send({
            success: false,
            error: "Failed to fetch categories"
        });
    }
};

const getCategoryByID = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        
        if (!category) {
            return res.status(404).send({
                success: false,
                error: "Category not found"
            });
        }

        res.status(200).send({
            success: true,
            category: category
        });

    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).send({
            success: false,
            error: "Failed to fetch category"
        });
    }
};

const updateCategory = async (req, res) => {
    const { name, is_active } = req.body;

    try {
        if (!name || name.trim() === '') {
            return res.status(400).send({
                success: false,
                error: "Category name is required"
            });
        }

        const category = await Category.findByPk(req.params.id);
        
        if (!category) {
            return res.status(404).send({
                success: false,
                error: "Category not found"
            });
        }

        const updatedCategory = await category.update({ 
            name: name.trim(),
            is_active: is_active !== undefined ? is_active : category.is_active
        });
        
        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory
        });

    } catch (error) {
        console.error("Error updating category:", error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send({
                success: false,
                error: "Category name already exists"
            });
        }
        
        res.status(500).send({
            success: false,
            error: "Failed to update category"
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        
        if (!category) {
            return res.status(404).send({
                success: false,
                error: "Category not found"
            });
        }

        await category.destroy();
        
        res.status(200).send({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send({
            success: false,
            error: "Failed to delete category"
        });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryByID,
    updateCategory,
    deleteCategory
};




// const Category =require('../models/categoryModel');
// const createCategory = async(req,res)=>{
//     const {name} = req.body
// try{
//     const newCategory= await Category.create({name})
//         // newBrand.save();
//     res.status(200).send({message:'category Created Succesfully',success:true})
// }catch(error){
//     res.status(500).send({error:error})
// }
// }

// const getAllCategories =async(req,res)=>{
//     try{
//         const categories = await Category.findAll()
//         res.status(200).send({categories:categories,success:true})
//         // res.status(200).send({message :'success'})
//     }catch(error){
//         res.status(500).send({error:error})
//     }
// }


// const getCategoryByID =(req,res)=>{
//     try{
//         res.status(200).send({message :'success'})
//     }catch(error){
//         res.status(500).send({error:error})
//     }
// }

// const updateCategory =(req,res)=>{
//     try{
//         res.status(200).send({message :'success'})
//     }catch(error){
//         res.status(500).send({error:error})
//     }
// }

// const deleteCategory =(req,res)=>{
//     try{
//         res.status(200).send({message :'success'})
//     }catch(error){
//         res.status(500).send({error:error})
//     }
// }

// module.exports = {
//     createCategory,
//     deleteCategory,
//     updateCategory,
//     getAllCategories,
//     getCategoryByID
// }



