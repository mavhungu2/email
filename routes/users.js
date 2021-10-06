var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var database = require('../utils/sql')
var bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator')

/* GET users listing. */
router.post('/', check('email').isEmail().normalizeEmail(), check('password').not().isEmpty(), function (req, res) {
  let sessionKey = makeid(255)
  bcrypt.hash(req.query.password, 10, function (err, hash) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let query = "INSERT INTO mail_users (email, password, session) VALUES ('" + req.query.email + "','" + hash + "','" + sessionKey + "')"
    database.query(query, function (err, result) {
      if (err) {
        console.log(err.code)
        if (err.code == "ER_DUP_ENTRY") {
          res.json({
            error: "User already registered"
          })
        }
        else {
          res.json(createError(500))
          console.log(err)
        }
      } else {
        res.json({
          message: "User registered successfully",
          sessionKey: sessionKey
        })
      }
    })

  });
});



router.get('/login', check('email').isEmail().normalizeEmail(), check('password').not().isEmpty(), function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let query = "SELECT `password` FROM mail_users WHERE email = '" + req.query.email + "'"
  database.query(query, function (err, result) {
    if (err) throw err;
    if(result.length > 0){
      bcrypt.compare(req.query.password, result[0]['password']).then(response => {
        if (response) {
          let sessionKey = makeid(255)
          let update = "UPDATE mail_users SET session = '" + sessionKey + "' WHERE email = '" + req.query.email + "'"
          database.query(update, function (err, result) {
            if (err) throw err;
            res.json({
              message: "Log in successfully",
              sessionKey: sessionKey
            })
          })
        } else {
          res.json({
            error: "Could not verify credentials",
          })
        }
  
      })
    }else{
      res.json({
        error: "Could not verify credentials",
      })
    }
    
  })
});

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}


module.exports = router;
