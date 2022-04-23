const jsonwebtoken = require('jsonwebtoken');
const { AuthorizationError } = require('../error/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookie;

  if (!jwt) {
    // return res.status(401).send({message: 'Необходима авторизация'});
    throw new AuthorizationError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, NODE_ENV ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    next(new AuthorizationError('Необходима авторизация'));
  }
  req.user = payload;
  next();
  return true;
};
