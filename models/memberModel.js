// Description: Mongoose schema for members
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxLength: 50 },
  lastName: { type: String, required: true, maxLength: 50 },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  membershipId: { type: String, required: true, unique: true },
  joinDate: { type: Date, required: true },
  booksBorrowed: { type: [String], default: [] },
  status: { type: String, required: true, enum: ['active', 'inactive'] }
});

module.exports = mongoose.model('Member', memberSchema);