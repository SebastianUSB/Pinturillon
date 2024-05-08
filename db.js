const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Pinturillon',
    password: '5384',
    port: 5432,
});

module.exports = pool;
