const router = require('express').Router();
const {
  getUserId,
  getUsers,
  postUser,
  createMe,
  createMeAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserId);

router.post('/users', postUser);

router.patch('/users/me', createMe);

router.patch('/users/me/avatar', createMeAvatar);

module.exports = router;
