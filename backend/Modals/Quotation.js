const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
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
    customerAddress: {
      type: String,
      default: '',
    },
    panelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Panel',
      default: null,
    },
    panelName: {
      type: String,
      default: '',
    },
    panelWattage: {
      type: Number,
      default: 0,
    },
    totalPanels: {
      type: Number,
      default: 0,
    },
    systemCapacityKw: {
      type: Number,
      default: 0,
    },
    inverterDetails: {
      type: String,
      default: 'Grid-Tie Solar Inverter',
    },
    structureDetails: {
      type: String,
      default: 'Galvanized Iron Elevated Mounting Structure',
    },
    panelCost: {
      type: Number,
      default: 0,
    },
    inverterCost: {
      type: Number,
      default: 0,
    },
    structureCost: {
      type: Number,
      default: 0,
    },
    installationCost: {
      type: Number,
      default: 0,
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    gstPercent: {
      type: Number,
      default: 12,
    },
    gstAmount: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Approved', 'Rejected'],
      default: 'Submitted',
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

module.exports = mongoose.model('Quotation', quotationSchema);
