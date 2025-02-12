const validateHandler = require('./validateHandler');
const {body} = require("express-validator");
const {checkExists} = require("./customeValidate");

const userRegisterRequest = [
    body('name').notEmpty()
        .withMessage("The name field required.").escape(),
    body('password').notEmpty()
        .withMessage("The password field required.").escape(),
    body('email')
        .notEmpty()
        .withMessage("The email field required.")
        .isEmail()
        .withMessage("The invalid email field.")
        // .custom((value) => {
        //     return checkExists('users', 'email', value).then((exists) => {
        //         if (exists) {
        //             return Promise.reject('The email is already registered.');
        //         }
        //     });
        // })
        .escape(),
    validateHandler,
];

const userLoginRequest = [
    body('password').notEmpty().escape(),
    body('email')
        .notEmpty()
        .withMessage("The email field required.")
        .isEmail()
        .withMessage("The invalid email field.")
        // .custom((value) => checkExists('users', 'email', value))
        .escape(),
    validateHandler,
];

module.exports = {
    userRegisterRequest,
    userLoginRequest,
}

