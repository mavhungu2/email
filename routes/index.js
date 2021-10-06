var express = require('express');
var router = express.Router();
var database = require('../utils/sql')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Hello")
});

module.exports = router;
