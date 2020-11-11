const util = require("util");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Paviliondv731$",
  password: "MyNewPass",
  database: "employees"
});

connection.connect();

connection.connect(function (err){
  if (err) throw err;

  start();
});

module.exports = connection;
