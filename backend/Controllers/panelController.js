const Panel = require('../Modals/Panel');

// Ensure some realistic initial panels if none exist
exports.ensureInitialPanels = async () => {
  try {
    const count = await Panel.countDocuments();
    if (count === 0) {
      const defaultPanels = [
        {
          name: 'Tata Solar 540W Mono PERC Half-Cut Module',
          brand: 'Tata Power Solar',
          wattage: 540,
          panelType: 'Mono PERC',
          price: 13500,
          gst: 12,
          discount: 5,
          areaRequiredSqFt: 22,
          warranty: '25 Years Performance Warranty',
          efficiency: '21.2%',
          description: 'High efficiency Mono PERC solar panel engineered for Indian weather conditions. Excellent low-light generation and high wind resistance.',
          image: '',
          inStock: true,
          stockCount: 45,
        },
        {
          name: 'Loom Solar 440W Shark Bifacial Module',
          brand: 'Loom Solar',
          wattage: 440,
          panelType: 'Bifacial',
          price: 14200,
          gst: 12,
          discount: 8,
          areaRequiredSqFt: 20,
          warranty: '30 Years Performance Warranty',
          efficiency: '22.0%',
          description: 'Advanced dual-sided glass solar panel producing energy from both front and rear sides. Generates up to 25% extra power.',
          image: '',
          inStock: true,
          stockCount: 30,
        },
        {
          name: 'Waaree 545W TopCon Bifacial Dual Glass',
          brand: 'Waaree',
          wattage: 545,
          panelType: 'TopCon',
          price: 14800,
          gst: 12,
          discount: 4,
          areaRequiredSqFt: 23,
          warranty: '30 Years Linear Performance',
          efficiency: '22.5%',
          description: 'N-Type TOPCon bifacial module with zero light-induced degradation (LID) and superior temperature coefficient for maximum generation.',
          image: '',
          inStock: true,
          stockCount: 60,
        },
        {
          name: 'Adani Solar 400W Polycrystalline Panel',
          brand: 'Adani Solar',
          wattage: 400,
          panelType: 'Polycrystalline',
          price: 9800,
          gst: 12,
          discount: 10,
          areaRequiredSqFt: 22,
          warranty: '25 Years Warranty',
          efficiency: '18.5%',
          description: 'Cost-effective high durability polycrystalline solar module ideal for residential and agricultural rooftop installations.',
          image: '',
          inStock: true,
          stockCount: 80,
        }
      ];
      await Panel.insertMany(defaultPanels);
      console.log('Sample solar panels seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding panels:', error);
  }
};

// Create Panel
exports.createPanel = async (req, res) => {
  try {
    const {
      name,
      brand,
      wattage,
      panelType,
      price,
      gst,
      discount,
      areaRequiredSqFt,
      warranty,
      efficiency,
      description,
      stockCount,
      inStock,
    } = req.body;

    if (!name || !brand || !wattage || !price) {
      return res.status(400).json({ success: false, message: 'Name, brand, wattage, and price are required' });
    }

    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const newPanel = new Panel({
      name,
      brand,
      wattage: Number(wattage),
      panelType: panelType || 'Mono PERC',
      price: Number(price),
      gst: gst !== undefined ? Number(gst) : 12,
      discount: discount !== undefined ? Number(discount) : 0,
      areaRequiredSqFt: areaRequiredSqFt ? Number(areaRequiredSqFt) : 22,
      warranty: warranty || '25 Years Performance Warranty',
      efficiency: efficiency || '21.0%',
      description: description || '',
      image: imagePath,
      stockCount: stockCount !== undefined ? Number(stockCount) : 50,
      inStock: inStock !== undefined ? inStock === 'true' || inStock === true : true,
    });

    await newPanel.save();
    res.status(201).json({ success: true, message: 'Solar panel added successfully', panel: newPanel });
  } catch (error) {
    console.error('Create panel error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Panels
exports.getAllPanels = async (req, res) => {
  try {
    const { search, brand, type, minWattage } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (brand && brand !== 'All') {
      query.brand = brand;
    }
    if (type && type !== 'All') {
      query.panelType = type;
    }
    if (minWattage) {
      query.wattage = { $gte: Number(minWattage) };
    }

    const panels = await Panel.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: panels.length, panels });
  } catch (error) {
    console.error('Get panels error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Panel by ID
exports.getPanelById = async (req, res) => {
  try {
    const panel = await Panel.findById(req.params.id);
    if (!panel) {
      return res.status(404).json({ success: false, message: 'Panel not found' });
    }
    res.status(200).json({ success: true, panel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Panel
exports.updatePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.wattage) updateData.wattage = Number(updateData.wattage);
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.gst) updateData.gst = Number(updateData.gst);
    if (updateData.discount) updateData.discount = Number(updateData.discount);
    if (updateData.stockCount) updateData.stockCount = Number(updateData.stockCount);
    if (updateData.inStock !== undefined) {
      updateData.inStock = updateData.inStock === 'true' || updateData.inStock === true;
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedPanel = await Panel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPanel) {
      return res.status(404).json({ success: false, message: 'Panel not found' });
    }

    res.status(200).json({ success: true, message: 'Panel updated successfully', panel: updatedPanel });
  } catch (error) {
    console.error('Update panel error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Panel
exports.deletePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Panel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Panel not found' });
    }
    res.status(200).json({ success: true, message: 'Panel deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
