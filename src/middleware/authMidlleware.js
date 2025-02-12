const db = require('../db/connection')
const {readTokenData} = require("../utils/authentication");
const findUser = async (tableName, keyName, value) => {
    const [result] = await db.query(`
        SELECT ${tableName}.*, COUNT(carts.id) AS cart_items
        FROM ${tableName}
                 LEFT JOIN carts ON ${tableName}.id = carts.user_id
        WHERE ${tableName}.${keyName} = ?
        GROUP BY ${tableName}.id
    `, [value]);
    if (result.length) {
        return result[0];
    }
    return false;
}

const setAuth = async (req, res, next) => {
    let head_token = req.headers?.authorization;
    head_token = head_token?.replace('Bearer ', '');
    if (head_token) {
        const tokenData = readTokenData(head_token);
        if (tokenData?.id) {
            let {login_tokens, ...user} = await findUser('users', 'id', tokenData.id);
            let tokens = login_tokens ? JSON.parse(login_tokens) : [];
            const isValidToken = tokens?.find((item) => item === head_token) ?? null;
            if (isValidToken) {
                req.login_tokens = tokens;
                req.login_token = head_token;
                req.auth = user;
            }
        }
    }
    return next();
}
const auth = async (req, res, next) => {
    try {
        if (req.login_token) {
            return next();
        }
        let head_token = req.headers?.authorization;
        head_token = head_token?.replace('Bearer ', '');
        if (head_token) {
            const tokenData = readTokenData(head_token);
            if (tokenData?.id) {
                let {login_tokens, ...user} = await findUser('users', 'id', tokenData.id);
                let tokens = login_tokens ? JSON.parse(login_tokens) : [];
                const isValidToken = tokens?.find((item) => item === head_token) ?? null;
                if (isValidToken) {
                    req.login_tokens = tokens;
                    req.login_token = head_token;
                    req.auth = user;
                    return next();
                }
                return res.error('invalid token');
            }
        } else {
            return res.error('Unauthorized user');
        }
    } catch (e) {
        return res.error(e.message);
    }
}

const authAdmin = async (req, res, next) => {
    try {
        let head_token = req.headers?.authorization;
        head_token = head_token?.replace('Bearer ', '');
        if (head_token) {
            const tokenData = readTokenData(head_token);
            if (tokenData?.id) {
                let {login_tokens, ...user} = await findUser('admins', 'id', tokenData.id);
                let tokens = login_tokens ? JSON.parse(login_tokens) : [];
                const isValidToken = tokens?.find((item) => item === head_token) ?? null;
                if (isValidToken) {
                    req.login_tokens = tokens;
                    req.login_token = head_token;
                    req.auth = user;
                    return next();
                }
                return res.error('invalid token');
            }
        } else {
            return res.error('Unauthorized user');
        }
    } catch (e) {
        return res.error(e.message);
    }
}

const socketAuth = async (socket, next) => {
    const token = socket.handshake.auth?.token; // Token sent by the client in handshake.auth
    if (!token) {
        return next(new Error('Authentication error: Token not provided'));
    }
    const tokenData = readTokenData(token);
    if (tokenData?.id) {
        let {login_tokens, ...user} = await findUser('users', 'id', tokenData.id);
        let tokens = login_tokens ? JSON.parse(login_tokens) : [];
        const isValidToken = (tokens ?? [])?.find((item) => item === token) ?? null;
        if (isValidToken) {
            socket.login_tokens = tokens;
            socket.login_token = token;
            socket.auth = user;
            return next();
        } else {
            return next(new Error('Authentication error: Invalid token'));
        }
    } else {
        return next(new Error('Authentication error: Invalid token'));
    }
}


module.exports = {
    auth, authAdmin, socketAuth, setAuth
}
