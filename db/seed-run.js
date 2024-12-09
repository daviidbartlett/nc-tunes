const seed = require("./seed");
const db = require("./connection");
const data = require("./data");

seed(data).then(() => {
  db.end();
});
