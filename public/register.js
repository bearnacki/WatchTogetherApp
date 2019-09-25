const input = document.getElementById('yt-url');
const button = document.getElementById('url-register');
const linkSection = document.querySelector('.link-section');
const link = document.getElementById('hash-link');

function showLink(url) {
  link.href = `${window.location}link/${url}`;
  link.textContent = `${window.location}link/${url}`;
  linkSection.classList.remove('link-hidden');
  linkSection.classList.add('link-released');
}

function register() {
  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      url: input.value
    })
  })
    .then(response => response.json())
    .then(url => {
      showLink(url);
    })
    .catch(err => console.log('sending error'));
}

button.addEventListener('click', register);
