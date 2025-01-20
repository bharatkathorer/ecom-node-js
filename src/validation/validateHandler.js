const {validationResult, matchedData} = require("express-validator");

const validateHandler = (req, res, next) => {
    // console.log(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.error(errors);
    }
    req.validate = matchedData(req);
    next();
};
module.exports = validateHandler;
