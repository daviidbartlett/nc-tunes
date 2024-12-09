const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

const config = {};

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

const pool = new Pool(config);

module.exports = pool;