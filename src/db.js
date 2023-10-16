const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'helpcsce',
  password: '9736',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
