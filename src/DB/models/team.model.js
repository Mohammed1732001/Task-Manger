import { Schema, model, Types } from "mongoose";


const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    teamLeader: {
        type: Types.ObjectId,
        ref: "User"
    },
    members: [
        {
            type: Types.ObjectId,
            ref: "User"
        }
    ],
    projects: [
        {
            type: Types.ObjectId,
            ref: "Project"
        }
    ]

}, { timestamps: true })



const teamModel = model("Team", teamSchema)
export default teamModel