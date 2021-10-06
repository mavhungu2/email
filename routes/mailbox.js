var express = require('express');
var router = express.Router();
var database = require('../utils/sql')
const { check, validationResult } = require('express-validator')

router.get('/', function (req, res) {
    let query = "SELECT * FROM mails WHERE `to` = '" + res.locals.email + "' AND (deleted IS NULL OR deleted != 1)"
    database.query(query, function (err, result) {
        if (err) throw err;
        res.json(result)
    })
})

router.get('/label/:id', function (req, res) {
    let query = "SELECT * FROM mails RIGHT JOIN link_labels ON link_labels.mail_id=mails.id WHERE link_labels.label_id = "+req.params['id']+" AND (deleted IS NULL OR deleted != 1) AND label_id IS NOT NULL"    
    database.query(query, function (err, result) {
        if (err) throw err;
        res.json(result)
    })
})

router.get('/label/:id', function (req, res) {
    console.log(req.query)
    let query = "SELECT * FROM mails WHERE `from` = '" + res.locals.email + "'"
    console.log(query)
    database.query(query, function (err, result) {
        if (err) throw err;
        console.log(result)
        res.json(result)
    })
})

router.post('/', check('to').isEmail().normalizeEmail(), function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let query = "INSERT INTO mails (`to`, `from`, `subject`, `message`) VALUES ('" + req.query.to + "','" + res.locals.email + "','" + req.query.subject + "','" + req.query.message + "')"
    database.query(query, function (err, result) {
        if (err) throw err;
        res.json({
            message: "Mail sent"
        })
    })
})

router.delete('/:id', function (req, res) {
    let query = "UPDATE mails SET deleted = 1 WHERE (deleted IS NULL OR deleted != 1) AND `id` = '" + req.params['id'] + "' AND `from` = '" + res.locals.email + "'"
    database.query(query, function (err, result) {
        if (err) throw err;
        console.log()
        if (result.affectedRows != 0) {
            res.json({
                message: "Mail Deleted"
            })
        } else {
            res.json({
                message: "Mail not found"
            })
        }
    })
})

router.get('/trash', function (req, res) {
    let query = "SELECT * FROM mails WHERE deleted = 1 AND `from` = '" + res.locals.email + "'"
    database.query(query, function (err, result) {
        if (err) throw err;
        res.json(result)
    })
})

router.get('/recover/:id', function (req, res) {
    let query = "UPDATE mails SET deleted = 0 WHERE deleted = 1 AND `id` = '" + req.params['id'] + "' AND `from` = '" + res.locals.email + "'"
    database.query(query, function (err, result) {
        if (err) throw err;
        if (result.affectedRows != 0) {
            res.json({
                message: "Mail Recovered"
            })
        } else {
            res.json({
                message: "Mail not found"
            })
        }

    })
})


module.exports = router;