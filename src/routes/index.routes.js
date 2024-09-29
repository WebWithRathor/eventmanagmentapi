const express = require('express');
const {attendesignin, attendesignup, CurrentAttende, attendesignout } = require('../controllers/index.controller');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.get('/',isAuthenticated,CurrentAttende);

router.post('/signin',attendesignin);

router.post('/signup',attendesignup);

router.post('/signout',isAuthenticated,attendesignout);




module.exports = router;