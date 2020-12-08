const express = require('express');
const server = express();
const morgan = require('morgan');
const router = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

server.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

mongoose.connect('mongodb://localhost/biblio', { useNewUrlParser: true, useUnifieldTopology: true });

server.use(express.static('public'));
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({extended: false}));
server.set('trust proxy', 1);

server.use((requete, reponse, next) => {
  reponse.locals.message  = requete.session.message;
  delete requete.session.message;
  next();
})

server.use('/', router);

server.listen(3000)
