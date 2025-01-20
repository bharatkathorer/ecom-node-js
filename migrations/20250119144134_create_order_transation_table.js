/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('order_transations', (table) => {
        table.increments('id').primary();
        table.bigInteger('order_id').unsigned();
        table.integer('status').defaultTo(0);
        table.string('note').defaultTo('Order pending');
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('order_transations');
};

