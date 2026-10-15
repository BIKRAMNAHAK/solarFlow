const mongoose = require('mongoose');

const employeeFinanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    recordType: {
      type: String,
      enum: ['Salary Payment', 'Advance Given', 'Expense Reimbursement'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque'],
      default: 'Cash',
    },
    reason: {
      type: String,
      default: '',
    },
    receiptImage: {
      type: String,
      default: '',
    },
    recordedBy: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EmployeeFinance', employeeFinanceSchema);
