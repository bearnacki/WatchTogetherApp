const socket = io.connect('http://localhost:3000');
const output = document.getElementById('chat-output');
const owner = document.getElementById('owner');
const message = document.getElementById('chat-message');
const button = document.getElementById('send-message');
const feedback = document.getElementById('feedback');
const synchronizer = document.getElementById('synchronize');
const roomId = window.location.pathname.slice(6);
const tag = document.createElement('script');
const url = document.getElementById('player').dataset.url;

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

function onPlayerReady(event) {
  event.target.playVideo();
}
function onPlayerStateChange(event) {}
function stopVideo() {
  player.stopVideo();
}

function onSynchronize(e) {
  e.preventDefault();
  let duration = player.getCurrentTime();
  let playerState = player.getPlayerState();
  socket.emit('playing', {
    roomId: roomId,
    duration: duration,
    state: playerState
  });
}

//sending and receiving chat messages

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

//connecting with YT API

tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '',
    width: '',
    videoId: url,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

//sending and receiving player's state

synchronizer.addEventListener('click', onSynchronize);

socket.on('playing', data => {
  player.seekTo(data.duration);
  player.playVideo();
});
