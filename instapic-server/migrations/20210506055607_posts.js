
exports.up = function(knex) {
  return knex.schema
    .createTable('posts', function(table) {
      table.increments('posts_id').unsigned().primary();
      table.string('img_url');
      table.string('content', 300);
      table.integer('user_id');
      table.foreign('user_id').references('users.id')
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });    
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts')
};
