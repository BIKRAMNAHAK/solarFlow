import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAdminProfileAction } from '../Services/Actions/getApis';
import { adminLogoutAction } from '../Services/Actions/postApis';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import {
  FaSolarPanel,
  FaCalculator,
  FaTools,
  FaPhoneAlt,
  FaUserShield,
  FaWhatsapp,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { adminProfile, isAuthenticated, admin } = useSelector((state) => state.states);

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    const formdata = new FormData();
    dispatch(getAdminProfileAction(formdata)).catch(() => {});
  }, [dispatch]);

  // Close offcanvas when route changes
  useEffect(() => {
    setShowOffcanvas(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(adminLogoutAction()).then(() => {
      navigate('/admin/login');
    });
  };

  const companyName = adminProfile?.companyName || admin?.companyName || 'SolarFlow';
  const logoUrl = adminProfile?.logo ? `${IMAGE_BASE_URL}${adminProfile.logo}` : null;
  const adminPhone = adminProfile?.mobile || admin?.mobile || '7803816900';
  const cleanMobile = adminPhone.replace(/\D/g, '').length === 10 ? `91${adminPhone.replace(/\D/g, '')}` : adminPhone.replace(/\D/g, '');

  const navLinks = [
    { name: 'Home', path: '/', icon: null },
    { name: 'Solar Panels', path: '/panels', icon: <FaSolarPanel className="text-warning flex-shrink-0" /> },
    { name: 'Solar Calculator', path: '/calculator', icon: <FaCalculator className="text-info flex-shrink-0" /> },
    { name: 'Services & Installation', path: '/services', icon: <FaTools className="text-success flex-shrink-0" /> },
    { name: 'Inquire', path: '/inquire', icon: <FaPhoneAlt className="text-warning flex-shrink-0" /> },
  ];

  return (
    <>
      <nav className="navbar navbar-dark bg-dark sticky-top shadow-sm py-2 px-3 border-bottom border-secondary border-opacity-25" style={{ background: '#0b1120' }}>
        <div className="container d-flex justify-content-between align-items-center">
          {/* Brand Logo & Name */}
          <Link className="navbar-brand d-flex align-items-center gap-2 m-0" to="/">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                className="rounded-3 border border-warning flex-shrink-0"
              />
            ) : (
              <div
                className="bg-warning text-dark rounded-3 d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                style={{ width: '36px', height: '36px' }}
              >
                <FaSolarPanel size={20} />
              </div>
            )}
            <div>
              <span className="fw-bold text-white fs-6 d-block" style={{ lineHeight: '1.2' }}>{companyName}</span>
              <small className="text-warning" style={{ fontSize: '10.5px' }}>Solar Energy & Installation</small>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="navbar-nav d-none d-lg-flex flex-row align-items-center gap-1 mb-0 mx-auto">
            {navLinks.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  className={`nav-link px-3 py-1 text-light rounded-pill d-flex align-items-center gap-2 ${
                    location.pathname === item.path ? 'bg-secondary bg-opacity-25 text-white fw-bold' : ''
                  }`}
                  style={{ fontSize: '0.9rem' }}
                  to={item.path}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Action buttons */}
          <div className="d-flex align-items-center gap-2">
            <a
              href={`https://wa.me/${cleanMobile}?text=${encodeURIComponent('Hello SolarFlow, I am interested in solar panels and installation.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-sm d-flex align-items-center gap-2 rounded-pill px-3 py-1 shadow-sm"
              style={{ fontSize: '0.86rem' }}
            >
              <FaWhatsapp size={16} className="flex-shrink-0" />
              <span className="fw-semibold">WhatsApp</span>
            </a>

            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-1">
                <Link
                  to="/admin/dashboard"
                  className="btn btn-outline-warning btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1"
                  style={{ fontSize: '0.86rem' }}
                >
                  <FaUserShield className="flex-shrink-0" />
                  <span className="d-none d-sm-inline">Admin</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center"
                  style={{ width: '30px', height: '30px' }}
                  title="Logout"
                >
                  <FaSignOutAlt size={13} />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="btn btn-outline-light btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1"
                style={{ fontSize: '0.86rem' }}
              >
                <FaUserShield className="flex-shrink-0" />
                <span className="d-none d-sm-inline">Admin Login</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="btn btn-outline-light btn-sm d-lg-none d-flex align-items-center justify-content-center ms-1 rounded-3"
              style={{ width: '36px', height: '36px' }}
              onClick={() => setShowOffcanvas(true)}
              aria-label="Toggle navigation"
            >
              <FaBars size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Modern React Offcanvas Mobile Drawer */}
      {showOffcanvas && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setShowOffcanvas(false)}
          style={{ zIndex: 1045 }}
        ></div>
      )}

      <div
        className={`offcanvas offcanvas-end text-bg-dark ${showOffcanvas ? 'show' : ''}`}
        tabIndex="-1"
        style={{
          visibility: showOffcanvas ? 'visible' : 'hidden',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 1050,
          background: '#0b1120',
          width: '300px',
        }}
      >
        <div className="offcanvas-header border-bottom border-secondary border-opacity-25 py-3">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-warning text-dark p-2 rounded-3 d-flex align-items-center justify-content-center">
              <FaSolarPanel size={18} />
            </div>
            <div>
              <h6 className="fw-bold mb-0 text-white">{companyName}</h6>
              <small className="text-warning" style={{ fontSize: '10px' }}>Menu & Navigation</small>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px' }}
            onClick={() => setShowOffcanvas(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className="offcanvas-body d-flex flex-column justify-content-between p-3">
          <div className="d-flex flex-column gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none ${
                  location.pathname === item.path
                    ? 'bg-primary text-white fw-bold'
                    : 'text-light bg-secondary bg-opacity-10'
                }`}
                style={{ fontSize: '0.95rem' }}
                onClick={() => setShowOffcanvas(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-top border-secondary border-opacity-25 mt-4 d-flex flex-column gap-2">
            <a
              href={`https://wa.me/${cleanMobile}?text=${encodeURIComponent('Hello SolarFlow, I need a consultation for my home solar installation.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success w-100 fw-bold py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
            >
              <FaWhatsapp size={18} /> Chat on WhatsApp
            </a>

            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="btn btn-warning text-dark w-100 fw-bold py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowOffcanvas(false)}
              >
                <FaUserShield /> Go to Admin Panel
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="btn btn-outline-light w-100 fw-bold py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowOffcanvas(false)}
              >
                <FaUserShield /> Admin Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
