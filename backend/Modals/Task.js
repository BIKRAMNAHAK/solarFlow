const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: true,
      trim: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    assignedBy: {
      type: String,
      required: true,
      default: 'Admin',
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    customerName: {
      type: String,
      trim: true,
      default: '',
    },
    customerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    taskType: {
      type: String,
      enum: ['Installation', 'Service/Repair', 'Site Survey', 'Maintenance', 'Panel Delivery'],
      default: 'Installation',
    },
    scheduledDate: {
      type: String,
      required: true,
    },
    scheduledTime: {
      type: String,
      default: '10:00 AM',
    },
    status: {
      type: String,
      enum: ['Assigned', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Assigned',
    },
    instructions: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
    completionReport: {
      completedAt: { type: Date, default: null },
      workNotes: { type: String, default: '' },
      image: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
