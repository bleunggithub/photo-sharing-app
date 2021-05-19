const {login} = require('../services/login')
const {register} = require('../services/register')
const {refreshToken} = require('../services/refreshToken')
const {logout} = require('../services/logout')

module.exports = (express,knex) => {
    const router = express.Router()
    //log in
    router.post('/login', async (req, res) => {
        try {
            login(req,res,knex)
        } catch (err) {
                console.trace(err)
                return res.status(400).json([{ message: 'An Error has occurred.' }])
            }
        }

    )
    
    //register
    router.post('/register', async (req, res) => {
            try {
                register(req, res, knex)
            } catch (err) {
                console.trace(err)
                return res.status(400).json([{message: 'An Error has occurred.'}])
            }
        }
    )

    //renew refresh token, called when the app is mounted & window is refreshed
    router.get('/refresh_token', async (req, res) => {

        try {
            refreshToken(req, res, knex)
        } catch (err) {
            console.trace(err)
            return res.status(400).json([{message: 'An Error has occurred.'}])
        }

    })

    router.get('/logout', (req, res) => {
        logout(req,res)
    })


    return router; 
}
