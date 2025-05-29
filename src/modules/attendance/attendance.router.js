import { Router } from "express";
import * as attendanceController from './controller/attendance.js'
import { auth } from "../../middleWare/autorization.js";

const router = Router();





router.get('/', attendanceController.attendanceHome)
router.post("/chieck-in", auth, attendanceController.checkIn);
router.post('/check-out', auth, attendanceController.checkOut);
router.get('/me/today', auth, attendanceController.getTodayAttendance)
router.get('/user/:userId', auth, attendanceController.getUserAttendanceHistory);
router.get('/team/:teamId', auth, attendanceController.getTeamAttendance);


export default router