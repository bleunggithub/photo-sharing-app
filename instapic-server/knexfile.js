// Update with your config settings.
require('dotenv').config()

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.PG_DATABASE,
      user:     process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: process.env.PG_DATABASE,
      user:     process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  test: {
    client: 'pg',
    connection: {
      database: process.env.PG_TEST_DATABASE,
      user:     process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD
    },
    migrations: {
      tableName: 'knex_migrations'
    },
  },

};
