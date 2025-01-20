const db = require('../db/connection');
const checkExists = async (tableName, keyName, value, ignoreKey = null,ignoreValueKey=null) => {
    const [result] = await db.query(`select id
                                     from ${tableName}
                                     where ${keyName} = ?`, [value]);

    return new Promise((resolve, reject) => {
        if (result.length) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}
module.exports = {
    checkExists,
}
