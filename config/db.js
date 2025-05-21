






const {Sequelize} =require('sequelize')
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER,
    process.env.PASSWORD,{
        host:process.env.HOST,
        dialect :"mysql",
        logging : false,
        dialectOptions :{
            //ssl options
        }
    }
)

//annonymous self invoke funstion
const connectDB = async ()=>{
    try{
        await sequelize.authenticate();
        console.log("Database connected successfully")


        await sequelize.sync({alter :false})
        // await sequelize.sync({ 
        //     alter: process.env.NODE_ENV === 'development' 
        // });

    }catch(error){
        console.error("unable to connect",error)
        //atleast one time exicute
        //after error it tries to reconnect
        
        process.exit(1);
        //after error it will stop

    }
};

connectDB();
module.exports = sequelize;