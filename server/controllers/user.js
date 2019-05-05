const User = require('../models/user');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');
const gverify = require('../helpers/gverify');

class Controller {
  static login(req, res, next) {
    const { email, password } = req.body;
    User.findOne({
      email,
    })
      .then(foundUser => {
        if(!foundUser) {
          const err = {
            status: 400,
            message: 'invalid email / password'
          }
          next(err);
        } else {
          let valid = bcrypt.compare(password, foundUser.password);
          if (!valid) {
            const err = {
              status: 400,
              message: 'invalid email / password'
            }
            next(err);
          } else {
            let token = jwt.sign({
              id: foundUser._id,
              name: foundUser.name,
              email: foundUser.email
            })
            res.status(200).json({ message: 'login success', token, user: foundUser.name });
          }
        }
      })
      .catch(err => {
        next(err);
      })
  }

  static register(req, res, next) {
    const { name, email, password } = req.body;
    User.create({
      name, email, password
    })
      .then(newUser => {
        res.status(201).json({ message: 'account registered', newUser });
      })
      .catch(err => {
        next(err);
      })
  }

  static glogin(req, res, next) {
    const { id_token } = req.headers;
    let getPayload = null;
    gverify(id_token)
      .then(ticket => {
        getPayload = ticket.getPayload();
        return User.findOne({
          email: getPayload.email
        })
      })
      .then(user => {
        if(!user) {
          const register_token = jwt.sign({
            name: getPayload.name,
            email: getPayload.email
          })
          const err = {
            status: 404,
            message: 'new account, then set password',
            register_token
          }
          next(err);
        } else {
          let token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
          })
          res.status(200).json({ message: 'login success', token, user: user.name });
        }
      })
      .catch(err => {
        next(err);
      })
  }

  static gregister(req, res, next) {
    if (req.headers.hasOwnProperty('register_token')) {
      try {
        const { register_token } = req.headers;
        const { password } = req.body;
        const decoded = jwt.verify(register_token);
        User.create({
          name: decoded.name,
          email: decoded.email,
          password,
        })
          .then(newUser => {
            let token = jwt.sign({
              id: newUser._id,
              name: newUser.name,
              email: newUser.email
            })
            res.status(200).json({ message: 'login success', token, user: newUser.name });
          })
          .catch(err => {
            next(err);
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
        status: 400,
        message: 'no token assigned'
      }
      next(err);
    }
  }
}


module.exports = Controller;