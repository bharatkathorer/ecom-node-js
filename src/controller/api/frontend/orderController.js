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
                           where user_id = ?`
            const [result] = await db.query(query, [req.auth.id]);
            return res.success({
                orders: result
            });
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
            let [result] = await db.query(cartsQuery, [req.validate.cart_ids, req.auth.id])
            const address = JSON.stringify([]);
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
                    address,
                }
            })
            await db.query('delete from carts where id IN (?)', [
                result.map((item) => item.cart_id)
            ])
            let {query, values} = makeMultipleInsertQuery(orders);
            query = `INSERT INTO orders ${query}`

            [result] = await db.query(query, [values]);
            if (result.affectedRows) {
                // db.commit();
                return res.success('Order successfully');
            } else {
                // await db.rollback();
                return res.error('something gon wrong');
            }

        } catch (e) {
            // await db.rollback();
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
