const ENV = process.env.NODE_ENV || "development";
const data = {
  development: require("./dev"),
  production: require("./dev"),
  test: require("./test"),
};

module.exports = data[ENV];
