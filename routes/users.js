const router = require('express').Router();

const { getUser, deleteUser, getUsers } = require('../controllers/users');

router.get('/users/me', getUser);

router.delete('/users/:userId', deleteUser);

router.get('/users', getUsers);

module.exports = router;
