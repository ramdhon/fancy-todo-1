const jwt = require('../helpers/jwt');
const User = require('../models/user');

module.exports = (req, res, next) => {
  if (req.headers.hasOwnProperty('token')) {
    try {
      const { token } = req.headers;
      const decoded = jwt.verify(token);
      User.findOne({
        email: decoded.email
      })
        .then(foundUser => {
          if (!foundUser) {
            const err = {
              status: 400,
              message: 'not recognized input data'
            }
            next(err);
          } else {
            next();
          }
        })
    } catch (error) {
      const err = {
        error,
        status: 400,
        message: 'not allowed to access'
      }
      next(err);
    }
  } else {
    const err = {
      error,
      status: 400,
      message: 'not token assigned'
    }
    next(err);
  }
}