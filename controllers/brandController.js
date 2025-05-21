const Brand = require('../models/brandModel');

const createBrand = async (req, res) => {
    const { name } = req.body;
    try {
        if(!req.user.isAdmin){
             res.status(401).send({ message: 'Not Authorized' });
        }
        const newBrand = await Brand.create({ name });
         res.status(200).send({ message: 'Brand Created Successfully',brand:newBrand, success: true });
    } 
    
    catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll();
        res.status(200).send({ brands: brands, success: true });
    } catch (error) {
        res.status(500).send({ error: error });
    }
};

const getBrandByID = async (req, res) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.status(404).send({ message: 'Brand not found', success: false });
        }
        res.status(200).send({ brand: brand, success: true });
    } catch (error) {
        res.status(500).send({ error: error });
    }
};
const updateBrand = async (req, res) => {
    try {
        // Update the brand and get affected row count
        const [affectedCount] = await Brand.update(req.body, {
            where: { id: req.params.id }
        });

        // If no rows were affected, brand doesn't exist
        if (affectedCount === 0) {
            return res.status(404).json({ 
                message: 'Brand not found', 
                success: false 
            });
        }

        // Get and return the updated brand
        const updatedBrand = await Brand.findByPk(req.params.id);
        return res.status(200).json({ 
            brand: updatedBrand, 
            success: true
        });
        
    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

const deleteBrand = async (req, res) => {
    try {
        const deleted = await Brand.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            return res.status(200).send({ message: 'Brand deleted', success: true });
        }
        res.status(404).send({ message: 'Brand not found', success: false });
    } catch (error) {
        res.status(500).send({ error: error });
    }
};

module.exports = {
    createBrand,
    deleteBrand,
    updateBrand,
    getAllBrands,
    getBrandByID
};










// // arrow fun that is why const
// const Brand =require('../models/brandModel')


// const createBrand = async(req,res)=>{
//     const {name} = req.body
// try{
//     const newBrand= await Brand.create({name})
//         // newBrand.save();
//     res.status(200).send({message:'Brand Created Succesfully',success:true})
// }catch(error){
//     res.status(500).send({error:error})
// }
// }
// //http:localhost:7000/api/brand/create


// const getAllBrands = async(req,res)=>{
// try{
//     const brands = await Brand.findAll()
//     res.status(200).send({brands:brands,success:true})
// }catch(error){
//     res.status(500).send({error:error})
// }
// }


// const getBrandByID  =(req,res)=>{
// try{
//     res.status(200).send({message:'success'})
// }catch(error){
//     res.status(500).send({error:error})
// }
// }


// const updateBrand =(req,res)=>{
// try{
//     res.status(200).send({message:'success'})
// }catch(error){
//     res.status(500).send({error:error})
// }
// }

// const deleteBrand =(req,res)=>{
// try{
//     res.status(200).send({message:'success'})
// }catch(error){
//     res.status(500).send({error:error})
// }
// }

// module.exports = {
//     createBrand,
//     deleteBrand,
//     updateBrand,
//     getAllBrands,
//     getBrandByID
// }