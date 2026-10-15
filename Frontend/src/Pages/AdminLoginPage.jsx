import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { adminLoginAction, adminForgotPasswordAction, adminResetPasswordAction } from '../Services/Actions/postApis';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import {
  FaSolarPanel,
  FaLock,
  FaUser,
  FaKey,
  FaShieldAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaBolt,
  FaTools,
  FaUsers,
  FaMoneyBillWave,
} from 'react-icons/fa';

function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminProfile } = useSelector((state) => state.states);

  const [identifier, setIdentifier] = useState('admin@solarflow.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('Please enter Email or Phone Number and Password');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const formdata = new FormData();
    formdata.append('identifier', identifier.trim());
    formdata.append('password', password.trim());

    dispatch(adminLoginAction(formdata))
      .then((res) => {
        setIsLoading(false);
        if (res.success) {
          navigate('/admin/dashboard');
        } else {
          setErrorMsg(res.message || 'Login failed');
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (!err.response) {
          setErrorMsg('Backend Server offline! Please start backend server with "node server.js" on port 5000.');
        } else {
          setErrorMsg(err.response?.data?.message || 'Invalid Email/Phone or Password');
        }
      });
  };

  // Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!forgotIdentifier) {
      setForgotError('Please enter your registered Email or Phone');
      return;
    }

    setForgotError('');
    setForgotMsg('Sending OTP...');

    const formdata = new FormData();
    formdata.append('identifier', forgotIdentifier.trim());

    dispatch(adminForgotPasswordAction(formdata))
      .then((res) => {
        setForgotMsg(res.message);
        if (res.otp) {
          setOtp(res.otp);
        }
        setForgotStep(2);
      })
      .catch((err) => {
        setForgotError(err.response?.data?.message || 'Admin not found with this identifier');
        setForgotMsg('');
      });
  };

  // Step 2: Reset Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setForgotError('Please enter OTP and new password');
      return;
    }

    setForgotError('');
    setForgotMsg('Resetting password...');

    const formdata = new FormData();
    formdata.append('identifier', forgotIdentifier.trim());
    formdata.append('otp', otp.trim());
    formdata.append('newPassword', newPassword.trim());

    dispatch(adminResetPasswordAction(formdata))
      .then(() => {
        setForgotMsg('Password reset successful! You can now log in.');
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep(1);
          setForgotMsg('');
          setPassword(newPassword);
          setIdentifier(forgotIdentifier);
        }, 1500);
      })
      .catch((err) => {
        setForgotError(err.response?.data?.message || 'Invalid or expired OTP');
        setForgotMsg('');
      });
  };

  const companyName = adminProfile?.companyName || 'SolarFlow Energy Solutions';
  const logoUrl = adminProfile?.logo ? `${IMAGE_BASE_URL}${adminProfile.logo}` : null;

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark" style={{ background: 'radial-gradient(circle at 15% 20%, #0f172a 0%, #020617 100%)' }}>
      <div className="container py-5">
        <div className="row g-0 rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25" style={{ maxWidth: '1000px', margin: '0 auto', background: '#0b1120' }}>
          
          {/* Left Hero Brand Pane */}
          <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between text-white position-relative" style={{ background: 'linear-gradient(135deg, #090e1a 0%, #0c1933 60%, #0284c7 140%)' }}>
            <div>
              <div className="d-flex align-items-center gap-3 mb-4">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    className="rounded-3 border border-warning"
                  />
                ) : (
                  <div className="bg-warning text-dark p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '46px', height: '46px' }}>
                    <FaSolarPanel size={26} />
                  </div>
                )}
                <div>
                  <h4 className="fw-bold mb-0 text-white" style={{ fontSize: '1.25rem' }}>{companyName}</h4>
                  <span className="badge bg-warning text-dark rounded-pill fw-bold" style={{ fontSize: '10px' }}>
                    ENTERPRISE CONTROL HUB
                  </span>
                </div>
              </div>

              <h2 className="fw-extrabold mb-3 text-white" style={{ fontSize: '1.85rem', lineHeight: '1.3' }}>
                Complete Solar EPC <br /><span className="text-warning">Digital Management</span>
              </h2>
              <p className="text-light opacity-75 mb-4" style={{ fontSize: '0.95rem' }}>
                Unified administration for solar hardware inventory, field technician dispatch, instant quotation generation, and Tally-grade ledger accounting.
              </p>

              {/* 4 Feature Highlights */}
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-center gap-3 text-light">
                  <div className="bg-primary bg-opacity-20 text-info p-2 rounded-circle">
                    <FaTools size={15} />
                  </div>
                  <span style={{ fontSize: '0.92rem' }}>Digital Employee Field Task Dispatch & Tracking</span>
                </div>
                <div className="d-flex align-items-center gap-3 text-light">
                  <div className="bg-success bg-opacity-20 text-success p-2 rounded-circle">
                    <FaBolt size={15} />
                  </div>
                  <span style={{ fontSize: '0.92rem' }}>Instant WhatsApp Quotations & Lead CRM</span>
                </div>
                <div className="d-flex align-items-center gap-3 text-light">
                  <div className="bg-warning bg-opacity-20 text-warning p-2 rounded-circle">
                    <FaMoneyBillWave size={15} />
                  </div>
                  <span style={{ fontSize: '0.92rem' }}>Bank Passbook & Tally-Style Financial Records</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center text-secondary small">
              <span>© {new Date().getFullYear()} {companyName}</span>
              <span className="text-warning d-flex align-items-center gap-1">
                <FaShieldAlt /> 256-Bit Encrypted
              </span>
            </div>
          </div>

          {/* Right Login Form Pane */}
          <div className="col-lg-6 p-4 p-md-5 bg-white d-flex flex-column justify-content-center">
            <div className="mb-4">
              <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 rounded-pill mb-2" style={{ fontSize: '11px' }}>
                SECURE AUTHENTICATION
              </span>
              <h3 className="fw-bold text-dark mb-1" style={{ fontSize: '1.6rem' }}>Admin Portal Login</h3>
              <p className="text-muted" style={{ fontSize: '0.92rem' }}>
                Enter your authorized Admin Email or Registered Mobile number to access controls.
              </p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
                <span>⚠️ {errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.92rem' }}>
                  Email or Registered Mobile
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 py-2"
                    style={{ fontSize: '0.95rem' }}
                    placeholder="e.g. admin@solarflow.com or 9876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-bold text-dark mb-0" style={{ fontSize: '0.92rem' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none text-primary fw-semibold"
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => {
                      setForgotIdentifier(identifier);
                      setShowForgotModal(true);
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control border-start-0 border-end-0 py-2"
                    style={{ fontSize: '0.95rem' }}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light border-start-0 text-muted"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-solar-gradient w-100 fw-bold py-2 rounded-3 shadow-sm mt-3"
                style={{ fontSize: '1rem' }}
              >
                {isLoading ? 'Signing In...' : 'Sign In to Dashboard →'}
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top">
              <Link
                to="/"
                className="text-secondary text-decoration-none d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: '0.88rem' }}
              >
                <FaArrowLeft size={12} /> Return to Customer Website
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal show fade d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold" style={{ fontSize: '1.1rem' }}>
                  <FaKey className="text-warning me-2" /> Reset Admin Password
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForgotModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                {forgotError && <div className="alert alert-danger py-2 small">{forgotError}</div>}
                {forgotMsg && <div className="alert alert-success py-2 small">{forgotMsg}</div>}

                {forgotStep === 1 ? (
                  <form onSubmit={handleSendOtp}>
                    <p className="text-muted small mb-3">
                      Enter your registered Admin Email or Mobile number to generate a password reset code.
                    </p>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Email or Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        placeholder="admin@solarflow.com"
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-solar-gradient w-100 fw-bold rounded-pill">
                      Generate 6-Digit OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">6-Digit OTP</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary w-50 rounded-pill"
                        onClick={() => setForgotStep(1)}
                      >
                        Back
                      </button>
                      <button type="submit" className="btn btn-solar-gradient w-50 fw-bold rounded-pill">
                        Save Password
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLoginPage;
