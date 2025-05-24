const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const registerUser = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    
    try {
      if(!req.user.isAdmin){
        res.status(401).send({message:"Not Authorized"})
      }
        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send({ 
                message: "User already exists", 
                success: false 
            });
        }

        // Create new user
        const newUser = await User.create({ 
            name, 
            email, 
            password,
            isAdmin: isAdmin || false // Default to false if not specified
        });
        
        res.status(201).send({ 
            message: 'User registered successfully', 
            success: true,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                isAdmin: newUser.isAdmin
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
}
// const registerUser = async (req, res) => {
//     const{name,email,password}= req.body
//     try {
//         // const existingUser = findOne({email})
//         // console.log(existingUser);
//         // if(existingUser){
//         //     res.status(202).send({message:"user already exist",success:true})
//         // }
//         // const newUser = await User.create({name,email,password});
        
//         res.status(200).send({ message: 'User registered successfully', success: true, });
//     // } catch (error) {
//     //     res.status(500).send({ error: error});
//     // }
//     }
//     catch (error) {
//     console.error("Registration error:", error); // full error log
//     res.status(500).send({ success: false, message: "Server error", error: error.message });
// }
// };
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 1. First validate that email and password are provided
        if (!email || !password) {
            return res.status(400).send({ 
                message: "Email and password are required",
                success: false 
            });
        }

        // 2. Find the user by email only first (security best practice)
        const user = await User.findOne({ 
            where: { email },
            attributes: ['id', 'isAdmin', 'password'] // Include password for verification
        });

        if (!user) {
            return res.status(401).send({
                message: "Invalid credentials",
                success: false
            });
        }

        // 3. Verify the password (you should be using hashed passwords!)
        // IMPORTANT: This assumes you're storing plain text passwords - which is UNSECURE
        // In a real app, you should use bcrypt.compare() with hashed passwords
        if (user.password !== password) {
            return res.status(401).send({
                message: "Invalid credentials",
                success: false
            });
        }

        // 4. Prepare user data for token (exclude sensitive info like password)
        const userData = {
            id: user.id,
            isAdmin: user.isAdmin
        };

        // 5. Generate token
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '2d' });

        // 6. Send response
        res.status(200).send({
            message: "User logged in successfully",
            success: true,
            token: token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({
            message: "Internal server error",
            success: false
        });
    }
};

// const loginUser = async (req, res) => {
//     // const { email, password } = req.body;
//     const {email,password}= req.body;
//     try {
//         const loggedInUser = await User.findOne({ where: { email:req.body.email, password:req.body.password },attributes: ['id','isAdmin']})
        
//         console.log(loggedInUser, "login user");
//         const user = loggedInUser.dataValues
//         console.log(user,"user data ***")
//         const token = jwt.sign(user,process.env.JWT_SECRET,{expiresIn:'2d'})
//         console.log(token,"Token ")
//         res.status(202).send({message:"user login successfully",success:true,token:token})

//     } catch (error) {
//         console.error("error:", error);
        
//     }
// };

// const getUserInfo = async(req,res) =>{
//     console.log("req.user")

//     try{
//         loggedUser = await user.findOne({where:{id:req.user.id},attributes:['id','name','email','isAdmin']})
//         res.status(200).send({message:"got user info",loggedUser:loggedUser})

//     }catch(error){
//         res.status(500).send({error:error})
        
//     }

// }

