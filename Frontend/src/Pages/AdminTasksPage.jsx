import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../Components/AdminLayout';
import { getTasksAction, getEmployeesAction } from '../Services/Actions/getApis';
import { assignTaskAction, updateTaskStatusAction, deleteTaskAction } from '../Services/Actions/postApis';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import {
  FaTasks,
  FaPlus,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaTrash,
  FaFilter,
  FaCalendarAlt,
  FaHardHat,
  FaImage,
} from 'react-icons/fa';

function AdminTasksPage() {
  const dispatch = useDispatch();
  const { tasks, employees, adminProfile, admin } = useSelector((state) => state.states);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter states
  const [filterEmployee, setFilterEmployee] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  // New Task form state
  const [taskForm, setTaskForm] = useState({
    taskTitle: '',
    employeeId: '',
    customerName: '',
    customerPhone: '',
    location: '',
    taskType: 'Installation',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '10:00 AM',
    instructions: '',
  });

  // Status update state
  const [newStatus, setNewStatus] = useState('Completed');
  const [remarks, setRemarks] = useState('');
  const [completionFile, setCompletionFile] = useState(null);

  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    fetchTasks();
    const empForm = new FormData();
    dispatch(getEmployeesAction(empForm)).catch((err) => console.error(err));
  }, [dispatch]);

  const fetchTasks = () => {
    const formdata = new FormData();
    dispatch(getTasksAction(formdata)).catch((err) => console.error(err));
  };

  const adminName = adminProfile?.ownerName || admin?.ownerName || 'Admin';

  // Handle Assign Task (Strictly following FormData + dispatch flow)
  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!taskForm.taskTitle || !taskForm.employeeId || !taskForm.location) {
      alert('Please fill Task Title, Select Employee, and Location');
      return;
    }

    const formdata = new FormData();
    formdata.append('taskTitle', taskForm.taskTitle);
    formdata.append('employeeId', taskForm.employeeId);
    formdata.append('assignedBy', adminName);
    formdata.append('customerName', taskForm.customerName);
    formdata.append('customerPhone', taskForm.customerPhone);
    formdata.append('location', taskForm.location);
    formdata.append('taskType', taskForm.taskType);
    formdata.append('scheduledDate', taskForm.scheduledDate);
    formdata.append('scheduledTime', taskForm.scheduledTime);
    formdata.append('instructions', taskForm.instructions);

    dispatch(assignTaskAction(formdata))
      .then((res) => {
        setShowAssignModal(false);
        setAlertMsg('Digital task successfully assigned to employee!');
        setTimeout(() => setAlertMsg(''), 3000);
        setTaskForm({
          taskTitle: '',
          employeeId: '',
          customerName: '',
          customerPhone: '',
          location: '',
          taskType: 'Installation',
          scheduledDate: new Date().toISOString().split('T')[0],
          scheduledTime: '10:00 AM',
          instructions: '',
        });
        fetchTasks();
      })
      .catch((err) => console.error(err));
  };

  // Open Status modal
  const openStatusModal = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status === 'Assigned' ? 'In Progress' : 'Completed');
    setRemarks(task.remarks || '');
    setCompletionFile(null);
    setShowStatusModal(true);
  };

  // Update Status
  const handleUpdateStatus = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('status', newStatus);
    formdata.append('remarks', remarks);
    if (completionFile) {
      formdata.append('image', completionFile);
    }

    dispatch(updateTaskStatusAction(formdata, selectedTask._id))
      .then(() => {
        setShowStatusModal(false);
        setAlertMsg('Task status & completion report updated!');
        setTimeout(() => setAlertMsg(''), 3000);
        fetchTasks();
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Delete this task record?')) {
      dispatch(deleteTaskAction(id))
        .then(() => fetchTasks())
        .catch((err) => console.error(err));
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchEmp = filterEmployee === 'All' || t.employeeId?._id === filterEmployee;
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchType = filterType === 'All' || t.taskType === filterType;
    return matchEmp && matchStatus && matchType;
  });

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 gap-md-3 mb-4 admin-header-row">
          <div>
            <h3 className="fw-bold text-dark mb-1" style={{ fontSize: '1.4rem' }}>Digital Job Assignment & Field Tracking</h3>
            <p className="text-muted small mb-0">
              Complete digital audit: which employee went where, when, what job they performed, and who authorized the dispatch.
            </p>
          </div>
          <button
            onClick={() => setShowAssignModal(true)}
            className="btn btn-primary fw-bold rounded-pill d-flex align-items-center gap-2 shadow-sm mt-2 mt-md-0 admin-header-btn flex-shrink-0"
          >
            <FaPlus /> Assign Work to Employee
          </button>
        </div>

        {alertMsg && (
          <div className="alert alert-success alert-dismissible fade show py-2 small" role="alert">
            {alertMsg}
            <button type="button" className="btn-close py-2" onClick={() => setAlertMsg('')}></button>
          </div>
        )}

        {/* Filters */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <label className="form-label small text-muted mb-1">Filter by Employee:</label>
              <select
                className="form-select form-select-sm"
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
              >
                <option value="All">All Employees ({tasks.length} tasks)</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small text-muted mb-1">Filter by Status:</label>
              <select
                className="form-select form-select-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small text-muted mb-1">Filter by Task Type:</label>
              <select
                className="form-select form-select-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Installation">Installation</option>
                <option value="Service/Repair">Service & Repair</option>
                <option value="Site Survey">Site Survey / Measurement</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Digital Tasks Log Table */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Job Title / Purpose</th>
                  <th>Employee (Who)</th>
                  <th>Location (Where)</th>
                  <th>Date & Time (When)</th>
                  <th>Authorized By (Who Sent)</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No task assignments found. Click "Assign Work to Employee" above.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task._id}>
                      <td>
                        <strong className="text-dark d-block">{task.taskTitle}</strong>
                        <span className="badge badge-soft-primary small me-1">{task.taskType}</span>
                        {task.customerName && (
                          <small className="text-muted" style={{ fontSize: '11px' }}>
                            Customer: {task.customerName} ({task.customerPhone})
                          </small>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
                            <FaHardHat size={16} />
                          </div>
                          <div>
                            <strong className="text-dark d-block">
                              {task.employeeId?.name || 'Assigned Staff'}
                            </strong>
                            <small className="text-muted" style={{ fontSize: '11px' }}>
                              {task.employeeId?.role || 'Technician'} ({task.employeeId?.phone})
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1 text-secondary">
                          <FaMapMarkerAlt className="text-danger flex-shrink-0" />
                          <span className="small">{task.location}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong className="d-block small">{task.scheduledDate}</strong>
                          <small className="text-muted" style={{ fontSize: '11px' }}>
                            <FaClock className="me-1" /> {task.scheduledTime}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary-subtle text-dark border">
                          <FaUser className="me-1" /> {task.assignedBy || 'Admin'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            task.status === 'Completed'
                              ? 'bg-success'
                              : task.status === 'In Progress'
                              ? 'bg-primary'
                              : task.status === 'Cancelled'
                              ? 'bg-danger'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => openStatusModal(task)}
                          className="btn btn-outline-primary btn-sm rounded-pill me-1 small py-1"
                          title="Update Status"
                        >
                          Update Status
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="btn btn-outline-danger btn-sm rounded-circle p-1"
                          title="Delete Record"
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal 1: Assign Work to Employee */}
        {showAssignModal && (
          <div className="modal show fade d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    <FaTasks className="text-warning me-2" /> Assign Digital Job to Employee
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
                </div>
                <form onSubmit={handleAssignTask}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      {/* Task Title */}
                      <div className="col-md-12">
                        <label className="form-label small fw-bold">Task Title / Work Purpose *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 5kW Solar Installation & Inverter Wiring"
                          value={taskForm.taskTitle}
                          onChange={(e) => setTaskForm({ ...taskForm, taskTitle: e.target.value })}
                          required
                        />
                      </div>

                      {/* Select Employee */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Select Employee (Who) *</label>
                        <select
                          className="form-select"
                          value={taskForm.employeeId}
                          onChange={(e) => setTaskForm({ ...taskForm, employeeId: e.target.value })}
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

                      {/* Job Type */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Work Category</label>
                        <select
                          className="form-select"
                          value={taskForm.taskType}
                          onChange={(e) => setTaskForm({ ...taskForm, taskType: e.target.value })}
                        >
                          <option value="Installation">Solar Installation</option>
                          <option value="Service/Repair">Service & Fault Repair</option>
                          <option value="Site Survey">Site Survey & Roof Measurement</option>
                          <option value="Maintenance">Cleaning & Routine Maintenance</option>
                          <option value="Panel Delivery">Panel & Material Delivery</option>
                        </select>
                      </div>

                      {/* Location */}
                      <div className="col-md-12">
                        <label className="form-label small fw-bold">Site Location / Destination Address (Where) *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Plot 120, Hill View Enclave, City Center"
                          value={taskForm.location}
                          onChange={(e) => setTaskForm({ ...taskForm, location: e.target.value })}
                          required
                        />
                      </div>

                      {/* Date & Time */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Scheduled Date (When) *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={taskForm.scheduledDate}
                          onChange={(e) => setTaskForm({ ...taskForm, scheduledDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Scheduled Time</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 10:30 AM"
                          value={taskForm.scheduledTime}
                          onChange={(e) => setTaskForm({ ...taskForm, scheduledTime: e.target.value })}
                        />
                      </div>

                      {/* Customer info */}
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Customer Contact Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Bikash Mohanty"
                          value={taskForm.customerName}
                          onChange={(e) => setTaskForm({ ...taskForm, customerName: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Customer Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="e.g. 9876543210"
                          value={taskForm.customerPhone}
                          onChange={(e) => setTaskForm({ ...taskForm, customerPhone: e.target.value })}
                        />
                      </div>

                      {/* Instructions */}
                      <div className="col-12">
                        <label className="form-label small fw-bold">Work Instructions & Safety Protocol</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Enter instructions, tools required, or customer specific requirements..."
                          value={taskForm.instructions}
                          onChange={(e) => setTaskForm({ ...taskForm, instructions: e.target.value })}
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <small className="text-muted">
                          Authorized Dispatcher: <strong>{adminName} (Admin)</strong>
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setShowAssignModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-solar-gradient fw-bold rounded-pill px-4">
                      Dispatch & Record Job
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Update Task Status / Completion Report */}
        {showStatusModal && selectedTask && (
          <div className="modal show fade d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Update Job Status & Field Report</h5>
                  <button type="button" className="btn-close" onClick={() => setShowStatusModal(false)}></button>
                </div>
                <form onSubmit={handleUpdateStatus}>
                  <div className="modal-body p-4">
                    <div className="p-3 bg-light rounded-3 mb-3 small">
                      <strong>Task:</strong> {selectedTask.taskTitle}<br />
                      <strong>Employee:</strong> {selectedTask.employeeId?.name}<br />
                      <strong>Location:</strong> {selectedTask.location}
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Current Status</label>
                      <select
                        className="form-select"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="In Progress">In Progress (Staff on Site)</option>
                        <option value="Completed">Completed (Work Finished)</option>
                        <option value="Assigned">Assigned (Pending Departure)</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Work Completion Remarks / Notes</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="e.g. Solar panels mounted, wiring completed, tested and generated 22A."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold d-flex align-items-center gap-1">
                        <FaImage className="text-primary" /> On-Site Completion Photo (Optional)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setCompletionFile(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setShowStatusModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-emerald-gradient fw-bold rounded-pill px-4">
                      Save Status & Report
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

export default AdminTasksPage;
