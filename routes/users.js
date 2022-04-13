const router = require('express').Router();

const User = require('../models/user');

router.get('/users', (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

router.get('/users/:userId', (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

router.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;
  // console.log({ name, about, avatar });
  User.create({ name, about, avatar })
    .then((user) => {
      // console.log(user);
      res.send({ user });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

module.exports = router;
