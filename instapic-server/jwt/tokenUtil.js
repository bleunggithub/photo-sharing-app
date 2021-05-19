const jwt = require('jsonwebtoken')
const config = require('./jwtConfig')


exports.createAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        config.jwtSecret,
        { expiresIn: "15m" }
    )
}

exports.createRefreshToken = (userId, tokenVersion) => {
    return jwt.sign(
        { userId , tokenVersion },
        config.jwtRefreshSecret,
        { expiresIn: "7d" }
    )
}