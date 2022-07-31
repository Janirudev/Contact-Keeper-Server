const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');

const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')

// @route GET  api/auth
// @desc  Get Logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  const { id } = req.user
  try {
    const user = await User.findById(id).select('-password')
    res.json(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ errors: "Server Error" });
  }
})

// @route POST  api/auth
// @desc  Authenticate User and Give Token
// @access  Private
router.post('/',
  body('email', 'Email of valid format').isEmail(),
  body('password', 'Password is required').exists(),
  async (req,res) => {

    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({email})
    if (!user) res.status(400).json({ errors: "Invalid Credentials"})
    
    const isMatched = await bcrypt.compare(password, user.password)

    if (!isMatched) res.status(400).json({ errors: "Invalid Credentials"})

    const payload = { user: {id: user.id} }

    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: 60 * 60 * 360 },
      (error, token) => {
        if (error) throw error
        res.json({ user, token })
      }
    )

  } catch(error) {
    console.error(error.message)
    res.status(500).json({ errors: "Server Error" });
  }
})

module.exports = router