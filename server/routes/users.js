const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');


const router = express.Router()
const User = require('../models/User')

// @route POST  api/users
// @desc  Register User
// @access  Public
router.post('/',
  body('name', 'Pame is required').not().isEmpty(),
  body('email', 'Email of valid format').isEmail(),
  body('password', 'Password with a minimum of 6 characters').isLength({ min: 6 }),
  async (req,res) => {

  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {name, email, password} = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({email})
    if (user) res.status(400).json({ errors: "User already exists"})

    // Generate Salt for password
    const salt = await bcrypt.genSalt(10)

    // Set user
    user = new User({name, email, password: await bcrypt.hash(password, salt)})
    await user.save()

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