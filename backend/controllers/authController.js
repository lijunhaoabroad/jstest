const User = require("../models/user");
const jwt = require('jsonwebtoken');
const config = require('../config')
const { body, validationResult } = require('express-validator');

module.exports.validate = (method) => {
  switch (method) {
    case 'createUser': {
      return [
        body('email').exists().withMessage('Email required').isEmail().withMessage("Invalid Email").trim().escape(),
        body('password').exists().withMessage("Password required").isLength({ min: 8, max: 16 }).withMessage("Pasword need to be between 8 and 16 characters").trim().escape()

      ]
    }
  }
}


// create json web token
const createToken = (id) => {
  return jwt.sign({ id }, config.accessTokenSecret, {
    expiresIn: config.accessTokenLife
  });
};


module.exports.signup_post = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    let user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: config.accessTokenLife * 1000 });

    res.status(201).json(user);
  }
  catch (err) {
    res.cookie('jwt', '', { maxAge: 1 });
    return res.status(404).json({ errors: [{ msg: err.message }] });
  }

}


module.exports.login_post = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let user = await User.login(email, password)

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: config.accessTokenLife * 1000 });

    res.status(200).json(user);
  }
  catch (err) {
    res.cookie('jwt', '', { maxAge: 1 });
    return res.status(404).json({ errors: [{ msg: err.message }] });
  }

}

module.exports.logout_get = (req, res, next) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json("logout");
}