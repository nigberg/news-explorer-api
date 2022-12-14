const router = require('express').Router();
const { getCurrentUserInfo } = require('../controllers/users');

// returns logged-in user info (email & name)
router.get('/users/me', getCurrentUserInfo);

module.exports = router;
