const mongoose = require('mongoose');

const { Schema } = mongoose;

const todoSchema = new Schema({
  name: {
    type: String,
    required: [true, 'required']
  },
  description: String,
  status: Number,
  dueDate: {
    type: Date,
    required: [true, 'required']
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

todoSchema.post('save', function(doc, next) {
  Todo
  .findOne({
    creator: doc.creator
  })
  .populate({
    path: 'creator',
    select: ['_id', 'name', 'email']
  })
  .then(todo => {
      doc.creator = todo.creator;
      next();
    })
    .catch(err => {
      next(err);
    })
})

let Todo = mongoose.model('Todo', todoSchema);


module.exports = Todo;