const validateHandler = require('./validateHandler');
const {body} = require("express-validator");

const productStoreRequest = [
    body('title').notEmpty()
        .withMessage("The title field required.")
        .escape(),
    body('description').notEmpty()
        .withMessage("The description field required.")
        .escape(),
    body('grass_price')
        .isNumeric()
        .withMessage("The grass price field must be number.")
        .notEmpty()
        .withMessage("The grass price field required.")
        .escape(),
    body('net_price')
        .isNumeric()
        .withMessage("The net price field must be number.")
        .notEmpty()
        .withMessage("The net price field required.")
        .escape(),
    body('discount')
        .isInt()
        .withMessage("The discount field must be number.")
        .notEmpty()
        .withMessage("The discount field required.")
        .escape(),
    validateHandler
];

module.exports = {productStoreRequest};
