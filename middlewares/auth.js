const jsonwebtoken = require('jsonwebtoken');
const { AuthorizationError } = require('../error/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new AuthorizationError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, NODE_ENV ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
