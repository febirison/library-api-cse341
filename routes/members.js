// Description: Routes for member-related operations
const express = require('express');
const router = express.Router();
const Member = require('../models/memberModel');

// GET all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    console.error('GET /members error:', error.message);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// POST a new member
router.post('/', async (req, res) => {
  try {
    // Convert joinDate string to Date object if provided
    if (req.body.joinDate && typeof req.body.joinDate === 'string') {
      req.body.joinDate = new Date(req.body.joinDate);
    }
    const member = new Member(req.body);
    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error('POST /members error:', error.message, error.stack);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Membership ID already exists' });
    }
    res.status(400).json({ error: error.message || 'Validation failed during member creation' });
  }
});

// GET a member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error('GET /members/:id error:', error.message);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// PUT update a member by ID
router.put('/:id', async (req, res) => {
  try {
    // Convert joinDate string to Date object if provided
    if (req.body.joinDate && typeof req.body.joinDate === 'string') {
      req.body.joinDate = new Date(req.body.joinDate);
    }
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error('PUT /members/:id error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Membership ID already exists' });
    }
    res.status(400).json({ error: error.message || 'Validation failed during member update' });
  }
});

// DELETE a member by ID
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.status(200).json({ message: 'Member deleted' });
  } catch (error) {
    console.error('DELETE /members/:id error:', error.message);
    res.status(400).json({ error: 'Failed to delete member' });
  }
});

module.exports = router;