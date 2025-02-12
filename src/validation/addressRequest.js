const validateHandler = require('./validateHandler');
const {body} = require("express-validator");

const addressRequest = [
    body('pincode').isNumeric()
        .withMessage("The pincode field must be number.")
        .notEmpty()
        .withMessage("The pincode field required.")
        .escape(),
    body('address').notEmpty()
        .withMessage("The address field required.")
        .escape(),
    validateHandler
];

module.exports = {
    addressRequest,
}
