import { Schema, model } from "mongoose";

const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  vdoCipherVideoId: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  course: {
    type: String,
    enum: ['web', 'mobile', 'design'],
    default: 'web'
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const videoModel = model("Video", videoSchema);
export default videoModel;
