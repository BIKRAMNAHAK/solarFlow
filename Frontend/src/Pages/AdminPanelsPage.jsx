import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../Components/AdminLayout';
import { getPanelsAction } from '../Services/Actions/getApis';
import { addPanelAction, updatePanelAction, deletePanelAction } from '../Services/Actions/postApis';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import PriceCalculator from '../Services/helpers/PriceCalculator';
import { FaPlus, FaSolarPanel, FaTrash, FaEdit, FaImage, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function AdminPanelsPage() {
  const dispatch = useDispatch();
  const { panels } = useSelector((state) => state.states);

  const [showModal, setShowModal] = useState(false);
  const [editingPanelId, setEditingPanelId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ text: '', type: '' });

  // Form state
  const [formDataState, setFormDataState] = useState({
    name: '',
    brand: '',
    wattage: '',
    panelType: 'Mono PERC',
    price: '',
    gst: '12',
    discount: '0',
    areaRequiredSqFt: '22',
    warranty: '25 Years Performance Warranty',
    efficiency: '21.0%',
    description: '',
    stockCount: '50',
    inStock: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchPanels();
  }, [dispatch]);

  const fetchPanels = () => {
    const formdata = new FormData();
    dispatch(getPanelsAction(formdata)).catch((err) => console.error(err));
  };

  const openAddModal = () => {
    setEditingPanelId(null);
    setFormDataState({
      name: '',
      brand: '',
      wattage: '',
      panelType: 'Mono PERC',
      price: '',
      gst: '12',
      discount: '0',
      areaRequiredSqFt: '22',
      warranty: '25 Years Performance Warranty',
      efficiency: '21.0%',
      description: '',
      stockCount: '50',
      inStock: true,
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (panel) => {
    setEditingPanelId(panel._id);
    setFormDataState({
      name: panel.name || '',
      brand: panel.brand || '',
      wattage: panel.wattage || '',
      panelType: panel.panelType || 'Mono PERC',
      price: panel.price || '',
      gst: panel.gst !== undefined ? panel.gst : '12',
      discount: panel.discount !== undefined ? panel.discount : '0',
      areaRequiredSqFt: panel.areaRequiredSqFt || '22',
      warranty: panel.warranty || '25 Years Performance Warranty',
      efficiency: panel.efficiency || '21.0%',
      description: panel.description || '',
      stockCount: panel.stockCount !== undefined ? panel.stockCount : '50',
      inStock: panel.inStock !== undefined ? panel.inStock : true,
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  // Form Submit Handler (Strictly using FormData + dispatch flow)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formDataState.name || !formDataState.brand || !formDataState.wattage || !formDataState.price) {
      alert('Please fill Name, Brand, Wattage, and Price');
      return;
    }

    setIsSaving(true);
    setAlertMsg({ text: '', type: '' });

    const formdata = new FormData();
    formdata.append('name', formDataState.name);
    formdata.append('brand', formDataState.brand);
    formdata.append('wattage', formDataState.wattage);
    formdata.append('panelType', formDataState.panelType);
    formdata.append('price', formDataState.price);
    formdata.append('gst', formDataState.gst);
    formdata.append('discount', formDataState.discount);
    formdata.append('areaRequiredSqFt', formDataState.areaRequiredSqFt);
    formdata.append('warranty', formDataState.warranty);
    formdata.append('efficiency', formDataState.efficiency);
    formdata.append('description', formDataState.description);
    formdata.append('stockCount', formDataState.stockCount);
    formdata.append('inStock', formDataState.inStock);

    if (selectedFile) {
      formdata.append('image', selectedFile);
    }

    if (editingPanelId) {
      // Update
      dispatch(updatePanelAction(formdata, editingPanelId))
        .then((res) => {
          setIsSaving(false);
          setShowModal(false);
          setAlertMsg({ text: 'Solar panel updated successfully!', type: 'success' });
          fetchPanels();
        })
        .catch((err) => {
          setIsSaving(false);
          setAlertMsg({ text: 'Failed to update solar panel.', type: 'danger' });
        });
    } else {
      // Add new
      dispatch(addPanelAction(formdata))
        .then((res) => {
          setIsSaving(false);
          setShowModal(false);
          setAlertMsg({ text: 'Solar panel added successfully with photo and GST pricing!', type: 'success' });
          fetchPanels();
        })
        .catch((err) => {
          setIsSaving(false);
          setAlertMsg({ text: 'Failed to add solar panel.', type: 'danger' });
        });
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      dispatch(deletePanelAction(id))
        .then(() => {
          setAlertMsg({ text: 'Panel removed successfully.', type: 'info' });
        })
        .catch(() => {
          setAlertMsg({ text: 'Error deleting panel.', type: 'danger' });
        });
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Solar Panels & Pricing Control</h3>
            <p className="text-muted small mb-0">
              Manage panel hardware models, specifications, pictures, base rates, and GST percentages.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="btn btn-warning text-dark fw-bold rounded-pill d-flex align-items-center gap-2 shadow-sm"
          >
            <FaPlus /> Add New Solar Panel
          </button>
        </div>

        {alertMsg.text && (
          <div className={`alert alert-${alertMsg.type} alert-dismissible fade show py-2 small`} role="alert">
            {alertMsg.text}
            <button type="button" className="btn-close py-2" onClick={() => setAlertMsg({ text: '', type: '' })}></button>
          </div>
        )}

        {/* Panels Table */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Product & Photo</th>
                  <th>Brand & Tech</th>
                  <th>Wattage</th>
                  <th>Base Price</th>
                  <th>GST Rate</th>
                  <th>Final Bill Price</th>
                  <th>Stock Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {panels.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      No solar panels available in database. Click "Add New Solar Panel" above.
                    </td>
                  </tr>
                ) : (
                  panels.map((panel) => {
                    const calc = new PriceCalculator(panel.price, 1);
                    const bill = calc.getBill(panel.gst || 12, panel.discount || 0);
                    const photoUrl = panel.image ? `${IMAGE_BASE_URL}${panel.image}` : null;

                    return (
                      <tr key={panel._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={panel.name}
                                style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                                className="rounded border bg-light p-1"
                              />
                            ) : (
                              <div
                                className="bg-light rounded border d-flex align-items-center justify-content-center text-primary"
                                style={{ width: '48px', height: '48px' }}
                              >
                                <FaSolarPanel size={24} />
                              </div>
                            )}
                            <div>
                              <strong className="text-dark d-block">{panel.name}</strong>
                              <small className="text-muted" style={{ fontSize: '11px' }}>
                                Eff: {panel.efficiency} | Req: {panel.areaRequiredSqFt} sq.ft
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-dark me-1">{panel.brand}</span>
                          <span className="badge badge-soft-primary">{panel.panelType}</span>
                        </td>
                        <td>
                          <strong className="text-primary">{panel.wattage} W</strong>
                        </td>
                        <td>
                          <strong>₹{panel.price?.toLocaleString('en-IN')}</strong>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{panel.gst}% GST</span>
                        </td>
                        <td>
                          <strong className="text-success fs-6">
                            ₹{Math.round(bill.total)?.toLocaleString('en-IN')}
                          </strong>
                        </td>
                        <td>
                          {panel.inStock ? (
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                              <FaCheckCircle className="me-1" /> Available ({panel.stockCount || 50})
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                              <FaTimesCircle className="me-1" /> Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => openEditModal(panel)}
                            className="btn btn-outline-primary btn-sm rounded-circle me-1"
                            title="Edit Panel"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(panel._id, panel.name)}
                            className="btn btn-outline-danger btn-sm rounded-circle"
                            title="Delete Panel"
                          >
                            <FaTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Modal */}
        {showModal && (
          <div className="modal show fade d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    <FaSolarPanel className="text-warning me-2" />
                    {editingPanelId ? 'Edit Solar Panel' : 'Add New Solar Panel & Pricing'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      {/* Name */}
                      <div className="col-md-8">
                        <label className="form-label small fw-bold">Panel Name / Model *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Tata Solar 540W Mono PERC Half-Cut"
                          value={formDataState.name}
                          onChange={(e) => setFormDataState({ ...formDataState, name: e.target.value })}
                          required
                        />
                      </div>

                      {/* Brand */}
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Brand *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Tata Power Solar, Waaree"
                          value={formDataState.brand}
                          onChange={(e) => setFormDataState({ ...formDataState, brand: e.target.value })}
                          required
                        />
                      </div>

                      {/* Wattage */}
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Wattage (Watts) *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 540"
                          value={formDataState.wattage}
                          onChange={(e) => setFormDataState({ ...formDataState, wattage: e.target.value })}
                          required
                        />
                      </div>

                      {/* Technology */}
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Technology / Type</label>
                        <select
                          className="form-select"
                          value={formDataState.panelType}
                          onChange={(e) => setFormDataState({ ...formDataState, panelType: e.target.value })}
                        >
                          <option value="Mono PERC">Mono PERC</option>
                          <option value="Bifacial">Bifacial Dual-Glass</option>
                          <option value="TopCon">TopCon N-Type</option>
                          <option value="Polycrystalline">Polycrystalline</option>
                        </select>
                      </div>

                      {/* Base Price */}
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Base Price (₹) *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 13500"
                          value={formDataState.price}
                          onChange={(e) => setFormDataState({ ...formDataState, price: e.target.value })}
                          required
                        />
                      </div>

                      {/* GST % */}
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">GST (%)</label>
                        <select
                          className="form-select"
                          value={formDataState.gst}
                          onChange={(e) => setFormDataState({ ...formDataState, gst: e.target.value })}
                        >
                          <option value="12">12% (Standard Solar)</option>
                          <option value="18">18%</option>
                          <option value="5">5%</option>
                          <option value="0">0% (Nil)</option>
                        </select>
                      </div>

                      {/* Discount % */}
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Discount (%)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="0"
                          value={formDataState.discount}
                          onChange={(e) => setFormDataState({ ...formDataState, discount: e.target.value })}
                        />
                      </div>

                      {/* Area required per panel */}
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Roof Area Per Panel (sq.ft)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="22"
                          value={formDataState.areaRequiredSqFt}
                          onChange={(e) => setFormDataState({ ...formDataState, areaRequiredSqFt: e.target.value })}
                        />
                      </div>

                      {/* Efficiency */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Efficiency (%)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 21.5%"
                          value={formDataState.efficiency}
                          onChange={(e) => setFormDataState({ ...formDataState, efficiency: e.target.value })}
                        />
                      </div>

                      {/* Warranty */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Warranty Period</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 25 Years Performance Warranty"
                          value={formDataState.warranty}
                          onChange={(e) => setFormDataState({ ...formDataState, warranty: e.target.value })}
                        />
                      </div>

                      {/* Stock Count */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Stock Count (Units)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formDataState.stockCount}
                          onChange={(e) => setFormDataState({ ...formDataState, stockCount: e.target.value })}
                        />
                      </div>

                      {/* Picture Upload */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold d-flex align-items-center gap-1">
                          <FaImage className="text-primary" /> Panel Photo / Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                        <small className="text-muted" style={{ fontSize: '11px' }}>
                          Upload product image (JPG, PNG, WebP)
                        </small>
                      </div>

                      {/* Description */}
                      <div className="col-12">
                        <label className="form-label small fw-bold">Description / Technical Features</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Provide details about cell technology, temperature coefficient, and warranty terms..."
                          value={formDataState.description}
                          onChange={(e) => setFormDataState({ ...formDataState, description: e.target.value })}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={isSaving} className="btn btn-solar-gradient fw-bold rounded-pill px-4">
                      {isSaving ? 'Saving Panel...' : editingPanelId ? 'Update Panel' : 'Save & Publish Panel'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminPanelsPage;
