import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSolarPanel, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaShieldAlt } from 'react-icons/fa';

function Footer() {
  const { adminProfile, admin } = useSelector((state) => state.states);
  const companyName = adminProfile?.companyName || admin?.companyName || 'SolarFlow Energy Solutions';
  const ownerName = adminProfile?.ownerName || admin?.ownerName || 'Bikram Nahak';
  const mobile = adminProfile?.mobile || admin?.mobile || '9876543210';
  const email = adminProfile?.email || admin?.email || 'admin@solarflow.com';

  return (
    <footer className="bg-dark text-white pt-5 pb-3 border-top border-secondary mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Company info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-warning text-dark rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <FaSolarPanel size={20} />
              </div>
              <h5 className="fw-bold mb-0 text-white">{companyName}</h5>
            </div>
            <p className="text-secondary small">
              Complete Solar Rooftop, Ground Mounted & Commercial Solar Energy Solutions.
              Turnkey engineering, premium Tier-1 solar panels, quick installation, and lifetime service support.
            </p>
            <div className="d-flex align-items-center gap-2 text-warning small">
              <FaShieldAlt /> <span>Owned & Managed by: <strong>{ownerName}</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-bold text-warning mb-3">Quick Links</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/" className="text-secondary hover-text-white">Home</Link></li>
              <li><Link to="/panels" className="text-secondary hover-text-white">Solar Panels</Link></li>
              <li><Link to="/calculator" className="text-secondary hover-text-white">Solar Calculator</Link></li>
              <li><Link to="/services" className="text-secondary hover-text-white">Installation & Services</Link></li>
              <li><Link to="/inquire" className="text-secondary hover-text-white">Inquire / Quote</Link></li>
              <li><Link to="/admin/login" className="text-warning">Admin Login</Link></li>
            </ul>
          </div>

          {/* Solar Services */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-warning mb-3">Our Services</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li>Residential Rooftop Installation</li>
              <li>Commercial & Industrial Solar</li>
              <li>Agricultural Solar Water Pumps</li>
              <li>AMC & Solar Inverter Repair</li>
              <li>Panel Cleaning & Preventive Care</li>
              <li>Government Subsidy Assistance</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-warning mb-3">Contact Us</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-3">
              <li className="d-flex align-items-center gap-2">
                <FaPhoneAlt className="text-warning" />
                <a href={`tel:${mobile}`} className="text-white fw-semibold">{mobile}</a>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaWhatsapp className="text-success" />
                <span>WhatsApp: +91 {mobile}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope className="text-info" />
                <span>{email}</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <FaMapMarkerAlt className="text-danger mt-1" />
                <span>Head Office & Solar Installation Center</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
          <p className="mb-0">© {new Date().getFullYear()} {companyName}. All Rights Reserved.</p>
          <p className="mb-0">Powered by SolarFlow Digital Platform</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
