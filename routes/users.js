const router = require('express').Router();
const {
  getUserId,
  getUsers,
  createMe,
  createMeAvatar,
  getMe,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserId);

router.get('/me', getMe);

router.patch('/me', createMe);

router.patch('/me/avatar', createMeAvatar);

module.exports = router;
