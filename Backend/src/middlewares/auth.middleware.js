const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Middleware to authenticate user using JWT
async function authMiddleware(req, res, next) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ 
            message: 'Refresh token not found' 
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);

        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ 
                message: 'User not found' 
            });
        }

        req.user = user;
        next();
        
    } catch (error) {
        return res.status(401).json({ 
            message: 'Invalid token' + error.message
        });
    }

}

module.exports = {
    authMiddleware
};