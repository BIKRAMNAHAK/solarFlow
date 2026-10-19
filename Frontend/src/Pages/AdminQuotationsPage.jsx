import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../Components/AdminLayout';
import { getQuotationsAction, getPanelsAction } from '../Services/Actions/getApis';
import { createQuotationAction, updateQuotationAction, deleteQuotationAction } from '../Services/Actions/postApis';
import PriceCalculator from '../Services/helpers/PriceCalculator';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import {
  FaFileInvoiceDollar,
  FaPlus,
  FaWhatsapp,
  FaPrint,
  FaTrash,
  FaCheckCircle,
  FaSolarPanel,
  FaRupeeSign,
  FaShieldAlt,
  FaBolt,
  FaSun,
  FaCertificate,
  FaCheckDouble,
  FaBuilding,
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaDownload,
  FaTimes,
  FaAward,
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
  const adminPhone = adminProfile?.mobile || admin?.mobile || '7803816900';
  const adminEmail = adminProfile?.email || admin?.email || 'admin@solarflow.com';
  const ownerName = adminProfile?.ownerName || admin?.ownerName || 'Admin';
  const logoUrl = adminProfile?.logo ? `${IMAGE_BASE_URL}${adminProfile.logo}` : null;

  const shareQuotationOnWhatsApp = (q) => {
    const phone = q.customerPhone?.replace(/\D/g, '');
    const cleanPhone = phone?.length === 10 ? `91${phone}` : phone;
    const subsidy = q.systemCapacityKw >= 3 ? 78000 : q.systemCapacityKw >= 2 ? 60000 : 30000;
    const netCost = Math.max(0, (q.grandTotal || 0) - subsidy);
    const message = `*OFFICIAL SOLAR TURNKEY QUOTATION*\n` +
      `*${companyName.toUpperCase()}*\n` +
      `------------------------------------------\n` +
      `📄 *Quotation No:* ${q.quotationNumber}\n` +
      `👤 *Customer Name:* ${q.customerName}\n` +
      `📞 *Phone:* ${q.customerPhone}\n` +
      `📍 *Site Location:* ${q.customerAddress || 'Customer Site'}\n` +
      `------------------------------------------\n` +
      `⚡ *System Capacity:* ${q.systemCapacityKw} kW Rooftop Solar Plant\n` +
      `☀️ *Solar Modules:* ${q.totalPanels} Units x ${q.panelWattage}W (${q.panelName || 'Tier-1 Mono PERC'})\n` +
      `🔌 *Inverter:* ${q.inverterDetails}\n` +
      `🏗️ *Mounting:* ${q.structureDetails}\n` +
      `📊 *Est. Generation:* ~${Math.round(q.systemCapacityKw * 120)} Units / Month\n` +
      `------------------------------------------\n` +
      `💰 *Total Project Cost (Inc. GST):* Rs. ${q.grandTotal?.toLocaleString('en-IN')}/-\n` +
      `🎁 *PM Surya Ghar Govt Subsidy:* -Rs. ${subsidy.toLocaleString('en-IN')}/- (Direct DBT)\n` +
      `✨ *Estimated Net Outlay:* Rs. ${netCost.toLocaleString('en-IN')}/- only\n` +
      `------------------------------------------\n` +
      `🛡️ *Warranties:* 25-Year Performance Warranty | 5-Year Inverter Warranty\n` +
      `⚡ *Net-Metering:* Full DISCOM liaison included\n\n` +
      `For any questions or site confirmation, contact +91 ${adminPhone}.`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 gap-md-3 mb-4 admin-header-row">
          <div>
            <h3 className="fw-bold text-dark mb-1" style={{ fontSize: '1.4rem' }}>Solar Project Quotations</h3>
            <p className="text-muted small mb-0">
              Submit formal turnkey solar quotations customized to customer site requirements with 1-click WhatsApp proposal sharing.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-warning text-dark fw-bold rounded-pill d-flex align-items-center gap-2 shadow-sm mt-2 mt-md-0 admin-header-btn flex-shrink-0"
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
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
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
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
              <div className="modal-content rounded-4 border-0 p-0 overflow-hidden shadow-lg">
                {/* Modal Top Control Bar (Hidden on print) */}
                <div className="no-print bg-dark text-white px-3 py-2 d-flex flex-wrap justify-content-between align-items-center gap-2 border-bottom border-secondary border-opacity-50">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-warning text-dark fw-bold">PROPOSAL PREVIEW</span>
                    <span className="small text-light">Quote #{viewQuotation.quotationNumber}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="btn btn-warning btn-sm fw-bold rounded-pill d-flex align-items-center gap-1 shadow-sm px-3"
                    >
                      <FaPrint size={13} /> Print / Save PDF
                    </button>
                    <button
                      onClick={() => shareQuotationOnWhatsApp(viewQuotation)}
                      className="btn btn-success btn-sm fw-bold rounded-pill d-flex align-items-center gap-1 shadow-sm px-3"
                    >
                      <FaWhatsapp size={14} /> Send on WhatsApp
                    </button>
                    <button
                      onClick={() => setViewQuotation(null)}
                      className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center p-0 text-white"
                      style={{ width: '28px', height: '28px' }}
                      title="Close Preview"
                    >
                      <FaTimes size={13} />
                    </button>
                  </div>
                </div>

                {/* Printable High-Resolution Colorful Document */}
                <div className="quotation-printable-document p-3 p-md-4">
                  {/* Top Colorful Header Banner */}
                  <div className="quotation-header-banner rounded-4 mb-3 mb-md-4">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                      <div className="d-flex align-items-center gap-3">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt="Logo"
                            style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                            className="rounded-3 border border-warning flex-shrink-0 bg-white p-1"
                          />
                        ) : (
                          <div
                            className="bg-warning text-dark rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: '56px', height: '56px' }}
                          >
                            <FaSolarPanel size={28} />
                          </div>
                        )}
                        <div>
                          <h4 className="fw-extrabold mb-0 text-white" style={{ fontSize: '1.4rem', letterSpacing: '-0.3px' }}>
                            {companyName}
                          </h4>
                          <span className="text-warning small fw-bold d-block" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                            TURNKEY SOLAR EPC & CLEAN ENERGY ENGINEERING
                          </span>
                          <small className="text-light opacity-75 d-block" style={{ fontSize: '11px' }}>
                            📞 +91 {adminPhone} &nbsp;|&nbsp; ✉ {adminEmail}
                          </small>
                        </div>
                      </div>

                      <div className="text-start text-sm-end">
                        <div className="badge bg-warning text-dark fs-6 fw-bold px-3 py-1 rounded-pill mb-1 shadow-sm">
                          {viewQuotation.quotationNumber}
                        </div>
                        <div className="small text-light">
                          <strong>Date:</strong> {new Date(viewQuotation.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="small text-warning" style={{ fontSize: '11px' }}>
                          <strong>Valid Till:</strong> 30 Days from Issue
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Multi-Color Technical Spec Pills */}
                  <div className="row g-2 g-md-3 mb-3 mb-md-4">
                    <div className="col-6 col-md-3">
                      <div className="quotation-spec-pill border-start border-primary border-4 h-100">
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>System Capacity</small>
                        <strong className="text-primary fs-6">{viewQuotation.systemCapacityKw} kW Plant</strong>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="quotation-spec-pill border-start border-warning border-4 h-100">
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>Modules & Wattage</small>
                        <strong className="text-dark fs-6">{viewQuotation.totalPanels} x {viewQuotation.panelWattage}W</strong>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="quotation-spec-pill border-start border-success border-4 h-100">
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>Est. Monthly Units</small>
                        <strong className="text-success fs-6">~{Math.round(viewQuotation.systemCapacityKw * 120)} kWh/mo</strong>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="quotation-spec-pill border-start border-info border-4 h-100">
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>Performance Warranty</small>
                        <strong className="text-info fs-6">25 Years Linear</strong>
                      </div>
                    </div>
                  </div>

                  {/* Client & Contractor Information Grid */}
                  <div className="row g-3 mb-3 mb-md-4">
                    <div className="col-md-6">
                      <div className="p-3 rounded-3 h-100" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderTop: '3px solid #2563eb' }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <FaUser className="text-primary" size={14} />
                          <strong className="text-dark small text-uppercase fw-bold">Client / Site Details</strong>
                        </div>
                        <div className="small">
                          <div className="fw-bold text-dark fs-6 mb-1">{viewQuotation.customerName}</div>
                          <div className="text-muted mb-1">📞 +91 {viewQuotation.customerPhone}</div>
                          <div className="text-muted">📍 {viewQuotation.customerAddress || 'Installation Site Rooftop'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="p-3 rounded-3 h-100" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderTop: '3px solid #10b981' }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <FaBuilding className="text-success" size={14} />
                          <strong className="text-dark small text-uppercase fw-bold">Solar EPC Contractor</strong>
                        </div>
                        <div className="small">
                          <div className="fw-bold text-dark fs-6 mb-1">{companyName}</div>
                          <div className="text-muted mb-1">Authorized Owner: {ownerName}</div>
                          <div className="text-muted">Certified MNRE / DISCOM Solar Engineering Partner</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bill of Materials (BOM) Detailed Cost Breakdown Table */}
                  <div className="mb-3 mb-md-4">
                    <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.98rem' }}>
                      <FaFileInvoiceDollar className="text-warning" /> Itemized Bill of Materials & Turnkey EPC Scope
                    </h6>
                    <div className="table-responsive rounded-3 border">
                      <table className="quotation-table table table-hover mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: '55%' }}>System Component & Technical Specification</th>
                            <th className="text-center" style={{ width: '20%' }}>Quantity / BOS</th>
                            <th className="text-end" style={{ width: '25%' }}>Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <strong className="text-dark d-block">1. Solar Photovoltaic Modules</strong>
                              <small className="text-muted">
                                {viewQuotation.panelName || 'Tier-1 Mono PERC'} ({viewQuotation.panelWattage}W Half-Cut Cell Technology with 25-Yr Linear Power Warranty)
                              </small>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-light text-dark border fw-bold">{viewQuotation.totalPanels} Units</span>
                            </td>
                            <td className="text-end fw-bold text-dark">
                              ₹{viewQuotation.panelCost?.toLocaleString('en-IN')}
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <strong className="text-dark d-block">2. Power Inverter & Telemetry System</strong>
                              <small className="text-muted">
                                {viewQuotation.inverterDetails || 'High-Efficiency Grid-Tie Inverter with WiFi generation monitoring & dual MPPT'}
                              </small>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-light text-dark border fw-bold">1 Complete Set</span>
                            </td>
                            <td className="text-end fw-bold text-dark">
                              ₹{viewQuotation.inverterCost?.toLocaleString('en-IN')}
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <strong className="text-dark d-block">3. Mounting Framework & Structure</strong>
                              <small className="text-muted">
                                {viewQuotation.structureDetails || 'Elevated Hot-Dip Galvanized Iron (GI 80µm) engineered for 150 km/h cyclone resistance'}
                              </small>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-light text-dark border fw-bold">Turnkey Array</span>
                            </td>
                            <td className="text-end fw-bold text-dark">
                              ₹{viewQuotation.structureCost?.toLocaleString('en-IN')}
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <strong className="text-dark d-block">4. Balance of System, Cabling & Installation</strong>
                              <small className="text-muted">
                                Solar grade 4sqmm DC cables, AC/DC DB boxes, chemical earthing kits, lightning arrestor & certified mechanical installation
                              </small>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-light text-dark border fw-bold">Lump Sum Scope</span>
                            </td>
                            <td className="text-end fw-bold text-dark">
                              ₹{viewQuotation.installationCost?.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pricing Breakdown & Grand Total Card */}
                  <div className="row g-3 mb-3 mb-md-4">
                    {/* Left: Government Subsidy & Environmental Benefit Box */}
                    <div className="col-md-6">
                      <div className="quotation-subsidy-card h-100">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <FaAward className="text-success" size={18} />
                          <strong className="text-success text-uppercase small fw-bold">
                            PM Surya Ghar Subsidy Benefit
                          </strong>
                        </div>
                        <p className="text-muted small mb-2">
                          Eligible rooftop capacity ({viewQuotation.systemCapacityKw} kW) qualifies for direct government DBT transfer into customer's bank account.
                        </p>
                        <div className="d-flex justify-content-between align-items-center py-1 border-bottom border-success border-opacity-25 small">
                          <span>Central Govt Subsidy:</span>
                          <strong className="text-success fs-6">
                            -₹{(viewQuotation.systemCapacityKw >= 3 ? 78000 : viewQuotation.systemCapacityKw >= 2 ? 60000 : 30000).toLocaleString('en-IN')} (Direct DBT)
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between align-items-center pt-2">
                          <span className="fw-bold small text-dark">Estimated Net Effective Outlay:</span>
                          <strong className="text-dark fs-6 fw-extrabold">
                            ₹{Math.max(0, viewQuotation.grandTotal - (viewQuotation.systemCapacityKw >= 3 ? 78000 : viewQuotation.systemCapacityKw >= 2 ? 60000 : 30000)).toLocaleString('en-IN')}*
                          </strong>
                        </div>
                        <small className="text-muted d-block mt-1" style={{ fontSize: '10px' }}>
                          *Disbursed directly by Ministry of New & Renewable Energy upon DISCOM commissioning.
                        </small>
                      </div>
                    </div>

                    {/* Right: Financial Totals */}
                    <div className="col-md-6">
                      <div className="p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div className="d-flex justify-content-between py-1 small text-muted">
                          <span>Gross Material & Labor Subtotal:</span>
                          <strong className="text-dark">
                            ₹{((viewQuotation.panelCost || 0) + (viewQuotation.inverterCost || 0) + (viewQuotation.structureCost || 0) + (viewQuotation.installationCost || 0)).toLocaleString('en-IN')}
                          </strong>
                        </div>

                        {viewQuotation.discount > 0 && (
                          <div className="d-flex justify-content-between py-1 small text-danger">
                            <span>Special Project Discount:</span>
                            <strong>-₹{viewQuotation.discount?.toLocaleString('en-IN')}</strong>
                          </div>
                        )}

                        <div className="d-flex justify-content-between py-1 small text-muted border-bottom pb-2">
                          <span>Statutory GST ({viewQuotation.gstPercent}%):</span>
                          <strong className="text-dark">
                            +₹{Math.round(viewQuotation.gstAmount || 0).toLocaleString('en-IN')}
                          </strong>
                        </div>

                        <div className="quotation-grand-total-box d-flex justify-content-between align-items-center mt-3">
                          <div>
                            <span className="text-uppercase fw-bold text-dark d-block small" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                              Grand Total (Turnkey EPC Value)
                            </span>
                            <small className="text-muted" style={{ fontSize: '11px' }}>Inclusive of GST, freight & commissioning</small>
                          </div>
                          <div className="text-end">
                            <h3 className="fw-extrabold mb-0 text-dark gradient-text-solar" style={{ fontSize: '1.65rem' }}>
                              ₹{viewQuotation.grandTotal?.toLocaleString('en-IN')}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes, Terms & Authorization Footer */}
                  <div className="p-3 bg-light rounded-3 mb-2 border">
                    <div className="row g-3">
                      <div className="col-md-8">
                        <strong className="text-dark small d-block mb-1">Standard Terms & Engineering Commitments:</strong>
                        <ul className="text-muted small mb-0 ps-3" style={{ fontSize: '11px' }}>
                          <li><strong>Performance Warranty:</strong> 25 Years linear degradation guarantee on photovoltaic modules.</li>
                          <li><strong>Inverter Guarantee:</strong> 5 Years full replacement warranty from original equipment manufacturer.</li>
                          <li><strong>Liaison Support:</strong> Full DISCOM documentation, application submission & net-meter coordination.</li>
                          {viewQuotation.notes && <li><strong>Special Remarks:</strong> {viewQuotation.notes}</li>}
                        </ul>
                      </div>
                      <div className="col-md-4 text-start text-md-end d-flex flex-column justify-content-end">
                        <div className="pt-2 border-top border-secondary border-opacity-25 mt-auto">
                          <span className="fw-bold text-dark d-block small">{ownerName}</span>
                          <small className="text-muted d-block" style={{ fontSize: '11px' }}>Authorized Engineering Signatory</small>
                          <small className="text-success fw-semibold" style={{ fontSize: '10px' }}>✓ Digitally Verified Proposal</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer (Hidden on print) */}
                <div className="no-print p-3 bg-light border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                  <small className="text-muted">
                    💡 Tip: Click <strong>"Print / Save PDF"</strong> and select <strong>"Save as PDF"</strong> in your print dialog.
                  </small>
                  <div className="d-flex flex-wrap gap-2 w-100 w-sm-auto justify-content-end">
                    <button
                      onClick={() => window.print()}
                      className="btn btn-solar-gradient rounded-pill btn-sm fw-bold px-3 py-2 d-flex align-items-center justify-content-center gap-1 shadow-sm w-100 w-sm-auto"
                    >
                      <FaPrint /> Print / Save PDF
                    </button>
                    <button
                      onClick={() => shareQuotationOnWhatsApp(viewQuotation)}
                      className="btn btn-success rounded-pill btn-sm fw-bold px-3 py-2 d-flex align-items-center justify-content-center gap-1 shadow-sm w-100 w-sm-auto"
                    >
                      <FaWhatsapp /> Send on WhatsApp
                    </button>
                    <button
                      onClick={() => setViewQuotation(null)}
                      className="btn btn-secondary rounded-pill btn-sm px-3 py-2 w-100 w-sm-auto"
                    >
                      Close
                    </button>
                  </div>
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
