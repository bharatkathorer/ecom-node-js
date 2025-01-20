const db = require('../../../db/connection')
const {makeInsertQuery, makeUpdateQuery} = require("../../../utils/common");

const addressController = {

    index: async (req, res) => {
        try {
            const selectQuery = `SELECT *
                                 FROM user_addresses
                                 WHERE user_id = ?`;

            const [result] = await db.query(selectQuery, [req.auth.id]);

            return res.success({
                addresses: result
            });
        } catch (e) {
            return res.error(e.message);
        }
    },

    view: async (req, res) => {
        try {
            const selectQuery = `SELECT *
                                 FROM user_addresses
                                 WHERE user_id = ?
                                   AND id = ? LIMIT 1`;
            const [result] = await db.query(selectQuery, [req.auth.id, req.params.address_id]);
            if (result.length) {
                return res.success(result[0]);
            } else {
                return res.error('invalid address');
            }
        } catch (e) {
            return res.error(e.message);
        }
    },

    store: async (req, res) => {
        try {
            var [result] = await db.query(`SELECT count(id) as total
                                           FROM user_addresses
                                           WHERE user_id = ?`, [req.auth.id]);

            const is_default = (result.length && result[0].total === 0) ? true : false;

            const {query, values} = makeInsertQuery({
                ...req.validate, user_id: req.auth.id, is_default
            });
            const insertQuery = `INSERT INTO user_addresses ${query}`;
            [result] = await db.query(insertQuery, values);
            return res.success({
                id: result.insertId, ...req.validate, is_default
            });
        } catch (e) {
            return res.error(e.message);
        }
    },

    update: async (req, res) => {
        try {
            var [result] = await db.query(`SELECT count(id) as total
                                           FROM user_addresses
                                           WHERE user_id = ?
                                             AND id = ?`, [req.auth.id, req.params.address_id]);

            if (result.length && result[0].total === 1) {
                const {query, values} = makeUpdateQuery(req.validate);
                [result] = await db.query(`UPDATE user_addresses
                                           SET ${query}
                                           WHERE user_id = ?
                                             AND id = ?`, [...values, req.auth.id, req.params.address_id]);
                if (result.affectedRows) {
                    return res.success('Address update successfully');
                }
                return res.error('something gon wrong');
            } else {
                return res.error('invalid address ');
            }
        } catch (e) {
            return res.error(e.message);
        }
    },

    destroy: async (req, res) => {
        try {
            const deleteQuery = `DELETE
                                 FROM user_addresses
                                 WHERE user_id = ?
                                   AND id = ?`;
            const [result] = await db.query(deleteQuery, [req.auth.id, req.params.address_id]);
            if (result.affectedRows) {
                return res.success('address delete successfully');
            }
            return res.error('something gon wrong');
        } catch (e) {
            return res.error(e.message);
        }
    },


    setDefault: async (req, res) => {
        try {
            var [result] = await db.query(`SELECT count(id) as total
                                           FROM user_addresses
                                           WHERE user_id = ?
                                             AND id = ?`, [req.auth.id, req.body.address_id]);

            if (result.length && result[0].total === 1) {
                var {query, values} = makeUpdateQuery({
                    is_default: false
                });
                [result] = await db.query(`UPDATE user_addresses
                                           SET ${query}
                                           WHERE user_id = ?`, [...values, req.auth.id]);
                var {query, values} = makeUpdateQuery({
                    is_default: true
                });
                [result] = await db.query(`UPDATE user_addresses
                                           SET ${query}
                                           WHERE user_id = ?
                                             AND id = ?`, [...values, req.auth.id, req.body.address_id]);
                if (result.affectedRows) {
                    return res.success('default address set successfully');
                }
                return res.error('something gon wrong');
            } else {
                return res.error('invalid address ');
            }
        } catch (e) {
            return res.error(e.message);
        }
    },
}

module.exports = addressController;
