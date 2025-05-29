import { Schema, model, Types } from "mongoose";



const userSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Owner', 'Manager', 'TeamLeader', 'Employee' , "Hr"],
        default: "Employee"
    },
    titleJop: String,
    image: {
        type: String
    },
    imagePuplicId: {
        type: String
    },
    team: {
        type: Types.ObjectId,
        ref: "Team"
    },
    tasks: [{
        type: Types.ObjectId,
        ref: "Task"
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })



const userModel = model("User", userSchema)

export default userModel


