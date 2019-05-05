const Todo = require('../models/todo');

class Controller {
  static findAll(req, res, next) {
    const { search } = req.query;
    let obj = {};
    if (search) {
      obj.name = search;
    }
    Todo.find(obj)
      .populate({
        path: 'creator',
        select: ['_id', 'name', 'email']
      })
      .then(todos => {
        if (todos.length === 0) {
          const err = {
            status: 404,
            message: 'data empty'
          }
          next(err);
        } else {
          res.status(200).json({ message: 'data found', todos });
        }
      })
      .catch(err => {        
        next(err);
      })
  }

  static findAllAuth(req, res, next) {
    const { search } = req.query;
    const { decoded } = req;

    let obj = {
      creator: decoded.id
    };

    if (search) {
      obj.name = search;
    }
    Todo.find(obj)
      .populate({
        path: 'creator',
        select: ['_id', 'name', 'email']
      })
      .then(todos => {
        if (todos.length === 0) {
          const err = {
            status: 404,
            message: 'data empty'
          }
          next(err);
        } else {
          res.status(200).json({ message: 'data found', todos });
        }
      })
      .catch(err => {
        next(err);
      })
  }
  
  static create(req, res, next) {
    const { name, description, dueDate } = req.body
    const { decoded } = req;
    Todo.create({
      name, description, dueDate,
      status: 0,
      creator: decoded.id,
      created: new Date(),
      updated: new Date()
    })
      .then(newTodo => {
        res.status(201).json({ message: 'data created', newTodo });
      })
      .catch(err => {
        next(err);
      })
  }
  
  static findOne(req, res, next) {
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
          res.status(200).json({ message: 'data found', todo });
        }
      })
      .catch(err => {
        next(err);
      })
  }

  static updatePut(req, res, next) {
    const { name, description, dueDate, status } = req.body
    let updatedTodo = req.todo;
    updatedTodo.name = name;
    updatedTodo.description = description;
    updatedTodo.dueDate = dueDate;
    updatedTodo.status = status;
    updatedTodo.updated = new Date();
    updatedTodo.updateOne({
      name, description, dueDate, status, updated: updatedTodo.updated
    })
      .then(info => {
        res.status(201).json({ message: 'data updated', updatedTodo, info });
      })  
      .catch(err => {
        next(err);
      })
  }

  static updatePatch(req, res, next) {
    const { name, description, dueDate, status } = req.body
    let { todo } = req;
    todo.name = name || todo.name;
    todo.description = description || todo.name;
    todo.dueDate = dueDate || todo.dueDate;
    todo.status = status || todo.status;
    todo.updated = new Date();
    todo.save()
      .then(updatedTodo => {
        res.status(201).json({ message: 'data updated', updatedTodo });
      })  
      .catch(err => {
        next(err);
      })
  }

  static delete(req, res, next) {
    let { todo } = req;
    todo.delete()
      .then(deletedTodo => {
        res.status(200).json({ message: 'data deleted', deletedTodo });
      })  
      .catch(err => {
        next(err);
      })
  }
}


module.exports = Controller;