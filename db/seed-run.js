const seed = require("./seed");
const db = require("./connection");
const data = require("./data/dev");

seed(data).then(() => {
  db.end();
});
