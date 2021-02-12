const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config')

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, config.accessTokenSecret, (err, decodedToken) => {
      if (err) {

        res.cookie('jwt', '', { maxAge: 1 });
      } else {
        let user = User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {

    res.cookie('jwt', '', { maxAge: 1 });
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, config.accessTokenSecret, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie('jwt', '', { maxAge: 1 });
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    res.cookie('jwt', '', { maxAge: 1 });
    next();
  }
};


module.exports = { requireAuth, checkUser };