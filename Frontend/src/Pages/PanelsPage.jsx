import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPanelsAction } from '../Services/Actions/getApis';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import PriceCalculator from '../Services/helpers/PriceCalculator';
import { FaSolarPanel, FaSearch, FaFilter, FaWhatsapp, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

function PanelsPage() {
  const dispatch = useDispatch();
  const { panels, adminProfile, admin } = useSelector((state) => state.states);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [activeModalPanel, setActiveModalPanel] = useState(null);

  useEffect(() => {
    const formdata = new FormData();
    dispatch(getPanelsAction(formdata))
      .then((res) => {})
      .catch((err) => console.error(err));
  }, [dispatch]);

  const brands = ['All', ...new Set(panels.map((p) => p.brand).filter(Boolean))];
  const types = ['All', 'Mono PERC', 'Bifacial', 'TopCon', 'Polycrystalline'];

  const filteredPanels = panels.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    const matchesType = selectedType === 'All' || p.panelType === selectedType;
    return matchesSearch && matchesBrand && matchesType;
  });

  const adminPhone = adminProfile?.mobile || admin?.mobile || '9876543210';
  const cleanMobile = adminPhone.replace(/\D/g, '').length === 10 ? `91${adminPhone.replace(/\D/g, '')}` : adminPhone.replace(/\D/g, '');

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header with Gradient Text */}
        <div className="text-center mb-4">
          <span className="badge badge-soft-warning px-3 py-1 rounded-pill mb-2" style={{ fontSize: '11px' }}>
            TIER-1 HARDWARE INVENTORY
          </span>
          <h1 className="fw-bold mb-2">
            Premium <span className="gradient-text-solar">Solar Panels & Modules</span>
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '650px', fontSize: '0.92rem' }}>
            Explore certified Tier-1 panels with transparent GST pricing, manufacturer performance warranties, and bulk installation rates.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-lg-5 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by panel name or brand (e.g. Tata, 540W)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-3">
              <div className="d-flex align-items-center gap-2">
                <FaFilter className="text-muted" />
                <select
                  className="form-select form-select-sm"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>Brand: {b}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-lg-4 col-md-3">
              <select
                className="form-select form-select-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {types.map((t) => (
                  <option key={t} value={t}>Technology: {t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Panels Grid */}
        {filteredPanels.length === 0 ? (
          <div className="text-center py-5">
            <FaSolarPanel size={60} className="text-muted opacity-50 mb-3" />
            <h5 className="text-muted">No solar panels match your criteria</h5>
          </div>
        ) : (
          <div className="row g-4">
            {filteredPanels.map((panel) => {
              const calc = new PriceCalculator(panel.price, 1);
              const bill = calc.getBill(panel.gst || 12, panel.discount || 0);
              const photoUrl = panel.image ? `${IMAGE_BASE_URL}${panel.image}` : null;

              return (
                <div className="col-lg-4 col-md-6" key={panel._id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white card-hover-lift">
                    <div
                      className="bg-secondary bg-opacity-10 position-relative d-flex align-items-center justify-content-center"
                      style={{ height: '220px' }}
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={panel.name}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <FaSolarPanel size={80} className="text-primary opacity-50" />
                      )}
                      <span className="position-absolute top-0 start-0 m-3 badge bg-dark shadow-sm">
                        {panel.brand}
                      </span>
                      <span className="position-absolute top-0 end-0 m-3 badge bg-warning text-dark fw-bold shadow-sm">
                        {panel.wattage}W
                      </span>
                      {panel.inStock ? (
                        <span className="position-absolute bottom-0 start-0 m-3 badge bg-success shadow-sm">
                          In Stock ({panel.stockCount} units)
                        </span>
                      ) : (
                        <span className="position-absolute bottom-0 start-0 m-3 badge bg-danger shadow-sm">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <div className="card-body p-4 d-flex flex-column">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge badge-soft-primary">{panel.panelType}</span>
                        <span className="badge badge-soft-success">{panel.efficiency} Efficiency</span>
                      </div>

                      <h5 className="fw-bold mb-2" style={{ fontSize: '1.05rem' }}>{panel.name}</h5>
                      <p className="text-muted small mb-3" style={{ minHeight: '40px', fontSize: '13px' }}>
                        {panel.description || `${panel.brand} high performance solar module for rooftop and commercial solar.`}
                      </p>

                      <div className="bg-light p-2 rounded-3 mb-3 small">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Roof Area Needed:</span>
                          <strong>~{panel.areaRequiredSqFt || 22} sq.ft / panel</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Warranty:</span>
                          <strong>{panel.warranty || '25 Years'}</strong>
                        </div>
                      </div>

                      {/* Pricing with PriceCalculator */}
                      <div className="mt-auto border-top pt-3">
                        <div className="d-flex justify-content-between align-items-end mb-3">
                          <div>
                            <small className="text-muted d-block" style={{ fontSize: '11px' }}>Base Price</small>
                            <h5 className="fw-bold mb-0 text-dark">₹{panel.price.toLocaleString('en-IN')}</h5>
                          </div>
                          <div className="text-end">
                            <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                              Net Price (Incl. {panel.gst}% GST)
                            </small>
                            <h5 className="fw-bold mb-0 gradient-text-emerald">₹{Math.round(bill.total).toLocaleString('en-IN')}</h5>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-1"
                            onClick={() => setActiveModalPanel(panel)}
                          >
                            <FaInfoCircle /> Specs
                          </button>
                          <a
                            href={`https://wa.me/${cleanMobile}?text=${encodeURIComponent(`Hello SolarFlow, I am interested in ${panel.name} (${panel.wattage}W, Brand: ${panel.brand}). Please provide complete quotation and availability.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-solar-gradient btn-sm flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-1 fw-bold"
                          >
                            <FaWhatsapp size={16} /> WhatsApp Quote
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Specs Details Modal */}
        {activeModalPanel && (
          <div className="modal show fade d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content rounded-4 border-0">
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold">{activeModalPanel.name}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setActiveModalPanel(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    <div className="col-md-5 text-center">
                      {activeModalPanel.image ? (
                        <img
                          src={`${IMAGE_BASE_URL}${activeModalPanel.image}`}
                          alt={activeModalPanel.name}
                          className="img-fluid rounded-3 border"
                          style={{ maxHeight: '250px' }}
                        />
                      ) : (
                        <div className="bg-light p-5 rounded-3 border">
                          <FaSolarPanel size={90} className="text-primary opacity-50" />
                        </div>
                      )}
                    </div>
                    <div className="col-md-7">
                      <span className="badge bg-warning text-dark mb-2">{activeModalPanel.brand}</span>
                      <h4 className="fw-bold">{activeModalPanel.wattage} Watts {activeModalPanel.panelType}</h4>
                      <p className="text-muted small">{activeModalPanel.description}</p>

                      <ul className="list-group list-group-flush small mb-3">
                        <li className="list-group-item px-0 d-flex justify-content-between">
                          <span className="text-muted">Technology</span>
                          <strong>{activeModalPanel.panelType}</strong>
                        </li>
                        <li className="list-group-item px-0 d-flex justify-content-between">
                          <span className="text-muted">Module Efficiency</span>
                          <strong>{activeModalPanel.efficiency}</strong>
                        </li>
                        <li className="list-group-item px-0 d-flex justify-content-between">
                          <span className="text-muted">Surface Area Required</span>
                          <strong>{activeModalPanel.areaRequiredSqFt || 22} sq.ft per module</strong>
                        </li>
                        <li className="list-group-item px-0 d-flex justify-content-between">
                          <span className="text-muted">Performance Warranty</span>
                          <strong className="text-success">{activeModalPanel.warranty}</strong>
                        </li>
                        <li className="list-group-item px-0 d-flex justify-content-between">
                          <span className="text-muted">GST Rate</span>
                          <strong>{activeModalPanel.gst}%</strong>
                        </li>
                      </ul>

                      <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-3">
                        <div>
                          <span className="small text-muted d-block">Base Price</span>
                          <h5 className="fw-bold mb-0">₹{activeModalPanel.price.toLocaleString('en-IN')}</h5>
                        </div>
                        <div className="text-end">
                          <span className="small text-muted d-block">Price With GST</span>
                          <h4 className="fw-bold text-success mb-0">
                            ₹{Math.round(new PriceCalculator(activeModalPanel.price).getFinalTotal(activeModalPanel.gst)).toLocaleString('en-IN')}
                          </h4>
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/${cleanMobile}?text=${encodeURIComponent(`Hello SolarFlow, I need a quotation for ${activeModalPanel.name} (${activeModalPanel.wattage}W). Please advise how many panels I should install.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success w-100 fw-bold py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                      >
                        <FaWhatsapp size={18} /> Inquire About This Panel on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default PanelsPage;
