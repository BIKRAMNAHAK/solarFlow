const Lead = require('../Modals/Lead');
const Admin = require('../Modals/Admin');

// Create Lead (Public inquiry / WhatsApp trigger)
exports.createLead = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      city,
      address,
      roofArea,
      calculatedPanels,
      estimatedKw,
      panelId,
      inquiryType,
      message,
    } = req.body;

    if (!customerName || !customerPhone) {
      return res.status(400).json({ success: false, message: 'Name and Phone Number are required' });
    }

    const newLead = new Lead({
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      city: city || '',
      address: address || '',
      roofArea: roofArea ? Number(roofArea) : 0,
      calculatedPanels: calculatedPanels ? Number(calculatedPanels) : 0,
      estimatedKw: estimatedKw ? Number(estimatedKw) : 0,
      panelId: panelId || null,
      inquiryType: inquiryType || 'Installation',
      message: message || '',
    });

    await newLead.save();

    // Fetch Admin for WhatsApp mobile number
    const admin = await Admin.findOne();
    const adminMobile = admin?.mobile || '9876543210';
    // Clean mobile number (keep digits only, add 91 if 10 digits)
    let cleanMobile = adminMobile.replace(/\D/g, '');
    if (cleanMobile.length === 10) {
      cleanMobile = '91' + cleanMobile;
    }

    const textMsg = `*New Solar Inquiry from SolarFlow Website*
--------------------------------
*Customer:* ${customerName}
*Phone:* ${customerPhone}
*City/Address:* ${city || address || 'Not specified'}
*Inquiry Type:* ${inquiryType || 'Installation'}
*Roof Area:* ${roofArea ? roofArea + ' sq.ft' : 'N/A'}
*Est. System:* ${estimatedKw ? estimatedKw + ' kW' : 'N/A'} (${calculatedPanels ? calculatedPanels + ' Panels' : ''})
*Notes:* ${message || 'Interested in solar panel solution'}`;

    const whatsappUrl = `https://wa.me/${cleanMobile}?text=${encodeURIComponent(textMsg)}`;

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      lead: newLead,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Leads
exports.getAllLeads = async (req, res) => {
  try {
    const { status, inquiryType } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    if (inquiryType && inquiryType !== 'All') {
      query.inquiryType = inquiryType;
    }

    const leads = await Lead.find(query)
      .populate('panelId')
      .populate('assignedEmployeeId', 'name phone role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: leads.length, leads });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Lead Status or Assign Employee
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedEmployeeId, notes, assignedBy } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (status) lead.status = status;
    if (assignedEmployeeId) lead.assignedEmployeeId = assignedEmployeeId;
    if (notes !== undefined) lead.notes = notes;
    if (assignedBy) lead.assignedBy = assignedBy;

    await lead.save();

    const populatedLead = await Lead.findById(id)
      .populate('panelId')
      .populate('assignedEmployeeId', 'name phone role');

    res.status(200).json({ success: true, message: 'Lead updated successfully', lead: populatedLead });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
