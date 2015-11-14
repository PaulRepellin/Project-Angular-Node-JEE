"use strict";
var CONFIG = require("./config.json");
process.env.CONFIG = JSON.stringify(CONFIG);

console.log("It Works !");
// déclarer express
var express = require("express");

var app = express();
//init path
var path = require("path");

//déclarer http
var http = require("http");
var defaultRoute = require("./app/routes/default.route.js");
var slidRoute = require("./app/routes/slid.route.js");


var IOController = require("./app/controllers/io.controller.js");

//déclarer la route
app.use(defaultRoute);
app.use(slidRoute);



var fs=require('fs');
// init server
var server = http.createServer(app);
server.listen(CONFIG.port);

//init exports with : 
var model=require("./app/models/slid.model.js");

// define static route to admin and watch folder
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));

app.use("/model",function(request, response) 
{
	console.log("ok");
});


app.use("/loadPres", function(request,response){

var p = CONFIG.presentationDirectory;
var i;
fs.readdir(p,function(err,files){
	var jsonTab = {};
	console.log("---------APP.JS-loadPres---------");
	console.log(files.length);
 		for(i=0;i<files.length;i++){
 			if(".json" === path.extname(files[i]).toString()){
 				var test = fs.readFileSync(path.join(p,files[i]));
 				var jsonElt = JSON.parse(test.toString());
 				jsonTab[jsonElt.id] = jsonElt;
 				console.log(jsonTab);	
 			}
		}
		response.send(jsonTab);
	});
});

app.post("/savePres" , function(request,response){
var p = CONFIG.presentationDirectory;
	var content = "";
	request.on('data',function(data){
			content += data.toString();
		});

	request.on('end',function(){
			var jsonElt = JSON.parse(content.toString());
			var nomPres = jsonElt.id;
			nomPres += ".pres.json";
			fs.writeFile(path.join(p,nomPres), content, function (err) {
  		if (err) throw err;
  		response.send(content);
  			console.log("---------APP.JS-savePres---------");
 			console.log('It\'s saved!');
		});

		});

});

//IOController.listen(server);



