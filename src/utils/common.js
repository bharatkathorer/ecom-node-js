const generateSlug = (string) => {
    return string
        .toLowerCase() // Convert to lowercase
        .trim()         // Remove whitespace from both ends
        .normalize("NFD") // Normalize the string (decompose diacritics)
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Remove duplicate hyphens
}

const makeInsertQuery = (data) => {
    const keys = Object.keys(data);
    let query = `(${keys.join(',')}) values(${keys.map(() => "?").join(", ")})`;
    return {
        query,
        values: keys.map((key) => data[key])
    };
}
const makeMultipleInsertQuery = (data = []) => {
    if (data.length) {
        const keys = Object.keys(data[0]);
        let query = `(${keys.join(',')}) values ?`;
        return {
            query,
            values: data.map((_data) => {
                return keys.map((key) => _data[key]);
            })
        };
    } else {
        return {
            query: '',
            values: []
        };
    }
}
const makeUpdateQuery = (data) => {
    const keys = Object.keys(data);
    let query = `${keys.map((key) => `${key}=?`).join(", ")}`;
    return {
        query,
        values: keys.map((key) => data[key])
    };
}
const makePaginateQuery = (query) => {
    return `WITH paginate_data AS (${query})
    SELECT *
    FROM paginate_data
    ORDER BY id LIMIT ?
    OFFSET ?;
    `;
}


module.exports = {
    generateSlug,
    makeInsertQuery, makeUpdateQuery, makePaginateQuery, makeMultipleInsertQuery
}
