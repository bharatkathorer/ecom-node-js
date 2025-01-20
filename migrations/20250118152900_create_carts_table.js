/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('carts', (table) => {
        table.increments('id').primary();
        table.bigInteger('product_id').unsigned();
        table.bigInteger('user_id').unsigned();
        table.enum('type', ['cart', 'save_later', 'wishlist']).defaultTo('cart');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('carts');
};
