// // const express = require('express')
// // const userController = require('../controllers/userController');
// // const auth = require('../middleware/auth');
// // const router = express.Router();

// // router.post('/register',userController.registerUser)
// // router.post('/login',userController.login)
// // router.get('/getUserInfo',auth, userController.getUserInfo)


// // module.exports = router;

// const express = require('express');
// const userController = require('../controllers/userController');
// const auth = require('../middleware/auth');
// const router = express.Router();

// router.post('/register', userController.registerUser);
// router.post('/login', userController.login);
// router.get('/me', auth, userController.getUserInfo);

// module.exports = router;

const express = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/auth') 


const router = express.Router();

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/getUserInfo', authMiddleware.auth,userController.getUserInfo)



module.exports = router;