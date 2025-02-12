const db = require('../../../db/connection');
const {hashPassword, verifyPassword, generateToken} = require("../../../utils/authentication");
const {mailService} = require("../../../services/mailService");

const authenticationController = {
    index: async (req, res) => {
        return res.success(req.auth);
    },

    register: async (req, res) => {
        try {
            req.validate.password = hashPassword(req.validate.password);
            let sql = 'INSERT INTO `users`(`name`, `email`,`password`) VALUES (?, ?,?)';
            const [result] = await db.execute(sql, [
                req.validate.name,
                req.validate.email,
                req.validate.password
            ]);

            req.validate.token = generateToken({
                id: result.insertId
            });
            await authenticationController.updateTokens([req.validate.token], result.insertId);
             mailService
                .to(req.validate.email)
                .subject('Register complete')
                .html('src/views/emails/register-mail.html', {
                    username: req.validate.name
                })
                .dealy(100);
            return res.success({
                id: result.insertId,
                ...req.validate,
            });
        } catch (e) {
            return res.error(e.message);
        }

    },

    login: async (req, res) => {
        try {
            const sql = `SELECT users.*, COUNT(carts.id) AS cart_items
                         FROM users
                                  LEFT JOIN carts ON users.id = carts.user_id
                         WHERE users.email = ?
                         GROUP BY users.id`;
            const [result] = await db.query(sql, [req.validate.email]);
            let errorMessage = 'something going wrong';
            if (result.length) {
                let data = result[0];
                if (verifyPassword(data.password, req.validate.password)) {
                    data.token = generateToken({
                        id: data.id
                    });

                    let tokens = data.login_tokens ? JSON.parse(data.login_tokens) : [];
                    data.login_tokens = null;
                    tokens.push(data.token);

                    const updateResult = await authenticationController.updateTokens(tokens, data.id);
                    if (updateResult.changedRows) {
                         mailService
                            .to(data.email)
                            .subject('Login')
                            // .cc('arohi@gmail.com')
                            // .text("testing")
                            .html('src/views/emails/login-mail.html', {
                                username: data.name
                            })
                            .dealy(100);
                        return res.success(data);
                    }
                } else {
                    errorMessage = "invalid password.";
                }
            } else {
                errorMessage = "User not found";
            }
            return res.error(errorMessage);

        } catch (e) {
            return res.error(e.message);
        }
    },

    logout: async (req, res) => {
        try {
            const tokens = req.login_tokens.filter((item) => req.login_token != item);
            await authenticationController.updateTokens(tokens, req.auth.id);
             mailService
                .to(req.auth.email)
                .subject('Logout')
                .html('src/views/emails/logout-mail.html', {
                    username: req.auth.name
                })
                .dealy(100);
            req.auth = null;
            return res.success('logout successfully done.');
        } catch (e) {
            return res.error(e.message);
        }
    },

    updateTokens: async (tokens, user_id) => {
        tokens = await JSON.stringify(tokens);
        const sql = 'UPDATE `users` SET `login_tokens` = ? WHERE `id` =? LIMIT 1';
        const [result] = await db.query(sql, [tokens, user_id]);
        return result;
    },

    googleAuth: async (req, res) => {
        try {

        } catch (e) {

        }
    }
}

module.exports = authenticationController;
