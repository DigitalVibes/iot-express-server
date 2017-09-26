var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var bulb;

app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
        if (data == "I am bulb" && bulb === undefined) {
            bulb = client;
        }
    });

    client.on('bulb_control', function(data) {
        if(bulb !== undefined) {
            bulb.emit('control', data);
        }
    });

    client.on('disconnect', function() {
        console.log('A client disconnected');
        if ( client === bulb ) {
            bulb = undefined;
            console.log('The client was the bulb');
        }
    })
});

server.listen(4200);