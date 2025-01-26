/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('messages', table => {
        table.increments('id').primary();
        table.string('message');
        table.bigInteger('sender_id').unsigned();
        table.bigInteger('receiver_id').unsigned();
        table.integer('status').defaultTo(0);
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('messages');
};
