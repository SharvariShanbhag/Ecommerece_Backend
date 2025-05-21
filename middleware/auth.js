const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized - No token provided' 
      });
    }

    const token = authHeader.split(' ')[1].trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Session expired - Please log in again' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = auth;







// const auth =(req,res)=>{
//     console.log(req.headers,"This is headers**********")
// // token = req.headers('authorization')
// token = req.headers['authorization'] 
//     console.log(token)
// if(!token?.startsWith('Bearer ')){
//     res.send({message:"Invalid authorization Header"})
// }
// const token = tokenBearer.split(' ')[1];


// next() 
// }

// module.exports = {auth}



