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
			console.log("\n\n---------CONTROLLER------READ---------\n\n");
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
		console.log("\n\n---------CONTROLLER------LIST----------\n\n");
		if(err)
			console.err(new Error("errorrrrr"));
		for(i=0;i<files.length;i++){
			if(".json" === path.extname(files[i]).toString()){
				var test = fs.readFileSync(path.join(p,files[i]));
				var jsonElt = JSON.parse(test.toString());
				jsonTab[jsonElt.id] = jsonElt;
				console.log(jsonTab[jsonElt.id]);	
				console.log("\n\n");
			}
		}
		response.send(jsonTab);
	});
}

SlidController.create=function(request,response){
	console.log("\n\n-------CONTROLLER--------CREATE--------\n\n");
	

	var p = CONFIG.contentDirectory;
	var content = "";
	request.on('data',function(data){
			content += data.toString();
		});

	request.on('end',function(){
		var jsonModel=JSON.parse(content.toString())
		var slid=new ModelSlid(jsonModel);
		slid.setData(jsonModel.data);
		console.log(content);
		console.log("Verification data : ")
		console.log(slid.getData());
		console.log("\n\n");
		ModelSlid.create(slid, function(err){
			if (err) {
			console.error(err);
			}
		});
	});
	response.send("ok");
}