const db = require('../../../db/connection');
const {makeInsertQuery, makeMultipleInsertQuery} = require("../../../utils/common");
const orderController = {

    index: async (req, res) => {
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
                                  orders.updated_at  AS order_updated_at
                           from orders
                                    RIGHT JOIN products ON orders.product_id = products.id
                           where user_id = ? ORDER BY orders.created_at DESC `
            const [result] = await db.query(query, [req.auth.id]);
            return res.success({
                orders: result
            });
        } catch (e) {
            return res.error(e.message);
        }
    },


    view: async (req, res) => {
        try {
            const query =`select orders.id          AS order_id,
                                 orders.payment_id,
                                 orders.address,
                                 orders.status,
                                 orders.grass_price AS order_grass_price,
                                 orders.net_price   AS order_net_price,
                                 orders.discount    AS order_discount,
                                 orders.created_at  AS order_created_at,
                                 orders.updated_at  AS order_updated_at,
                                 products.*,
                                 users.name         AS user_name,
                                 users.email        AS user_email,
                                 COALESCE((SELECT JSON_ARRAYAGG(
                                                          JSON_OBJECT(
                                                                  'id', t.id,
                                                                  'note', t.note,
                                                                  'status', t.status,
                                                                  'created_at', t.created_at
                                                          )
                                                  )
                                           FROM order_transations t
                                           WHERE t.order_id = orders.id
                                           ORDER BY t.created_at DESC -- Sorting transactions before aggregation
                                          ), '[]')  AS order_transactions
                          from orders
                                   Right Join products on orders.product_id = products.id
                                   Right Join users on orders.user_id = users.id
                          where orders.id = ? limit 1 `
            // const query = `select products.*,
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
            //                       users.email        AS user_email,
            //                       COALESCE((SELECT JSON_ARRAYAGG(
            //                                                JSON_OBJECT(
            //                                                        'id', t.id,
            //                                                        'note', t.note,
            //                                                        'status', t.status,
            //                                                        'created_at', t.created_at
            //                                                )
            //                                        )
            //                                 FROM order_transations t
            //                                 WHERE t.order_id = orders.id
            //                                 ORDER BY t.created_at DESC -- Sorting transactions before aggregation
            //                                ), '[]')  AS order_transactions
            //                from products
            //                         RIGHT JOIN orders ON products.id = orders.product_id
            //                         LEFT JOIN users ON orders.user_id = users.id
            //                  AND orders.id = ? limit 1`
            const [result] = await db.query(query, [req.params.order_id]);

            if (result.length) {
                return res.success(result[0]);
            }
            return res.error('invalid order id');
        } catch (e) {
            return res.error(e.message);
        }
    },

    checkout: async (req, res) => {
        try {
            // await db.beginTransaction();
            const cartsQuery = `
                SELECT products.*, carts.id AS cart_id, carts.user_id
                FROM carts
                         RIGHT JOIN products ON carts.product_id = products.id
                WHERE carts.id IN (?)
                  AND carts.user_id = ?;
            `;

            let [result] = await db.query(`select *
                                           from user_addresses
                                           where id = ?`, [req.validate.address_id])
            const address = JSON.stringify(result[0]);
            [result] = await db.query(cartsQuery, [req.validate.cart_ids, req.auth.id])

            if (!result.length) {
                return res.error('your cart is empty');
            }


            const orders = result.map((item) => {
                return {
                    product_id: item.id,
                    user_id: req.auth.id,
                    payment_id: 'testing',
                    grass_price: item.grass_price,
                    net_price: item.net_price,
                    discount: item.discount,
                    address
                }
            })
            await db.query('delete from carts where id IN (?)', [
                result.map((item) => item.cart_id)
            ])
            let {query, values} = makeMultipleInsertQuery(orders);

            [result] = await db.query(`INSERT INTO orders ${query}`, [values]);

            if (result.affectedRows) {
                // db.commit();
                return res.success('Order successfully');
            } else {
                // await db.rollback();
                return res.error('something gon wrong');
            }

        } catch (e) {
            // await db.rollback();
            console.log(e);
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

module.exports = orderController;
