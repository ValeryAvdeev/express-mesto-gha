const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../error/NotFoundError');
const { BadRequestError } = require('../error/BadRequestError');
const { ConflictError } = require('../error/ConflictError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
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
    .catch((err) => {
      next(err);
    });
};

module.exports.newLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new NotFoundError('неверный логин или пароль');
    } else {
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        throw new NotFoundError('неверный логин или пароль');
      }
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send(token)
        .end();
    }
  } catch (e) {
    next(e);
  }
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((e) => {
      next(e);
    });
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

module.exports.getMe = async (req, res, next) => {
  try {
    const userMe = await User.findById(req.user._id);
    if (userMe) {
      res.send({ data: userMe });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError('Некорректный id пользователя'));
    }
    next(e);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hash, name, about, avatar,
    });
    // const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
    // res
    //   .cookie('jwt', token, {
    //     maxAge: 3600000 * 24 * 7,
    //     httpOnly: true,
    //   })
    //   .send({
    //     user: {
    //       email: user.email,
    //       name: user.name,
    //       about: user.about,
    //       avatar: user.avatar,
    //     },
    //   })
    //   .end();
    res.status(200).send({
      user: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (e) {
    // console.log(e.code);
    if (e.code === 11000) {
      next(new ConflictError('Пользователь с таким email существует'));
    }
    // if (e.name === 'ValidationError' || e.name === 'CastError') {
    //   next(new BadRequestError('Переданы некорректные данные'));
    // }
    next(e);
  }
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
        next(new BadRequestError('Переданы некорректные данные профиля.'));
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
