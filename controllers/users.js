// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../error/NotFoundError');
const { BadRequestError } = require('../error/BadRequestError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
    })
    .catch((err) => next(err));
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserId = async (req, res, next) => {
  try {
    const userId = await User.findById(req.params.userId);
    if (!userId) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    res.status(200).send({ data: userId });
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError('Некорректный _id пользователя'));
    }
    next(e);
  }
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

module.exports.createMe = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      next(err);
    });
};

module.exports.createMeAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((userAvatar) => {
      if (!userAvatar) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send({ data: userAvatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      next(err);
    });
};
