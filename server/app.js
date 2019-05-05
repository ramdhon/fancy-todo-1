require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const mongoose = require('mongoose');
const DATABASE = 'todo-1'
mongoose.connect(`mongodb://localhost/${DATABASE}`, { useNewUrlParser: true });

const router = require('./router');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`running on port:${PORT}`);
})