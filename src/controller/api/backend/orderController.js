const db = require('../../../db/connection')
const {makeUpdateQuery, makeInsertQuery, makePaginateQuery} = require("../../../utils/common");
const orderController = {

    index: async (req, res) => {
        try {

            req.makePaginate();
            const query = makePaginateQuery(`SELECT products.*,
                                                    orders.id          AS order_id,
                                                    orders.payment_id,
                                                    orders.address,
                                                    orders.status,
                                                    orders.grass_price AS order_grass_price,
                                                    orders.net_price   AS order_net_price,
                                                    orders.discount    AS order_discount,
                                                    orders.created_at  AS order_created_at,
                                                    orders.updated_at  AS order_updated_at,
                                                    users.name         AS user_name,
                                                    users.email        AS user_email,
                                                    COUNT(*)              OVER () AS total_rows
                                             from products
                                                      RIGHT JOIN orders ON products.id = orders.product_id
                                                      RIGHT JOIN users ON orders.user_id = users.id
                                             WHERE admin_id = ?
                                             ORDER BY orders.created_at DESC
            `);
            // const query = `SELECT products.*,
            //                       orders.id          AS order_id,
            //                       orders.payment_id,
            //                       orders.address,
            //                       orders.status,
            //                       orders.grass_price AS order_grass_price,
            //                       orders.net_price   AS order_net_price,
            //                       orders.discount    AS order_discount,
            //                       orders.created_at  AS order_created_at,
            //                       orders.updated_at  AS order_updated_at,
            //                       users.name         AS user_name,
            //                       users.email        AS user_email
            //                from products
            //                         RIGHT JOIN orders ON products.id = orders.product_id
            //                         RIGHT JOIN users ON orders.user_id = users.id
            //                WHERE admin_id = ?
            //                ORDER BY orders.created_at DESC`

            const [result] = await db.query(query, [req.auth.id, req.limit, req.offset]);
            return res.success({
                orders: result,
                paginate: req.paginate(result, 'total_rows'),
            });
        } catch (e) {
            return res.error(e.message);
        }
    },

    view: async (req, res) => {
        try {
            const query = `select products.*,
                                  orders.id          AS order_id,
                                  orders.payment_id,
                                  orders.address,
                                  orders.status,
                                  orders.grass_price AS order_grass_price,
                                  orders.net_price   AS order_net_price,
                                  orders.discount    AS order_discount,
                                  orders.created_at  AS order_created_at,
                                  orders.updated_at  AS order_updated_at,
                                  users.name         AS user_name,
                                  users.email        AS user_email,
                                  -- Convert transactions to a JSON array
                                  COALESCE(
                                          JSON_ARRAYAGG(
                                                  JSON_OBJECT(
                                                          'id', th.id,
                                                          'note', th.note,
                                                          'status', th.status,
                                                          'created_at', th.created_at
                                                  )
                                          ), '[]'
                                  )                  AS order_transactions
                           from products
                                    RIGHT JOIN orders ON products.id = orders.product_id
                                    RIGHT JOIN users ON orders.user_id = users.id
                                    LEFT JOIN order_transations th ON orders.id = th.order_id
                           WHERE admin_id = ?
                             AND orders.id = ?`
            const [result] = await db.query(query, [req.auth.id, req.params.order_id]);

            if (result.length) {
                return res.success(result[0]);
            }
            return res.error('invalid order id');
        } catch (e) {
            return res.error(e.message);
        }
    },

    update: async (req, res) => {
        try {
            const findOrderQuery = `SELECT products.admin_id
                                    FROM orders
                                             LEFT JOIN products ON orders.product_id = products.id
                                    WHERE orders.id = ?
                                      AND products.admin_id = ?`

            let [result] = await db.query(findOrderQuery, [req.validate.order_id, req.auth.id])
            if (result.length && result[0].admin_id === req.auth.id) {
                let {query, values} = makeUpdateQuery({
                    status: req.validate.status
                })
                await db.query(`UPDATE orders
                                SET ${query}
                                WHERE id = ?`, [
                        ...values,
                        req.validate.order_id
                    ]
                )
                const insetQuery = makeInsertQuery(req.validate)
                await db.query(`INSERT INTO order_transations ${insetQuery.query}`, insetQuery.values)
                return res.success(result[0]);
            } else {
                return res.error('invalid order id');
            }
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

module.exports = orderController;

