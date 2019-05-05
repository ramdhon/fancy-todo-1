const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = function(idToken) {
  return client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  })
}