import attendanceModel from "../../../DB/models/attendance.model.js";
import userModel from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js"






export const attendanceHome = asyncHandler(async (req, res, next) => {
    const attendance = await attendanceModel.find().populate("user team");
    res.status(200).json({ message: "all attendance", attendance })
})



export const checkIn = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const alredyCheckIn = await attendanceModel.findOne({ user: userId, date: { $gte: today } });
    if (alredyCheckIn) {
        return next(new Error("You have already checked in today"));
    }
    const attendance = await attendanceModel.create({
        user: userId,
        team: user.team,
        date: new Date(),
        checkIn: new Date(),
        workType: req.body.workType || "Office",
        notes: req.body.notes || ""
    });
    res.status(200).json({ message: "Check-in successful", attendance });

})

export const checkOut = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let attendance = await attendanceModel.findOne({
        user: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!attendance) return next(new Error("لم تقم بتسجيل الحضور بعد"));

    if (attendance.checkOut) return next(new Error("تم تسجيل الانصراف بالفعل"));

    const now = new Date();

    const diffMs = now - attendance.checkIn;
    const totalWorkedHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    attendance = await attendanceModel.findOneAndUpdate(
        {
            user: userId,
            date: { $gte: startOfDay, $lte: endOfDay },
        },
        {
            checkOut: now,
            notes: req.body.notes,
            totalWorkedHours,
        },
        { new: true }
    );

    res.status(200).json({
        message: "تم تسجيل الانصراف بنجاح",
        attendance,
    });
});




export const getTodayAttendance = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await attendanceModel.findOne({
        user: req.user._id,
        date: { $gte: today },
    });

    res.status(200).json({ attendance });
})


export const getTeamAttendance = asyncHandler(async (req, res) => {
    if (req.user.role !== "Hr") {
        return next(new Error("You are not HR"));
    }

    const { teamId } = req.params;
    const users = await userModel.find({ team: teamId }).select("name email");
    const result = await Promise.all(users.map(async (user) => {
        const attendanceRecords = await attendanceModel
            .find({ user: user._id })
            .sort({ date: -1 });

        return {
            user,
            attendance: attendanceRecords,
        };
    }));

    res.status(200).json({ teamId, result });
});

export const getUserAttendanceHistory = asyncHandler(async (req, res) => {
    console.log(req.user.role);
    if (req.user.role !== "Hr") {
        return next(new Error("You are not HR"))
    }
    const { userId } = req.params;

    const attendance = await attendanceModel.find({ user: userId })
        .sort({ date: -1 });
    res.status(200).json({ attendance });
});