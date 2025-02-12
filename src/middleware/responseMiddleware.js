const responseMiddleware = (req, res, next) => {

    req.makePaginate = () => {
        const {page = 1, limit = 10} = req.query;
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        req.page = page;
        req.limit = parsedLimit;
        req.offset = (parsedPage - 1) * parsedLimit;
    }
    req.paginate = (result, total_key) => {
        const currentPageTotal = result.length
        const total = currentPageTotal > 0 ? result[0]?.[total_key] : 0;
        const totalPages = Math.ceil(total / req.limit);
        return {
            currentPage: parseInt(req.page ?? '1'),
            limit: req.limit,
            total,
            totalPages,
            currentPageTotal
        }
    }

    res.success = (data = [], message = 'ok') => {
        let responseData;
        if (typeof data == 'string') {
            responseData = {
                success: true, message: data, data: []
            };
        } else {
            responseData = {
                success: true, message: message, ...data
            }
        }
        if (req?.auth) {
            responseData.auth = req?.auth
        }
        res.status(200).send();
    };

    res.error = (errors = [], message = 'error') => {
        let responseData;
        if (typeof errors == 'string') {
            responseData = {
                success: false, message: errors, errors: []
            };
        } else {
            responseData = {
                success: false, message: message, ...errors
            }
        }
        if (req?.auth) {
            responseData.auth = req?.auth
        }
        res.status(200).send();
    };


    next();
}

module.exports = responseMiddleware;
