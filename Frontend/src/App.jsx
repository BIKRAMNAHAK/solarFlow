import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

// Public Pages
import HomePage from './Pages/HomePage';
import PanelsPage from './Pages/PanelsPage';
import CalculatorPage from './Pages/CalculatorPage';
import ServicesPage from './Pages/ServicesPage';

// Admin Pages
import AdminLoginPage from './Pages/AdminLoginPage';
import AdminDashboardPage from './Pages/AdminDashboardPage';
import AdminPanelsPage from './Pages/AdminPanelsPage';
import AdminLeadsPage from './Pages/AdminLeadsPage';
import AdminTasksPage from './Pages/AdminTasksPage';
import AdminQuotationsPage from './Pages/AdminQuotationsPage';
import AdminEmployeesPage from './Pages/AdminEmployeesPage';
import AdminAttendancePage from './Pages/AdminAttendancePage';
import AdminPaymentsPage from './Pages/AdminPaymentsPage';
import AdminProfilePage from './Pages/AdminProfilePage';

// Public Layout Wrapper with Navbar & Footer
function PublicLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">{children}</div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public Customer Facing Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />
      <Route
        path="/panels"
        element={
          <PublicLayout>
            <PanelsPage />
          </PublicLayout>
        }
      />
      <Route
        path="/calculator"
        element={
          <PublicLayout>
            <CalculatorPage />
          </PublicLayout>
        }
      />
      <Route
        path="/services"
        element={
          <PublicLayout>
            <ServicesPage />
          </PublicLayout>
        }
      />
      <Route
        path="/inquire"
        element={
          <PublicLayout>
            <CalculatorPage />
          </PublicLayout>
        }
      />

      {/* Admin Authentication Route */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Protected Control Portal Routes */}
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/panels" element={<AdminPanelsPage />} />
      <Route path="/admin/leads" element={<AdminLeadsPage />} />
      <Route path="/admin/tasks" element={<AdminTasksPage />} />
      <Route path="/admin/quotations" element={<AdminQuotationsPage />} />
      <Route path="/admin/employees" element={<AdminEmployeesPage />} />
      <Route path="/admin/attendance" element={<AdminAttendancePage />} />
      <Route path="/admin/payments" element={<AdminPaymentsPage />} />
      <Route path="/admin/profile" element={<AdminProfilePage />} />

      {/* Fallback route */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <div className="text-center py-5">
              <h2 className="fw-bold">404 - Page Not Found</h2>
              <p className="text-muted">The requested page does not exist.</p>
              <a href="/" className="btn btn-warning rounded-pill fw-bold">
                Return to Home
              </a>
            </div>
          </PublicLayout>
        }
      />
    </Routes>
  );
}

export default App;
