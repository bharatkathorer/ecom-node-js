const db = require('../../../db/connection')
const {makePaginateQuery} = require("../../../utils/common");
const productController = {

    index: async (req, res) => {
        try {
            req.makePaginate();
            const getQuery = makePaginateQuery(`
                SELECT *,
                       COUNT(*) OVER () AS total_rows
                FROM products
            `);
            // Pass parameters to the query
            const [result] = await db.query(getQuery, [req.limit, req.offset]);

            // Return response
            return res.success({
                data: result,
                paginate: req.paginate(result, 'total_rows'),
            });
        } catch (e) {
            return res.error(e.message);
        }
    },

    view: async (req, res) => {
        try {
            const sqlQuery = `select *
                              from products
                              where id = ? limit 1`
            const [result] = await db.query(sqlQuery, [req.params.product_id])
            if (result.length) {
                return res.success(result[0]);
            }
            return res.error('invalid product id');
        } catch (e) {
            return res.error(e.message);
        }
    },

    store: async (req, res) => {
        try {
            return res.success('');
        } catch (e) {
            return res.error(e.message);
        }
    },

    edit: async (req, res) => {
        try {
            return res.success('');
        } catch (e) {
            return res.error(e.message);
        }
    },

    update: async (req, res) => {
        try {
            return res.success('');
        } catch (e) {
            return res.error(e.message);
        }
    },

    destroy: async (req, res) => {
        try {
            return res.success('');
        } catch (e) {
            return res.error(e.message);
        }
    },
}

module.exports = productController;
