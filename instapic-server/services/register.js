const { createAccessToken, createRefreshToken } = require('../jwt/tokenUtil')
const bcrypt = require('../jwt/bcrypt')

module.exports.register = async (req, res, knex) => {
    const { username, password } = req.body
    const errors = []

    // input validation
    if (!username || !password) {
        errors.push({ message: "Please complete all required fields." })
    } else if (username.length < 4 || password.length < 4) {
        errors.push({ message: "Username & password should be at least 4 characters long." })
    } else {
        try {
            //check whether username is already registered
            const query = await knex("users").where({ username: username.toLowerCase() })
            
            if (query.length > 0) {
                errors.push({ message: "Sorry, the username you entered is already taken." })
            } else {
                //new user registration, issue access token & refresh token
                const hashedPassword = await bcrypt.hashPassword(password)
                const userId = await knex('users').returning('id').insert({
                    username: username.toLowerCase(),
                    password: hashedPassword,
                    tokenVersion: 1
                })

                const refreshToken = createRefreshToken(userId[0], 1)
                res.cookie('zed', refreshToken, { httpOnly: true, sameSite: 'strict', secure: true })

                const accessToken = createAccessToken(userId[0])

                return res.status(200).json({ authenticated: true, accessToken })
            }
        } catch (err) {
            console.trace(err)
            return res.status(400).json({ message: [{message: "An Error has occurred."}] })
        }
    }

    if (errors.length > 0) {
        console.trace(errors)
        return res.status(400).json({ message: errors })
    }

}