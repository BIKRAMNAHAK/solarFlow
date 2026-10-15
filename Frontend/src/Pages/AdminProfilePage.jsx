import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../Components/AdminLayout';
import { getAdminProfileAction } from '../Services/Actions/getApis';
import { updateAdminProfileAction } from '../Services/Actions/postApis';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import { FaCog, FaBuilding, FaUserTie, FaEnvelope, FaPhoneAlt, FaImage, FaCheckCircle } from 'react-icons/fa';

function AdminProfilePage() {
  const dispatch = useDispatch();
  const { adminProfile, admin } = useSelector((state) => state.states);

  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    const current = adminProfile || admin;
    if (current) {
      setCompanyName(current.companyName || '');
      setOwnerName(current.ownerName || '');
      setEmail(current.email || '');
      setMobile(current.mobile || '');
    }
  }, [adminProfile, admin]);

  // Update Profile (Strictly using FormData + dispatch flow)
  const handleUpdate = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setAlertMsg('');

    const formdata = new FormData();
    formdata.append('companyName', companyName);
    formdata.append('ownerName', ownerName);
    formdata.append('email', email);
    formdata.append('mobile', mobile);

    if (logoFile) {
      formdata.append('logo', logoFile);
    }

    dispatch(updateAdminProfileAction(formdata))
      .then((res) => {
        setIsSaving(false);
        setAlertMsg('Company & Admin settings updated successfully!');
        setTimeout(() => setAlertMsg(''), 3000);
      })
      .catch((err) => {
        setIsSaving(false);
        console.error(err);
      });
  };

  const currentLogo = adminProfile?.logo || admin?.logo;

  return (
    <AdminLayout>
      <div className="container-fluid px-0" style={{ maxWidth: '800px' }}>
        <div className="mb-4">
          <h3 className="fw-bold text-dark mb-1">Company Profile & WhatsApp Number</h3>
          <p className="text-muted small mb-0">
            Configure your enterprise solar company details, owner credentials, brand logo, and the primary WhatsApp contact number for website customer leads.
          </p>
        </div>

        {alertMsg && (
          <div className="alert alert-success alert-dismissible fade show py-2 small" role="alert">
            <FaCheckCircle className="me-2" /> {alertMsg}
            <button type="button" className="btn-close py-2" onClick={() => setAlertMsg('')}></button>
          </div>
        )}

        <div className="form-card-vibrant p-4 p-md-5 mb-4">
          <form onSubmit={handleUpdate}>
            {/* Current Logo preview */}
            <div className="d-flex align-items-center gap-4 mb-4 pb-3 border-bottom">
              <div>
                {currentLogo ? (
                  <img
                    src={`${IMAGE_BASE_URL}${currentLogo}`}
                    alt="Logo"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    className="rounded-3 border shadow-sm"
                  />
                ) : (
                  <div
                    className="bg-light rounded-3 border d-flex align-items-center justify-content-center text-muted"
                    style={{ width: '80px', height: '80px' }}
                  >
                    No Logo
                  </div>
                )}
              </div>
              <div>
                <label className="form-label small fw-bold d-flex align-items-center gap-1">
                  <FaImage className="text-primary" /> Update Company Logo
                </label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                />
                <small className="text-muted" style={{ fontSize: '11px' }}>
                  Recommended: Square PNG or JPG with transparent/light background
                </small>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold d-flex align-items-center gap-1">
                  <FaBuilding className="text-primary" /> Company Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold d-flex align-items-center gap-1">
                  <FaUserTie className="text-primary" /> Owner Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold d-flex align-items-center gap-1">
                  <FaEnvelope className="text-primary" /> Official Admin Email *
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold d-flex align-items-center gap-1">
                  <FaPhoneAlt className="text-success" /> Admin Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  className="form-control"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                />
                <small className="text-muted" style={{ fontSize: '11px' }}>
                  All customer rooftop inquiries & WhatsApp quote requests will arrive at this phone number.
                </small>
              </div>

              <div className="col-12 mt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-solar-gradient fw-bold px-4 py-2 rounded-pill shadow-sm"
                >
                  {isSaving ? 'Updating Profile...' : 'Save Profile Settings'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProfilePage;
