// Setting up connection to database.
var mysql = require("mysql");
var pool = mysql.createPool({
	connectionLimit: 10,
	host: "classmysql.engr.oregonstate.edu",
	user: "cs340_[userName]",
	password: "[Password]",
	database: "cs340_[database]",
});

module.exports.pool = pool;
