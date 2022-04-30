const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserId,
  getUsers,
  createMe,
  createMeAvatar,
  getMe,
} = require('../controllers/users');

router.get('/me', getMe);
router.get('/', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), createMe);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
    ),
  }),
}), createMeAvatar);

module.exports = router;
