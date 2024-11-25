const { Pool } = require("pg");

require("dotenv").config();

const connectionString = process.env.DB_CONNECTION_URL;

module.exports = new Pool({
  connectionString,
});
