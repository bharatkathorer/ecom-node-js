const validateHandler = require('./validateHandler');
const {body} = require("express-validator");

const addCartRequest = [
    body('product_id').notEmpty().escape(),
    // body('qty').isNumeric().escape(),
    validateHandler
];

const checkOutRequest = [
    body('cart_ids').notEmpty()
        .withMessage("The cart field required.")
        .isArray({min: 1}).escape(),
    body('address_id').notEmpty()
        .withMessage("The address field required.")
        .escape(),
    // body('qty').isNumeric().escape(),
    validateHandler
];

const adminOrderUpdateRequest = [
    body('order_id').notEmpty().escape(),
    body('status').notEmpty().isNumeric().escape(),
    body('note').escape(),
    validateHandler
];

module.exports = {
    addCartRequest,
    checkOutRequest, adminOrderUpdateRequest
};
