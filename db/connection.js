const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

const db = new Pool();

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

module.exports = db;
