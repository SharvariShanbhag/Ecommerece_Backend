const jwt = require('jsonwebtoken')
require('dotenv').config() // Ensure .env is loaded for JWT_SECRET

const auth = (req, res, next) => {
    // Express headers are typically lowercase
    const authHeader = req.headers.authorization; 

    // 1. Check if Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: "Authorization token missing or invalid format. Must be 'Bearer <token>'" });
    }

    // 2. Extract the actual token string (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // Optional: Check if token is empty after splitting
    if (!token) {
        return res.status(401).send({ message: "Authorization token missing after 'Bearer ' prefix." });
    }

    try {
        // 3. Verify the token using the secret key from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        console.log('Decoded JWT:', decoded);

        // 4. Attach decoded user info to the request object (req.user)
        // The payload in userController.js is { user: { id: ..., username: ..., email: ... } }
        req.user = decoded.user; 

        // 5. Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Authorization token expired.' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).send({ message: 'Invalid or malformed authorization token.' });
        }
        res.status(500).send({ message: 'Failed to authenticate token.', error: err.message });
    }
}

module.exports = { auth };