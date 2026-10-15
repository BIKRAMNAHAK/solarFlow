const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    wattage: {
      type: Number,
      required: true,
    },
    panelType: {
      type: String,
      default: 'Mono PERC',
    },
    price: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      default: 12,
    },
    discount: {
      type: Number,
      default: 0,
    },
    areaRequiredSqFt: {
      type: Number,
      default: 22,
    },
    warranty: {
      type: String,
      default: '25 Years Performance Warranty',
    },
    efficiency: {
      type: String,
      default: '21.5%',
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockCount: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Panel', panelSchema);
