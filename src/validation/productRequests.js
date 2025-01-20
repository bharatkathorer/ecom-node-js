const validateHandler = require('./validateHandler');
const {body} = require("express-validator");

const productStoreRequest = [
    body('title').notEmpty().escape(),
    body('description').notEmpty().escape(),
    body('grass_price').isNumeric().notEmpty().escape(),
    body('net_price').isNumeric().notEmpty().escape(),
    body('discount').isInt().notEmpty().escape(),
    validateHandler
];

module.exports = {productStoreRequest};
