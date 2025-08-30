import Notice from '../models/Notice.js';

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate('author');
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create({
      ...req.body,
      author: req.user._id
    });
    const populatedNotice = await Notice.findById(notice._id).populate('author');
    res.status(201).json(populatedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('author');
    
    if (notice) {
      res.json(notice);
    } else {
      res.status(404).json({ message: 'Notice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (notice) {
      res.json({ message: 'Notice removed' });
    } else {
      res.status(404).json({ message: 'Notice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};