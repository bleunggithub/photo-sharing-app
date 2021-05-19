
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'cookie',
          password: '$2b$10$SIGm/69m6wnjoUixI.6E8uqe4UCrpIYO3OY.4N25/LdS72Dh9fbaW',//pw:1234
          tokenVersion: 1
        }, 
        {
          username: 'biscuit',
          password: '9876',
          tokenVersion: 1
        },
        {
          username: 'cheesecake',
          password: '1234',
          tokenVersion: 1
        }
      ]);
    });
};
