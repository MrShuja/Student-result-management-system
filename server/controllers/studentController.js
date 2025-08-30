import Student from '../models/Student.js';
import User from '../models/User.js';
import { generateStudentId } from '../utils/helpers.js';

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user')
      .populate('department');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user')
      .populate('department');
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    // First create the user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password || 'defaultPassword123',
      role: 'student',
      avatar: req.body.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.name)}&background=3b82f6&color=fff`
    });
    
    // First get the department for the department code
    const Department = await import('../models/Department.js').then(mod => mod.default);
    const department = await Department.findById(req.body.department);
    const departmentCode = department ? department.code : 'ST';
    
    // Then create the student with the user reference
    const student = await Student.create({
      studentId: await generateStudentId(departmentCode),
      user: user._id,
      program: req.body.program,
      semester: req.body.semester,
      department: req.body.department
    });
    
    const populatedStudent = await Student.findById(student._id)
      .populate('user')
      .populate('department');
    
    res.status(201).json(populatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('user')
      .populate('department');
    
    if (student) {
      // Also update the user if name or email changed
      if (req.body.name || req.body.email) {
        await User.findByIdAndUpdate(student.user._id, {
          name: req.body.name || student.user.name,
          email: req.body.email || student.user.email,
          avatar: req.body.avatar || student.user.avatar
        });
      }
      
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (student) {
      // Check if this student has any results
      const Result = await import('../models/Result.js').then(mod => mod.default);
      const resultCount = await Result.countDocuments({ student: student._id });
      
      if (resultCount > 0) {
        return res.status(400).json({ 
          message: `Cannot delete student. There are ${resultCount} results associated with this student.` 
        });
      }
      
      // Delete the student record
      await Student.findByIdAndDelete(req.params.id);
      
      // Also delete the associated user
      await User.findByIdAndDelete(student.user);
      
      res.json({ message: 'Student removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};