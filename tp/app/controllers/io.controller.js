"use strict";
var io = require("socket.io");
var SlidModel = require("../models/slid.model.js");
var fs = require ("fs");
var path = require("path")
var map = {}
var presentationCourrante;
var contentMapCourrant;
var indiceContentMap = 0;
var slideCourrant;
var indiceSlide = 1;

exports.listen = function (server){
	io.listen(server);
	io.sockets.on("connection", function (socket) {
		socket.emit("connection");


		socket.on("data_comm", function (idClient){
			map[idClient] = socket;
		});

		socket.on("slidEvent", function (data){
			
			

			
				var jsonElt = JSON.parse(data.toString());
				var idPres = "";

				var cmdPres = jsonElt.cmd;
				if("START" === cmdPres){
					idPres = jsonElt.id;
					var p = CONFIG.presentationDirectory;
					var i = 0;
					var trouve = false;
					fs.readdir(p,function(err,files){
				 		while(i<files.length && !trouve){
				 			if(".json" === path.extname(files[i]).toString()){
				 				var testPresentation = fs.readFileSync(path.join(p,files[i]));
				 				var jsonElt = JSON.parse(test.toString());
				 				if(idPres === jsonElt.id){
				 					trouve = true;
				 					presentationCourrante = jsonElt;
				 					contentMapCourrant = presentationCourrante.slidArray[0].contentMap;
				 					slideCourrant = contentMapCourrant[1];
				 				}
				 			}
				 			i++;
						}
					});
				}

				if("BEGIN" === cmdPres){
					readSlide(slideCourrant);
				}
				if("NEXT" === cmdPres){
					indiceSlide++;
					if(contentMapCourrant[indiceSlide] != undefined){
						slideCourrant = contentMapCourrant[indiceSlide];
						readSlide(slideCourrant);
					} else if(presentationCourrante.slidArray[indiceContentMap+1] != undefined){
						indiceContentMap++;
						contentMapCourrant = presentationCourrante.slidArray[indiceContentMap].contentMap;
						slideCourrant = contentMapCourrant[1];
						indiceSlide = 1;
						readSlide(slideCourrant);
					} else {
						socket.broadcast.emit("message","Fin du diapo");
					}
					
				}

				if("PREV" === cmdPres){
					indiceSlide --;
					if(contentMapCourrant.indiceSlide != undefined){
						slideCourrant = contentMapCourrant[indiceSlide];
						readSlide(slideCourrant);
					} else if(presentationCourrante.slidArray[indiceContentMap-1] != undefined){
						indiceContentMap--;
						contentMapCourrant = presentationCourrante.slidArray[indiceContentMap].contentMap;
						indiceSlide = Object.keys(contentMapCourrant).length
						slideCourrant = contentMapCourrant[indiceSlide];
						readSlide(slideCourrant);
					} else {
						socket.broadcast.emit("message","Début du diapo");
					}
					
				}

				if("END" === cmdPres){
					socket.broadcast.emit("message","Fin du diapo");
				}
				if("PAUSE" === cmdPres){
					socket.broadcast.emit("message","Diapo en pause");
				}

		});

	});
};

function readSlide(idSlide){
	SlidModel.read(idSlide, function(err,slid){
		if (err) throw err;
		slid.src = "/slid/" + slid.id;
		socket.broadcast.emit(slid);
	});

}




