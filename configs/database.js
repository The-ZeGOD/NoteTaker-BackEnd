const { Client } = require("pg");

console.log(process.env.SECRET_KEY);
const client = new Client("postgres://xwumtnbf:lNE5LElgPd9k3lJBwzRB9o0IBBMswPqm@rain.db.elephantsql.com/xwumtnbf");

module.exports = client;