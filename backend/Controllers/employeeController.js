const Employee = require('../Modals/Employee');

// Seed sample employees if none exist
exports.ensureInitialEmployees = async () => {
  try {
    const count = await Employee.countDocuments();
    if (count === 0) {
      const defaultEmployees = [
        {
          name: 'Ramesh Sharma',
          phone: '9823456781',
          email: 'ramesh.solar@solarflow.com',
          role: 'Installation Engineer',
          salary: 28000,
          address: 'Main Market Road, City Center',
          status: 'Active',
        },
        {
          name: 'Suresh Kumar',
          phone: '9845123654',
          email: 'suresh.tech@solarflow.com',
          role: 'Technician',
          salary: 22000,
          address: 'Plot 45, Industrial Area',
          status: 'Active',
        },
        {
          name: 'Amit Patel',
          phone: '9789456123',
          email: 'amit.electric@solarflow.com',
          role: 'Electrician',
          salary: 24000,
          address: 'Station Colony, Sector 4',
          status: 'Active',
        },
        {
          name: 'Vikram Singh',
          phone: '9654123987',
          email: 'vikram.sales@solarflow.com',
          role: 'Site Supervisor',
          salary: 26000,
          address: 'Green Park Extension',
          status: 'Active',
        }
      ];
      await Employee.insertMany(defaultEmployees);
      console.log('Sample employees seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding employees:', error);
  }
};

// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, phone, email, role, salary, address, status, joiningDate } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone are required' });
    }

    let photoPath = '';
    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`;
    }

    const newEmp = new Employee({
      name,
      phone,
      email: email || '',
      role: role || 'Technician',
      salary: salary ? Number(salary) : 15000,
      address: address || '',
      status: status || 'Active',
      photo: photoPath,
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
    });

    await newEmp.save();
    res.status(201).json({ success: true, message: 'Employee added successfully', employee: newEmp });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let query = {};
    if (role && role !== 'All') query.role = role;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: employees.length, employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.salary) updateData.salary = Number(updateData.salary);

    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    const updated = await Employee.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, message: 'Employee updated successfully', employee: updated });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
