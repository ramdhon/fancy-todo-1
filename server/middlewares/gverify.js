const gverify = require('../helpers/gverify');

module.exports = (req, res, next) => {
  const { id_token } = req.headers;
  gverify(id_token)
    .then(ticket => {
      req.getPayload = ticket.getPayload();
      next();
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
}