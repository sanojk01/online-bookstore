const userModel = require('../models/user.model');

async function register(req, res) {
    const {username, email, password } = req.body;

    console.log(username, email, password);

    res.status(201).json({ 
        message: 'User registered successfully' 
    });
}

async function login(req, res) {
    const { email, password } = req.body;

    res.status(200).json({ 
        message: 'User logged in successfully' 
    });
}

module.exports = {
    register,
    login
};