const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    roofArea: {
      type: Number,
      default: 0,
    },
    calculatedPanels: {
      type: Number,
      default: 0,
    },
    estimatedKw: {
      type: Number,
      default: 0,
    },
    panelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Panel',
      default: null,
    },
    inquiryType: {
      type: String,
      enum: ['Installation', 'Service', 'Sell', 'General Inquiry'],
      default: 'Installation',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'New',
        'Contacted',
        'Survey Assigned',
        'Quotation Sent',
        'Approved',
        'Installation Assigned',
        'Completed',
        'Cancelled',
      ],
      default: 'New',
    },
    assignedEmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    assignedBy: {
      type: String,
      default: 'Admin',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);
