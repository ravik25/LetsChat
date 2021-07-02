var express = require('express');
var path = require('path');
var app = express();

var http = require('http').createServer(app);
const PORT = process.env.PORT||3000
app.use(express.static(__dirname + '/public'))

var io = require('socket.io')(http);

http.listen(PORT,()=>{
	console.log(`successfully running on ${PORT}`);
})

app.get('/',(req,res)=>{
	res.sendFile(__dirname + '/index.html');
})


var users = {};


io.on("connection",(socket)=>{
	console.log('user connected');
	socket.on('userJoined',name=>{
		users[socket.id]=name;
		socket.broadcast.emit('userJoined',`${name} joined the chat`);
	})
	socket.on('sendMessage',Message=>{
		socket.broadcast.emit('sendMessage',Message);
	})

	socket.on('disconnect', msg =>{
        socket.broadcast.emit('userLeft', `${users[socket.id]} left the chat`);
        delete users[socket.id]
    });
})