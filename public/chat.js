const socket = io.connect('http://localhost:3000');
const output = document.getElementById('chat-output');
const owner = document.getElementById('owner');
const message = document.getElementById('chat-message');
const button = document.getElementById('send-message');
const feedback = document.getElementById('feedback');
const roomId = window.location.pathname.slice(6);

function onSendingResponse(e) {
  e.preventDefault();
  socket.emit('chat', {
    owner: owner.value,
    message: message.value,
    roomId: roomId
  });
}

function onTyping(e) {
  socket.emit('typing', {
    owner: owner.value,
    roomId: roomId
  });
  if (e.keyCode == 13) {
    onSendingResponse(e);
    message.value = '';
  }
}

socket.emit('subscribe', roomId);
button.addEventListener('click', onSendingResponse);
message.addEventListener('keypress', onTyping);

socket.on('chat', data => {
  let p = document.createElement('p');
  let textOwner = document.createElement('span');
  textOwner.classList.add('text-owner');
  textOwner.appendChild(document.createTextNode(`${data.owner}: `));
  let textMessage = document.createElement('span');
  textMessage.classList.add('text-chat');
  textMessage.appendChild(document.createTextNode(`${data.message}`));
  p.appendChild(textOwner);
  p.appendChild(textMessage);
  output.appendChild(p);
  feedback.textContent = '';
});

socket.on('typing', data => {
  feedback.textContent = `${data.owner} is typing...`;
});
