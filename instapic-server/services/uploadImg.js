const cloudinary = require('cloudinary').v2

module.exports.uploadImg = async(req, res, knex) => {
    try {
        const fileToUpload = "data:" + req.files.file.mimetype + ";base64," + req.files.file.data.toString('base64')
        let results = await cloudinary.uploader.upload(fileToUpload, { upload_preset: "instapic_setup" })
            
        if (results.public_id) {
            try {
                const postDetails = {
                    img_url: results.public_id,
                    content: req.body.message,
                    user_id: req.userId,
                }

                await knex('posts').returning('posts_id').insert(postDetails)
                
                if (req.accessToken) {
                    return res.status(200).json({ authenticated: true, accessToken:req.accessToken })
                } else {
                    return res.status(200).json({message: "Upload success"})
                }
            } catch (err) {
                console.trace(err)
                return res.status(400).json({message: "An Error has occurred while saving."})
            }
        } else {
            return res.status(400).json({message: "An Error has occurred while uploading."})
        }

    } catch (err) {
        console.trace(err)
        return res.status(400).json({message: "An Error has occurred."})
    }
}