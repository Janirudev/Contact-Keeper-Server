const express = require('express')
const { body, validationResult } = require('express-validator');

const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')
const Contact = require('../models/Contact')

// @route GET  api/contacts
// @desc  Get all users contacts
// @access  Private
router.get('/', auth, async (req,res) => {
  const { id } = req.user
  try {
    const contacts = await Contact.find({ user: id }).sort({ date: -1 })
    res.json(contacts)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ errors: "Server Error" });
  }
})

// @route POST  api/contacts
// @desc  Create new users contact
// @access  Private
router.post('/', 
  [auth, 
  body('name', 'Name is required').not().isEmpty()],
  async (req,res) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { id } = req.user
  const {name, email, phone, type} = req.body
  
  try {
    const newContact = new Contact({
      name,
      email,
      phone,
      type,
      user: id})

    const contact = await newContact.save()
    res.json(contact)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ errors: "Server Error" });
  }
})

// @route PUT  api/contacts/:id
// @desc  Update users contact
// @access  Private
router.put('/:id', auth, async (req,res) => {
  const { id } = req.user
  const {name, email, phone, type} = req.body

  // Build Contact object
  const contactFields = {};
  if(name) contactFields.name = name
  if(email) contactFields.email = email
  if(phone) contactFields.phone = phone
  if(type) contactFields.type = type
  
  try {
    let contact = await Contact.findById(req.params.id)

    if(!contact) res.status(404).json({ errors: 'Contact not found' })
    if(contact.user.toString() !== id) res.status(401).json({ errors: 'Unauthorized' })

    contact = await Contact.findByIdAndUpdate(req.params.id, 
    { $set: contactFields },
    { new: true })
    res.json(contact)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ errors: "Server Error" });
  }
})

// @route DELETE  api/contacts/:id
// @desc  Delete users contact
// @access  Private
router.delete('/:id', auth, async (req,res) => {
  const { id } = req.user

  try {
    let contact = await Contact.findById(req.params.id)

    if(!contact) res.status(404).json({ errors: 'Contact not found' })
    if(contact.user.toString() !== id) res.status(401).json({ errors: 'Unauthorized' })

    await Contact.findByIdAndRemove(req.params.id)
    res.status(204).json()
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ errors: "Server Error" });
  }
})

module.exports = router