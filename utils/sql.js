var mysql = require('mysql');

var con = mysql.createConnection({
  host: "tbkbusiness.co.za",
  user: "tbkbuiqd_isaac",
  password: "Nokia0629*",
  database: "tbkbuiqd_wp220"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database");
});

con.on('error', function(err) {
  console.log(err)
});

module.exports = con