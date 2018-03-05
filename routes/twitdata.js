var express = require('express');
var router = express.Router();
const mongoose   = require('mongoose');
var TwitData = require('../models/TwitData.js');

/* GET users listing. */
router.get('/', function(req, res, next) {

  TwitData.find({}).sort({createdAt: -1}).limit(5).exec(function(err, tweets) {
      if (err) throw err;
      res.json(tweets);
  });

});

module.exports = router;
