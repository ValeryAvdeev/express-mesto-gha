const User = require('../models/user');
const { NotFoundError } = require('../error/NotFoundError');
const { ValidationError } = require('../error/ValidationError');

// работает
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
    if (e.name === 'ValidationError') {
      next(new ValidationError('Некорректный _id пользователя'));
    }
    next(e);
  }
};

// работает

module.exports.postUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

module.exports.createMe = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      next(err);
    });
};

module.exports.createMeAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params._id, { avatar }, { new: true, runValidators: true })
    .then((userAvatar) => {
      if (!userAvatar) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      res.send({ data: userAvatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      next(err);
    });
};
