const sellerMiddleware = async (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            message: 'Unauthorized. User not authenticated.'
        });
    }


    if (req.user.role !== 'seller') {
        return res.status(403).json({
            message: 'Access denied. Only sellers can perform this action.'
        });
    }
    next();
}

module.exports = sellerMiddleware;