const getUserInfo = async (req, res) => {
    console.log("req.user", req.user); // Added req.user to the log

    try {
        const loggedUser = await User.findOne({
            where: { id: req.user.id },
            attributes: ['id', 'name', 'email', 'isAdmin']
        });

        if (!loggedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        return res.status(200).send({ 
            message: "Got user info",
            loggedUser: loggedUser 
        });

    } catch (error) {
        console.error("Error in getUserInfo:", error); // Better error logging
        return res.status(500).send({ 
            error: "Internal server error",
            details: error.message 
        });
    }
};



module.exports ={
    registerUser,
    loginUser,
    getUserInfo
    
}
// const User = require('../models/userModel')
// const jwt = require('jsonwebtoken')
// require('dotenv').config()

// const registerUser = async (req, res) => {
//     const{name,email,password}= req.body
//     try {
//         // const existingUser = findOne({email})
//         // console.log(existingUser);
//         // if(existingUser){
//         //     res.status(202).send({message:"user already exist",success:true})
//         // }
//         const newUser = await User.create({name,email,password});
//         res.status(200).send({ message: 'User registered successfully', success: true, });
//     // } catch (error) {
//     //     res.status(500).send({ error: error});
//     // }
//     }
//     catch (error) {
//     console.error("Registration error:", error); // full error log
//     res.status(500).send({ success: false, message: "Server error", error: error.message });
// }
// };
// // Login
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.scope('withPassword').findOne({ where: { email } });
    
//     if (!user || user.password !== password) {
//       return res.status(401).json({ 
//         success: false,
//         message: "Invalid credentials" 
//       });
//     }

//     const token = jwt.sign(
//       { id: user.id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '2d' }
//     );

//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         isAdmin: user.isAdmin
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: "Login failed",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };
// const loginUser = async (req, res) => {
//       const { email, password } = req.body;
//     try {
//         const loggedInUser = await User.findOne({ where: { email:req.body.email, password:req.body.password },attributes: ['id','isAdmin']})
        
//         // console.log(loggedInUser, "login user");
//         const user = loggedInUser.dataValues
//         console.log(user,"user data ***")
//         const token = jwt.sign(user,process.env.JWT_SECRET,{expiresIn:'2d'})
//         console.log(token,"Token ")
//         res.status(202).send({message:"user login successfully",success:true,token:token})

//     } catch (error) {
//         console.error("error:", error);
        
//     }
// };

// const getUserInfo = async(req,res) =>{
//     console.log("req.user")

//     try{
//         loggedUser = await user.findOne({where:{id:req.user.id},attributes:['id','name','email','isAdmin']})
//         res.status(200).send({message:"got user info",loggedUser:loggedUser})

//     }catch(error){
//         res.status(500).send({error:error})
        
//     }

// }


// const getUserInfo = async (req, res) => {
//     console.log("req.user", req.user); // Added req.user to the log

//     try {
//         const loggedUser = await User.findOne({
//             where: { id: req.user.id },
//             attributes: ['id', 'name', 'email', 'isAdmin']
//         });

//         if (!loggedUser) {
//             return res.status(404).send({ message: "User not found" });
//         }

//         return res.status(200).send({ 
//             message: "Got user info",
//             loggedUser: loggedUser 
//         });

//     } catch (error) {
//         console.error("Error in getUserInfo:", error); // Better error logging
//         return res.status(500).send({ 
//             error: "Internal server error",
//             details: error.message 
//         });
//     }
// };



module.exports ={
    registerUser,
    loginUser,
    getUserInfo
    
}
// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// // Register
// const registerUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
    
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already in use'
//       });
//     }

//     const user = await User.create({ 
//       username, 
//       email, 
//       password,
//       isAdmin: false
//     });

//     const token = jwt.sign(
//       { id: user.id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '2d' }
//     );

//     res.status(201).json({
//       success: true,
//       message: "Registration successful",
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         isAdmin: user.isAdmin
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: "Registration failed",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Login
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.scope('withPassword').findOne({ where: { email } });
    
//     if (!user || user.password !== password) {
//       return res.status(401).json({ 
//         success: false,
//         message: "Invalid credentials" 
//       });
//     }

//     const token = jwt.sign(
//       { id: user.id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '2d' }
//     );

//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         isAdmin: user.isAdmin
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: "Login failed",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Get user info
// const getUserInfo = async (req, res) => {
//   try {
//     const user = req.user;

//     res.json({
//       success: true,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         isAdmin: user.isAdmin,
//         createdAt: user.createdAt
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to get user information",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// module.exports = { 
//   registerUser, 
//   login,
//   getUserInfo
// };