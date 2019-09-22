const express = require('express');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const db = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '',
    database: 'watchapp'
  }
});

const app = express();

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Knock, knock? Can I go now?');
});

const io = socket(server);

app.use(express.static('public'));

app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { url } = req.body;
  //to do: validating url
  const id =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);
  db.insert({
    hash: id,
    url: url
  })
    .into('chats')
    .returning('hash')
    .then(hash => {
      console.log(hash);
    });
  res.status(200).json('OK');
});

app.get('/link/:id', (req, res) => {
  const { id } = req.params;
  db.select('url')
    .from('chats')
    .where('hash', id)
    .then(response => {
      if (response[0] == undefined) {
        res.status(404).send('Not found');
      } else {
        res.render('link.ejs', response[0]);
      }
    });
});

io.on('connection', socket => {
  socket.on('chat', data => {
    io.sockets.emit('chat', data);
  });
  socket.on('typing', data => {
    socket.broadcast.emit('typing', data);
  });
});
