import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../Components/AdminLayout';
import { getLeadsAction, getEmployeesAction } from '../Services/Actions/getApis';
import { updateLeadAction, assignTaskAction } from '../Services/Actions/postApis';
import { FaWhatsapp, FaUserCheck, FaFileInvoiceDollar, FaTrash, FaFilter, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

function AdminLeadsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leads, employees, adminProfile, admin } = useSelector((state) => state.states);

  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [assignData, setAssignData] = useState({
    employeeId: '',
    taskTitle: '',
    taskType: 'Site Survey',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '10:00 AM',
    instructions: '',
  });
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    fetchLeads();
    const empForm = new FormData();
    dispatch(getEmployeesAction(empForm)).catch((err) => console.error(err));
  }, [dispatch]);

  const fetchLeads = () => {
    const formdata = new FormData();
    dispatch(getLeadsAction(formdata)).catch((err) => console.error(err));
  };

  const filteredLeads = leads.filter((l) => {
    if (filterStatus === 'All') return true;
    return l.status === filterStatus;
  });

  const handleStatusChange = (leadId, newStatus) => {
    const formdata = new FormData();
    formdata.append('status', newStatus);

    dispatch(updateLeadAction(formdata, leadId))
      .then(() => {
        setAlertMsg(`Lead status changed to "${newStatus}"`);
        setTimeout(() => setAlertMsg(''), 3000);
        fetchLeads();
      })
      .catch((err) => console.error(err));
  };

  const openAssignModal = (lead) => {
    setSelectedLead(lead);
    setAssignData({
      employeeId: lead.assignedEmployeeId?._id || (employees[0]?._id || ''),
      taskTitle: `Site Survey & Measurement for ${lead.customerName}`,
      taskType: lead.inquiryType === 'Service' ? 'Service/Repair' : 'Site Survey',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '10:00 AM',
      instructions: `Please visit site at ${lead.city || lead.address || 'Customer location'}. Measure roof slope, shadows, and prepare quote requirements for ${lead.roofArea || 'rooftop'} sq.ft.`,
    });
    setAssignModal(true);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignData.employeeId) {
      alert('Please select an employee');
      return;
    }

    const adminName = adminProfile?.ownerName || admin?.ownerName || 'Admin';

    // 1. Assign Task Digitally
    const taskForm = new FormData();
    taskForm.append('taskTitle', assignData.taskTitle);
    taskForm.append('employeeId', assignData.employeeId);
    taskForm.append('assignedBy', adminName);
    taskForm.append('leadId', selectedLead._id);
    taskForm.append('customerName', selectedLead.customerName);
    taskForm.append('customerPhone', selectedLead.customerPhone);
    taskForm.append('location', selectedLead.city || selectedLead.address || 'Field Location');
    taskForm.append('taskType', assignData.taskType);
    taskForm.append('scheduledDate', assignData.scheduledDate);
    taskForm.append('scheduledTime', assignData.scheduledTime);
    taskForm.append('instructions', assignData.instructions);

    dispatch(assignTaskAction(taskForm))
      .then(() => {
        // 2. Update Lead with assigned employee & status
        const leadForm = new FormData();
        leadForm.append('assignedEmployeeId', assignData.employeeId);
        leadForm.append('status', 'Survey Assigned');
        return dispatch(updateLeadAction(leadForm, selectedLead._id));
      })
      .then(() => {
        setAssignModal(false);
        setAlertMsg(`Job assigned digitally to employee! Lead marked as "Survey Assigned".`);
        fetchLeads();
      })
      .catch((err) => {
        console.error('Error assigning job:', err);
      });
  };

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Customer Leads & Inquiries</h3>
            <p className="text-muted small mb-0">
              Manage incoming rooftop solar inquiries from website & WhatsApp. Assign field staff digitally for site surveys.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
            <FaFilter className="text-muted" />
            <select
              className="form-select form-select-sm rounded-pill"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses ({leads.length})</option>
              <option value="New">New Inquiries</option>
              <option value="Contacted">Contacted</option>
              <option value="Survey Assigned">Survey Assigned</option>
              <option value="Quotation Sent">Quotation Sent</option>
              <option value="Approved">Approved</option>
              <option value="Installation Assigned">Installation Assigned</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {alertMsg && (
          <div className="alert alert-success alert-dismissible fade show py-2 small" role="alert">
            {alertMsg}
            <button type="button" className="btn-close py-2" onClick={() => setAlertMsg('')}></button>
          </div>
        )}

        {/* Leads Table */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Customer Info</th>
                  <th>City / Address</th>
                  <th>Inquiry Type</th>
                  <th>Roof Area / Est. kW</th>
                  <th>Assigned Field Staff</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No leads found for status: {filterStatus}
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td>
                        <strong className="text-dark d-block">{lead.customerName}</strong>
                        <a
                          href={`tel:${lead.customerPhone}`}
                          className="text-muted small text-decoration-none"
                        >
                          {lead.customerPhone}
                        </a>
                      </td>
                      <td>
                        <span className="text-secondary small">
                          <FaMapMarkerAlt className="text-danger me-1" />
                          {lead.city || lead.address || 'Location Not Specified'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-soft-primary">{lead.inquiryType}</span>
                      </td>
                      <td>
                        {lead.roofArea > 0 ? (
                          <div>
                            <strong>{lead.roofArea} sq.ft</strong>
                            <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                              ~{lead.estimatedKw || 0} kW ({lead.calculatedPanels || 0} Panels)
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted small">N/A</span>
                        )}
                      </td>
                      <td>
                        {lead.assignedEmployeeId ? (
                          <div>
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                              <FaUserCheck className="me-1" /> {lead.assignedEmployeeId.name}
                            </span>
                            <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                              {lead.assignedEmployeeId.role}
                            </small>
                          </div>
                        ) : (
                          <button
                            onClick={() => openAssignModal(lead)}
                            className="btn btn-outline-warning text-dark btn-sm rounded-pill py-1 px-2 small"
                          >
                            + Assign Staff
                          </button>
                        )}
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm py-1"
                          style={{ width: '150px', fontSize: '12px' }}
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Survey Assigned">Survey Assigned</option>
                          <option value="Quotation Sent">Quotation Sent</option>
                          <option value="Approved">Approved</option>
                          <option value="Installation Assigned">Installation Assigned</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          {/* WhatsApp Customer */}
                          <a
                            href={`https://wa.me/91${lead.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.customerName}, Greetings from SolarFlow! We received your solar inquiry for ${lead.roofArea || ''} sq.ft rooftop. How can we assist you today?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-sm rounded-circle p-1"
                            title="Open WhatsApp Chat"
                          >
                            <FaWhatsapp size={15} />
                          </a>

                          {/* Assign field job */}
                          <button
                            onClick={() => openAssignModal(lead)}
                            className="btn btn-outline-primary btn-sm rounded-circle p-1"
                            title="Assign Field Job to Employee"
                          >
                            <FaUserCheck size={14} />
                          </button>

                          {/* Create Quotation */}
                          <button
                            onClick={() => navigate('/admin/quotations', { state: { fromLead: lead } })}
                            className="btn btn-outline-warning text-dark btn-sm rounded-circle p-1"
                            title="Submit Formal Quotation"
                          >
                            <FaFileInvoiceDollar size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Assign Field Job to Employee Digitally */}
        {assignModal && selectedLead && (
          <div className="modal show fade d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    <FaUserCheck className="text-warning me-2" /> Assign Field Job to Employee
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setAssignModal(false)}></button>
                </div>
                <form onSubmit={handleAssignSubmit}>
                  <div className="modal-body p-4">
                    <div className="p-3 bg-light rounded-3 mb-3 small">
                      <strong>Customer:</strong> {selectedLead.customerName} ({selectedLead.customerPhone})<br />
                      <strong>Location:</strong> {selectedLead.city || selectedLead.address || 'Not specified'}
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Select Employee / Engineer *</label>
                      <select
                        className="form-select"
                        value={assignData.employeeId}
                        onChange={(e) => setAssignData({ ...assignData, employeeId: e.target.value })}
                        required
                      >
                        <option value="">-- Choose Employee --</option>
                        {employees.map((emp) => (
                          <option key={emp._id} value={emp._id}>
                            {emp.name} - {emp.role} ({emp.phone})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-bold">Job Type</label>
                        <select
                          className="form-select"
                          value={assignData.taskType}
                          onChange={(e) => setAssignData({ ...assignData, taskType: e.target.value })}
                        >
                          <option value="Site Survey">Site Survey / Measurement</option>
                          <option value="Installation">Installation Execution</option>
                          <option value="Service/Repair">Service & Repair</option>
                          <option value="Maintenance">Routine Maintenance</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold">Scheduled Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={assignData.scheduledDate}
                          onChange={(e) => setAssignData({ ...assignData, scheduledDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Scheduled Time</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 10:00 AM"
                        value={assignData.scheduledTime}
                        onChange={(e) => setAssignData({ ...assignData, scheduledTime: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Work Instructions</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={assignData.instructions}
                        onChange={(e) => setAssignData({ ...assignData, instructions: e.target.value })}
                        placeholder="Enter instructions for the engineer..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setAssignModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-solar-gradient fw-bold rounded-pill px-4">
                      Assign Job Digitally
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

export default AdminLeadsPage;
