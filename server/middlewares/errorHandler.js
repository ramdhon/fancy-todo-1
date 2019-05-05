module.exports = (err, req, res, next) => {
  const { error, status, message, register_token, name } = err;
  if (error) {
    console.log({ message: 'ERROR AT TRY CATCH', error });
  }
  if (status) {
    if (register_token) {
      res.status(status).json({ message, register_token })
    } else {
      res.status(status).json({ message });
    }
  } else {
    if (name === 'ValidationError') {
      res.status(400).json({ message });
    } else {
      res.status(500).json('internal server error');
    }
  }
}