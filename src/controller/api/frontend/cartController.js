const db = require('../../../db/connection');
const {makeInsertQuery, makeMultipleInsertQuery} = require("../../../utils/common");
const cartController = {

    index: async (req, res) => {
        try {
            const query = `select products.*, carts.id AS cart_id
                           from carts
                                    RIGHT JOIN products ON carts.product_id = products.id
                           where user_id = ?`
            const [result] = await db.query(query, [req.auth.id]);
            return res.success({
                carts: result
            });
        } catch (e) {
            return res.error(e.message);
        }
    },


    store: async (req, res) => {
        try {
            const checkExistsProductQuery = `SELECT products.*, carts.id AS cart_id
                                             FROM products
                                                      LEFT JOIN carts ON products.id = carts.product_id
                                                 AND carts.user_id = ?
                                             WHERE products.id = ? LIMIT 1`;

            let [result] = await db.query(checkExistsProductQuery, [req.auth.id, req.body.product_id]);

            if (result.length) {
                result = result[0];
                if (result?.cart_id) {
                    await db.query('delete from carts where id = ? limit 1', [result.cart_id]);
                    req.auth.cart_items = req.auth.cart_items - 1;
                    return res.success('cart remove successfully');
                } else {
                    const insertQueryData = makeInsertQuery({
                        product_id: req.body.product_id,
                        user_id: req.auth.id,
                    })
                    const queryString = `insert into carts ${insertQueryData.query}`;
                    [result] = await db.query(queryString, insertQueryData.values)
                    if (result.affectedRows) {
                        req.auth.cart_items = req.auth.cart_items + 1;
                        return res.success('cart added successfully');
                    } else {
                        return res.error('something gon wrong');
                    }
                }
            } else {
                return res.error('product not fount');
            }

        } catch (e) {
            return res.error(e.message);
        }
    },


}

module.exports = cartController;
