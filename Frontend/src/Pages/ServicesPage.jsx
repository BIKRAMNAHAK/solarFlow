import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLeadAction } from '../Services/Actions/postApis';
import {
  FaTools,
  FaSolarPanel,
  FaShieldAlt,
  FaCheckCircle,
  FaWhatsapp,
  FaPhoneAlt,
  FaCalendarCheck,
  FaHardHat,
  FaWrench,
} from 'react-icons/fa';

function ServicesPage() {
  const dispatch = useDispatch();
  const { adminProfile, admin } = useSelector((state) => state.states);

  const [serviceForm, setServiceForm] = useState({
    customerName: '',
    customerPhone: '',
    city: '',
    address: '',
    inquiryType: 'Installation',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleServiceSubmit = (e) => {
    e.preventDefault();
    if (!serviceForm.customerName || !serviceForm.customerPhone) {
      alert('Please fill Name and Phone');
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg('');

    const formdata = new FormData();
    formdata.append('customerName', serviceForm.customerName);
    formdata.append('customerPhone', serviceForm.customerPhone);
    formdata.append('city', serviceForm.city);
    formdata.append('address', serviceForm.address);
    formdata.append('inquiryType', serviceForm.inquiryType);
    formdata.append('message', serviceForm.message);

    dispatch(createLeadAction(formdata))
      .then((res) => {
        setIsSubmitting(false);
        setSuccessMsg('Service request logged! Opening WhatsApp with admin...');
        setServiceForm({
          customerName: '',
          customerPhone: '',
          city: '',
          address: '',
          inquiryType: 'Installation',
          message: '',
        });
        if (res.whatsappUrl) {
          window.open(res.whatsappUrl, '_blank');
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        setSuccessMsg('Failed to log service request. Please try again.');
        console.error(err);
      });
  };

  const adminPhone = adminProfile?.mobile || admin?.mobile || '9876543210';
  const cleanMobile = adminPhone.replace(/\D/g, '').length === 10 ? `91${adminPhone.replace(/\D/g, '')}` : adminPhone.replace(/\D/g, '');

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge badge-soft-success px-3 py-2 rounded-pill mb-2">Solar Engineering Solutions</span>
          <h1 className="fw-bold">Installation, Services & Panel Supply</h1>
          <p className="text-muted">
            End-to-end solar solutions managed digitally: certified technicians dispatched directly to your location.
          </p>
        </div>

        {/* 3 Pillars - Colorful Modern Cards */}
        <div className="row g-4 mb-5">
          {/* 1. Installation */}
          <div className="col-lg-4 col-md-6">
            <div className="color-card-blue h-100 p-4 card-hover-lift d-flex flex-column">
              <div className="icon-box-blue mb-3">
                <FaHardHat size={22} />
              </div>
              <h4 className="fw-bold mb-2 gradient-text-blue" style={{ fontSize: '1.2rem' }}>
                Solar Rooftop Installation
              </h4>
              <p className="text-muted small">
                High-standard turnkey solar plant engineering designed to withstand 150 km/h wind speeds.
              </p>
              <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-4">
                <li><FaCheckCircle className="text-success me-2" /> Structural Design & Wind-Load Certification</li>
                <li><FaCheckCircle className="text-success me-2" /> Heavy GI Rust-Proof Elevated Structures</li>
                <li><FaCheckCircle className="text-success me-2" /> Tier-1 Inverter & Double Earthing System</li>
                <li><FaCheckCircle className="text-success me-2" /> DISCOM Net Metering & Subsidy Processing</li>
              </ul>
              <button
                className="btn btn-outline-primary btn-sm rounded-pill mt-auto fw-semibold"
                onClick={() => setServiceForm((prev) => ({ ...prev, inquiryType: 'Installation' }))}
              >
                Request Installation Visit →
              </button>
            </div>
          </div>

          {/* 2. Service & Maintenance */}
          <div className="col-lg-4 col-md-6">
            <div className="color-card-emerald h-100 p-4 card-hover-lift d-flex flex-column">
              <div className="icon-box-emerald mb-3">
                <FaWrench size={22} />
              </div>
              <h4 className="fw-bold mb-2 gradient-text-emerald" style={{ fontSize: '1.2rem' }}>
                Service, Repair & AMC
              </h4>
              <p className="text-muted small">
                Certified technicians dispatched digitally with task assignments to ensure minimal solar downtime.
              </p>
              <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-4">
                <li><FaCheckCircle className="text-success me-2" /> Solar Inverter Error Code & Fault Clearance</li>
                <li><FaCheckCircle className="text-success me-2" /> High-Pressure De-ionized Panel Cleaning</li>
                <li><FaCheckCircle className="text-success me-2" /> Thermal Drone Hotspot & Wiring Inspection</li>
                <li><FaCheckCircle className="text-success me-2" /> Annual Maintenance Contract (AMC)</li>
              </ul>
              <button
                className="btn btn-outline-success btn-sm rounded-pill mt-auto fw-semibold"
                onClick={() => setServiceForm((prev) => ({ ...prev, inquiryType: 'Service' }))}
              >
                Book Service Technician →
              </button>
            </div>
          </div>

          {/* 3. Panel Sales */}
          <div className="col-lg-4 col-md-6">
            <div className="color-card-amber h-100 p-4 card-hover-lift d-flex flex-column">
              <div className="icon-box-amber mb-3">
                <FaSolarPanel size={22} />
              </div>
              <h4 className="fw-bold mb-2 gradient-text-solar" style={{ fontSize: '1.2rem' }}>
                Solar Panel Sales & Supply
              </h4>
              <p className="text-muted small">
                Direct wholesale and retail distribution of top Tier-1 brand panels with genuine GST tax invoices.
              </p>
              <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-4">
                <li><FaCheckCircle className="text-success me-2" /> Tata Power, Waaree, Loom Solar, Adani</li>
                <li><FaCheckCircle className="text-success me-2" /> Mono PERC, Bifacial & TopCon Panels</li>
                <li><FaCheckCircle className="text-success me-2" /> Bulk project dispatch with safe logistics</li>
                <li><FaCheckCircle className="text-success me-2" /> 25 to 30 Years Manufacturer Warranties</li>
              </ul>
              <button
                className="btn btn-outline-warning text-dark btn-sm rounded-pill mt-auto fw-semibold"
                onClick={() => setServiceForm((prev) => ({ ...prev, inquiryType: 'Sell' }))}
              >
                Inquire Wholesale Rates →
              </button>
            </div>
          </div>
        </div>

        {/* Dispatch & Booking Form */}
        <div className="form-card-vibrant p-4 p-md-5 mb-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <span className="badge badge-soft-warning px-3 py-1 rounded-pill mb-2" style={{ fontSize: '11px' }}>
                DIGITAL FIELD DISPATCH
              </span>
              <h3 className="fw-bold mb-2">Schedule a Certified Field Technician</h3>
              <p className="text-muted mb-4 small">
                Our admin assigns nearby certified technicians digitally with scheduled time and location tracking.
                Submit your site details to confirm an on-site visit or consultation.
              </p>
              <div className="bg-light p-3 rounded-3 border mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="icon-box-blue">
                    <FaCalendarCheck size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.92rem' }}>Rapid 24-48 Hour Site Visit</h6>
                    <small className="text-muted">Direct contact via technician phone call & WhatsApp updates</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              {successMsg && (
                <div className={`alert ${successMsg.includes('logged') ? 'alert-success' : 'alert-danger'} py-2 small`}>
                  {successMsg}
                </div>
              )}
              <form onSubmit={handleServiceSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Customer Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rahul Mishra"
                      value={serviceForm.customerName}
                      onChange={(e) => setServiceForm({ ...serviceForm, customerName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      value={serviceForm.customerPhone}
                      onChange={(e) => setServiceForm({ ...serviceForm, customerPhone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Service Required</label>
                    <select
                      className="form-select"
                      value={serviceForm.inquiryType}
                      onChange={(e) => setServiceForm({ ...serviceForm, inquiryType: e.target.value })}
                    >
                      <option value="Installation">Rooftop Solar Installation</option>
                      <option value="Service">Repair / Panel Cleaning / Maintenance</option>
                      <option value="Sell">Solar Panel Purchase</option>
                      <option value="General Inquiry">Technical Site Survey</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">City / Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Bhubaneswar"
                      value={serviceForm.city}
                      onChange={(e) => setServiceForm({ ...serviceForm, city: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">Site Address / Remarks</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Describe your requirement or roof type (e.g. RCC flat roof 800 sq.ft)..."
                      value={serviceForm.message}
                      onChange={(e) => setServiceForm({ ...serviceForm, message: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-emerald-gradient w-100 fw-bold py-2 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    >
                      <FaWhatsapp size={18} />
                      {isSubmitting ? 'Submitting Details...' : 'Confirm & Chat with Engineer on WhatsApp'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${cleanMobile}?text=${encodeURIComponent('Hello SolarFlow, I need solar installation/service assistance.')}`}
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

export default ServicesPage;
