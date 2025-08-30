import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Faculty', facultySchema);