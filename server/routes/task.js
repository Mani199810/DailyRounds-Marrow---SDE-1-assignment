import express from 'express';
import multer from 'multer';
import Task from '../models/taskModal.js';
import { verifyToken } from '../middleware/auth.js';
import { Parser } from 'json2csv';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(verifyToken);

router.post("/tasks", upload.array('attachments', 5), async (req, res) => {
  console.log('req',req.body)
  try {
    const attachments = req.files.map(file => ({
      filename: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer, 
    }));

    const task = new Task({ ...req.body, attachments });
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
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

router.get('/tasks/export', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name');

    const formattedTasks = tasks.map(task => ({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo || 'Unassigned',
      status: task.status,
      createdAt: task.createdAt.toISOString(),
    }));

    const fields = ['title', 'description', 'assignedTo', 'status', 'createdAt'];
    const parser = new Parser({ fields });

    const csv = parser.parse(formattedTasks);

    res.header('Content-Type', 'text/csv');
    res.attachment('tasks.csv');
    res.status(200).send(csv);

  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (err) {
  }
});

router.put('/tasks/:id', upload.array('attachments', 5), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.title = req.body.title || task.title;
    task.taskType = req.body.taskType || task.taskType;
    task.priority = req.body.priority || task.priority;
    task.status = req.body.status || task.status;

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

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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