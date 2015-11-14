// slid.route.js
'use strict';
var http = require("http");
var multer=require("multer");
var SlidController=require("./../controllers/slid.controller.js");
var express=require("express");
var router=express.Router();
module.exports=router;
var multerMiddleware=multer({ "dest":'../../uploads/'});
/*router.post("/slids",multerMiddleware.single("file"), function(request,response) { 
	console.log(request.file.path);
	console.log(request.file.originalname);
	console.log(request.file.mimetype);
});*/

router.route('/slids')
.get(SlidController.list)
.post(multerMiddleware.single("file"),SlidController.create);

router.route('/slids/:slidId').get(SlidController.read);

router.param('slidId', function(req, res, next, id) {
	req.userId = id;
	next();
});