/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('products', (table) => {
        table.increments('id').primary();
        table.string('title');
        table.string('slug').nullable();
        table.string('product_image').nullable();
        table.text('description').nullable();
        table.double('grass_price');
        table.double('net_price');
        table.integer('discount').defaultTo(0);
        table.bigInteger('admin_id')
            .unsigned()
        table.timestamps(true, true)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('products');
};
