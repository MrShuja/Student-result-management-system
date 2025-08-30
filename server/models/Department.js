import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    maxLength: 5
  },
  description: {
    type: String,
    default: ''
  },
  headOfDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  }
}, {
  timestamps: true
});

export default mongoose.model('Department', departmentSchema);