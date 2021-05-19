const { createAccessToken, createRefreshToken } = require('../jwt/tokenUtil')
const bcrypt = require('../jwt/bcrypt')

module.exports.login = async (req, res, knex) => {
    const { username, password } = req.body;
    const errors = [];

    if (!username || !password) {
        errors.push({ message: "Please enter all fields." })
    } else {
        try {
            //check if username is registered
            const checkUser = await knex("users").where({ username: username.toLowerCase() })

            if (checkUser.length === 0) {
                errors.push({ message: "The username you entered is not registered." })
            } else {
                //if registered, check if pw matches
                const userFromDB = await knex('users')
                    .where({ username: username.toLowerCase() })
                    .returning(['password', 'id']);
                const { id } = userFromDB[0]
                
                const checkPasswordResults = await bcrypt.checkPassword(password, userFromDB[0].password);
                
                if (checkPasswordResults) {
                    //if pw matches, increment token version by 1 and issue new refresh token & access token
                    let newTokenVersion = await knex('users')
                        .where({ id })
                        .increment('tokenVersion', 1)
                        .returning('tokenVersion')

                    const refreshToken = createRefreshToken(id, newTokenVersion[0])
                    res.cookie('zed', refreshToken, { httpOnly: true, sameSite: 'strict', secure: true })
                    
                    const accessToken = createAccessToken(id)
                    return res.status(200).json({ authenticated: true, accessToken })
                } else {
                    errors.push({ message: "Your password is incorrect." })
                    return res.status(400).json({ message: errors })
                }
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