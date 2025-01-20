const validateHandler = require('./validateHandler');
const {body} = require("express-validator");
const {checkExists} = require("./customeValidate");

const userRegisterRequest = [
    body('name').notEmpty().escape(),
    body('password').notEmpty().escape(),
    body('email')
        .notEmpty()
        .isEmail()
        // .custom((value) => {
        //     return checkExists('users', 'email', value).then((exists) => {
        //         if (exists) {
        //             return Promise.reject('The email is already registered.');
        //         }
        //     });
        // })
        .withMessage("the email already registered.")
        .escape(),
    validateHandler,
];

const userLoginRequest = [
    body('password').notEmpty().escape(),
    body('email')
        .notEmpty()
        .isEmail()
        // .custom((value) => checkExists('users', 'email', value))
        .escape(),
    validateHandler,
];

module.exports = {
    userRegisterRequest,
    userLoginRequest,
}

