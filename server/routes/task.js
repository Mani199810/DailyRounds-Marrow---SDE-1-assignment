import express from 'express';
import multer from 'multer';
import Task from '../models/taskModal.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Set up memory storage for binary file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyToken);

// 📌 1️⃣ CREATE a Task with File Uploads
router.post("/tasks", upload.array('attachments', 5), async (req, res) => {
  console.log('req',req.body)
  try {
    const attachments = req.files.map(file => ({
      filename: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer, // Store in memory
    }));

    const task = new Task({ ...req.body, attachments });
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// 📌 2️⃣ GET All Tasks
router.get('/tasks', async (req, res) => {
  try {
    const { title } = req.query;
    const query = title ? { title: new RegExp(title, 'i') } : {};
    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 3️⃣ GET a Single Task by ID
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (err) {
  }
});

// 📌 4️⃣ UPDATE a Task (including file replacement)
router.put('/tasks/:id', upload.array('attachments', 5), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Update fields
    task.title = req.body.title || task.title;
    task.taskType = req.body.taskType || task.taskType;
    task.priority = req.body.priority || task.priority;
    task.status = req.body.status || task.status;

    // Replace attachments if new files are uploaded
    if (req.files && req.files.length > 0) {
      task.attachments = req.files.map(file => ({
        filename: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer,
      }));
    }

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 5️⃣ DELETE a Task (Removes Attachments)
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 6️⃣ DOWNLOAD an Attachment
router.get('/tasks/:taskId/attachment/:filename', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const file = task.attachments.find(att => att.filename === req.params.filename);
    if (!file) return res.status(404).json({ error: 'File not found' });

    res.set('Content-Type', file.mimetype);
    res.send(file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;