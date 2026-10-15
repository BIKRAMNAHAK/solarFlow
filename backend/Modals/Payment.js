const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
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
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    quotationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quotation',
      default: null,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    balanceRemaining: {
      type: Number,
      default: 0,
    },
    paymentType: {
      type: String,
      enum: ['Advance Token', 'Delivery Milestone', 'Final Installation Settlement', 'Full Payment', 'Service Charges'],
      default: 'Advance Token',
    },
    paymentMode: {
      type: String,
      enum: ['UPI', 'Cash', 'Net Banking', 'Cheque'],
      default: 'UPI',
    },
    transactionId: {
      type: String,
      default: '',
    },
    paymentDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Paid', 'Partial', 'Pending'],
      default: 'Paid',
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

module.exports = mongoose.model('Payment', paymentSchema);
