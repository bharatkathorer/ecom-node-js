/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('user_addresses', (table) => {
        table.increments('id').primary();
        table.string('pincode').nullable();
        table.text('address').nullable();
        table.boolean('is_default').defaultTo(false);

        table.bigInteger('user_id').unsigned();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('user_addresses');
};
