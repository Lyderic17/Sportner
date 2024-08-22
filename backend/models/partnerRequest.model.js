const mongoose = require('mongoose');

const partnerRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sport: { type: String, required: true },
  dateTime: { type: Date, required: true },
  location: { type: String, required: true },
  additionalInfo: { type: String }
});

const PartnerRequest = mongoose.model('PartnerRequest', partnerRequestSchema);

module.exports = PartnerRequest;
