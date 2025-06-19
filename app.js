   const express = require('express');
   const app = express();
   const cors = require('cors');
   const path = require('path');
   require('dotenv').config(); // Ensure dotenv is loaded at the very top

   const { sequelize, mongoose } = require('./config/db');

   const User = require('./models/userModel');
   const Brand = require('./models/brandModel');
   const Category = require('./models/categoryModel');
   const Product = require('./models/productModel');

   Brand.hasMany(Product, { foreignKey: 'brandId', as: 'Products' });
   Category.hasMany(Product, { foreignKey: 'categoryId', as: 'Products' });

   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use(cors({
       origin: ['http://localhost:3000', 'http://localhost:3001'],
       credentials: true,
   }));

   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

   const brandRoute = require('./routes/brandRoute');
   app.use('/api/brand', brandRoute);

   const productRoute = require('./routes/productRoute');
   app.use('/api/product', productRoute);

   const categoryRoute = require('./routes/categoryRoute');
   app.use('/api/category', categoryRoute);

   const userRoute = require('./routes/userRoute');
   app.use('/api/user', userRoute);

   (async () => {
       try {
           // *** DANGER: Setting { force: true } will DROP (delete) existing tables and recreate them.
           // *** This will lead to DATA LOSS in your MySQL database for these models.
           // *** ONLY USE THIS IN DEVELOPMENT WHEN YOU ARE OK WITH LOSING DATA.
           // *** AFTER RUNNING ONCE SUCCESSFULLY, CHANGE IT BACK TO { alter: false } OR { force: false }
           await sequelize.sync({ force: false }); // DANGEROUS TEMPORARY CHANGE HERE
           console.log('MySQL models synchronized (tables dropped and recreated).');

           const PORT = process.env.PORT || 7001;
           app.listen(PORT, () => {
               console.log(`Server running on port ${PORT}`);
           });

       } catch (error) {
           console.error('Fatal error during database sync or server start:', error);
           process.exit(1);
       }
   })();
   