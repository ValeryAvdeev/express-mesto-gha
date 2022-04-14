const router = require('express').Router();
const {
  getUser,
  getUsers,
  postUser,
  createMe,
  createMeAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUser);

router.post('/users', postUser);

router.patch('/users/me', createMe);

router.patch('/users/me/avatar', createMeAvatar);

module.exports = router;
