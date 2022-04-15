const User = require('../models/user');
const { NotFoundError } = require('../error/NotFoundError');
const { ValidationError } = require('../error/ValidationError');

// работает корректо
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// работает корректо
module.exports.getUserId = async (req, res, next) => {
  try {
    const userId = await User.findById(req.params.id);
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

// работает корректо
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

  User.findByIdAndUpdate(req.params.id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      console.log(user);
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
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createMeAvatar = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { avatar }, { new: true })
    .then((avatar) => res.send({ data: avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'NotFoundError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
