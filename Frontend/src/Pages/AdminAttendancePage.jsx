import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../Components/AdminLayout';
import { getAttendanceAction, getFinanceRecordsAction, getEmployeesAction } from '../Services/Actions/getApis';
import { markAttendanceAction, addFinanceRecordAction } from '../Services/Actions/postApis';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import {
  FaCalendarCheck,
  FaMoneyBillWave,
  FaCheck,
  FaTimes,
  FaFileInvoiceDollar,
  FaPlus,
  FaFilter,
  FaPrint,
  FaUserCheck,
  FaBuilding,
  FaReceipt,
  FaClock,
} from 'react-icons/fa';

function AdminAttendancePage() {
  const dispatch = useDispatch();
  const { attendance, finances, financeTotals, employees } = useSelector((state) => state.states);

  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' or 'tally'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployeeLedger, setSelectedEmployeeLedger] = useState('All');
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [quickNotice, setQuickNotice] = useState('');

  // Tally Voucher Modal State
  const [voucherForm, setVoucherForm] = useState({
    employeeId: '',
    recordType: 'Advance Given',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'UPI',
    reason: '',
  });
  const [receiptFile, setReceiptFile] = useState(null);

  useEffect(() => {
    fetchAttendanceForDate(selectedDate);
    fetchFinances();
    const empForm = new FormData();
    dispatch(getEmployeesAction(empForm)).catch((err) => console.error(err));
  }, [dispatch]);

  const fetchAttendanceForDate = (date) => {
    const attForm = new FormData();
    attForm.append('date', date);
    dispatch(getAttendanceAction(attForm)).catch((err) => console.error(err));
  };

  const fetchFinances = () => {
    const finForm = new FormData();
    dispatch(getFinanceRecordsAction(finForm)).catch((err) => console.error(err));
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    fetchAttendanceForDate(newDate);
  };

  // ==========================================
  // EXCEL 1-CLICK CELL ATTENDANCE LOGIC
  // ==========================================
  // When an admin clicks P, HD, A, or L cell, it immediately marks attendance automatically!
  const handleQuickCellClick = (employeeId, status) => {
    const formdata = new FormData();
    formdata.append('employeeId', employeeId);
    formdata.append('date', selectedDate);
    formdata.append('status', status);
    formdata.append('siteLocation', 'Office / Site');
    formdata.append('notes', 'Marked via Excel grid cell');

    dispatch(markAttendanceAction(formdata))
      .then(() => {
        setQuickNotice(`Marked ${status} for staff member.`);
        setTimeout(() => setQuickNotice(''), 2000);
        fetchAttendanceForDate(selectedDate);
      })
      .catch((err) => console.error('Error marking attendance:', err));
  };

  // 1-Click "Mark All Present"
  const handleMarkAllPresent = () => {
    if (employees.length === 0) return;
    employees.forEach((emp) => {
      const formdata = new FormData();
      formdata.append('employeeId', emp._id);
      formdata.append('date', selectedDate);
      formdata.append('status', 'Present');
      formdata.append('siteLocation', 'Office / Field');
      dispatch(markAttendanceAction(formdata)).catch((err) => console.error(err));
    });
    setQuickNotice('All active staff marked as Present!');
    setTimeout(() => {
      setQuickNotice('');
      fetchAttendanceForDate(selectedDate);
    }, 1000);
  };

  // Find attendance record for an employee on the selected date
  const getEmployeeStatus = (empId) => {
    const rec = attendance.find(
      (a) => a.employeeId?._id === empId || a.employeeId === empId
    );
    return rec ? rec.status : null; // 'Present', 'Half Day', 'Absent', 'On Leave', or null
  };

  // Summary counts for the selected date
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const halfDayCount = attendance.filter((a) => a.status === 'Half Day').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;
  const leaveCount = attendance.filter((a) => a.status === 'On Leave').length;

  // ==========================================
  // TALLY / BANK STATEMENT LEDGER LOGIC
  // ==========================================
  const handleVoucherSubmit = (e) => {
    e.preventDefault();
    if (!voucherForm.employeeId || !voucherForm.amount) {
      alert('Please select employee and enter amount');
      return;
    }

    const formdata = new FormData();
    formdata.append('employeeId', voucherForm.employeeId);
    formdata.append('recordType', voucherForm.recordType);
    formdata.append('amount', voucherForm.amount);
    formdata.append('date', voucherForm.date);
    formdata.append('paymentMode', voucherForm.paymentMode);
    formdata.append('reason', voucherForm.reason);

    if (receiptFile) {
      formdata.append('receipt', receiptFile);
    }

    dispatch(addFinanceRecordAction(formdata))
      .then(() => {
        setShowVoucherModal(false);
        setQuickNotice(`Tally voucher for ${voucherForm.recordType} recorded!`);
        setTimeout(() => setQuickNotice(''), 3000);
        setVoucherForm({
          employeeId: '',
          recordType: 'Advance Given',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          paymentMode: 'UPI',
          reason: '',
        });
        setReceiptFile(null);
        fetchFinances();
      })
      .catch((err) => console.error(err));
  };

  const filteredFinances = finances.filter((f) => {
    if (selectedEmployeeLedger === 'All') return true;
    return f.employeeId?._id === selectedEmployeeLedger;
  });

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        {/* Module Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1" style={{ fontSize: '1.6rem' }}>
              Staff Operations & Accounts Desk
            </h3>
            <p className="text-muted small mb-0">
              Interactive 1-Click Excel Attendance Sheet and Bank Statement / Tally Double-Entry Ledger.
            </p>
          </div>

          {/* Switcher Tab Pills */}
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${
                activeTab === 'attendance'
                  ? 'btn-success text-white shadow-sm'
                  : 'btn-outline-secondary'
              }`}
            >
              <FaCalendarCheck />
              <span>Excel Attendance Sheet</span>
            </button>
            <button
              onClick={() => setActiveTab('tally')}
              className={`btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${
                activeTab === 'tally'
                  ? 'btn-dark text-white shadow-sm'
                  : 'btn-outline-secondary'
              }`}
            >
              <FaBuilding />
              <span>Tally / Bank Statement</span>
            </button>
          </div>
        </div>

        {quickNotice && (
          <div className="alert alert-success py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
            <FaCheck /> <span>{quickNotice}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. EXCEL-STYLE 1-CLICK ATTENDANCE SHEET (NO TEDIOUS FORM) */}
        {/* ======================================================== */}
        {activeTab === 'attendance' && (
          <div className="excel-container">
            {/* Excel Ribbon Topbar */}
            <div className="excel-ribbon">
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold text-dark d-flex align-items-center gap-2">
                  <FaCalendarCheck className="text-success" /> Attendance Roster:
                </span>
                <input
                  type="date"
                  className="form-control form-control-sm border-secondary"
                  style={{ width: '170px', fontWeight: '600' }}
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                />
                <button
                  onClick={handleMarkAllPresent}
                  className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold"
                  title="Mark everyone Present for this date"
                >
                  ✔ Mark All Present
                </button>
              </div>

              {/* Real-time Summary Pills */}
              <div className="d-flex align-items-center gap-2">
                <span className="badge cell-present px-3 py-2">
                  Present: {presentCount}
                </span>
                <span className="badge cell-halfday px-3 py-2">
                  Half Day: {halfDayCount}
                </span>
                <span className="badge cell-absent px-3 py-2">
                  Absent: {absentCount}
                </span>
                <span className="badge cell-leave px-3 py-2">
                  Leave: {leaveCount}
                </span>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="bg-light px-3 py-2 border-bottom border-light d-flex justify-content-between align-items-center small text-muted">
              <span>
                💡 <strong>Excel Mode:</strong> Kisi bhi employee ke status cell (<strong>P</strong>, <strong>HD</strong>, <strong>A</strong>, <strong>L</strong>) par click karein. Attendance automatically turant save ho jayegi.
              </span>
              <span className="fw-semibold">Date: {new Date(selectedDate).toDateString()}</span>
            </div>

            {/* Excel Grid Table */}
            <div className="table-responsive">
              <table className="excel-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Row</th>
                    <th style={{ textAlign: 'left', minWidth: '220px' }}>Staff Name & Designation</th>
                    <th style={{ width: '130px' }}>Contact Phone</th>
                    <th style={{ width: '100px' }} className="cell-present">P (Present)</th>
                    <th style={{ width: '100px' }} className="cell-halfday">HD (Half Day)</th>
                    <th style={{ width: '100px' }} className="cell-absent">A (Absent)</th>
                    <th style={{ width: '100px' }} className="cell-leave">L (Leave)</th>
                    <th style={{ minWidth: '160px' }}>Current Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-5 text-muted">
                        No employees found. Please add employees in "Employee Staff Records" first.
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp, idx) => {
                      const currentStatus = getEmployeeStatus(emp._id);
                      const isPresent = currentStatus === 'Present';
                      const isHalfDay = currentStatus === 'Half Day';
                      const isAbsent = currentStatus === 'Absent';
                      const isLeave = currentStatus === 'On Leave';

                      return (
                        <tr key={emp._id}>
                          <td className="text-muted fw-bold">{idx + 1}</td>
                          <td style={{ textAlign: 'left' }}>
                            <strong className="text-dark d-block">{emp.name}</strong>
                            <span className="badge badge-soft-primary" style={{ fontSize: '10px' }}>
                              {emp.role}
                            </span>
                          </td>
                          <td className="small text-muted">{emp.phone}</td>

                          {/* Present Cell Button */}
                          <td>
                            <button
                              type="button"
                              onClick={() => handleQuickCellClick(emp._id, 'Present')}
                              className={`excel-cell-btn ${
                                isPresent ? 'cell-present shadow-sm' : 'cell-empty'
                              }`}
                              title="Click to Mark Present"
                            >
                              {isPresent ? '✔ P' : 'P'}
                            </button>
                          </td>

                          {/* Half Day Cell Button */}
                          <td>
                            <button
                              type="button"
                              onClick={() => handleQuickCellClick(emp._id, 'Half Day')}
                              className={`excel-cell-btn ${
                                isHalfDay ? 'cell-halfday shadow-sm' : 'cell-empty'
                              }`}
                              title="Click to Mark Half Day"
                            >
                              {isHalfDay ? '⏱ HD' : 'HD'}
                            </button>
                          </td>

                          {/* Absent Cell Button */}
                          <td>
                            <button
                              type="button"
                              onClick={() => handleQuickCellClick(emp._id, 'Absent')}
                              className={`excel-cell-btn ${
                                isAbsent ? 'cell-absent shadow-sm' : 'cell-empty'
                              }`}
                              title="Click to Mark Absent"
                            >
                              {isAbsent ? '✖ A' : 'A'}
                            </button>
                          </td>

                          {/* Leave Cell Button */}
                          <td>
                            <button
                              type="button"
                              onClick={() => handleQuickCellClick(emp._id, 'On Leave')}
                              className={`excel-cell-btn ${
                                isLeave ? 'cell-leave shadow-sm' : 'cell-empty'
                              }`}
                              title="Click to Mark Leave"
                            >
                              {isLeave ? '✈ L' : 'L'}
                            </button>
                          </td>

                          {/* Status Indicator */}
                          <td>
                            {currentStatus ? (
                              <span
                                className={`badge px-3 py-1 ${
                                  isPresent
                                    ? 'bg-success'
                                    : isHalfDay
                                    ? 'bg-warning text-dark'
                                    : isAbsent
                                    ? 'bg-danger'
                                    : 'bg-primary'
                                }`}
                              >
                                {currentStatus}
                              </span>
                            ) : (
                              <span className="text-muted small italic">Not Marked Yet</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. TALLY / BANK STATEMENT LEDGER PASSBOOK                */}
        {/* ======================================================== */}
        {activeTab === 'tally' && (
          <div className="tally-passbook">
            {/* Tally Top Bar */}
            <div className="tally-top-banner">
              <div>
                <h5 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
                  <FaBuilding className="text-warning" /> Tally ERP & Bank Statement Passbook
                </h5>
                <small className="text-light opacity-75">
                  General Staff Payment & Expense Ledger Book
                </small>
              </div>

              <button
                onClick={() => setShowVoucherModal(true)}
                className="btn btn-warning text-dark fw-bold rounded-pill btn-sm d-flex align-items-center gap-2 px-3 shadow-sm"
              >
                <FaPlus /> Post Tally Voucher Entry
              </button>
            </div>

            {/* Bank Header Meta Bar */}
            <div className="tally-meta-bar">
              <div>
                <span className="text-muted small d-block">Account Type:</span>
                <strong className="text-dark">Staff Current Ledger</strong>
              </div>
              <div>
                <span className="text-muted small d-block">Filter Account Holder:</span>
                <select
                  className="form-select form-select-sm border-dark"
                  value={selectedEmployeeLedger}
                  onChange={(e) => setSelectedEmployeeLedger(e.target.value)}
                  style={{ minWidth: '180px', fontWeight: '600' }}
                >
                  <option value="All">All Staff Members (Consolidated)</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} (₹{emp.salary}/mo)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="text-muted small d-block">Total Debits (Dr - Advances/Expenses):</span>
                <strong className="tally-debit fs-6">
                  ₹{((financeTotals?.totalAdvances || 0) + (financeTotals?.totalExpenses || 0)).toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <span className="text-muted small d-block">Total Credits (Cr - Salary Payouts):</span>
                <strong className="tally-credit fs-6">
                  ₹{(financeTotals?.totalSalaryPaid || 0).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            {/* Bank Passbook Statement Table */}
            <div className="table-responsive">
              <table className="tally-table">
                <thead>
                  <tr>
                    <th style={{ width: '110px' }}>Date</th>
                    <th style={{ width: '130px' }}>Voucher Ref</th>
                    <th>Particulars / Narration</th>
                    <th style={{ width: '170px' }}>Staff Account</th>
                    <th style={{ width: '140px', textAlign: 'right' }}>Debit (Dr ₹)</th>
                    <th style={{ width: '140px', textAlign: 'right' }}>Credit (Cr ₹)</th>
                    <th style={{ width: '120px' }}>Payment Mode</th>
                    <th style={{ width: '90px' }}>Voucher</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFinances.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-5 text-center text-muted">
                        No transactions recorded in this statement ledger. Click "Post Tally Voucher Entry" above.
                      </td>
                    </tr>
                  ) : (
                    filteredFinances.map((f, i) => {
                      const isCredit = f.recordType === 'Salary Payment';
                      const isDebit = f.recordType === 'Advance Given' || f.recordType === 'Expense Reimbursement';

                      return (
                        <tr key={f._id}>
                          <td className="fw-semibold text-dark">{f.date}</td>
                          <td>
                            <span className="badge bg-dark font-monospace">
                              VCH-{1000 + i + 1}
                            </span>
                          </td>
                          <td>
                            <strong className="text-dark d-block">{f.recordType}</strong>
                            <small className="text-muted" style={{ fontSize: '11px' }}>
                              {f.reason || 'Routine account settlement'}
                            </small>
                          </td>
                          <td>
                            <strong>{f.employeeId?.name || 'Staff Member'}</strong>
                            <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                              {f.employeeId?.role}
                            </small>
                          </td>

                          {/* Debit Column (Advances, Expenses) */}
                          <td style={{ textAlign: 'right' }}>
                            {isDebit ? (
                              <span className="tally-debit">
                                ₹{f.amount?.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>

                          {/* Credit Column (Salary payouts) */}
                          <td style={{ textAlign: 'right' }}>
                            {isCredit ? (
                              <span className="tally-credit">
                                ₹{f.amount?.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>

                          <td>
                            <span className="badge bg-secondary-subtle text-dark border">
                              {f.paymentMode}
                            </span>
                          </td>

                          <td>
                            {f.receiptImage ? (
                              <a
                                href={`${IMAGE_BASE_URL}${f.receiptImage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-dark btn-sm py-0 px-2 rounded"
                                title="View Receipt"
                              >
                                Slip
                              </a>
                            ) : (
                              <span className="text-muted small">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Tally Passbook Footer */}
            <div className="tally-footer">
              <span className="text-muted small">
                Statement generated automatically from double-entry records.
              </span>
              <div className="d-flex align-items-center gap-4">
                <span>
                  Net Cr: <span className="tally-credit">₹{(financeTotals?.totalSalaryPaid || 0).toLocaleString('en-IN')}</span>
                </span>
                <span>
                  Net Dr: <span className="tally-debit">₹{((financeTotals?.totalAdvances || 0) + (financeTotals?.totalExpenses || 0)).toLocaleString('en-IN')}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal: New Tally Voucher Entry */}
        {showVoucherModal && (
          <div className="modal show fade d-block bg-dark bg-opacity-75" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title fw-bold" style={{ fontSize: '1.1rem' }}>
                    <FaFileInvoiceDollar className="text-warning me-2" /> Post Tally Voucher Entry
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowVoucherModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleVoucherSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-bold">Select Account / Employee *</label>
                        <select
                          className="form-select"
                          value={voucherForm.employeeId}
                          onChange={(e) => setVoucherForm({ ...voucherForm, employeeId: e.target.value })}
                          required
                        >
                          <option value="">-- Choose Staff Account --</option>
                          {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                              {emp.name} (Base Salary: ₹{emp.salary}/mo)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Voucher Nature *</label>
                        <select
                          className="form-select"
                          value={voucherForm.recordType}
                          onChange={(e) => setVoucherForm({ ...voucherForm, recordType: e.target.value })}
                        >
                          <option value="Advance Given">Advance Drawn (Debit Dr)</option>
                          <option value="Salary Payment">Salary Disbursement (Credit Cr)</option>
                          <option value="Expense Reimbursement">Site Travel Expense (Debit Dr)</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Amount (₹) *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 5000"
                          value={voucherForm.amount}
                          onChange={(e) => setVoucherForm({ ...voucherForm, amount: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Voucher Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={voucherForm.date}
                          onChange={(e) => setVoucherForm({ ...voucherForm, date: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Mode of Transfer</label>
                        <select
                          className="form-select"
                          value={voucherForm.paymentMode}
                          onChange={(e) => setVoucherForm({ ...voucherForm, paymentMode: e.target.value })}
                        >
                          <option value="UPI">UPI / GPay / PhonePe</option>
                          <option value="Cash">Cash Voucher</option>
                          <option value="Bank Transfer">NEFT / Bank Transfer</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-bold">Narration / Particulars</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Advance requested for festival / diesel fuel on site"
                          value={voucherForm.reason}
                          onChange={(e) => setVoucherForm({ ...voucherForm, reason: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-bold">Upload Slip / Receipt Image</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setReceiptFile(e.target.files[0])}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-3"
                      onClick={() => setShowVoucherModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-solar-gradient fw-bold rounded-pill px-4"
                    >
                      Post to Ledger
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAttendancePage;
