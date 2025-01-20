const validateHandler = require('./validateHandler');
const {body} = require("express-validator");

const addressRequest = [
    body('pincode').isNumeric().notEmpty().escape(),
    body('address').notEmpty(),
    validateHandler
];

module.exports = {
    addressRequest,
}
