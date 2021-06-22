const dotenv = require('dotenv-flow');

if (process.env.ENV_LOADED !== 'true') {
  dotenv.config();
}

const dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
};

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig
};
