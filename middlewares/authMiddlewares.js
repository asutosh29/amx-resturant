const { getUserJWT } = require('../utils/jwtauth.js')

function restrictToLoggedInUser(req,res,next){
    const token = req.cookies?.token_id
    if(!token) return res.redirect('/login')

    const user = getUserJWT(token)
    if(!user) return res.redirect('/login')
    req.user = user

    next()
}

function restrictToAdmin(req,res,next){
    const token = req.cookies?.token_id
    if(!token) return res.redirect('/login')

    const user = getUserJWT(token)
    if(!(user.userRole === 'admin')) return res.redirect('/login')
    req.user = user
    next()
}

function restrictToNewUser(req,res,next){
    const token = req.cookies?.token_id
    if(token) return res.redirect('/home')
    next()
}


module.exports = { restrictToLoggedInUser, restrictToNewUser , restrictToAdmin}