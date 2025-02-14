const {generateSlug, makeInsertQuery, makeUpdateQuery, makePaginateQuery} = require("../../../utils/common");
const db = require('../../../db/connection');
const {mailService} = require("../../../services/mailService");
const productController = {

    index: async (req, res) => {
        try {
            req.makePaginate();
            const getQuery = `WITH paginate_data AS (SELECT *,
                                                            COUNT(*) OVER () AS total_rows
                                                     FROM products
                                                     WHERE admin_id = ?)
                              SELECT *
                              FROM paginate_data
                              ORDER BY created_at DESC -- ✅ Ensure sorting is applied in the final result
                                  LIMIT ?
                              OFFSET ?`;

            // Pass parameters to the query
            const [result] = await db.query(getQuery, [req.auth.id, req.limit, req.offset]);

            // Return response
            return res.success({
                data: result,
                paginate: req.paginate(result, 'total_rows'),
            });
        } catch (e) {
            console.log(e.message)
            return res.error(e.message);
        }
    },

    create: async (req, res) => {
        try {
            return res.success('');
        } catch (e) {
            return res.error(e.message);
        }
    },

    store: async (req, res) => {
        try {
            let data = req.validate;
            data.admin_id = req.auth.id;
            data.slug = generateSlug(data.title);
            data.product_image = req.file?.path?.replace(`public\\`, '');
            const {query, values} = makeInsertQuery(data);
            const insertQuery = `insert into products ${query}`
            const [result] = await db.execute(insertQuery, values);
            data.id = result.insertId;
            return res.success(data);
        } catch (e) {
            return res.error(e.message);
        }
    },

    edit: async (req, res) => {
        try {
            const query = `select *
                           from products
                           where id = ?`;

            const [result] = await db.query(query, [
                req.params.product_id
            ])
            if (result.length) {
                return res.success(result[0]);
            }
            return res.error('invalid product');
        } catch (e) {
            return res.error(e.message);
        }
    },

    update: async (req, res) => {
        try {
            const existsQuery = `select id
                                 from products
                                 where id = ?`;
            var [result] = await db.query(existsQuery, [
                req.params.product_id
            ])
            if (!result.length) {
                return res.error('invalid product');
            }

            let data = req.validate;
            data.slug = generateSlug(data.title);
            if (req.file.path) {
                data.product_image = req.file?.path?.replace(`public\\`, '');
            }
            const {query, values} = makeUpdateQuery(data);

            const updateQuery = `UPDATE products
                                 SET ${query}
                                 WHERE id = ?`

            var [result] = await db.execute(updateQuery, [
                ...values,
                req.params.product_id,
            ])
            if (result.affectedRows) {
                return res.success('product update successfully.');
            }
            return res.error('something gon wrong');
        } catch (e) {
            return res.error(e.message);
        }
    },

    destroy: async (req, res) => {
        try {
            const deleteQuery = `DELETE
                                 FROM products
                                 WHERE id = ? `
            const [result] = await db.execute(deleteQuery, [
                req.params.product_id
            ])
            if (result.affectedRows) {
                return res.success('product delete successfully.');
            }
            return res.error('invalid product id');
        } catch (e) {
            return res.error(e.message);
        }
    },
}

module.exports = productController;
