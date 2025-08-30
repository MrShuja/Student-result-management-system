import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    maxLength: 10
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Subject', subjectSchema);