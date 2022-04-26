const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../error/AuthorizationError');

// const extractBearerToken = (header) => header.replace('Bearer ', '');

// module.exports = async (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startWith('Bearer ')) {
//     throw new AuthorizationError('Необходима авторизация');
//   }

//   const token = extractBearerToken(authorization);
//   let payload;

//   try {
//     payload = jsonwebtoken.verify(token, 'super-strong-secret');
//   } catch (err) {
//     throw new AuthorizationError('Необходима авторизация');
//   }

//   req.user = payload; // записываем пейлоуд в объект запроса

//   next();
//   return true;
// };

// const handleAuthError = (res) => {
//   res
//     .status(401)
//     .send({ message: 'Необходима авторизация' });
// };

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new AuthorizationError('Необходима авторизация');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return new AuthorizationError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
