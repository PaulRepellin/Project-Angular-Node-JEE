"use strict";
// default.route.js
var express = require("express");
var router = express.Router();
module.exports = router;
// Routing using
router.route('/').get(function(resquest,response){
	response.send("It's Works");
});
/*
router.route(__PATH__)
.get()
.post()
.put()
.delete()
.all()
.[...]
*/