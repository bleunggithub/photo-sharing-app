
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').unsigned().primary();
      table.string('username');
      table.string('password');
      table.integer('tokenVersion').unsigned();
    });    
};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
