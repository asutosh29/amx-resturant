const jwt = require('jsonwebtoken')
const secret = process.env.JWTSECRET

function setUserJWT(payload) {
    try {
        return jwt.sign(payload, secret)
    } catch (error) {
        return null
    }

}
function getUserJWT(token) {
    // returns the payload. That is an object with the email
    if (!token) return null
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        return null
    }
}

module.exports = {
    setUserJWT,
    getUserJWT,
}