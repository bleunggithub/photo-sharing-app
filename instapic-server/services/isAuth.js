require('dotenv').config()

const { development } = require('../knexfile')
const { test } = require('../knexfile')

let environment
if (process.env.NODE_ENV === 'test') {
    environment = test
} else {
    environment = development
}

const knex = require('knex')(environment)

const jwt = require('jsonwebtoken')
const config = require('../jwt/jwtConfig')

const {createAccessToken} = require('../jwt/tokenUtil')

module.exports.isAuth = async (req, res, next) => {
    const refreshTokenFromCookies = req.cookies.zed
    
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]

    if (!accessToken || !refreshTokenFromCookies) {
        return res.status(401).json({ message: "You are not authenticated." })
    }
    
    let user = jwt.verify(accessToken, config.jwtSecret)

    if (!user || !user.userId) {
            let resultsRT = jwt.verify(refreshTokenFromCookies, config.jwtRefreshSecret)
 
            if (!resultsRT || !resultsRT.userId) {
                return res.status(401).json({ authenticated: false, message: "You are not authenticated." })
            } else {
                try {
                    const userFromDB = await knex('users')
                        .where({ id: resultsRT.userId })
                        .returning('tokenVersion');
                    
                    if (userFromDB[0].tokenVersion !== resultsRT.tokenVersion) {
                        //refresh token version does not match the one in database
                        return res.status(401).json({ authenticated: false, message: "You are not authenticated." })
                    } else {
                        //refresh token version matches the one in database
                        const accessToken = createAccessToken(userFromDB[0].id)
                        req.userId = userFromDB[0].id
                        req.accessToken = accessToken
                        return next()
                    }
                } catch (err) {
                    console.trace(err)
                    return res.status(401).json({ authenticated: false, message: "You are not authenticated." })
                }
            }
    } else {
        req.userId = user.userId
        return next()
    }
}
