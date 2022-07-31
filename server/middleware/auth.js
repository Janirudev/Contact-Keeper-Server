const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');

  // Check if !token
  if(!token) res.status(401).json({errors: 'Unauthorized'})

  try {
    const decorded = jwt.verify(token, process.env.JWTSECRET)

    req.user = decorded.user
    next()
  } catch(error) {
    res.status(401).json({errors: 'Token expired'})
  }
}