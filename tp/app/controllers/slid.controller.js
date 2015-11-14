var CONFIG = require("../../config.json");

var fs = require ("fs");
var path = require("path");
var http = require("http");
var ModelSlid=require("../models/slid.model.js");

module.exports=SlidController;
function SlidController() {}
SlidController.read=function(request,response){
	ModelSlid.read(request.userId, function(err,data)
	{
		if (err) 
			console.error(err);
		else
		{
			console.log("---------CONTROLLER----------");
			console.log(data);
			response.send(data);
		}
	});


}

SlidController.list=function(request,response){
	var p = CONFIG.contentDirectory;
	var i;
	var jsonTab = {};
	console.log(p);
	fs.readdir(p,function(err,files){
		console.log("---------CONTROLLER----------");
		if(err)
			console.err(new Error("errorrrrr"));
		for(i=0;i<files.length;i++){
			if(".json" === path.extname(files[i]).toString()){
				var test = fs.readFileSync(path.join(p,files[i]));
				var jsonElt = JSON.parse(test.toString());
				jsonTab[jsonElt.id] = jsonElt;
				console.log(jsonTab[jsonElt.id]);	
			}
		}
		response.send(jsonTab);
	});
}

SlidController.create=function(request,response){
	console.log("-------CONTROLLER--------CREATE--------");
	

	var p = CONFIG.contentDirectory;
	var content = "";
	request.on('data',function(data){
			content += data.toString();
		});

	request.on('end',function(){
		var slid=new ModelSlid(JSON.parse(content.toString()));
		console.log(content);
		console.log(slid.getData());
		ModelSlid.create(slid, function(err){
			if (err) {
			console.error(err);
			}
		});
	});
	response.send("ok");
}