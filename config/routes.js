const axios = require('axios');

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken');

const { authenticate, generateToken } = require('../auth/authenticate');

const db = require('../database/dbConfig.js');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  db('users')
    .insert(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json(error);
    })

  
}

function login(req, res) {
  // implement user login
  let {username, password} = req.body;
  db('users')
    .where({username})
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token
        })
      } else {
        res.status(401).json({message: 'Invalid Credentials'})
      }
    })
    .catch(err => {
      res.status(500).json({message: err})
    })
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
