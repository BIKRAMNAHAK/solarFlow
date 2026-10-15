const Attendance = require('../Modals/Attendance');
const EmployeeFinance = require('../Modals/EmployeeFinance');
const Employee = require('../Modals/Employee');

// Mark / Update Attendance
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkInTime, checkOutTime, siteLocation, notes } = req.body;
    if (!employeeId || !date) {
      return res.status(400).json({ success: false, message: 'Employee and date are required' });
    }

    const record = await Attendance.findOneAndUpdate(
      { employeeId, date },
      {
        employeeId,
        date,
        status: status || 'Present',
        checkInTime: checkInTime || '09:30 AM',
        checkOutTime: checkOutTime || '06:30 PM',
        siteLocation: siteLocation || 'Office / Field',
        notes: notes || '',
      },
      { upsert: true, new: true }
    ).populate('employeeId', 'name phone role');

    res.status(200).json({ success: true, message: 'Attendance recorded successfully', record });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Attendance records
exports.getAttendance = async (req, res) => {
  try {
    const { employeeId, date } = req.query;
    let query = {};
    if (employeeId && employeeId !== 'All') query.employeeId = employeeId;
    if (date) query.date = date;

    const records = await Attendance.find(query)
      .populate('employeeId', 'name phone role')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: records.length, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Finance Record (Salary, Advance, Expense)
exports.addFinanceRecord = async (req, res) => {
  try {
    const { employeeId, recordType, amount, date, paymentMode, reason, recordedBy } = req.body;
    if (!employeeId || !recordType || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: 'Employee, record type, amount, and date are required',
      });
    }

    let receiptPath = '';
    if (req.file) {
      receiptPath = `/uploads/${req.file.filename}`;
    }

    const newRecord = new EmployeeFinance({
      employeeId,
      recordType,
      amount: Number(amount),
      date,
      paymentMode: paymentMode || 'Cash',
      reason: reason || '',
      receiptImage: receiptPath,
      recordedBy: recordedBy || 'Admin',
    });

    await newRecord.save();
    const populated = await EmployeeFinance.findById(newRecord._id).populate('employeeId', 'name phone role salary');

    res.status(201).json({
      success: true,
      message: `${recordType} recorded successfully`,
      record: populated,
    });
  } catch (error) {
    console.error('Add finance error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Employee Finance records & summary
exports.getFinanceRecords = async (req, res) => {
  try {
    const { employeeId, recordType } = req.query;
    let query = {};
    if (employeeId && employeeId !== 'All') query.employeeId = employeeId;
    if (recordType && recordType !== 'All') query.recordType = recordType;

    const records = await EmployeeFinance.find(query)
      .populate('employeeId', 'name phone role salary')
      .sort({ date: -1 });

    // Calculate totals
    let totalSalaryPaid = 0;
    let totalAdvances = 0;
    let totalExpenses = 0;

    records.forEach((r) => {
      if (r.recordType === 'Salary Payment') totalSalaryPaid += r.amount;
      if (r.recordType === 'Advance Given') totalAdvances += r.amount;
      if (r.recordType === 'Expense Reimbursement') totalExpenses += r.amount;
    });

    res.status(200).json({
      success: true,
      count: records.length,
      totals: { totalSalaryPaid, totalAdvances, totalExpenses },
      records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
