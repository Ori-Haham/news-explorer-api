const router = require('express').Router();

const usersRoute = require('./users');
const articalsRoute = require('./articals');

router.use('/', usersRoute);
router.use('/', articalsRoute);

module.exports = router;
