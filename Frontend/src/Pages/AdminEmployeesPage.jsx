import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../Components/AdminLayout';
import { getEmployeesAction } from '../Services/Actions/getApis';
import { addEmployeeAction, updateEmployeeAction, deleteEmployeeAction } from '../Services/Actions/postApis';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import {
  FaUsers,
  FaPlus,
  FaUserTie,
  FaPhoneAlt,
  FaEnvelope,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaImage,
} from 'react-icons/fa';

function AdminEmployeesPage() {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.states);

  const [showModal, setShowModal] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const [empForm, setEmpForm] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Technician',
    salary: '22000',
    address: '',
    status: 'Active',
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, [dispatch]);

  const fetchEmployees = () => {
    const formdata = new FormData();
    dispatch(getEmployeesAction(formdata)).catch((err) => console.error(err));
  };

  const openAddModal = () => {
    setEditingEmpId(null);
    setEmpForm({
      name: '',
      phone: '',
      email: '',
      role: 'Technician',
      salary: '22000',
      address: '',
      status: 'Active',
    });
    setSelectedPhoto(null);
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setEditingEmpId(emp._id);
    setEmpForm({
      name: emp.name || '',
      phone: emp.phone || '',
      email: emp.email || '',
      role: emp.role || 'Technician',
      salary: emp.salary || '22000',
      address: emp.address || '',
      status: emp.status || 'Active',
    });
    setSelectedPhoto(null);
    setShowModal(true);
  };

  // Submit Handler (Strictly using FormData + dispatch flow)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!empForm.name || !empForm.phone) {
      alert('Please fill Name and Phone');
      return;
    }

    setIsSaving(true);
    const formdata = new FormData();
    formdata.append('name', empForm.name);
    formdata.append('phone', empForm.phone);
    formdata.append('email', empForm.email);
    formdata.append('role', empForm.role);
    formdata.append('salary', empForm.salary);
    formdata.append('address', empForm.address);
    formdata.append('status', empForm.status);

    if (selectedPhoto) {
      formdata.append('photo', selectedPhoto);
    }

    if (editingEmpId) {
      dispatch(updateEmployeeAction(formdata, editingEmpId))
        .then(() => {
          setIsSaving(false);
          setShowModal(false);
          setAlertMsg('Employee profile updated successfully!');
          setTimeout(() => setAlertMsg(''), 3000);
          fetchEmployees();
        })
        .catch((err) => {
          setIsSaving(false);
          console.error(err);
        });
    } else {
      dispatch(addEmployeeAction(formdata))
        .then(() => {
          setIsSaving(false);
          setShowModal(false);
          setAlertMsg('New employee added successfully!');
          setTimeout(() => setAlertMsg(''), 3000);
          fetchEmployees();
        })
        .catch((err) => {
          setIsSaving(false);
          console.error(err);
        });
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete employee record for ${name}?`)) {
      dispatch(deleteEmployeeAction(id))
        .then(() => {
          setAlertMsg('Employee record removed.');
          setTimeout(() => setAlertMsg(''), 3000);
          fetchEmployees();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Employee & Staff Management</h3>
            <p className="text-muted small mb-0">
              Manage solar engineers, electricians, technicians, base salaries, contact numbers, and profiles.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="btn btn-primary fw-bold rounded-pill d-flex align-items-center gap-2 shadow-sm mt-3 mt-md-0"
          >
            <FaPlus /> Add New Employee
          </button>
        </div>

        {alertMsg && (
          <div className="alert alert-success alert-dismissible fade show py-2 small" role="alert">
            {alertMsg}
            <button type="button" className="btn-close py-2" onClick={() => setAlertMsg('')}></button>
          </div>
        )}

        {/* Employees Table */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Employee & Photo</th>
                  <th>Role / Designation</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Monthly Base Salary</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No employees added yet. Click "Add New Employee" above.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => {
                    const photoUrl = emp.photo ? `${IMAGE_BASE_URL}${emp.photo}` : null;
                    return (
                      <tr key={emp._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={emp.name}
                                style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                                className="rounded-circle border"
                              />
                            ) : (
                              <div
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '42px', height: '42px' }}
                              >
                                <FaUserTie size={18} />
                              </div>
                            )}
                            <div>
                              <strong className="text-dark d-block">{emp.name}</strong>
                              <small className="text-muted" style={{ fontSize: '11px' }}>
                                {emp.address || 'Field Staff'}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-soft-primary">{emp.role}</span>
                        </td>
                        <td>
                          <a href={`tel:${emp.phone}`} className="text-dark small text-decoration-none">
                            <FaPhoneAlt className="text-success me-1" size={12} /> {emp.phone}
                          </a>
                        </td>
                        <td>
                          <small className="text-muted">{emp.email || 'N/A'}</small>
                        </td>
                        <td>
                          <strong className="text-dark">₹{emp.salary?.toLocaleString('en-IN')}/mo</strong>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              emp.status === 'Active'
                                ? 'bg-success'
                                : emp.status === 'On Leave'
                                ? 'bg-warning text-dark'
                                : 'bg-secondary'
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => openEditModal(emp)}
                            className="btn btn-outline-primary btn-sm rounded-circle me-1"
                            title="Edit Employee"
                          >
                            <FaEdit size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id, emp.name)}
                            className="btn btn-outline-danger btn-sm rounded-circle"
                            title="Delete Employee"
                          >
                            <FaTrash size={13} />
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
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {editingEmpId ? 'Edit Employee Details' : 'Add New Employee'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-bold">Full Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={empForm.name}
                          onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                          placeholder="e.g. Ramesh Sharma"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Phone Number *</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={empForm.phone}
                          onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                          placeholder="e.g. 9823456781"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={empForm.email}
                          onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                          placeholder="e.g. ramesh@solarflow.com"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Job Role / Designation</label>
                        <select
                          className="form-select"
                          value={empForm.role}
                          onChange={(e) => setEmpForm({ ...empForm, role: e.target.value })}
                        >
                          <option value="Installation Engineer">Installation Engineer</option>
                          <option value="Technician">Solar Technician</option>
                          <option value="Site Supervisor">Site Supervisor</option>
                          <option value="Electrician">Electrician</option>
                          <option value="Sales Executive">Sales Executive</option>
                          <option value="Helper">Helper / Assistant</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Monthly Base Salary (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={empForm.salary}
                          onChange={(e) => setEmpForm({ ...empForm, salary: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Status</label>
                        <select
                          className="form-select"
                          value={empForm.status}
                          onChange={(e) => setEmpForm({ ...empForm, status: e.target.value })}
                        >
                          <option value="Active">Active</option>
                          <option value="On Leave">On Leave</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold d-flex align-items-center gap-1">
                          <FaImage className="text-primary" /> Profile Photo
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setSelectedPhoto(e.target.files[0])}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Residential Address / City</label>
                        <input
                          type="text"
                          className="form-control"
                          value={empForm.address}
                          onChange={(e) => setEmpForm({ ...empForm, address: e.target.value })}
                          placeholder="e.g. Main Market Road, City Center"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={isSaving} className="btn btn-solar-gradient fw-bold rounded-pill px-4">
                      {isSaving ? 'Saving...' : editingEmpId ? 'Update Staff Member' : 'Save Staff Member'}
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

export default AdminEmployeesPage;
