const Panel = require('../Modals/Panel');
const Lead = require('../Modals/Lead');
const Employee = require('../Modals/Employee');
const Task = require('../Modals/Task');
const Quotation = require('../Modals/Quotation');
const Payment = require('../Modals/Payment');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalPanels = await Panel.countDocuments();
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const totalEmployees = await Employee.countDocuments({ status: 'Active' });
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: { $in: ['Assigned', 'In Progress'] } });
    const totalQuotations = await Quotation.countDocuments();

    const payments = await Payment.find();
    let totalRevenue = 0;
    payments.forEach((p) => {
      totalRevenue += p.amountPaid || 0;
    });

    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);
    const recentTasks = await Task.find().populate('employeeId', 'name phone').sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalPanels,
        totalLeads,
        newLeads,
        totalEmployees,
        totalTasks,
        pendingTasks,
        totalQuotations,
        totalRevenue,
      },
      recentLeads,
      recentTasks,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
