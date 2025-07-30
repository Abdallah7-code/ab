const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  department: String,
  ratings: [Number],
}, { timestamps: true });

module.exports = mongoose.models.Technician || mongoose.model('Technician', technicianSchema);
