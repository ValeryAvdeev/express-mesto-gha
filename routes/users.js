const router = require('express').Router();
const {
  getUserId,
  getUsers,
  createUser,
  createMe,
  createMeAvatar,
  login,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserId);

router.post('/signin', login);

router.post('/signup', createUser);

router.patch('/users/me', createMe);

router.patch('/users/me/avatar', createMeAvatar);

module.exports = router;
