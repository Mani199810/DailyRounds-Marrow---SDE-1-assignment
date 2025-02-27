import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  taskType: { type: String, enum: ['Bug', 'Task', 'Issue'], required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  assignedTo: { type: String, required: true },
  description: { type: String, required: true },
  attachments: [
    {
      filename: String,
      mimetype: String,
      buffer: Buffer, 
    },
  ],
  createdAt: { type: Date, default: Date.now },
  deliveryDate: { type: Date, required: true },
  status: { type: String,  required: true  },
},{
    collection: "Task",
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
