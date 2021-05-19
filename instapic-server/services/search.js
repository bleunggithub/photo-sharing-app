module.exports.search = async (req, res, knex) => {
    const { username } = req.query
    
    try {
        const searchResults = await knex
            .select('username', 'posts_id', 'img_url', 'content')
            .from('users')
            .fullOuterJoin('posts', 'users.id', 'posts.user_id')
            .where('username', 'LIKE', `${username}%`)
            .whereNotNull('posts_id')
            .orderBy('created_at', 'desc')
        
        const data = {}

        if (searchResults.length > 0) {
            data.result = searchResults
        } else {
            data.message = "No results found."
        }
        
        if (req.accessToken) {
            data.authenticated = true,
            data.accessToken = req.accessToken
        } 

        return res.status(200).json(data)
    } catch (err) {
        console.trace(err)
        return res.status(400).json({message: "An Error has occurred."})
    }
}