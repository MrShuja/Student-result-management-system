import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F']
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  }
}, {
  timestamps: true
});

export default mongoose.model('Result', resultSchema);