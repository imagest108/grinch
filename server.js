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
		}
	});
	
	socket.on('disconnect', function() {
		console.log("Client has disconnected");
	});
});
