const bcrypt = require('bcrypt');

function genSalt(saltRounds=10) {
    return bcrypt.genSalt(saltRounds);
}

function genHash(password, salt) {
    return bcrypt.hash(password, salt);
}

function checkPassword(password, hash) {
    return bcrypt.compare(password, hash);
}


module.exports = { genSalt, genHash , checkPassword}