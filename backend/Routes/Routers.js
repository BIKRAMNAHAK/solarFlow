const express = require('express');
const router = express.Router();
const upload = require('../Configs/imageUplode');

// Controllers
const authController = require('../Controllers/authController');
const panelController = require('../Controllers/panelController');
const leadController = require('../Controllers/leadController');
const employeeController = require('../Controllers/employeeController');
const taskController = require('../Controllers/taskController');
const quotationController = require('../Controllers/quotationController');
const employeeFinanceController = require('../Controllers/employeeFinanceController');
const paymentController = require('../Controllers/paymentController');
const dashboardController = require('../Controllers/dashboardController');

// --- Auth & Admin Routes ---
router.post('/api/auth/login', upload.none(), authController.adminLogin);
router.post('/api/auth/forgot-password', upload.none(), authController.adminForgotPassword);
router.post('/api/auth/reset-password', upload.none(), authController.adminResetPassword);
router.get('/api/auth/profile', authController.getAdminProfile);
router.post('/api/auth/profile', upload.single('logo'), authController.updateAdminProfile);

// --- Solar Panels Routes ---
router.post('/api/panels', upload.single('image'), panelController.createPanel);
router.get('/api/panels', panelController.getAllPanels);
router.get('/api/panels/:id', panelController.getPanelById);
router.put('/api/panels/:id', upload.single('image'), panelController.updatePanel);
router.delete('/api/panels/:id', panelController.deletePanel);

// --- Leads & Inquiries Routes ---
router.post('/api/leads', upload.none(), leadController.createLead);
router.get('/api/leads', leadController.getAllLeads);
router.put('/api/leads/:id', upload.none(), leadController.updateLead);
router.delete('/api/leads/:id', leadController.deleteLead);

// --- Employee Management Routes ---
router.post('/api/employees', upload.single('photo'), employeeController.createEmployee);
router.get('/api/employees', employeeController.getAllEmployees);
router.get('/api/employees/:id', employeeController.getEmployeeById);
router.put('/api/employees/:id', upload.single('photo'), employeeController.updateEmployee);
router.delete('/api/employees/:id', employeeController.deleteEmployee);

// --- Digital Job / Task Assignment Routes ---
router.post('/api/tasks', upload.none(), taskController.assignTask);
router.get('/api/tasks', taskController.getAllTasks);
router.put('/api/tasks/:id', upload.single('image'), taskController.updateTaskStatus);
router.delete('/api/tasks/:id', taskController.deleteTask);

// --- Solar Quotations Routes ---
router.post('/api/quotations', upload.none(), quotationController.createQuotation);
router.get('/api/quotations', quotationController.getAllQuotations);
router.put('/api/quotations/:id', upload.none(), quotationController.updateQuotation);
router.delete('/api/quotations/:id', quotationController.deleteQuotation);

// --- Attendance & Employee Finance Routes ---
router.post('/api/attendance', upload.none(), employeeFinanceController.markAttendance);
router.get('/api/attendance', employeeFinanceController.getAttendance);
router.post('/api/employee-finance', upload.single('receipt'), employeeFinanceController.addFinanceRecord);
router.get('/api/employee-finance', employeeFinanceController.getFinanceRecords);

// --- Payment Management Routes ---
router.post('/api/payments', upload.none(), paymentController.addPayment);
router.get('/api/payments', paymentController.getAllPayments);
router.put('/api/payments/:id', upload.none(), paymentController.updatePayment);
router.delete('/api/payments/:id', paymentController.deletePayment);

// --- Dashboard Analytics ---
router.get('/api/dashboard/stats', dashboardController.getDashboardStats);

module.exports = router;
