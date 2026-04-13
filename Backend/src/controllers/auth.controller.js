const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateTokens');
const config = require('../config/config');
const jwt = require('jsonwebtoken');


// Register a new user
async function registerUser(req, res) {
    const { fullname, phone, email, password, gender, role } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ $or: [
        { email },
        { phone }
    ]});

    if (isUserAlreadyExist) {
        return res.status(400).json({ 
            message: 'User already exists' 
        });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userModel.create({
        fullname,
        phone,
        email,
        password: hashedPassword,
        gender,
        role : role || 'user'
    });

    const { refreshToken, accessToken } = await generateToken(user);
    

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });


    res.status(201).json({ 
        message: 'User registered successfully',
        user: {
            id: user._id,
            fullname: user.fullname,
            phone: user.phone,
            email: user.email,
            gender: user.gender
        },
        accessToken: accessToken
    });
}

// Login user
async function loginUser(req, res) {
    const { email, phone, password } = req.body;

    const user = await userModel.findOne({ $or: [
        { email },
        { phone }
    ]}).select('+password');

    if (!user) {
        return res.status(400).json({ 
            message: 'Invalid email or phone number' 
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ 
            message: 'Invalid password' 
        });
    }

    const { refreshToken, accessToken } = await generateToken(user);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ 
        message: 'User logged in successfully',
        user: {
            id: user._id,
            fullname: user.fullname,
            phone: user.phone,
            email: user.email
        },
        accessToken: accessToken
    });
}

// Get current user info
async function getCurrentUser(req, res) {
    const user = req.user;

    res.status(200).json({ 
        message: 'User info retrieved successfully',
        user: {
            id: user._id,
            fullname: user.fullname,
            phone: user.phone,
            email: user.email,
            gender: user.gender,
            role: user.role
        }
    });
}

// Refresh access token
async function refreshAccessToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ 
            message: 'refresh token not found' 
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);

        const user = await userModel.findById(decoded.id);
        
        const { accessToken, refreshToken: newRefreshToken } = await generateToken(user);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            accessToken: accessToken
        });

    } catch (error) {
        return res.status(401).json({ 
            message: 'Invalid refresh token :' + error.message
        });
    }
}

// Logout user
async function logoutUser(req, res) {

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });

    res.status(200).json({ 
        message: 'User logged out successfully'
    });
}


module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    refreshAccessToken,
    logoutUser
};