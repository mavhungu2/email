var express = require('express');
var router = express.Router();
var database = require('../utils/sql')
const { check, validationResult } = require('express-validator')


router.post('/',check('label').not().isEmpty(), function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let query = "INSERT INTO labels (`label`, `email`) VALUES ('"+req.query.label+"','"+res.locals.email+"')"
    console.log(query)
    database.query(query, function (err, result){
        console.log(result)
        if (err) throw err;
        res.json({
            message: "Label Created"
        })
    })
})

router.delete('/:id', function(req, res){
    let query = "DELETE FROM labels WHERE `id` = '"+req.params['id']+"' AND `email` = '"+res.locals.email+"'"
    database.query(query, function (err, result){
        if (err) throw err;
        if(result.affectedRows != 0){
            res.json({
                message: "Label Deleted"
            })
        }else{
            res.json({
                message: "Label not found"
            })
        }
        
    })
})

router.post('/link/:id', function(req, res){
    let query = "INSERT INTO link_labels (`label_id`, `mail_id`) VALUES ('"+req.params['id']+"','"+req.query.mailID+"')"
    database.query(query, function (err, result){
        if (err) throw err;
        res.json({
            message: "Label linked"
        })
    })
})

router.post('/unlink/:id',check('mailID').not().isEmpty(), function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let query = "DELETE FROM link_labels WHERE `label_id` = '"+req.params['id']+"' AND `mail_id` = '"+req.query.mailID+"'"
    database.query(query, function (err, result){
        if (err) throw err;
        if(result.affectedRows != 0){
            res.json({
                message: "Label Unlinked"
            })
        }else{
            res.json({
                message: "Label not found"
            })
        }
    })
})


module.exports = router;