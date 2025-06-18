import taskModel from "../../../DB/models/task.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import { checkRole } from "../../../utils/user.utily.js"
import cloudinary from "../../../utils/cloudnairy.js";
import fs from "fs";
import projectModel from "../../../DB/models/project.model.js";
import userModel from "../../../DB/models/user.model.js";

export const taskHome = asyncHandler(async (req, res, next) => {

    res.json({ message: "Hello Task Model !" })

})
export const getAllTasks = asyncHandler(async (req, res, next) => {
    checkRole(req.user.role)
    const tasks = await taskModel.find().populate('project assignedToUser assignedToTeam createdBy')
    res.status(200).json({ message: "all tasks", tasks })
})
export const createdTask = asyncHandler(async (req, res, next) => {
    checkRole(req.user.role)
    const { title, description, assignedToUser, assignedToTeam, deadline, project } = req.body
    const task = await taskModel.create({ title, assignedToUser, description, assignedToTeam, deadline, project, createdBy: req.user.id })
    const addedTaskForProject = await projectModel.findByIdAndUpdate(project, { $push: { tasks: task } }, { new: true });
    const addedTaskForUser = await userModel.findByIdAndUpdate(assignedToUser, { $push: { tasks: task } }, { new: true });
    res.status(200).json({ message: "task created", task })
})
export const getOneTask = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return next(new Error("id is required"))
    }
    const task = await taskModel.findById(id).populate('project assignedToUser assignedToTeam createdBy').populate({
        path: 'comments.user',
        model: 'User'
    })

    if (!task) {
        return next(new Error("task not found"))
    }
    res.status(200).json({ message: "task", task })
})
export const updateTask = asyncHandler(async (req, res, next) => {
    checkRole(req.user.role)
    const { id } = req.params
    const { title, description, assignedToTeam, deadline } = req.body
    const task = await taskModel.findById(id)
    if (!task) {
        return next(new Error("task not found"))
    }
    const updatedTask = await taskModel.findByIdAndUpdate(id, { title, description, assignedToTeam, deadline }, { new: true })
    res.status(200).json({ message: "task updated", updatedTask })
})
export const updateTaskStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { status } = req.body
    if (!id || !status) return next(new Error("id and status are required"));

    const task = await taskModel.findById(id)
    if (!task) {
        return next(new Error("task not found"))
    }
    const updatedTask = await taskModel.findByIdAndUpdate(id, { status }, { new: true })
    res.status(200).json({ message: "task updated", updatedTask })
})
export const deleteTask = asyncHandler(async (req, res, next) => {
    checkRole(req.user.role)
    const { id } = req.params
    const task = await taskModel.findById(id)
    if (!task) {
        return next(new Error("task not found"))
    }
    const deletedTask = await taskModel.findByIdAndDelete(id)
    res.status(200).json({ message: "task deleted", deletedTask })
})
export const addCommentforTask = asyncHandler(async (req, res, next) => {
    const { text } = req.body;
    const { id } = req.params

    const task = await taskModel.findById(id);
    if (!task) throw new Error("Task not found");

    task.comments.push({ text, user: req.user.id });

    await task.save();

    res.status(200).json(task);
})
export const deleteCommentFromTask = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { commentId } = req.body;
    const task = await taskModel.findById(id);
    if (!task) throw new Error("Task not found");

    task.comments = task.comments.filter(comment => comment._id.toString() !== commentId);
    await task.save();

    res.status(200).json(task);
})
export const assignTaskToUser = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "TeamLeader") {
        return next(new Error("You are not authorized to assign tasks to users."));
    }
    const { assignedToUser } = req.body;
    const { id } = req.params;
    const task = await taskModel.findById(id);
    if (!task) {
        return next(new Error("Task not found"));
    }
    const user = await userModel.findById(assignedToUser);
    if (!user) {
        return next(new Error("User not found"));
    }
    if (user.role !== "Employee") {
        return next(new Error("Assigned user must be an Employee"));
    }
    const isTaskAlreadyAssigned = user.tasks.some(t => t.toString() === task._id.toString());
    if (isTaskAlreadyAssigned) {
        return next(new Error("This task is already assigned to the user"));
    }
    task.assignedToUser = assignedToUser;
    await task.save();
    user.tasks.push(task._id);
    await user.save();
    res.status(200).json({ message: "Task assigned to user", task });
})
export const addAttachment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const findTask = await taskModel.findById(id)
    if (!findTask) {
        return next(new Error("task not found"))
    }
    const urls = []

    if (!req.files || req.files.length === 0) {
        return next(new Error("No files uploaded"));
    }
    for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "task/attachments",
            resource_type: "raw"
        });
        urls.push(result.secure_url)

        fs.unlink(file.path, (err) => {
            if (err) console.error("Failed to delete local image:", err);
        })
    }
    const updatedTask = await taskModel.findByIdAndUpdate(
        id,
        { attachments: [...findTask.attachments, ...urls] },
        { new: true }
    );
    res.status(200).json({ message: "task updated", updatedTask })
})

