const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при  получении пользователей' }));
};

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении пользователя' }));
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при добавлении пользователя' }));
};

module.exports.createMe = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при обновлении пользователя' }));
};

module.exports.createMeAvatar = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { avatar }, { new: true })
    .then((avatar) => res.send({ data: avatar }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при обновлении аватара' }));
};
