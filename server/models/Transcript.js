import mongoose from 'mongoose';

const transcriptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  results: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Result'
  }],
  gpa: {
    type: Number,
    required: true
  },
  totalCredits: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Transcript', transcriptSchema);