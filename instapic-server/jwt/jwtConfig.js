require('dotenv').config;

module.exports = {
    jwtSecret: process.env.JWT_TOKEN_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
}