const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../error/NotFoundError');
const { BadRequestError } = require('../error/BadRequestError');
const { ConflictError } = require('../error/ConflictError');
const { AuthorizationError } = require('../error/AuthorizationError');

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthorizationError('неверный логин или пароль');
    } else {
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        throw new AuthorizationError('неверный логин или пароль');
      }
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      // console.log(token);
      res
        // .cookie('jwt', token, {
        //   maxAge: 3600000 * 24 * 7,
        //   httpOnly: true,
        // })
        .send({ token })
        .end();
    }
  } catch (e) {
    next(e);
  }
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users) {
        // res.send({ data: users });
        res.send(users);
      } else {
        throw new AuthorizationError('пользователь не найден');
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserId = async (req, res, next) => {
  try {
    const userId = await User.findById(req.params.userId);
    if (!userId) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    // res.status(200).send({ data: userId });
    res.status(200).send({ userId });
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
    // console.log(userMe);
    if (userMe) {
      // res.send({ data: userMe });
      res.send(userMe);
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
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashPassword, name, about, avatar,
    });

    res.status(200).send({
      user: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (e) {
    if (e.code === 11000) {
      next(new ConflictError('Пользователь с таким email существует'));
    } else if (e.name === 'ValidationError' || e.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(e);
    }
  }
};

module.exports.createMe = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      // res.send({ data: user });
      res.send({ user });
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
      // res.send({ data: userAvatar });
      res.send(userAvatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      next(err);
    });
};
