module.exports.getPostsFromDB = async(req, res, knex) => {
    try {
        const page = parseInt(req.query.page)
        const sort = req.query.sort
        const dbLimit = 6
        const dbOffset = (page - 1) * dbLimit
        console.log(page,sort,dbOffset)

        const dbResults = await knex
            .select('username', 'posts_id', 'img_url', 'content')
            .from('users')
            .fullOuterJoin('posts', 'users.id', 'posts.user_id')
            .whereNotNull('posts_id')
            .orderBy('created_at', sort)
            .offset(dbOffset)
            .limit(dbLimit)

        const data = {}

        if (dbResults.length >= 0 && dbResults.length < dbLimit) {
            data.posts = dbResults
            data.message = "This is the last page."
        } else {
            data.posts = dbResults
        }

        if (req.accessToken) {
            data.authenticated = true,
            data.accessToken = req.accessToken
        }
        console.trace(data)
        return res.status(200).json(data)
    } catch (err) {
        console.trace(err)
        return res.status(400).json({message: "An Error has occurred."})
    }
}