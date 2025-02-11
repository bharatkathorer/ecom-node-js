const DB = require('../../../db/connection')
const {makePaginateQuery} = require("../../../utils/common");
const userController = {
    index: async (req, res) => {
        try {
            req.makePaginate();
            const query = makePaginateQuery(`select users.id,
                                                    users.email,
                                                    users.name,
                                                    users.created_at,
                                                    COUNT(carts.id)  AS cart_items,
                                                    COUNT(orders.id) AS order_items,
                                                    COUNT(*)            OVER () AS total_rows
                                             from users
                                                      LEFT JOIN carts on users.id = carts.user_id
                                                      LEFT JOIN orders on users.id = orders.user_id
                                             GROUP BY users.id
            `);
            const [result] = await DB.query(query, [req.limit, req.offset]);
            return res.success({
                data: result,
                paginate: req.paginate(result, 'total_rows'),
            });
        } catch (e) {
            return res.error(e.message);
        }
    },
}
module.exports = userController;
