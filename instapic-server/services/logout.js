
module.exports.logout = async (req, res) => {
        res.clearCookie('zed', {sameSite: 'none', secure: true} )
        res.status(200).json({message: 'logged out successfully.'})
}