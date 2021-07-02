var socket = io();
var container = document.querySelector('.container');
var button = document.querySelector('.btn');

var name;
do{
	name=prompt("Please enter your name");
}while(!name)
//Telling server that a user joined the chat
socket.emit('userJoined',name);
//Recieving This users name on client side for all other users
socket.on('userJoined',msg=>{
	var joinMsg = document.createElement('div');
	joinMsg.classList.add('message','center');
	joinMsg.textContent = msg;
	container.appendChild(joinMsg);
})


button.addEventListener('click',addmessage);

function addmessage(e){
	e.preventDefault();
	var messageinp = document.getElementById('messageinp');
	if(!messageinp.value)
		return;
	else
	{
		var Message = {
			name:name,
			message:messageinp.value
		};
		appendMessage(Message,'right');
		messageinp == "";
		//giving this Message to server so that server can send this info to everyone's client side
		socket.emit('sendMessage',Message);
	}
}

function appendMessage(Message,position){
	var mess = document.createElement('div')
	mess.classList.add('message',position)
	mess.textContent = `${Message.name} : ${Message.message}`;
	container.appendChild(mess);
}

//recieving message from server

socket.on('sendMessage',Message=>{
	appendMessage(Message,'left');
})


socket.on('userLeft',msg=>{
	var leftMsg = document.createElement('div');
	leftMsg.classList.add('message','center');
	leftMsg.textContent = msg;
	container.appendChild(leftMsg);
})