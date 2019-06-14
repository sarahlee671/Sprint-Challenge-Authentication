const jwt = require('jsonwebtoken');

const secrets = require('../secret/secrets.js');

// const jwtKey =
//   process.env.JWT_SECRET ||
//   'add a .env file to root of project with the JWT_SECRET variable';

// quickly see what this file exports
module.exports = {
  authenticate
};

// implementation details
function authenticate(req, res, next) {
  const token = req.get('Authorization');
  console.log(secrets)
  if (token) {
    jwt.verify(token, secrets.jwtKey, (err, decoded) => {
      if (err) return res.status(401).json(err);
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(401).json({
      error: 'No token provided, must be set on the Authorization Header',
    });
  }
}

