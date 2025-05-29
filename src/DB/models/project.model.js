import { Schema, model, Types } from "mongoose";

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,

    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },

    teams: [{
        type: Types.ObjectId,
        ref: "Team",
        required: true
    }],

    tasks: [{
        type: Types.ObjectId,
        ref: "Task"
    }]

}, { timestamps: true });

const projectModel = model("Project", projectSchema);
export default projectModel;
