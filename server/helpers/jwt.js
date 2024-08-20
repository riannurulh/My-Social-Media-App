const jwt = require('jsonwebtoken');
require('dotenv').config()
let secret = process.env.SECRET
function signToken(payload) {
    return jwt.sign(payload,secret)
}

function verifyToken(token) {
    return jwt.verify(token, secret)
}

module.exports = {signToken,verifyToken}