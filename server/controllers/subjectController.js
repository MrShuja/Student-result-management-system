import Subject from '../models/Subject.js';

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('department');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('department');
    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    const populatedSubject = await Subject.findById(subject._id).populate('department');
    res.status(201).json(populatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('department');
    
    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (subject) {
      res.json({ message: 'Subject removed' });
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};