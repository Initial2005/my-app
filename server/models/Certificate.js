const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  recipient: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  issuer: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
