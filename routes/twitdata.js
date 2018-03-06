var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var TwitData = require('../models/TwitData.js');

/* GET users listing. */
router.get('/', function(req, res, next) {

    TwitData.find({}).sort({
        createdAt: -1
    }).limit(5).exec(function(err, tweets) {
        if (err) throw err;
        res.json(tweets);
    });

});

router.get('/all/:prediction?', function(req, res, next) {
    var pred = req.params.prediction;

    if (!pred) {
        TwitData.find({}).exec(function(err, tweets) {
            if (err) throw err;
            return res.json(tweets);
        });
    } else {
        TwitData.find({
            prediction: pred
        }).exec(function(err, tweets) {
            if (err) throw err;
            console.log(pred);
            return res.json(tweets);
        });
    }

});

router.get('/count', function(req, res, next) {

    TwitData.aggregate([{
            $group: {
                _id: {
                    prediction: "$prediction"
                },
                count: {
                    $sum: 1
                }
            }
        }])
        .exec(function(err, tweets) {
            if (err) throw err;
            res.json(tweets);
        });

});

//db.twitData.aggregate([ {$group : { _id : {prediction: "$prediction"} , count: { $sum: 1 } }}])


module.exports = router;
