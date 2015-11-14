'use strict';
var CONFIG = require("../../config.json");
var path = require("path");
var fs=require('fs');
var utils=require('../utils/utils.js');
process.env.CONFIG = JSON.stringify(CONFIG);

//data_model is a json object
function ModelSlid(data_model){
	if(data_model==null)
	{
		this.id="";
		this.type="";
		this.title="";
		this.fileName="";
		var data="";
	}
	else
	{
		this.id=data_model.id;
		this.type=data_model.type;
		this.title=data_model.title;
		this.fileName=data_model.fileName;
		if(data_model.getData)
			this.setData(data_model.getData());
	}
	this.getData = function () {
  		return data;
	}
	this.setData = function (val) {
 		 data = val;
	}
	
}
module.exports=ModelSlid;



ModelSlid.create=function(slid,callback){

			// create a JSON File with all meta data
	// Building meta data
	//type,id,title, fileName
	var metadata = JSON.stringify(slid);
			// write into file
	if(!slid.fileName || !slid.id )
	{		
		callback(new Error('ModelSlid unfullfilled'));;
		return;
	}
	
	fs.writeFile(utils.getMetaFilePath(slid.id), metadata, function (err) {
		if (err) {
			console.log('Fail in writing the meta-data in'+slid.id+'!');
			callback(err);	
			return;
		}
		
		console.log('The meta-data in '+slid.id+' have been saved!');
		
		// create file with data ( picture or anything)
		// write into file
		fs.writeFile(utils.getDataFilePath(slid.fileName), slid.getData(), function (err) {
			if (err) 
			{
				console.log('Fail in writing the data in'+slid.fileName+'!');
				callback(err);
				return;
			}
			console.log('The data in '+slid.fileName+' have been saved!');

			callback();
		});	
	});	
}



ModelSlid.read=function(id,callback){
	//id += ".meta.json";

	fs.readFile(utils.getMetaFilePath(id), function (err, data) {
		if(err){		
			console.log("The MetaData doesn't exist!");
			callback(err);
			return;
		}
		var jsonElt = JSON.parse(data.toString());
		var slid= new ModelSlid(jsonElt);
		console.log("---------MODEL----------");
		console.log(slid);	

 		callback(undefined,slid);
	});
	
}
ModelSlid.update=function(slid,callback){
	//update data from meta data 
	// if data != null and >0, update data from filename
	
	
	//var id = ".meta.json";
	utils.readFileIfExists(utils.getMetaFilePath(slid.id),function(err){
		if(err){
			console.log("The MetaData doesn't exist!");
			callback(err);
			return;
		}
		else{

			if(slid.getData()!=null){
				console.log("coucou");
				ModelSlid.create( slid, function (err) {
					if (err){
						console.log('Fail in updating the data in'+slid.fileName+'!');
						callback(err);
						return;
					}
								
					console.log('The data in '+slid.fileName+' have been updated!');
					callback();
				
				});	
			}
			else{
				console.log("coucou");
				fs.writeFile(utils.getMetaFilePath(slid.id), slid, function (err) {
						if (err){
							console.log('Fail in updating the meta-data in'+slid.id+'!');
							callback(err);
							return;
						}
						console.log('The meta-data in '+slid.id+' have been updated!');
						callback();
				});	
			}

		}
		
	});
	
	
}
ModelSlid.delete=function(id,callback){
	ModelSlid.read(id, function(err, data) {
		fs.unlink(utils.getMetaFilePath(id), function(err) {
			if (err) {
				callback(err);
				console.log("Delete meta data failed ! ");
				return;
			} 
			fs.unlink(utils.getDataFilePath(data.fileName), function(err) {
				if (err) {
					callback(err);
					console.log("Delete data failed ! ");
					return;
				}
				console.log("Delete data and meta-data ok ! ");
				callback();
			});
			
		});
		
	});
	
	
}
