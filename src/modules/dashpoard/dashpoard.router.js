import { Router } from "express";
import { auth } from "../../middleWare/autorization.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import userModel from "../../DB/models/user.model.js";
import taskModel from "../../DB/models/task.model.js";
import projectModel from "../../DB/models/project.model.js";
import teamModel from "../../DB/models/team.model.js";
import attendanceModel from "../../DB/models/attendance.model.js";

const router = Router();

router.get('/', auth, asyncHandler(async (req, res, next) => {
    if (req.user.role !== "Owner") {
        return next(new Error("You are not Owner"));
    }

    const totalUsers = await userModel.countDocuments();
    const totalTeams = await teamModel.countDocuments();
    const totalProjects = await projectModel.countDocuments();
    const totalTasks = await taskModel.countDocuments();
    const openTasks = await taskModel.countDocuments({ status: 'Pending' });
    const inProgressTasks = await taskModel.countDocuments({ status: 'inProgress' });
    const completedTasks = await taskModel.countDocuments({ status: 'Completed' });

    const todayDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const todaysAttendance = await attendanceModel.countDocuments({ date: todayDate, status: 'present' });
    const absencesToday = await attendanceModel.countDocuments({ date: todayDate, status: 'absent' });
    const teams = await teamModel.find();
    const productivityData = [];

    for (const team of teams) {
        const count = await taskModel.countDocuments({ assignedToTeam: team._id });
        productivityData.push({ team: team.name, tasks: count });
    }


    return res.json({
        statCards: {
            totalTasks,
            totalUsers,
            totalTeams,
            totalProjects,
            openTasks,
            inProgressTasks,
            completedTasks,
            todaysAttendance,
            absencesToday,
            productivityData
        }
    });
}));

export default router;
