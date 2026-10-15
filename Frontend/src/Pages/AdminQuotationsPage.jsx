import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../Components/AdminLayout';
import { getQuotationsAction, getPanelsAction } from '../Services/Actions/getApis';
import { createQuotationAction, updateQuotationAction, deleteQuotationAction } from '../Services/Actions/postApis';
import PriceCalculator from '../Services/helpers/PriceCalculator';
import {
  FaFileInvoiceDollar,
  FaPlus,
  FaWhatsapp,
  FaPrint,
  FaTrash,
  FaCheckCircle,
  FaSolarPanel,
  FaRupeeSign,
} from 'react-icons/fa';

function AdminQuotationsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { quotations, panels, adminProfile, admin } = useSelector((state) => state.states);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewQuotation, setViewQuotation] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');

  // Pre-fill if navigated from Leads page
  const leadData = location.state?.fromLead || null;

  // Form State
  const [quoteForm, setQuoteForm] = useState({
    leadId: leadData?._id || '',
    customerName: leadData?.customerName || '',
    customerPhone: leadData?.customerPhone || '',
    customerAddress: leadData?.city || leadData?.address || '',
    panelId: '',
    panelName: '',
    panelWattage: 540,
    totalPanels: leadData?.calculatedPanels || 6,
    systemCapacityKw: leadData?.estimatedKw || 3.2,
    inverterDetails: '5kW Single Phase Grid-Tie Inverter',
    structureDetails: 'Galvanized Iron Elevated Rooftop Mounting Structure',
    panelCost: 81000,
    inverterCost: 45000,
    structureCost: 18000,
    installationCost: 12000,
    gstPercent: 12,
    discount: 2000,
    notes: 'Includes 5 years AMC and standard net-metering processing.',
  });

  useEffect(() => {
    fetchQuotations();
    const pForm = new FormData();
    dispatch(getPanelsAction(pForm)).catch((err) => console.error(err));
  }, [dispatch]);

  const fetchQuotations = () => {
    const formdata = new FormData();
    dispatch(getQuotationsAction(formdata)).catch((err) => console.error(err));
  };

  // When panel selection changes, recalculate panel cost
  const handlePanelChange = (panelId) => {
    const p = panels.find((item) => item._id === panelId);
    if (p) {
      const pCost = p.price * quoteForm.totalPanels;
      const sysKw = Number(((p.wattage * quoteForm.totalPanels) / 1000).toFixed(1));
      setQuoteForm({
        ...quoteForm,
        panelId: p._id,
        panelName: p.name,
        panelWattage: p.wattage,
        panelCost: pCost,
        systemCapacityKw: sysKw,
      });
    }
  };

  // Recalculate panel cost when total panels count changes
  const handlePanelsCountChange = (count) => {
    const c = Number(count) || 1;
    const currentPrice = quoteForm.panelCost / (quoteForm.totalPanels || 1) || 13500;
    const sysKw = Number(((quoteForm.panelWattage * c) / 1000).toFixed(1));
    setQuoteForm({
      ...quoteForm,
      totalPanels: c,
      panelCost: currentPrice * c,
      systemCapacityKw: sysKw,
    });
  };

  // Computed totals
  const subTotal =
    Number(quoteForm.panelCost || 0) +
    Number(quoteForm.inverterCost || 0) +
    Number(quoteForm.structureCost || 0) +
    Number(quoteForm.installationCost || 0);

  const afterDiscount = Math.max(0, subTotal - Number(quoteForm.discount || 0));
  const gstAmount = (afterDiscount * Number(quoteForm.gstPercent || 12)) / 100;
  const grandTotal = Math.round(afterDiscount + gstAmount);

  // Submit Quotation (Strictly using FormData + dispatch flow)
  const handleCreateQuotation = (e) => {
    e.preventDefault();
    if (!quoteForm.customerName || !quoteForm.customerPhone) {
      alert('Please fill customer name and phone');
      return;
    }

    const formdata = new FormData();
    formdata.append('customerName', quoteForm.customerName);
    formdata.append('customerPhone', quoteForm.customerPhone);
    formdata.append('customerAddress', quoteForm.customerAddress);
    formdata.append('leadId', quoteForm.leadId);
    formdata.append('panelId', quoteForm.panelId);
    formdata.append('panelName', quoteForm.panelName || 'Solar Panels');
    formdata.append('panelWattage', quoteForm.panelWattage);
    formdata.append('totalPanels', quoteForm.totalPanels);
    formdata.append('systemCapacityKw', quoteForm.systemCapacityKw);
    formdata.append('inverterDetails', quoteForm.inverterDetails);
    formdata.append('structureDetails', quoteForm.structureDetails);
    formdata.append('panelCost', quoteForm.panelCost);
    formdata.append('inverterCost', quoteForm.inverterCost);
    formdata.append('structureCost', quoteForm.structureCost);
    formdata.append('installationCost', quoteForm.installationCost);
    formdata.append('gstPercent', quoteForm.gstPercent);
    formdata.append('discount', quoteForm.discount);
    formdata.append('notes', quoteForm.notes);

    dispatch(createQuotationAction(formdata))
      .then((res) => {
        setShowCreateModal(false);
        setAlertMsg(`Quotation #${res.quotation.quotationNumber} generated successfully!`);
        setTimeout(() => setAlertMsg(''), 3000);
        fetchQuotations();
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteQuotation = (id) => {
    if (window.confirm('Delete this quotation?')) {
      dispatch(deleteQuotationAction(id))
        .then(() => fetchQuotations())
        .catch((err) => console.error(err));
    }
  };

  const companyName = adminProfile?.companyName || admin?.companyName || 'SolarFlow';
  const adminPhone = adminProfile?.mobile || admin?.mobile || '9876543210';

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Solar Project Quotations</h3>
            <p className="text-muted small mb-0">
              Submit formal turnkey solar quotations customized to customer site requirements with 1-click WhatsApp proposal sharing.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-warning text-dark fw-bold rounded-pill d-flex align-items-center gap-2 shadow-sm mt-3 mt-md-0"
          >
            <FaPlus /> Create Custom Quotation
          </button>
        </div>

        {alertMsg && (
          <div className="alert alert-success alert-dismissible fade show py-2 small" role="alert">
            {alertMsg}
            <button type="button" className="btn-close py-2" onClick={() => setAlertMsg('')}></button>
          </div>
        )}

        {/* Quotations Table */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Quote #</th>
                  <th>Customer</th>
                  <th>System Size</th>
                  <th>Hardware Details</th>
                  <th>Grand Total (GST Incl.)</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No quotations generated yet. Click "Create Custom Quotation" above.
                    </td>
                  </tr>
                ) : (
                  quotations.map((q) => {
                    const cleanPhone = q.customerPhone.replace(/\D/g, '');
                    const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                    const quoteMsg = `*Official Solar Project Quotation from ${companyName}*
----------------------------------------
*Quotation No:* ${q.quotationNumber}
*Customer:* ${q.customerName}
*System Size:* ${q.systemCapacityKw} kW (${q.totalPanels}x ${q.panelName || 'Panels'})
*Inverter:* ${q.inverterDetails}
*Mounting Structure:* ${q.structureDetails}
----------------------------------------
*Cost Breakdown:*
- Solar Panels: ₹${q.panelCost?.toLocaleString('en-IN')}
- Inverter: ₹${q.inverterCost?.toLocaleString('en-IN')}
- Structure & BOS: ₹${q.structureCost?.toLocaleString('en-IN')}
- Installation & Testing: ₹${q.installationCost?.toLocaleString('en-IN')}
*Discount:* -₹${q.discount?.toLocaleString('en-IN')}
*GST (${q.gstPercent}%):* ₹${Math.round(q.gstAmount)?.toLocaleString('en-IN')}
----------------------------------------
*GRAND TOTAL:* ₹${q.grandTotal?.toLocaleString('en-IN')}
----------------------------------------
For confirmation or site visit, reply to this message.`;

                    return (
                      <tr key={q._id}>
                        <td>
                          <span className="badge bg-dark fw-bold">{q.quotationNumber}</span>
                          <small className="text-muted d-block" style={{ fontSize: '10px' }}>
                            {new Date(q.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <strong className="text-dark d-block">{q.customerName}</strong>
                          <span className="text-muted small">{q.customerPhone}</span>
                        </td>
                        <td>
                          <strong className="text-primary">{q.systemCapacityKw} kW</strong>
                          <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                            {q.totalPanels} Panels
                          </small>
                        </td>
                        <td>
                          <small className="d-block text-truncate" style={{ maxWidth: '200px' }}>
                            {q.panelName || 'Tier-1 Modules'}
                          </small>
                          <small className="text-muted d-block text-truncate" style={{ maxWidth: '200px', fontSize: '11px' }}>
                            {q.inverterDetails}
                          </small>
                        </td>
                        <td>
                          <h6 className="fw-bold text-success mb-0">
                            ₹{q.grandTotal?.toLocaleString('en-IN')}
                          </h6>
                          <small className="text-muted" style={{ fontSize: '10px' }}>
                            (GST {q.gstPercent}% ₹{Math.round(q.gstAmount)?.toLocaleString('en-IN')})
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            {q.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            {/* Send Quotation via WhatsApp */}
                            <a
                              href={`https://wa.me/${waPhone}?text=${encodeURIComponent(quoteMsg)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-success btn-sm rounded-circle p-1"
                              title="Send Quotation via WhatsApp"
                            >
                              <FaWhatsapp size={14} />
                            </a>

                            {/* View / Print Proposal */}
                            <button
                              onClick={() => setViewQuotation(q)}
                              className="btn btn-outline-primary btn-sm rounded-circle p-1"
                              title="View & Print Quotation"
                            >
                              <FaPrint size={13} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteQuotation(q._id)}
                              className="btn btn-outline-danger btn-sm rounded-circle p-1"
                              title="Delete Quotation"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Quotation Modal */}
        {showCreateModal && (
          <div className="modal show fade d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    <FaFileInvoiceDollar className="text-warning me-2" /> Generate Solar Quotation
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                </div>
                <form onSubmit={handleCreateQuotation}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      {/* Customer details */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Customer Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={quoteForm.customerName}
                          onChange={(e) => setQuoteForm({ ...quoteForm, customerName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Customer Phone (WhatsApp) *</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={quoteForm.customerPhone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, customerPhone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Customer Site Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={quoteForm.customerAddress}
                          onChange={(e) => setQuoteForm({ ...quoteForm, customerAddress: e.target.value })}
                        />
                      </div>

                      {/* Panel details */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Select Solar Panel Model</label>
                        <select
                          className="form-select"
                          value={quoteForm.panelId}
                          onChange={(e) => handlePanelChange(e.target.value)}
                        >
                          <option value="">-- Choose Panel --</option>
                          {panels.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name} ({p.wattage}W) - ₹{p.price}/panel
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label small fw-bold">Number of Panels</label>
                        <input
                          type="number"
                          className="form-control"
                          value={quoteForm.totalPanels}
                          onChange={(e) => handlePanelsCountChange(e.target.value)}
                          min="1"
                        />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label small fw-bold">System Capacity (kW)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={quoteForm.systemCapacityKw}
                          onChange={(e) => setQuoteForm({ ...quoteForm, systemCapacityKw: Number(e.target.value) })}
                        />
                      </div>

                      {/* Inverter & Structure */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Inverter Specifications</label>
                        <input
                          type="text"
                          className="form-control"
                          value={quoteForm.inverterDetails}
                          onChange={(e) => setQuoteForm({ ...quoteForm, inverterDetails: e.target.value })}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Mounting Structure</label>
                        <input
                          type="text"
                          className="form-control"
                          value={quoteForm.structureDetails}
                          onChange={(e) => setQuoteForm({ ...quoteForm, structureDetails: e.target.value })}
                        />
                      </div>

                      {/* Line Item Costs */}
                      <div className="col-md-3">
                        <label className="form-label small fw-bold">Panels Cost (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={quoteForm.panelCost}
                          onChange={(e) => setQuoteForm({ ...quoteForm, panelCost: Number(e.target.value) })}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-bold">Inverter Cost (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={quoteForm.inverterCost}
                          onChange={(e) => setQuoteForm({ ...quoteForm, inverterCost: Number(e.target.value) })}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-bold">Structure/BOS (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={quoteForm.structureCost}
                          onChange={(e) => setQuoteForm({ ...quoteForm, structureCost: Number(e.target.value) })}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-bold">Labor & Wiring (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={quoteForm.installationCost}
                          onChange={(e) => setQuoteForm({ ...quoteForm, installationCost: Number(e.target.value) })}
                        />
                      </div>

                      {/* Tax & Discount */}
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Discount (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={quoteForm.discount}
                          onChange={(e) => setQuoteForm({ ...quoteForm, discount: Number(e.target.value) })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">GST Rate (%)</label>
                        <select
                          className="form-select"
                          value={quoteForm.gstPercent}
                          onChange={(e) => setQuoteForm({ ...quoteForm, gstPercent: Number(e.target.value) })}
                        >
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="5">5%</option>
                        </select>
                      </div>

                      {/* Computed Grand Total */}
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Grand Total (₹)</label>
                        <div className="p-2 bg-success text-white rounded text-center fw-bold fs-5">
                          ₹{grandTotal.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="col-12">
                        <label className="form-label small fw-bold">Notes / Warranty / Scope</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={quoteForm.notes}
                          onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-solar-gradient fw-bold rounded-pill px-4">
                      Save & Issue Quotation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View / Print Quotation Proposal Modal */}
        {viewQuotation && (
          <div className="modal show fade d-block bg-dark bg-opacity-75" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content rounded-4 border-0 p-4">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div>
                    <h4 className="fw-bold mb-0 text-primary">{companyName}</h4>
                    <small className="text-muted">Solar EPC & Turnkey Engineering Solutions | +91 {adminPhone}</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-dark fs-6">{viewQuotation.quotationNumber}</span>
                    <small className="text-muted d-block">{new Date(viewQuotation.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>

                <div className="bg-light p-3 rounded-3 mb-3 small">
                  <strong>Prepared For:</strong> {viewQuotation.customerName}<br />
                  <strong>Phone:</strong> {viewQuotation.customerPhone}<br />
                  <strong>Site Address:</strong> {viewQuotation.customerAddress || 'Customer Rooftop'}
                </div>

                <h6 className="fw-bold mb-2">System Sizing: {viewQuotation.systemCapacityKw} kW Plant</h6>
                <table className="table table-bordered small mb-3">
                  <thead className="table-light">
                    <tr>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th className="text-end">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{viewQuotation.panelName || 'Tier-1 Solar Panels'} ({viewQuotation.panelWattage}W)</td>
                      <td>{viewQuotation.totalPanels} Units</td>
                      <td className="text-end">₹{viewQuotation.panelCost?.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Inverter: {viewQuotation.inverterDetails}</td>
                      <td>1 Set</td>
                      <td className="text-end">₹{viewQuotation.inverterCost?.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Structure: {viewQuotation.structureDetails}</td>
                      <td>Turnkey BOS</td>
                      <td className="text-end">₹{viewQuotation.structureCost?.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Civil Foundation, DC/AC Cabling, Installation</td>
                      <td>Lump sum</td>
                      <td className="text-end">₹{viewQuotation.installationCost?.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="text-end fw-bold">Discount:</td>
                      <td className="text-end text-danger">-₹{viewQuotation.discount?.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="text-end fw-bold">GST ({viewQuotation.gstPercent}%):</td>
                      <td className="text-end">₹{Math.round(viewQuotation.gstAmount)?.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="table-success">
                      <td colSpan="2" className="text-end fw-bold fs-6">Grand Total:</td>
                      <td className="text-end fw-bold fs-6 text-success">
                        ₹{viewQuotation.grandTotal?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {viewQuotation.notes && (
                  <p className="text-muted small mb-3">
                    <strong>Scope & Terms:</strong> {viewQuotation.notes}
                  </p>
                )}

                <div className="d-flex justify-content-end gap-2">
                  <button onClick={() => window.print()} className="btn btn-outline-dark rounded-pill btn-sm d-flex align-items-center gap-1">
                    <FaPrint /> Print / Save PDF
                  </button>
                  <button onClick={() => setViewQuotation(null)} className="btn btn-secondary rounded-pill btn-sm">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminQuotationsPage;
