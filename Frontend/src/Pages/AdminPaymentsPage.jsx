import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../Components/AdminLayout';
import { getPaymentsAction } from '../Services/Actions/getApis';
import { addPaymentAction, deletePaymentAction } from '../Services/Actions/postApis';
import { FaMoneyCheckAlt, FaPlus, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

function AdminPaymentsPage() {
  const dispatch = useDispatch();
  const { payments, paymentTotals } = useSelector((state) => state.states);

  const [showModal, setShowModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const [payForm, setPayForm] = useState({
    customerName: '',
    customerPhone: '',
    totalAmount: '',
    amountPaid: '',
    paymentType: 'Advance Token',
    paymentMode: 'UPI',
    transactionId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchPayments();
  }, [dispatch]);

  const fetchPayments = () => {
    const formdata = new FormData();
    dispatch(getPaymentsAction(formdata)).catch((err) => console.error(err));
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!payForm.customerName || !payForm.amountPaid) {
      alert('Please fill customer name and amount paid');
      return;
    }

    const formdata = new FormData();
    formdata.append('customerName', payForm.customerName);
    formdata.append('customerPhone', payForm.customerPhone);
    formdata.append('totalAmount', payForm.totalAmount || payForm.amountPaid);
    formdata.append('amountPaid', payForm.amountPaid);
    formdata.append('paymentType', payForm.paymentType);
    formdata.append('paymentMode', payForm.paymentMode);
    formdata.append('transactionId', payForm.transactionId);
    formdata.append('paymentDate', payForm.paymentDate);
    formdata.append('notes', payForm.notes);

    dispatch(addPaymentAction(formdata))
      .then(() => {
        setShowModal(false);
        setAlertMsg('Customer payment transaction recorded successfully!');
        setTimeout(() => setAlertMsg(''), 3000);
        setPayForm({
          customerName: '',
          customerPhone: '',
          totalAmount: '',
          amountPaid: '',
          paymentType: 'Advance Token',
          paymentMode: 'UPI',
          transactionId: '',
          paymentDate: new Date().toISOString().split('T')[0],
          notes: '',
        });
        fetchPayments();
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this payment entry?')) {
      dispatch(deletePaymentAction(id))
        .then(() => fetchPayments())
        .catch((err) => console.error(err));
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 gap-md-3 mb-4 admin-header-row">
          <div>
            <h3 className="fw-bold text-dark mb-1" style={{ fontSize: '1.4rem' }}>Customer Payments & Milestone Tracking</h3>
            <p className="text-muted small mb-0">
              Manage advance booking tokens, delivery milestone payments, outstanding balances, and transaction receipts.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-success fw-bold rounded-pill d-flex align-items-center gap-2 shadow-sm mt-2 mt-md-0 admin-header-btn flex-shrink-0"
          >
            <FaPlus /> Record Customer Payment
          </button>
        </div>

        {alertMsg && (
          <div className="alert alert-success alert-dismissible fade show py-2 small" role="alert">
            {alertMsg}
            <button type="button" className="btn-close py-2" onClick={() => setAlertMsg('')}></button>
          </div>
        )}

        {/* 2 Big Totals */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-success border-4">
              <small className="text-muted fw-bold text-uppercase">Total Revenue Collected</small>
              <h2 className="fw-bold text-success mb-0 mt-2">
                ₹{(paymentTotals?.totalCollected || 0).toLocaleString('en-IN')}
              </h2>
              <small className="text-muted">Recorded across {payments.length} customer payment receipts</small>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-warning border-4">
              <small className="text-muted fw-bold text-uppercase">Total Outstanding Balance</small>
              <h2 className="fw-bold text-warning mb-0 mt-2">
                ₹{(paymentTotals?.totalPendingBalance || 0).toLocaleString('en-IN')}
              </h2>
              <small className="text-muted">Pending balance on active installation projects</small>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Date</th>
                  <th>Customer Name & Phone</th>
                  <th>Payment Stage</th>
                  <th>Amount Paid</th>
                  <th>Remaining Balance</th>
                  <th>Payment Mode & Txn ID</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      No payment records found. Click "Record Customer Payment" above.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <strong className="text-dark small">{p.paymentDate}</strong>
                      </td>
                      <td>
                        <strong className="text-dark d-block">{p.customerName}</strong>
                        <small className="text-muted">{p.customerPhone || 'N/A'}</small>
                      </td>
                      <td>
                        <span className="badge badge-soft-primary">{p.paymentType}</span>
                      </td>
                      <td>
                        <strong className="text-success fs-6">₹{p.amountPaid?.toLocaleString('en-IN')}</strong>
                        {p.totalAmount > p.amountPaid && (
                          <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                            of ₹{p.totalAmount?.toLocaleString('en-IN')} Total
                          </small>
                        )}
                      </td>
                      <td>
                        {p.balanceRemaining > 0 ? (
                          <span className="text-danger fw-bold">
                            ₹{p.balanceRemaining?.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-success small fw-semibold">
                            <FaCheckCircle className="me-1" /> Fully Settled
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-dark me-1">{p.paymentMode}</span>
                        {p.transactionId && (
                          <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                            Ref: {p.transactionId}
                          </small>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            p.status === 'Paid'
                              ? 'bg-success'
                              : p.status === 'Partial'
                              ? 'bg-warning text-dark'
                              : 'bg-secondary'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="btn btn-outline-danger btn-sm rounded-circle p-1"
                          title="Delete Payment"
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Payment Modal */}
        {showModal && (
          <div className="modal show fade d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    <FaMoneyCheckAlt className="text-success me-2" /> Record Customer Payment
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleAddPayment}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-bold">Customer Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Ramesh Nahak"
                          value={payForm.customerName}
                          onChange={(e) => setPayForm({ ...payForm, customerName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Customer Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="e.g. 9876543210"
                          value={payForm.customerPhone}
                          onChange={(e) => setPayForm({ ...payForm, customerPhone: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Total Project Value (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 185000"
                          value={payForm.totalAmount}
                          onChange={(e) => setPayForm({ ...payForm, totalAmount: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Amount Paid (₹) *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 50000"
                          value={payForm.amountPaid}
                          onChange={(e) => setPayForm({ ...payForm, amountPaid: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Payment Milestone</label>
                        <select
                          className="form-select"
                          value={payForm.paymentType}
                          onChange={(e) => setPayForm({ ...payForm, paymentType: e.target.value })}
                        >
                          <option value="Advance Token">Advance Token (Booking)</option>
                          <option value="Delivery Milestone">Material Delivery (50%)</option>
                          <option value="Final Installation Settlement">Final Installation (Settlement)</option>
                          <option value="Full Payment">100% Full Payment</option>
                          <option value="Service Charges">Service / Repair Charges</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Payment Mode</label>
                        <select
                          className="form-select"
                          value={payForm.paymentMode}
                          onChange={(e) => setPayForm({ ...payForm, paymentMode: e.target.value })}
                        >
                          <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                          <option value="Cash">Cash</option>
                          <option value="Net Banking">Net Banking / NEFT</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Transaction / UTR Reference</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. UPI/1234567890"
                          value={payForm.transactionId}
                          onChange={(e) => setPayForm({ ...payForm, transactionId: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Payment Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={payForm.paymentDate}
                          onChange={(e) => setPayForm({ ...payForm, paymentDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Notes</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 5kW project token received"
                          value={payForm.notes}
                          onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-emerald-gradient fw-bold rounded-pill px-4">
                      Record Payment
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

export default AdminPaymentsPage;
