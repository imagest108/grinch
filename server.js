var http = require("http");
var fs = require("fs");
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler (req, res){

        fs.readFile(__dirname + '/index.html',
                function (err, data) {
                        if (err) {
                                res.writeHead(500);
                                return res.end('Error loading index.html');
                        }

                        res.writeHead(200);
                        res.end(data);
                });
}

var displaygroup = [];
var usergroup1 = [];
var usergroup2 = [];
var usergroup3 = [];
var grinch = null;


var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function (socket){

	console.log("We have a new client: " + socket.id);
	socket.on('register', function(data){
		//console.log(data);
		if( data === "display"){
			 
			if(displaygroup.length < 3){				
				var tempData = { 
					id: socket.id, 
					index: displaygroup.length+1,
					role: data 
				};
				
				displaygroup.push(tempData);
				io.sockets.socket(displaygroup[displaygroup.length-1].id).emit('render', tempData);
		
			}else{
				//make socket disconnect!
				console.log("you shouldn't be here!");
				console.log("displaysockets are "+ displaygroup.length);
			}	

		} else if(data === "user_group1"){
			
			if(usergroup1.length < 50){				
				tempData = { 
					id: socket.id, 
					index: usergroup1.length+1,
					role: data 
				};
				usergroup1.push(tempData);
				console.log(usergroup1[usergroup1.length -1 ]);

				io.sockets.socket(displaygroup[0].id).emit('render', tempData);
				
			}else{
				//make socket disconnect!
			}

		} else if(data === "user_group2"){
			
			if(usergroup2.length < 50){								
				tempData = { 
					id: socket.id, 
					index: usergroup2.length+1,
					role: data 
				};
				usergroup2.push(tempData);
				console.log(usergroup2[usergroup2.length -1 ]);

				io.sockets.socket(displaygroup[1].id).emit('render', tempData);
				
			}else{
				//make socket disconnect!
			}
		} else if(data === "user_group3"){
			
			if(usergroup3.length < 50){								
				tempData = { 
					id: socket.id, 
					index: usergroup3.length+1,
					role: data 
				};
				usergroup3.push(tempData);
				console.log(usergroup3[usergroup3.length -1 ]);

				io.sockets.socket(displaygroup[2].id).emit('render', tempData);
				
			}else{
				//make socket disconnect!
			}
		} else if(data === "grinch"){
                        
            console.log("grinch found in server side");            
            if(grinch == null){                                                                
                tempData = { 
                    id: socket.id, 
                    index: 999,
                    role: data
                };
            grinch = tempData;
                                

            io.sockets.socket(displaygroup[0].id).emit('render', tempData);
        
            }else{
                //make socket disconnect!
            }
        }


	});

	socket.on('calibrateLoc', function (data){

                  
        for(var i = 0; i < displaygroup.length ; i++){
                          
            var calibratedX = data.x - (3840 * i);
            var calibLoc = {
                section : i+1,
                x : calibratedX,
                y : data.y,
                w : data.w,
                h : data.h
            };        

            io.sockets.socket(displaygroup[i].id).emit('setGrinchLoc', calibLoc);
        }        

    });
	
	socket.on('disconnect', function() {
		console.log("Client has disconnected");
	});

	socket.on('attack', function (data){
		io.sockets.socket(displaygroup[data.section-1].id).emit('renderThrow', data);
	});

});
