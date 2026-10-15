const Task = require('../Modals/Task');
const Employee = require('../Modals/Employee');

// Create / Assign Task to Employee digitally
exports.assignTask = async (req, res) => {
  try {
    const {
      taskTitle,
      employeeId,
      assignedBy,
      leadId,
      customerName,
      customerPhone,
      location,
      taskType,
      scheduledDate,
      scheduledTime,
      instructions,
    } = req.body;

    if (!taskTitle || !employeeId || !location || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Task title, employee, location, and scheduled date are required',
      });
    }

    const newTask = new Task({
      taskTitle,
      employeeId,
      assignedBy: assignedBy || 'Admin',
      leadId: leadId || null,
      customerName: customerName || '',
      customerPhone: customerPhone || '',
      location,
      taskType: taskType || 'Installation',
      scheduledDate,
      scheduledTime: scheduledTime || '10:00 AM',
      instructions: instructions || '',
      status: 'Assigned',
    });

    await newTask.save();
    const populated = await Task.findById(newTask._id).populate('employeeId', 'name phone role');

    res.status(201).json({
      success: true,
      message: 'Work assigned digitally to employee successfully',
      task: populated,
    });
  } catch (error) {
    console.error('Assign task error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Tasks / Work History
exports.getAllTasks = async (req, res) => {
  try {
    const { employeeId, status, taskType, date } = req.query;
    let query = {};
    if (employeeId && employeeId !== 'All') query.employeeId = employeeId;
    if (status && status !== 'All') query.status = status;
    if (taskType && taskType !== 'All') query.taskType = taskType;
    if (date) query.scheduledDate = date;

    const tasks = await Task.find(query)
      .populate('employeeId', 'name phone role')
      .populate('leadId', 'customerName customerPhone roofArea city')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Task Status / Completion Report
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, workNotes } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task record not found' });
    }

    if (status) task.status = status;
    if (remarks) task.remarks = remarks;

    let imagePath = task.completionReport?.image || '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    if (status === 'Completed') {
      task.completionReport = {
        completedAt: new Date(),
        workNotes: workNotes || remarks || 'Completed successfully',
        image: imagePath,
      };
    }

    await task.save();
    const updated = await Task.findById(id).populate('employeeId', 'name phone role');

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      task: updated,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
