const Payment = require('../Modals/Payment');

// Add Customer Payment
exports.addPayment = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      leadId,
      quotationId,
      totalAmount,
      amountPaid,
      paymentType,
      paymentMode,
      transactionId,
      paymentDate,
      notes,
    } = req.body;

    if (!customerName || !amountPaid || !paymentDate) {
      return res.status(400).json({ success: false, message: 'Customer name, amount paid, and date are required' });
    }

    const tAmount = Number(totalAmount) || Number(amountPaid);
    const paid = Number(amountPaid);
    const balance = Math.max(0, tAmount - paid);

    let status = 'Paid';
    if (balance > 0 && paid > 0) status = 'Partial';
    else if (paid === 0) status = 'Pending';

    const newPayment = new Payment({
      customerName,
      customerPhone: customerPhone || '',
      leadId: leadId || null,
      quotationId: quotationId || null,
      totalAmount: tAmount,
      amountPaid: paid,
      balanceRemaining: balance,
      paymentType: paymentType || 'Advance Token',
      paymentMode: paymentMode || 'UPI',
      transactionId: transactionId || '',
      paymentDate,
      status,
      notes: notes || '',
    });

    await newPayment.save();
    res.status(201).json({ success: true, message: 'Payment recorded successfully', payment: newPayment });
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Payments
exports.getAllPayments = async (req, res) => {
  try {
    const { status, paymentMode } = req.query;
    let query = {};
    if (status && status !== 'All') query.status = status;
    if (paymentMode && paymentMode !== 'All') query.paymentMode = paymentMode;

    const payments = await Payment.find(query).sort({ paymentDate: -1, createdAt: -1 });

    let totalCollected = 0;
    let totalPendingBalance = 0;
    payments.forEach((p) => {
      totalCollected += p.amountPaid;
      totalPendingBalance += p.balanceRemaining;
    });

    res.status(200).json({
      success: true,
      count: payments.length,
      totalCollected,
      totalPendingBalance,
      payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Payment
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Payment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.status(200).json({ success: true, message: 'Payment updated', payment: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Payment
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payment.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.status(200).json({ success: true, message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
