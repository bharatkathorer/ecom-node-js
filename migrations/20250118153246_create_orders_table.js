/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('orders', (table) => {
        table.increments('id').primary();
        table.bigInteger('product_id').unsigned();
        table.bigInteger('user_id').unsigned();
        table.string('payment_id').nullable();
        table.double('grass_price');
        table.double('net_price');
        table.integer('discount').defaultTo(0);
        table.integer('status').defaultTo(0);
        table.json('address').nullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
