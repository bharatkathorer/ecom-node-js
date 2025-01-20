const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

const verifyPassword = (hasPassword, password) => {
    return bcrypt.compareSync(password, hasPassword);
}

const generateToken = (data) => {
    return  jwt.sign(data, process.env.TOKEN_SECREAT);
}
const readTokenData = (token) => {
    return  jwt.verify(token, process.env.TOKEN_SECREAT);
}
module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    readTokenData
};
