import { Schema, model, Types } from "mongoose";

const attendanceSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  team: {
    type: Types.ObjectId,
    ref: "Team"
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date
  },
  workType: {
    type: String,
    enum: ['Office', 'Remote'],
    default: 'Office'
  },
  notes: {
    type: String
  },
  totalWorkedHours: {
    type: Number
  },
}, { timestamps: true });

const attendanceModel = model("Attendance", attendanceSchema);
export default attendanceModel;
