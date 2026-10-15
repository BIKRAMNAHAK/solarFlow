import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPanelsAction } from '../Services/Actions/getApis';
import { createLeadAction } from '../Services/Actions/postApis';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import PriceCalculator from '../Services/helpers/PriceCalculator';
import {
  FaCalculator,
  FaSolarPanel,
  FaBolt,
  FaRupeeSign,
  FaLeaf,
  FaWhatsapp,
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
} from 'react-icons/fa';

function CalculatorPage() {
  const dispatch = useDispatch();
  const { panels, adminProfile, admin } = useSelector((state) => state.states);

  // Input States
  const [calcMode, setCalcMode] = useState('area'); // 'area' or 'bill'
  const [roofArea, setRoofArea] = useState(500); // sq ft
  const [monthlyBill, setMonthlyBill] = useState(4000); // ₹
  const [selectedPanelId, setSelectedPanelId] = useState('');

  // Customer Contact for Inquiry
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const formdata = new FormData();
    dispatch(getPanelsAction(formdata))
      .then((res) => {
        if (res.panels && res.panels.length > 0) {
          setSelectedPanelId(res.panels[0]._id);
        }
      })
      .catch((err) => console.error(err));
  }, [dispatch]);

  // Selected Panel
  const currentPanel = panels.find((p) => p._id === selectedPanelId) || panels[0] || {
    name: 'Standard 540W Mono PERC',
    wattage: 540,
    price: 13500,
    gst: 12,
    areaRequiredSqFt: 22,
  };

  // Calculations
  let estimatedKw = 0;
  let panelCount = 0;

  if (calcMode === 'area') {
    const panelArea = currentPanel.areaRequiredSqFt || 22;
    panelCount = Math.max(1, Math.floor(roofArea / panelArea));
    estimatedKw = Number(((panelCount * (currentPanel.wattage || 540)) / 1000).toFixed(1));
  } else {
    // ₹8 per unit, 1 kW generates approx 120 units per month = ₹960 savings
    estimatedKw = Number((monthlyBill / 960).toFixed(1));
    if (estimatedKw < 1) estimatedKw = 1;
    panelCount = Math.ceil((estimatedKw * 1000) / (currentPanel.wattage || 540));
  }

  const monthlyGenerationUnits = Math.round(estimatedKw * 120);
  const monthlySavings = Math.round(monthlyGenerationUnits * 8.2);
  const annualSavings = monthlySavings * 12;

  // Turnkey Cost Breakdown using PriceCalculator
  const panelPriceCalc = new PriceCalculator(currentPanel.price || 13500, panelCount);
  const totalPanelCostWithGst = Math.round(panelPriceCalc.getFinalTotal(currentPanel.gst || 12));
  
  // Inverter & Structure & BOS estimation
  const inverterAndBosCost = Math.round(estimatedKw * 18000);
  const installationLabor = Math.round(estimatedKw * 5000);
  const estimatedTotalProjectCost = totalPanelCostWithGst + inverterAndBosCost + installationLabor;
  const paybackPeriodYears = (estimatedTotalProjectCost / annualSavings).toFixed(1);

  // Lead / Quote Submission
  const handleGetQuotation = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please enter your Name and Phone Number to receive the quotation');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    const formdata = new FormData();
    formdata.append('customerName', customerName);
    formdata.append('customerPhone', customerPhone);
    formdata.append('city', city);
    formdata.append('inquiryType', 'Quotation');
    formdata.append('roofArea', calcMode === 'area' ? roofArea : Math.round(panelCount * 22));
    formdata.append('calculatedPanels', panelCount);
    formdata.append('estimatedKw', estimatedKw);
    formdata.append('panelId', currentPanel._id || '');
    formdata.append(
      'message',
      `Calculated Solar System: ${estimatedKw} kW using ${panelCount}x ${currentPanel.name}. Estimated monthly savings: ₹${monthlySavings}. Estimated total: ₹${estimatedTotalProjectCost.toLocaleString('en-IN')}`
    );

    dispatch(createLeadAction(formdata))
      .then((res) => {
        setIsSubmitting(false);
        setSubmitMessage('Quotation requested successfully! Opening WhatsApp...');
        if (res.whatsappUrl) {
          window.open(res.whatsappUrl, '_blank');
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        setSubmitMessage('Failed to submit quote request. Please try again.');
        console.error(err);
      });
  };

  const adminPhone = adminProfile?.mobile || admin?.mobile || '9876543210';
  const cleanMobile = adminPhone.replace(/\D/g, '').length === 10 ? `91${adminPhone.replace(/\D/g, '')}` : adminPhone.replace(/\D/g, '');

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Title */}
        <div className="text-center mb-5">
          <span className="badge badge-soft-primary px-3 py-2 rounded-pill mb-2">Smart Engineering Tool</span>
          <h1 className="fw-bold">Rooftop Solar Calculator</h1>
          <p className="text-muted">
            Find out exactly how many solar panels your rooftop needs, how much power you will generate, and your total bill savings.
          </p>
        </div>

        <div className="row g-4">
          {/* Left Column: Input Form & Panel Selector */}
          <div className="col-lg-5">
            <div className="form-card-solar mb-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaCalculator className="text-warning" /> Step 1: Rooftop or Bill Details
              </h5>

              {/* Mode switch */}
              <div className="btn-group w-100 mb-4" role="group">
                <button
                  type="button"
                  className={`btn ${calcMode === 'area' ? 'btn-primary' : 'btn-outline-primary'} fw-semibold`}
                  onClick={() => setCalcMode('area')}
                >
                  By Roof Area (sq.ft)
                </button>
                <button
                  type="button"
                  className={`btn ${calcMode === 'bill' ? 'btn-primary' : 'btn-outline-primary'} fw-semibold`}
                  onClick={() => setCalcMode('bill')}
                >
                  By Electricity Bill (₹)
                </button>
              </div>

              {calcMode === 'area' ? (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-bold mb-0">Rooftop Area Available:</label>
                    <span className="badge bg-primary fs-6">{roofArea} sq.ft</span>
                  </div>
                  <input
                    type="range"
                    className="form-range mb-2"
                    min="100"
                    max="5000"
                    step="50"
                    value={roofArea}
                    onChange={(e) => setRoofArea(Number(e.target.value))}
                  />
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={roofArea}
                      onChange={(e) => setRoofArea(Number(e.target.value))}
                      placeholder="Enter sq.ft"
                    />
                    <span className="input-group-text">Sq. Feet</span>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-bold mb-0">Average Monthly Electricity Bill:</label>
                    <span className="badge bg-success fs-6">₹{monthlyBill} / month</span>
                  </div>
                  <input
                    type="range"
                    className="form-range mb-2"
                    min="500"
                    max="50000"
                    step="500"
                    value={monthlyBill}
                    onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  />
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(Number(e.target.value))}
                      placeholder="Enter bill in ₹"
                    />
                    <span className="input-group-text">per month</span>
                  </div>
                </div>
              )}

              {/* Panel Choice */}
              <div className="mb-3">
                <label className="form-label fw-bold">Select Solar Panel Model:</label>
                <select
                  className="form-select"
                  value={selectedPanelId}
                  onChange={(e) => setSelectedPanelId(e.target.value)}
                >
                  {panels.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} - {p.wattage}W ({p.brand})
                    </option>
                  ))}
                </select>
                <small className="text-muted d-block mt-1">
                  Each panel requires approx ~{currentPanel.areaRequiredSqFt || 22} sq.ft surface area.
                </small>
              </div>
            </div>

            {/* Step 2: Request Formal Quotation Form */}
            <div className="form-card-vibrant">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaWhatsapp className="text-success" /> Step 2: Get WhatsApp Quotation
              </h5>
              <p className="text-muted small">
                Submit below to receive this quotation directly on WhatsApp, and schedule a free roof inspection with our technician.
              </p>

              {submitMessage && (
                <div className={`alert ${submitMessage.includes('successfully') ? 'alert-success' : 'alert-danger'} py-2 small`}>
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleGetQuotation}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">City / District</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Berhampur, Ganjam"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-solar-gradient w-100 fw-bold py-2 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <FaWhatsapp size={18} />
                  {isSubmitting ? 'Sending Request...' : 'Get Quotation on WhatsApp'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Detailed Calculation Dashboard */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white mb-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <div>
                  <h4 className="fw-bold mb-1 text-dark">Solar System Estimation</h4>
                  <span className="text-muted small">Custom engineered for your rooftop dimensions</span>
                </div>
                <span className="badge bg-warning text-dark px-3 py-2 fs-6 rounded-pill">
                  {estimatedKw} kW System
                </span>
              </div>

              {/* 4 Colorful Highlights Cards */}
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="color-card-blue p-3 h-100 card-hover-lift">
                    <div className="d-flex align-items-center gap-3">
                      <div className="icon-box-blue">
                        <FaSolarPanel size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>Solar Panels Required</small>
                        <h4 className="fw-extrabold mb-0 gradient-text-blue">{panelCount} Panels</h4>
                        <small className="text-secondary" style={{ fontSize: '11px' }}>
                          @ {currentPanel.wattage}W each
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="color-card-emerald p-3 h-100 card-hover-lift">
                    <div className="d-flex align-items-center gap-3">
                      <div className="icon-box-emerald">
                        <FaBolt size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>Monthly Generation</small>
                        <h4 className="fw-extrabold mb-0 gradient-text-emerald">~{monthlyGenerationUnits} Units</h4>
                        <small className="text-secondary" style={{ fontSize: '11px' }}>
                          Approx {Math.round(monthlyGenerationUnits * 12).toLocaleString()} Units/yr
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="color-card-amber p-3 h-100 card-hover-lift">
                    <div className="d-flex align-items-center gap-3">
                      <div className="icon-box-amber">
                        <FaRupeeSign size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>Estimated Monthly Savings</small>
                        <h4 className="fw-extrabold mb-0 gradient-text-solar">₹{monthlySavings.toLocaleString('en-IN')}</h4>
                        <small className="text-success fw-bold" style={{ fontSize: '11px' }}>
                          ₹{annualSavings.toLocaleString('en-IN')} / year saved
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="color-card-purple p-3 h-100 card-hover-lift">
                    <div className="d-flex align-items-center gap-3">
                      <div className="icon-box-purple">
                        <FaLeaf size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>Environmental Impact</small>
                        <h4 className="fw-extrabold mb-0 gradient-text-sunset">~{Math.round(estimatedKw * 14)} Trees</h4>
                        <small className="text-secondary" style={{ fontSize: '11px' }}>
                          Carbon offset equivalent
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost & Investment Estimation Breakdown */}
              <div className="bg-light p-4 rounded-4 border mb-4">
                <h5 className="fw-bold mb-3">Estimated Investment & Quotation Breakdown</h5>
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0">
                    <tbody>
                      <tr className="border-bottom">
                        <td>
                          <strong>{panelCount}x {currentPanel.name}</strong>
                          <small className="text-muted d-block">Base Price ₹{currentPanel.price} + {currentPanel.gst}% GST</small>
                        </td>
                        <td className="text-end fw-bold">₹{totalPanelCostWithGst.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="border-bottom">
                        <td>
                          <strong>Inverter, Elevated Structure & Electrical BOS</strong>
                          <small className="text-muted d-block">GI Structure, DC Cables, AC/DC DB boxes, Earthing kit</small>
                        </td>
                        <td className="text-end fw-bold">₹{inverterAndBosCost.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="border-bottom">
                        <td>
                          <strong>Civil Engineering & Installation Services</strong>
                          <small className="text-muted d-block">Site survey, foundation, civil work, net metering processing</small>
                        </td>
                        <td className="text-end fw-bold">₹{installationLabor.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="table-success rounded">
                        <td className="py-3">
                          <h6 className="fw-bold mb-0 text-success">Total Estimated Turnkey Cost:</h6>
                          <small className="text-muted">Includes hardware, GST, delivery, and full installation</small>
                        </td>
                        <td className="py-3 text-end">
                          <h4 className="fw-bold text-success mb-0">
                            ₹{estimatedTotalProjectCost.toLocaleString('en-IN')}
                          </h4>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 p-3 bg-white rounded-3 border d-flex justify-content-between align-items-center">
                  <div>
                    <span className="small text-muted d-block">Estimated Payback Period:</span>
                    <strong className="text-dark fs-5">{paybackPeriodYears} Years</strong>
                  </div>
                  <div className="text-end">
                    <span className="small text-muted d-block">Lifetime Free Power (25 Yrs):</span>
                    <strong className="text-success fs-5">
                      ₹{Math.round(annualSavings * 25).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 rounded-3 bg-dark text-white gap-3">
                <div>
                  <h6 className="fw-bold mb-1 text-warning">Need Site Measurement by an Engineer?</h6>
                  <small className="text-light opacity-80">Our technician will visit your location to verify shade & roof slope.</small>
                </div>
                <a
                  href={`https://wa.me/${cleanMobile}?text=${encodeURIComponent(`Hello SolarFlow, I calculated a ${estimatedKw}kW solar system for ${roofArea} sq.ft roof on your calculator. I would like to schedule a site visit.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-warning fw-bold text-dark rounded-pill px-4"
                >
                  Book Free Site Visit
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${cleanMobile}?text=${encodeURIComponent('Hello SolarFlow, I am interested in solar panels and installation.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="Chat on WhatsApp with Admin"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}

export default CalculatorPage;
