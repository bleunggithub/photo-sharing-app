
module.exports.logout = async (req, res) => {
        res.clearCookie('zed')
        res.status(200).json({message: 'logged out successfully.'})
}