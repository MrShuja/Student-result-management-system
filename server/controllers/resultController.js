import Result from '../models/Result.js';
import Student from '../models/Student.js';
import Subject from '../models/Subject.js';

export const getResults = async (req, res) => {
  try {
    const { semester } = req.query;
    let filter = {};
    
    if (semester && semester !== 'all') {
      filter.semester = semester;
    }
    
    const results = await Result.find(filter)
      .populate({
        path: 'student',
        populate: {
          path: 'user'
        }
      })
      .populate('subject');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.studentId })
      .populate({
        path: 'student',
        populate: {
          path: 'user'
        }
      })
      .populate('subject');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createResult = async (req, res) => {
  try {
    const result = await Result.create(req.body);
    const populatedResult = await Result.findById(result._id)
      .populate({
        path: 'student',
        populate: {
          path: 'user'
        }
      })
      .populate('subject');
    res.status(201).json(populatedResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    .populate({
      path: 'student',
      populate: {
        path: 'user'
      }
    })
    .populate('subject');
    
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Result not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: 'Result removed' });
    } else {
      res.status(404).json({ message: 'Result not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};