const {body, validationResult} = require('express-validator');

const responsdWithValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array() 
        });
    }
    next();
}

const registerUserValidations = [
    body('fullname')
        .notEmpty().withMessage('Full name is required'),
    body('phone')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone().withMessage('Invalid phone number format'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 3 }).withMessage('Password must be at least 6 characters long'),
    body('gender')
        .optional()
        .isIn(['male', 'female', 'other']).withMessage('Gender must be either male, female, or other'),
    body('role')
        .optional()
        .isIn(['user', 'seller']).withMessage("Role must be either 'user' or 'seller'"),
    responsdWithValidationErrors
];

const loginUserValidations = [
    body('email')
        .optional()
        .isEmail().withMessage('Invalid email format'),
    body('phone')
        .optional()
        .isMobilePhone().withMessage('Invalid phone number format'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        if (!req.body.email && !req.body.phone) {
            return res.status(400).json({ 
                message: 'Either email or phone is required' 
            });
        }
        responsdWithValidationErrors(req, res, next);
    }
    
];

const addAddressValidations = [
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('phone')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone().withMessage('Invalid phone number format'),
    body('street')
        .notEmpty().withMessage('Street is required'),
    body('city')
        .notEmpty().withMessage('City is required'),
    body('state')
        .notEmpty().withMessage('State is required'),
    body('pincode')
        .notEmpty().withMessage('Pincode is required'),
    body('country')
        .notEmpty().withMessage('Country is required'),
    body('isDefault')
        .optional()
        .isBoolean().withMessage('isDefault must be a boolean value'),
    responsdWithValidationErrors
];

module.exports = {
    registerUserValidations,
    loginUserValidations,
    addAddressValidations
};