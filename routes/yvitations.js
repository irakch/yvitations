/**
 * Created by vk on 24.04.16.
 */

var express = require('express');
var router = express.Router();
var yvitations = require('../custom_modules/quotes');

/*
 * GET yvitations.
 */

router.get('/', function(req, res) {
	res.json(yvitations);
});

module.exports = router;