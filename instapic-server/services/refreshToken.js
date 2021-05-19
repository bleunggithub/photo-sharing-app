const { createAccessToken, createRefreshToken } = require('../jwt/tokenUtil')
const jwt = require('jsonwebtoken')
const config = require('../jwt/jwtConfig')

module.exports.refreshToken = async (req, res, knex) => {
    const refreshTokenFromCookies = req.cookies.zed

    if (!refreshTokenFromCookies) {
        return res.sendStatus(204) //no content, not authenticated
    } else {
        const user = jwt.verify(refreshTokenFromCookies, config.jwtRefreshSecret)
        
        if (!user || !user.userId) {
            return res.status(401).json({authenticated: false, message: "You are not authenticated."})
        } else {
            try {
                //refresh token is valid
                const { userId,tokenVersion } = user
                const userFromDB = await knex('users')
                    .where({ id: userId })
                    .returning('tokenVersion');
                
                if (userFromDB[0].tokenVersion !== tokenVersion) {
                    //token version does not match the one in database, maybe using different devices,log in required
                    return res.status(401).json({authenticated: false, message: "You are not authenticated."})
                } else {
                    //token is already valid, reissue to extend expiry date upon log in
                    let newTokenVersion = await knex('users')
                        .where({ id: userId })
                        .increment('tokenVersion', 1)
                        .returning('tokenVersion')
                    
                    const refreshToken = createRefreshToken(userId, newTokenVersion[0])
                    res.cookie('zed', refreshToken, { httpOnly: true, sameSite: 'none', secure: true })
                    
                    const accessToken = createAccessToken(user.userId)
                    return res.status(200).json({authenticated: true, accessToken})
                }
            } catch(err) {
                console.trace(err)
                return res.status(400).json({authenticated: false, message: 'An Error has occurred.'})
            }

        }            
    }

}