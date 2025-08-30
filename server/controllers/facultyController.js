import Faculty from '../models/Faculty.js';
import User from '../models/User.js';
import { generateFacultyId } from '../utils/helpers.js';

export const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate('user')
      .populate('department');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFacultyMember = async (req, res) => {
  try {
    const facultyMember = await Faculty.findById(req.params.id)
      .populate('user')
      .populate('department');
    if (facultyMember) {
      res.json(facultyMember);
    } else {
      res.status(404).json({ message: 'Faculty member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFaculty = async (req, res) => {
  try {
    // First create the user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password || 'defaultPassword123',
      role: 'faculty',
      avatar: req.body.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.name)}&background=3b82f6&color=fff`
    });
    
    // Then create the faculty with the user reference
    const faculty = await Faculty.create({
      facultyId: await generateFacultyId(),
      user: user._id,
      department: req.body.department
    });
    
    const populatedFaculty = await Faculty.findById(faculty._id)
      .populate('user')
      .populate('department');
    
    res.status(201).json(populatedFaculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('user')
      .populate('department');
    
    if (faculty) {
      // Also update the user if name or email changed
      if (req.body.name || req.body.email) {
        await User.findByIdAndUpdate(faculty.user._id, {
          name: req.body.name || faculty.user.name,
          email: req.body.email || faculty.user.email,
          avatar: req.body.avatar || faculty.user.avatar
        });
      }
      
      res.json(faculty);
    } else {
      res.status(404).json({ message: 'Faculty member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    
    if (faculty) {
      // Check if this faculty member is head of any department
      const isHeadOfDepartment = await Department.findOne({ headOfDepartment: faculty._id });
      
      if (isHeadOfDepartment) {
        return res.status(400).json({ 
          message: 'Cannot delete faculty member. They are currently head of a department.' 
        });
      }
      
      // Delete the faculty record
      await Faculty.findByIdAndDelete(req.params.id);
      
      // Also delete the associated user
      await User.findByIdAndDelete(faculty.user);
      
      res.json({ message: 'Faculty member removed' });
    } else {
      res.status(404).json({ message: 'Faculty member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};