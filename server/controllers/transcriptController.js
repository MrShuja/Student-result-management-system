import Transcript from '../models/Transcript.js';
import Result from '../models/Result.js';
import { calculateGPA } from '../utils/helpers.js';

export const generateTranscript = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Get all results for the student
    const results = await Result.find({ student: studentId })
      .populate('subject');
    
    // Calculate GPA
    const gpa = calculateGPA(results);
    
    // Calculate total credits
    const totalCredits = results.reduce((sum, result) => sum + result.credits, 0);
    
    // Create or update transcript
    let transcript = await Transcript.findOne({ student: studentId });
    
    if (transcript) {
      transcript.results = results.map(result => result._id);
      transcript.gpa = gpa;
      transcript.totalCredits = totalCredits;
      await transcript.save();
    } else {
      transcript = await Transcript.create({
        student: studentId,
        results: results.map(result => result._id),
        gpa,
        totalCredits
      });
    }
    
    const populatedTranscript = await Transcript.findById(transcript._id)
      .populate('student')
      .populate({
        path: 'results',
        populate: {
          path: 'subject',
          model: 'Subject'
        }
      });
    
    res.json(populatedTranscript);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTranscript = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const transcript = await Transcript.findOne({ student: studentId })
      .populate('student')
      .populate({
        path: 'results',
        populate: {
          path: 'subject',
          model: 'Subject'
        }
      });
    
    if (transcript) {
      res.json(transcript);
    } else {
      res.status(404).json({ message: 'Transcript not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};