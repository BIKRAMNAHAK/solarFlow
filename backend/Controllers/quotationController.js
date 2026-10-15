const Quotation = require('../Modals/Quotation');
const Lead = require('../Modals/Lead');

// Create Quotation
exports.createQuotation = async (req, res) => {
  try {
    const {
      leadId,
      customerName,
      customerPhone,
      customerAddress,
      panelId,
      panelName,
      panelWattage,
      totalPanels,
      systemCapacityKw,
      inverterDetails,
      structureDetails,
      panelCost,
      inverterCost,
      structureCost,
      installationCost,
      gstPercent,
      discount,
      notes,
    } = req.body;

    if (!customerName || !customerPhone) {
      return res.status(400).json({ success: false, message: 'Customer name and phone are required' });
    }

    const pCost = Number(panelCost) || 0;
    const invCost = Number(inverterCost) || 0;
    const sCost = Number(structureCost) || 0;
    const instCost = Number(installationCost) || 0;
    const subTotal = pCost + invCost + sCost + instCost;

    const disc = Number(discount) || 0;
    const afterDiscount = Math.max(0, subTotal - disc);

    const gstP = Number(gstPercent) || 12;
    const gstAmt = (afterDiscount * gstP) / 100;
    const grandTotal = Math.round(afterDiscount + gstAmt);

    const count = await Quotation.countDocuments();
    const quotationNumber = `SF-QT-${1000 + count + 1}`;

    const newQuotation = new Quotation({
      quotationNumber,
      leadId: leadId || null,
      customerName,
      customerPhone,
      customerAddress: customerAddress || '',
      panelId: panelId || null,
      panelName: panelName || '',
      panelWattage: Number(panelWattage) || 0,
      totalPanels: Number(totalPanels) || 0,
      systemCapacityKw: Number(systemCapacityKw) || 0,
      inverterDetails: inverterDetails || 'Grid-Tie Inverter',
      structureDetails: structureDetails || 'Galvanized Iron Elevated Structure',
      panelCost: pCost,
      inverterCost: invCost,
      structureCost: sCost,
      installationCost: instCost,
      subTotal,
      gstPercent: gstP,
      gstAmount: gstAmt,
      discount: disc,
      grandTotal,
      notes: notes || '',
      status: 'Submitted',
    });

    await newQuotation.save();

    // If leadId is attached, update lead status to 'Quotation Sent'
    if (leadId) {
      await Lead.findByIdAndUpdate(leadId, { status: 'Quotation Sent' });
    }

    res.status(201).json({
      success: true,
      message: 'Quotation generated successfully',
      quotation: newQuotation,
    });
  } catch (error) {
    console.error('Create quotation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Quotations
exports.getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().populate('panelId').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: quotations.length, quotations });
  } catch (error) {
    console.error('Get quotations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Quotation Status
exports.updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Quotation.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }
    res.status(200).json({ success: true, message: 'Quotation updated', quotation: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Quotation
exports.deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Quotation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }
    res.status(200).json({ success: true, message: 'Quotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
