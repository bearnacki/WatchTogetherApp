const input = document.getElementById('yt-url');
const button = document.getElementById('url-register');

function register() {
  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      url: input.value
    })
  })
    .then(response => response.json())
    .then(c => console.log(c))
    .catch(err => console.log('sending error'));
}

button.addEventListener('click', register);
