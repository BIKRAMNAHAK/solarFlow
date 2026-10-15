const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      required: true,
      enum: ['Installation Engineer', 'Technician', 'Site Supervisor', 'Electrician', 'Sales Executive', 'Helper'],
      default: 'Technician',
    },
    salary: {
      type: Number,
      required: true,
      default: 15000,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    photo: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'On Leave'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
