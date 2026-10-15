import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPanelsAction } from '../Services/Actions/getApis';
import { createLeadAction } from '../Services/Actions/postApis';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import PriceCalculator from '../Services/helpers/PriceCalculator';
import {
  FaSolarPanel,
  FaCalculator,
  FaWhatsapp,
  FaCheckCircle,
  FaShieldAlt,
  FaBolt,
  FaArrowRight,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTools,
} from 'react-icons/fa';

function HomePage() {
  const dispatch = useDispatch();
  const { panels, adminProfile, admin } = useSelector((state) => state.states);

  // Quick Calculator State
  const [roofArea, setRoofArea] = useState(400);
  const [calcResult, setCalcResult] = useState({
    panels: 4,
    kw: 2.1,
    monthlyUnits: 250,
    monthlySavings: 2000,
  });

  // Inquiry Form State
  const [inquiryData, setInquiryData] = useState({
    customerName: '',
    customerPhone: '',
    city: '',
    inquiryType: 'Installation',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  useEffect(() => {
    const formdata = new FormData();
    dispatch(getPanelsAction(formdata)).catch((err) => console.error(err));
  }, [dispatch]);

  // Recalculate when roofArea changes
  useEffect(() => {
    const area = Number(roofArea) || 0;
    const panelCount = Math.max(1, Math.floor(area / 22));
    const kw = Number(((panelCount * 540) / 1000).toFixed(1));
    const monthlyUnits = Math.round(kw * 120);
    const monthlySavings = Math.round(monthlyUnits * 8);
    setCalcResult({
      panels: panelCount,
      kw,
      monthlyUnits,
      monthlySavings,
    });
  }, [roofArea]);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryData.customerName || !inquiryData.customerPhone) {
      alert('Please fill in your Name and Phone Number');
      return;
    }

    setIsSubmitting(true);
    setSubmitMsg('');

    const formdata = new FormData();
    formdata.append('customerName', inquiryData.customerName);
    formdata.append('customerPhone', inquiryData.customerPhone);
    formdata.append('city', inquiryData.city);
    formdata.append('inquiryType', inquiryData.inquiryType);
    formdata.append('roofArea', roofArea);
    formdata.append('calculatedPanels', calcResult.panels);
    formdata.append('estimatedKw', calcResult.kw);
    formdata.append('message', inquiryData.message || `Interested in ${calcResult.kw}kW Solar system`);

    dispatch(createLeadAction(formdata))
      .then((res) => {
        setIsSubmitting(false);
        setSubmitMsg('Inquiry submitted! Opening WhatsApp...');
        setInquiryData({
          customerName: '',
          customerPhone: '',
          city: '',
          inquiryType: 'Installation',
          message: '',
        });
        if (res.whatsappUrl) {
          window.open(res.whatsappUrl, '_blank');
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        setSubmitMsg('Could not submit inquiry. Please try again.');
        console.error(err);
      });
  };

  const adminPhone = adminProfile?.mobile || admin?.mobile || '7803816900';
  const cleanMobile = adminPhone.replace(/\D/g, '').length === 10 ? `91${adminPhone.replace(/\D/g, '')}` : adminPhone.replace(/\D/g, '');

  return (
    <div>
      {/* ======================================================== */}
      {/* 1. TOP HERO BANNER WITH PROMINENT BOOTSTRAP ACCORDION   */}
      {/* ======================================================== */}
      <section className="py-4 py-md-5 text-white position-relative" style={{ background: 'radial-gradient(ellipse at 20% 20%, #1e293b 0%, #0b1120 70%, #030712 100%)' }}>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row g-4 align-items-center">
            {/* Left Column: Heading + Interactive Accordion Banner */}
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 bg-warning bg-opacity-10 border border-warning border-opacity-30 px-3 py-1 rounded-pill mb-3 anim-pulse-amber">
                <FaBolt className="text-warning flex-shrink-0" size={13} />
                <span className="text-warning fw-bold" style={{ fontSize: '0.82rem' }}>
                  PM SURYA GHAR YOJANA • DIRECT ₹78,000 SUBSIDY
                </span>
              </div>

              {/* Moderate/Medium Heading with Vibrant Gradient */}
              <h1 className="fw-extrabold text-white mb-2" style={{ fontSize: '1.75rem', lineHeight: '1.3' }}>
                <span className="gradient-text-solar">Clean Solar Power</span> For Homes & Commercial Roofs
              </h1>
              <p className="text-light opacity-80 mb-3" style={{ fontSize: '0.92rem' }}>
                End-to-end solar engineering: fast rooftop survey, cyclone-grade mounting, Tier-1 panels, DISCOM net-metering, and instant WhatsApp quotes.
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                <Link to="/calculator" className="btn btn-solar-gradient btn-sm fw-bold px-3 py-2 rounded-pill d-flex align-items-center gap-2">
                  <FaCalculator className="flex-shrink-0" /> Calculate Solar Need
                </Link>
                <Link to="/panels" className="btn btn-outline-light btn-sm fw-semibold px-3 py-2 rounded-pill d-flex align-items-center gap-2">
                  <FaSolarPanel className="flex-shrink-0 text-warning" /> Explore Panels
                </Link>
                <a
                  href={`https://wa.me/${cleanMobile}?text=${encodeURIComponent('Hello SolarFlow, I need a consultation for solar installation.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-emerald-gradient btn-sm fw-semibold px-3 py-2 rounded-pill d-flex align-items-center gap-2 anim-pulse-green"
                >
                  <FaWhatsapp className="flex-shrink-0" /> Chat on WhatsApp
                </a>
              </div>

              {/* ======================================================== */}
              {/* BOOTSTRAP ACCORDION BANNER: STEP-BY-STEP SOLAR ROADMAP   */}
              {/* ======================================================== */}
              <div className="accordion-banner shadow-lg">
                <div className="p-3 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center bg-dark bg-opacity-60">
                  <span className="fw-bold d-flex align-items-center gap-2 text-warning" style={{ fontSize: '0.9rem' }}>
                    <FaTools className="text-warning flex-shrink-0" />
                    <span>SOLAR ROADMAP & GOVERNMENT SUBSIDY GUIDE</span>
                  </span>
                  <span className="badge bg-warning text-dark fw-bold rounded-pill" style={{ fontSize: '10px' }}>
                    3-Step Process
                  </span>
                </div>

                <div className="accordion accordion-flush" id="heroSolarAccordion">
                  {/* Step 1 */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button py-2 collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                        style={{ fontSize: '0.88rem' }}
                      >
                        <span className="badge bg-primary rounded-pill me-2 px-2 py-1">Step 1</span>
                        <strong className="text-white">Free Rooftop Sizing & Shadow Trajectory</strong>
                      </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#heroSolarAccordion">
                      <div className="accordion-body text-light opacity-80 py-2" style={{ fontSize: '0.84rem' }}>
                        Enter your rooftop area in sq.ft into our calculator. Our engineering algorithm calculates the exact number of panels needed (each panel consumes ~22 sq.ft). Our certified field engineer confirms orientation and roof load capacity.
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button py-2 collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                        style={{ fontSize: '0.88rem' }}
                      >
                        <span className="badge bg-warning text-dark rounded-pill me-2 px-2 py-1">Step 2</span>
                        <strong className="text-white">Tier-1 Hardware & Cyclone-Proof GI Structure</strong>
                      </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#heroSolarAccordion">
                      <div className="accordion-body text-light opacity-80 py-2" style={{ fontSize: '0.84rem' }}>
                        Top brands (Tata, Loom Solar, Waaree, Adani) with 25-30 years performance warranty. Heavy hot-dip galvanized iron elevated structures tested for up to 150 km/h wind speeds.
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button py-2 collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                        style={{ fontSize: '0.88rem' }}
                      >
                        <span className="badge bg-success rounded-pill me-2 px-2 py-1">Step 3</span>
                        <strong className="text-white">DISCOM Net-Metering & PM Surya Ghar Subsidy</strong>
                      </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#heroSolarAccordion">
                      <div className="accordion-body text-light opacity-80 py-2" style={{ fontSize: '0.84rem' }}>
                        Complete liaison with your local electricity board for bi-directional net-meter installation. Up to ₹78,000 central subsidy directly transferred to your bank account via DBT.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Rooftop Calculator Card */}
            <div className="col-lg-5">
              <div className="color-card-amber p-3 p-md-4 shadow-lg text-dark bg-white">
                <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <div className="icon-box-amber">
                      <FaCalculator size={18} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.98rem' }}>
                        Rooftop Solar Sizer
                      </h6>
                      <small className="text-muted" style={{ fontSize: '11px' }}>Quick generation & savings calculator</small>
                    </div>
                  </div>
                  <span className="badge bg-warning text-dark fw-bold rounded-pill" style={{ fontSize: '10px' }}>
                    Live Engine
                  </span>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-bold small text-muted mb-0">Rooftop Area Available:</label>
                    <strong className="text-primary fs-6">{roofArea} sq.ft</strong>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="100"
                    max="3000"
                    step="50"
                    value={roofArea}
                    onChange={(e) => setRoofArea(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between text-muted" style={{ fontSize: '11px' }}>
                    <span>100 sq.ft</span>
                    <span>1,500 sq.ft</span>
                    <span>3,000+ sq.ft</span>
                  </div>
                </div>

                {/* Calculation Result Grid */}
                <div className="bg-light p-3 rounded-3 mb-3 border">
                  <div className="row g-2 text-center">
                    <div className="col-6">
                      <div className="p-2 bg-white rounded-3 border-0 shadow-sm">
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>System Size</small>
                        <strong className="gradient-text-blue fs-6">{calcResult.kw} kW</strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-white rounded-3 border-0 shadow-sm">
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>Modules Required</small>
                        <strong className="gradient-text-solar fs-6">{calcResult.panels} Panels</strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-white rounded-3 border-0 shadow-sm">
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>Monthly Units</small>
                        <strong className="text-success small fw-bold">~{calcResult.monthlyUnits} kWh</strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-white rounded-3 border-0 shadow-sm">
                        <small className="text-muted d-block" style={{ fontSize: '11px' }}>Estimated Savings</small>
                        <strong className="text-success small fw-bold">₹{calcResult.monthlySavings}/mo</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  to="/calculator"
                  className="btn btn-outline-primary w-100 fw-bold py-2 rounded-pill d-flex align-items-center justify-content-center gap-2 mb-2"
                  style={{ fontSize: '0.88rem' }}
                >
                  Open Full Detailed Calculator <FaArrowRight size={12} />
                </Link>

                <a
                  href={`https://wa.me/${cleanMobile}?text=${encodeURIComponent(`Hello SolarFlow, I checked my roof area ${roofArea} sq.ft on your website. It estimated ${calcResult.kw}kW (${calcResult.panels} panels). Please send me a quote.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-solar-gradient w-100 fw-bold py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: '0.88rem' }}
                >
                  <FaWhatsapp size={16} /> Get Quotation on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern 4-Item Metric / Trust Strip */}
      <section className="py-3 bg-white border-bottom shadow-sm">
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-6 col-md-3">
              <div className="p-2 d-flex align-items-center justify-content-center gap-2">
                <div className="icon-box-blue">
                  <FaTools size={18} />
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0 gradient-text-blue" style={{ fontSize: '1.05rem' }}>500+ Roofs</h6>
                  <small className="text-muted" style={{ fontSize: '11px' }}>EPC Installations</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-2 d-flex align-items-center justify-content-center gap-2">
                <div className="icon-box-emerald">
                  <FaBolt size={18} />
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0 gradient-text-emerald" style={{ fontSize: '1.05rem' }}>₹78,000</h6>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Govt Subsidy DBT</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-2 d-flex align-items-center justify-content-center gap-2">
                <div className="icon-box-amber">
                  <FaShieldAlt size={18} />
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0 gradient-text-solar" style={{ fontSize: '1.05rem' }}>25 Years</h6>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Module Warranty</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-2 d-flex align-items-center justify-content-center gap-2">
                <div className="icon-box-purple">
                  <FaCheckCircle size={18} />
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0 gradient-text-sunset" style={{ fontSize: '1.05rem' }}>100% DISCOM</h6>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Net-Metering Approval</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Services: Installation, Service, Sell (Colorful Cards) */}
      <section className="py-5 bg-light border-bottom">
        <div className="container">
          <div className="text-center mb-4">
            <span className="badge badge-soft-primary px-3 py-1 rounded-pill mb-1" style={{ fontSize: '11px' }}>
              OUR THREE PILLARS
            </span>
            <h3 className="fw-bold mb-1" style={{ fontSize: '1.45rem' }}>Complete Solar EPC Services</h3>
            <p className="text-muted small">Turnkey residential, commercial, and agricultural power solutions.</p>
          </div>

          <div className="row g-4">
            {/* 1. Installation - Blue Card */}
            <div className="col-md-4">
              <div className="color-card-blue h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="icon-box-blue">
                    <FaTools size={20} />
                  </div>
                  <span className="badge badge-soft-primary rounded-pill px-2 py-1" style={{ fontSize: '10px' }}>
                    Turnkey EPC
                  </span>
                </div>
                <h5 className="fw-bold mb-2 gradient-text-blue" style={{ fontSize: '1.15rem' }}>
                  1. Rooftop Installation
                </h5>
                <p className="text-muted small mb-3">
                  Complete on-site survey, high-load elevated structure mounting, inverter setup, net-metering liaison,
                  and government subsidy application processing.
                </p>
                <Link to="/services" className="btn btn-outline-primary btn-sm rounded-pill mt-auto fw-semibold">
                  Learn About Installation →
                </Link>
              </div>
            </div>

            {/* 2. Service & Maintenance - Emerald Card */}
            <div className="col-md-4">
              <div className="color-card-emerald h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="icon-box-emerald">
                    <FaShieldAlt size={20} />
                  </div>
                  <span className="badge badge-soft-success rounded-pill px-2 py-1" style={{ fontSize: '10px' }}>
                    AMC & Repairs
                  </span>
                </div>
                <h5 className="fw-bold mb-2 gradient-text-emerald" style={{ fontSize: '1.15rem' }}>
                  2. Service & Maintenance
                </h5>
                <p className="text-muted small mb-3">
                  Keep your solar generation at peak efficiency. Certified field engineers handle rapid fault diagnosis,
                  inverter troubleshooting, panel cleaning, and AMC.
                </p>
                <Link to="/services" className="btn btn-outline-success btn-sm rounded-pill mt-auto fw-semibold">
                  Explore Solar Services →
                </Link>
              </div>
            </div>

            {/* 3. Sell Panels - Amber Card */}
            <div className="col-md-4">
              <div className="color-card-amber h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="icon-box-amber">
                    <FaSolarPanel size={20} />
                  </div>
                  <span className="badge badge-soft-warning rounded-pill px-2 py-1" style={{ fontSize: '10px' }}>
                    Tier-1 Hardware
                  </span>
                </div>
                <h5 className="fw-bold mb-2 gradient-text-solar" style={{ fontSize: '1.15rem' }}>
                  3. Solar Panel Sales
                </h5>
                <p className="text-muted small mb-3">
                  Authorized supplier for top Tier-1 brands like Tata Power, Loom Solar, Waaree, and Adani.
                  Transparent GST billing, manufacturer warranties, and wholesale rates.
                </p>
                <Link to="/panels" className="btn btn-outline-warning text-dark btn-sm rounded-pill mt-auto fw-semibold">
                  Browse Panel Catalog →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Panels Showcase (Colorful & Animated) */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
              <span className="badge badge-soft-warning px-3 py-1 rounded-pill mb-1" style={{ fontSize: '11px' }}>
                HARDWARE CATALOG
              </span>
              <h3 className="fw-bold mb-0" style={{ fontSize: '1.45rem' }}>
                Featured <span className="gradient-text-solar">Solar Panels & Modules</span>
              </h3>
            </div>
            <Link to="/panels" className="btn btn-outline-dark rounded-pill fw-semibold btn-sm mt-2 mt-md-0">
              View All Panels ({panels.length}) →
            </Link>
          </div>

          <div className="row g-4">
            {panels.slice(0, 4).map((panel) => {
              const calc = new PriceCalculator(panel.price, 1);
              const bill = calc.getBill(panel.gst || 12, panel.discount || 0);
              const photoUrl = panel.image ? `${IMAGE_BASE_URL}${panel.image}` : null;

              return (
                <div className="col-lg-3 col-sm-6" key={panel._id}>
                  <div className="card h-100 card-hover-lift border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                    <div
                      className="bg-secondary bg-opacity-10 position-relative d-flex align-items-center justify-content-center"
                      style={{ height: '170px' }}
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={panel.name}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <FaSolarPanel size={50} className="text-primary opacity-50" />
                      )}
                      <span className="position-absolute top-0 start-0 m-2 badge bg-dark" style={{ fontSize: '10px' }}>
                        {panel.brand}
                      </span>
                      <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark fw-bold" style={{ fontSize: '10px' }}>
                        {panel.wattage}W
                      </span>
                    </div>

                    <div className="card-body p-3 d-flex flex-column">
                      <div className="mb-1">
                        <span className="badge badge-soft-primary" style={{ fontSize: '10px' }}>{panel.panelType}</span>
                      </div>
                      <h6 className="fw-bold mb-1 text-truncate" title={panel.name} style={{ fontSize: '0.92rem' }}>
                        {panel.name}
                      </h6>
                      <p className="text-muted small mb-2 text-truncate" style={{ fontSize: '12px' }}>
                        {panel.description || `${panel.wattage}W high efficiency module`}
                      </p>

                      <div className="mt-auto border-top pt-2">
                        <div className="d-flex justify-content-between align-items-baseline mb-2">
                          <span className="text-muted" style={{ fontSize: '11px' }}>Incl. {panel.gst}% GST</span>
                          <span className="gradient-text-emerald fw-bold fs-6">
                            ₹{Math.round(bill.total).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <a
                          href={`https://wa.me/${cleanMobile}?text=${encodeURIComponent(`Hello SolarFlow, I am interested in ${panel.name} (${panel.wattage}W). Please let me know price and delivery.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-success btn-sm w-100 rounded-pill d-flex align-items-center justify-content-center gap-1 fw-semibold"
                          style={{ fontSize: '0.84rem' }}
                        >
                          <FaWhatsapp size={14} className="flex-shrink-0" /> Inquire on WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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

export default HomePage;
