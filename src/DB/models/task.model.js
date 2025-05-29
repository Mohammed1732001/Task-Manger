import { Schema, model, Types } from "mongoose";



const commentSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
    trim: true
  },

}, { timestamps: true })




const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },

  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  project: {
    type: Types.ObjectId,
    ref: "Project",
    required: true
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User"
  },

  assignedToUser: {
    type: Types.ObjectId,
    ref: "User"
  },
  assignedToTeam: {
    type: Types.ObjectId,
    ref: "Team",
    required: true
  },

  deadline: Date,

  attachments: [String],

  comments: [commentSchema],


}, { timestamps: true });



const taskModel = model("Task", taskSchema)
export default taskModel