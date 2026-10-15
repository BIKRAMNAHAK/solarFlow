import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminLayout from '../Components/AdminLayout';
import {
  getDashboardStatsAction,
  getPanelsAction,
  getLeadsAction,
  getTasksAction,
  getEmployeesAction,
} from '../Services/Actions/getApis';
import {
  FaSolarPanel,
  FaAddressBook,
  FaTasks,
  FaUsers,
  FaPlus,
  FaWhatsapp,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
} from 'react-icons/fa';

function AdminDashboardPage() {
  const dispatch = useDispatch();
  const { dashboardStats, leads, tasks, panels, employees } = useSelector(
    (state) => state.states
  );

  useEffect(() => {
    const formdata = new FormData();
    dispatch(getDashboardStatsAction(formdata)).catch((err) => console.error(err));
    dispatch(getPanelsAction(formdata)).catch((err) => console.error(err));
    dispatch(getLeadsAction(formdata)).catch((err) => console.error(err));
    dispatch(getTasksAction(formdata)).catch((err) => console.error(err));
    dispatch(getEmployeesAction(formdata)).catch((err) => console.error(err));
  }, [dispatch]);

  const stats = dashboardStats?.stats || {
    totalPanels: panels.length,
    totalLeads: leads.length,
    newLeads: leads.filter((l) => l.status === 'New').length,
    totalEmployees: employees.length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter((t) => t.status === 'Assigned' || t.status === 'In Progress').length,
  };

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        {/* Header with Medium Font */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 gap-md-3 mb-3 admin-header-row">
          <div>
            <h4 className="fw-bold text-dark mb-1" style={{ fontSize: '1.35rem' }}>
              Solar Business Command Center
            </h4>
            <p className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
              Live overview of solar inquiries, digital job assignments, employee dispatch, and hardware.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0 w-100 w-md-auto">
            <Link
              to="/admin/tasks"
              className="btn btn-primary btn-sm rounded-pill d-flex align-items-center justify-content-center gap-1 shadow-sm px-3 flex-grow-1 flex-md-grow-0"
              style={{ fontSize: '0.84rem' }}
            >
              <FaTasks className="flex-shrink-0" />
              <span>Assign Job</span>
            </Link>
            <Link
              to="/admin/panels"
              className="btn btn-warning text-dark btn-sm rounded-pill d-flex align-items-center justify-content-center gap-1 shadow-sm fw-bold px-3 flex-grow-1 flex-md-grow-0"
              style={{ fontSize: '0.84rem' }}
            >
              <FaPlus className="flex-shrink-0" />
              <span>Add Panel</span>
            </Link>
          </div>
        </div>

        {/* 4 Primary KPI Stats (Colorful Animated Cards & Gradient Text) */}
        <div className="row g-3 mb-4">
          {/* Total Panels - Amber Theme */}
          <div className="col-xl-3 col-sm-6">
            <div className="color-card-amber p-3 h-100 card-hover-lift">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold" style={{ fontSize: '0.84rem' }}>
                  Solar Panels Catalog
                </span>
                <div className="icon-box-amber">
                  <FaSolarPanel size={18} />
                </div>
              </div>
              <h4 className="fw-extrabold mb-1 gradient-text-solar" style={{ fontSize: '1.55rem' }}>
                {stats.totalPanels}
              </h4>
              <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.8rem' }}>
                <span className="badge badge-soft-warning rounded-pill px-2 py-1">Active Modules</span>
                <Link to="/admin/panels" className="text-primary fw-semibold text-decoration-none">Manage →</Link>
              </div>
            </div>
          </div>

          {/* Leads - Blue Theme */}
          <div className="col-xl-3 col-sm-6">
            <div className="color-card-blue p-3 h-100 card-hover-lift">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold" style={{ fontSize: '0.84rem' }}>
                  Total Inquiries & Leads
                </span>
                <div className="icon-box-blue">
                  <FaAddressBook size={18} />
                </div>
              </div>
              <h4 className="fw-extrabold mb-1 gradient-text-blue" style={{ fontSize: '1.55rem' }}>
                {stats.totalLeads}
              </h4>
              <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.8rem' }}>
                <span className="badge bg-danger rounded-pill px-2 py-1 anim-pulse-amber">{stats.newLeads} New Inquiries</span>
                <Link to="/admin/leads" className="text-primary fw-semibold text-decoration-none">View CRM →</Link>
              </div>
            </div>
          </div>

          {/* Active Field Jobs - Purple Theme */}
          <div className="col-xl-3 col-sm-6">
            <div className="color-card-purple p-3 h-100 card-hover-lift">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold" style={{ fontSize: '0.84rem' }}>
                  Assigned Field Tasks
                </span>
                <div className="icon-box-purple">
                  <FaTasks size={18} />
                </div>
              </div>
              <h4 className="fw-extrabold mb-1 gradient-text-sunset" style={{ fontSize: '1.55rem' }}>
                {stats.totalTasks}
              </h4>
              <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.8rem' }}>
                <span className="badge bg-warning text-dark rounded-pill px-2 py-1">{stats.pendingTasks} In Progress</span>
                <Link to="/admin/tasks" className="text-primary fw-semibold text-decoration-none">Track Staff →</Link>
              </div>
            </div>
          </div>

          {/* Total Employees - Emerald Theme */}
          <div className="col-xl-3 col-sm-6">
            <div className="color-card-emerald p-3 h-100 card-hover-lift">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold" style={{ fontSize: '0.84rem' }}>
                  Field Staff & Engineers
                </span>
                <div className="icon-box-emerald">
                  <FaUsers size={18} />
                </div>
              </div>
              <h4 className="fw-extrabold mb-1 gradient-text-emerald" style={{ fontSize: '1.55rem' }}>
                {stats.totalEmployees}
              </h4>
              <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.8rem' }}>
                <span className="badge badge-soft-success rounded-pill px-2 py-1">Active Technicians</span>
                <Link to="/admin/employees" className="text-primary fw-semibold text-decoration-none">Staff List →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Main Sections: Recent Inquiries + Digital Tasks Track */}
        <div className="row g-3">
          {/* Recent Inquiries */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.98rem' }}>
                  Recent Customer Inquiries
                </h6>
                <Link to="/admin/leads" className="btn btn-outline-primary btn-sm rounded-pill py-0 px-2" style={{ fontSize: '0.78rem' }}>
                  View All
                </Link>
              </div>

              {leads.length === 0 ? (
                <p className="text-muted small py-4 text-center">No inquiries logged yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Customer</th>
                        <th>Type / Roof</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice(0, 5).map((lead) => (
                        <tr key={lead._id}>
                          <td>
                            <strong className="text-dark d-block">{lead.customerName}</strong>
                            <span className="text-muted" style={{ fontSize: '11px' }}>{lead.customerPhone}</span>
                          </td>
                          <td>
                            <span className="badge badge-soft-primary" style={{ fontSize: '10px' }}>{lead.inquiryType}</span>
                            {lead.roofArea > 0 && (
                              <small className="text-muted d-block" style={{ fontSize: '10px' }}>{lead.roofArea} sq.ft</small>
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                lead.status === 'New'
                                  ? 'bg-danger'
                                  : lead.status === 'Completed'
                                  ? 'bg-success'
                                  : 'bg-warning text-dark'
                              }`}
                              style={{ fontSize: '10px' }}
                            >
                              {lead.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <a
                              href={`https://wa.me/91${lead.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.customerName}, this is SolarFlow regarding your solar inquiry.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-success btn-sm rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
                              style={{ width: '28px', height: '28px' }}
                              title="Chat on WhatsApp"
                            >
                              <FaWhatsapp size={14} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Recent Digital Task Assignments */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.98rem' }}>
                  Live Field Task Dispatch
                </h6>
                <Link to="/admin/tasks" className="btn btn-outline-primary btn-sm rounded-pill py-0 px-2" style={{ fontSize: '0.78rem' }}>
                  View All Tasks
                </Link>
              </div>

              {tasks.length === 0 ? (
                <p className="text-muted small py-4 text-center">No tasks assigned yet.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {tasks.slice(0, 4).map((task) => (
                    <div key={task._id} className="p-2 px-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div>
                          <strong className="text-dark d-block" style={{ fontSize: '0.88rem' }}>{task.taskTitle}</strong>
                          <span className="text-primary small" style={{ fontSize: '11px' }}>
                            Staff: <strong>{task.employeeId?.name || 'Assigned Staff'}</strong> ({task.employeeId?.role || 'Technician'})
                          </span>
                        </div>
                        <span
                          className={`badge ${
                            task.status === 'Completed'
                              ? 'bg-success'
                              : task.status === 'In Progress'
                              ? 'bg-primary'
                              : 'bg-warning text-dark'
                          }`}
                          style={{ fontSize: '10px' }}
                        >
                          {task.status}
                        </span>
                      </div>
                      <div className="d-flex flex-wrap gap-3 text-muted" style={{ fontSize: '11px' }}>
                        <span className="d-flex align-items-center gap-1">
                          <FaMapMarkerAlt className="text-danger flex-shrink-0" size={11} /> {task.location}
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <FaClock className="text-secondary flex-shrink-0" size={11} /> {task.scheduledDate} ({task.scheduledTime})
                        </span>
                        <span>
                          Sent by: <strong>{task.assignedBy}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboardPage;
