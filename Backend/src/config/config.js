require('dotenv').config();

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in the environment variables.");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in the environment variables.");
    process.exit(1);
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    console.error("IMAGEKIT_PRIVATE_KEY is not defined in the environment variables.");
    process.exit(1);
}


const config = {
    PORT : process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
};

module.exports = config;