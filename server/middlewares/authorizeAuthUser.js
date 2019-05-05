const Todo = require('../models/todo');

module.exports = (req, res, next) => {
  const { decoded } = req;
  const { id } = req.params;

  Todo.findById(id)
    .populate({
      path: 'creator',
      select: ['_id', 'name', 'email']
    })
    .then(todo => {
      if (!todo) {
        const err = {
          status: 404,
          message: 'data not found'
        }
        next(err);
      } else {
        if (todo.creator._id != decoded.id) {
          const err = {
            status: 401,
            message: 'unauthorized to access'
          }
          next(err);
        } else {
          req.todo = todo;
          next();
        }
      }
    })
    .catch(err => {
      next(err);
    })
}