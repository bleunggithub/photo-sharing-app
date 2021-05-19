//auth
const {isAuth} = require('../services/isAuth')
const {uploadImg} = require('../services/uploadImg')
const {getPostsFromDB} = require('../services/getPostsFromDB')
const { search } = require('../services/search')

module.exports = (express,knex) => {
    const router = express.Router()

    //test
    router.post('/upload', isAuth, async (req, res) => {
        try{
            uploadImg(req, res, knex)
        } catch(err) {
            console.trace(err)
            return res.status(400).json({message: "An Error has occurred."})
        }
    })

    //view all posts
    router.get('/posts', isAuth, async (req, res) => {
        try {
            getPostsFromDB(req, res, knex)
        } catch (err) {
            console.trace(err)
            return res.status(400).json({message: "An Error has occurred."})
        }
    })
    
    //search by username
    router.get('/search', isAuth, async (req, res) => {
        try {
            search(req, res, knex)
            } catch (err) {
            console.trace(err)
            return res.status(400).json({message: "An Error has occurred."})
        }
    })


    return router; 
}
