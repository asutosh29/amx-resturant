const { getUserJWT } = require('../utils/jwtauth.js')

function restrictToLoggedInUser(req,res,next){
    console.log('I am called')
    const token = req.cookies?.token_id
    console.log(token)
    if(!token) return res.redirect('/login')
    const user = getUserJWT(token)
    console.log(user)
    if(!user) return res.redirect('/login')
    next()
}

module.exports = { restrictToLoggedInUser }