var mysql = require("mysql");
var pool = mysql.createPool({
    host: "campusshala.com",
    port: 3306,
    user: "campussh_timesheet",
    database: "campussh_timesheet",
    password: "Vikram123@@",
    connectionLimit: 100, // optional
    multipleStatements: true
});
module.exports = pool;

// var mysql = require("mysql");
// var pool = mysql.createPool({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "123",
//   database: "campussh_timesheet",
//   connectionLimit: 100,
//   multipleStatements: true,
// });
// module.exports = pool;
