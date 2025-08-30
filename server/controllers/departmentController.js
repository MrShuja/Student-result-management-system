import Department from '../models/Department.js';
import Faculty from '../models/Faculty.js';

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('headOfDepartment');
    
    // Get faculty count for each department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const facultyCount = await Faculty.countDocuments({ department: dept._id });
        return {
          ...dept.toObject(),
          facultyCount
        };
      })
    );
    
    res.json(departmentsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('headOfDepartment');
    if (department) {
      const facultyCount = await Faculty.countDocuments({ department: req.params.id });
      res.json({ ...department.toObject(), facultyCount });
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    const populatedDepartment = await Department.findById(department._id).populate('headOfDepartment');
    res.status(201).json(populatedDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('headOfDepartment');
    
    if (department) {
      res.json(department);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    // Check if any faculty members are assigned to this department
    const facultyCount = await Faculty.countDocuments({ department: req.params.id });
    
    if (facultyCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete department. There are ${facultyCount} faculty members assigned to it.` 
      });
    }
    
    const department = await Department.findByIdAndDelete(req.params.id);
    if (department) {
      res.json({ message: 'Department removed' });
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};