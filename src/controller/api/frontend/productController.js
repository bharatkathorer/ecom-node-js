const db = require('../../../db/connection')
const {makePaginateQuery} = require("../../../utils/common");
const productController = {

    index: async (req, res) => {


        try {
            req.makePaginate();
            const getQuery = makePaginateQuery(`
                SELECT products.id,
                       products.title,
                       products.slug,
                       products.product_image,
                       products.description,
                       products.grass_price,
                       products.net_price,
                       products.discount,
                       carts.id as cart_id,
                       COUNT(*) OVER () AS total_rows
                FROM products LEFT JOIN carts ON products.id = carts.product_id 
                AND carts.user_id = ?
                    
            `);
            // Pass parameters to the query
            const [result] = await db.query(getQuery, [req?.auth?.id,req.limit, req.offset]);

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
            const sqlQuery = `SELECT products.id,
                                     products.title,
                                     products.slug,
                                     products.product_image,
                                     products.description,
                                     products.grass_price,
                                     products.net_price,
                                     products.discount,
                                     carts.id as cart_id,
                                     COUNT(*)    OVER () AS total_rows
                              FROM products
                                       LEFT JOIN carts ON products.id = carts.product_id
                                  AND carts.user_id = ?
                              where products.id = ? limit 1`
            const [result] = await db.query(sqlQuery, [req?.auth?.id,req.params.product_id])
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
