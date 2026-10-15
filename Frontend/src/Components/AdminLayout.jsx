import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { adminLogoutAction } from '../Services/Actions/postApis';
import { getAdminProfileAction } from '../Services/Actions/getApis';
import { IMAGE_BASE_URL } from '../Services/helpers/config';
import {
  FaChartPie,
  FaSolarPanel,
  FaUsers,
  FaTasks,
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
  FaCalendarCheck,
  FaCog,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaAddressBook,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, admin, adminProfile } = useSelector((state) => state.states);

  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  // Sidebar collapsed state: Open (full icon + content) vs Close (icon only)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('solarflow_admin_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('solarflow_admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    const formdata = new FormData();
    dispatch(getAdminProfileAction(formdata)).catch(() => {});
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    setShowMobileSidebar(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(adminLogoutAction()).then(() => {
      navigate('/admin/login');
    });
  };

  const companyName = adminProfile?.companyName || admin?.companyName || 'SolarFlow';
  const ownerName = adminProfile?.ownerName || admin?.ownerName || 'Admin';
  const logoUrl = adminProfile?.logo ? `${IMAGE_BASE_URL}${adminProfile.logo}` : null;

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaChartPie size={18} className="flex-shrink-0" /> },
    { name: 'Solar Panels', path: '/admin/panels', icon: <FaSolarPanel size={18} className="flex-shrink-0" /> },
    { name: 'Leads & Enquiries', path: '/admin/leads', icon: <FaAddressBook size={18} className="flex-shrink-0" /> },
    { name: 'Assign Tasks', path: '/admin/tasks', icon: <FaTasks size={18} className="flex-shrink-0" /> },
    { name: 'Quotations', path: '/admin/quotations', icon: <FaFileInvoiceDollar size={18} className="flex-shrink-0" /> },
    { name: 'Employees', path: '/admin/employees', icon: <FaUsers size={18} className="flex-shrink-0" /> },
    { name: 'Attendance & Salary', path: '/admin/attendance', icon: <FaCalendarCheck size={18} className="flex-shrink-0" /> },
    { name: 'Payments & Finance', path: '/admin/payments', icon: <FaMoneyCheckAlt size={18} className="flex-shrink-0" /> },
    { name: 'Company Settings', path: '/admin/profile', icon: <FaCog size={18} className="flex-shrink-0" /> },
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Top Navbar */}
      <nav className="navbar navbar-dark px-2 px-sm-3 py-2 border-bottom sticky-top shadow-sm" style={{ background: '#0b1120', borderColor: '#1e293b' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center px-1">
          {/* Brand & Mobile / Desktop Toggle */}
          <div className="d-flex align-items-center gap-1 gap-sm-2" style={{ minWidth: 0 }}>
            {/* Mobile Hamburger */}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm d-md-none text-white p-1 rounded-3 me-1 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '32px', height: '32px' }}
              onClick={() => setShowMobileSidebar(true)}
              aria-label="Open Navigation Menu"
            >
              <FaBars size={15} />
            </button>

            {/* Desktop Sidebar Collapse Toggle */}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm d-none d-md-flex align-items-center justify-content-center text-white border-secondary rounded-3 me-2 flex-shrink-0"
              style={{ width: '34px', height: '34px', background: 'rgba(255,255,255,0.05)' }}
              onClick={toggleSidebar}
              title={isSidebarCollapsed ? 'Open Sidebar (Show text)' : 'Close Sidebar (Icon only)'}
            >
              <FaBars size={15} />
            </button>

            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                className="rounded-3 border border-warning flex-shrink-0"
              />
            ) : (
              <div
                className="bg-warning text-dark rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: '32px', height: '32px' }}
              >
                <FaSolarPanel size={16} />
              </div>
            )}
            <div className="text-truncate" style={{ maxWidth: '140px' }}>
              <span className="fw-bold text-white mb-0 d-block text-truncate" style={{ fontSize: '0.88rem', lineHeight: '1.2' }}>{companyName}</span>
              <small className="text-secondary d-none d-sm-block" style={{ fontSize: '10px' }}>Admin Workspace</small>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="d-flex align-items-center gap-1 gap-sm-2 flex-shrink-0">
            <Link
              to="/"
              target="_blank"
              className="btn btn-outline-light btn-sm rounded-pill d-flex align-items-center gap-1 px-2 px-sm-3 py-1"
              style={{ fontSize: '0.8rem' }}
              title="Customer Site"
            >
              <FaExternalLinkAlt size={10} className="flex-shrink-0" />
              <span className="d-none d-sm-inline">Site</span>
            </Link>

            <div className="d-flex align-items-center gap-1 gap-sm-2 ps-1 ps-sm-2 border-start border-secondary border-opacity-50">
              <div className="text-end d-none d-md-block">
                <span className="d-block text-white fw-bold" style={{ fontSize: '0.88rem' }}>{ownerName}</span>
                <span className="text-warning small" style={{ fontSize: '10px' }}>Owner</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm rounded-pill d-flex align-items-center gap-1 px-2 py-1"
                style={{ fontSize: '0.8rem' }}
                title="Logout"
              >
                <FaSignOutAlt size={12} className="flex-shrink-0" />
                <span className="d-none d-sm-inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <div className="d-flex flex-grow-1">
        {/* Desktop Left Sidebar: Collapsible with Icon Only when closed */}
        <aside className={`admin-sidebar d-none d-md-block ${isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
          <div className="d-flex align-items-center justify-content-between mb-3 px-1">
            {!isSidebarCollapsed && (
              <small className="text-uppercase text-secondary fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                Admin Modules
              </small>
            )}
            <button
              onClick={toggleSidebar}
              className="btn btn-sm text-secondary border-0 p-1 rounded-2 ms-auto d-flex align-items-center justify-content-center"
              style={{ width: '26px', height: '26px', background: 'rgba(255,255,255,0.05)' }}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
            </button>
          </div>

          <div className="d-flex flex-column gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-sidebar-link ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed-link' : ''}`}
                  title={isSidebarCollapsed ? item.name : ''}
                >
                  <span
                    className={`d-flex align-items-center justify-content-center flex-shrink-0 ${
                      isActive ? 'text-info' : 'text-secondary'
                    }`}
                    style={{ width: '24px', height: '24px' }}
                  >
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <span className="sidebar-text text-truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Mobile Offcanvas Drawer for Sidebar */}
        {showMobileSidebar && (
          <div
            className="offcanvas-backdrop fade show d-md-none"
            onClick={() => setShowMobileSidebar(false)}
            style={{ zIndex: 1045 }}
          ></div>
        )}

        <div
          className={`offcanvas offcanvas-start text-bg-dark d-md-none ${showMobileSidebar ? 'show' : ''}`}
          tabIndex="-1"
          style={{
            visibility: showMobileSidebar ? 'visible' : 'hidden',
            transition: 'transform 0.3s ease-in-out',
            zIndex: 1050,
            background: '#0b1120',
            width: '280px',
          }}
        >
          <div className="offcanvas-header border-bottom border-secondary border-opacity-25 py-3">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-warning text-dark p-2 rounded-3 d-flex align-items-center justify-content-center">
                <FaSolarPanel size={18} />
              </div>
              <h6 className="fw-bold mb-0 text-white" style={{ fontSize: '0.92rem' }}>{companyName}</h6>
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '30px', height: '30px' }}
              onClick={() => setShowMobileSidebar(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="offcanvas-body p-2">
            <div className="d-flex flex-column gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setShowMobileSidebar(false)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content area */}
        <main className="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
